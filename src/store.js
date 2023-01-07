import create from "zustand";
import {CLIENT_DIALOG, CONFIRMATION_DIALOG, WIREGUARD_CONFIG_DIALOG} from "./components/DialogsComponent";
import {ansibleApiUrl, flowerApiUrl} from "./utils";

const sortTasks = tasks => {
    return tasks.sort((a, b) => parseFloat(b.received) - parseFloat(a.received));
};

export const useStore = create((setStore, getStore) => ({
    keycloak: create((set, get) => ({
        keycloak: null,
        token: "",
        roles: [],
        setKeycloak: keycloak => {
            set({
                keycloak: keycloak
            })
        },
        setToken: token => {
            set({
                token: token
            })
        },
        setRoles: roles => {
            set({
                roles: roles
            })
        },
        logout: () => {
            get().keycloak.logout({
                redirectUri: "http://127.0.0.1:3000"
            });
        }
    })),
    dialogs: create((set, get) => ({
        open: false,
        type: null,
        props: {},
        openDialog: (type, props) => {
            set({
                open: true,
                type: type,
                props: props
            })
        },
        openConfirmationDialog: (props) => get().openDialog(CONFIRMATION_DIALOG, props),
        openClientDialog: (props) => get().openDialog(CLIENT_DIALOG, props),
        openWireGuardConfigDialog: (props) => get().openDialog(WIREGUARD_CONFIG_DIALOG, props),
        closeDialog: () => {
            set({
                open: false,
                type: null
            })
        }
    })),
    clientsApplied: create((set, get) => ({
        clientsApplied: [],
        setClientsApplied: clientsApplied => {
            set({
                clientsApplied: clientsApplied
            })
        },
    })),
    clients: create((set, get) => ({
        clients: [],
        setClients: clients => {
            set({
                clients: clients
            })
        },
        addClient: client => {
            set({
                clients: [...get().clients, client]
            })
        },
        editClient: client => {
            set({
                clients: get().clients.map(i => i.id === client.id ? client : i)
            })
        },
        deleteClient: clientId => {
            set({
                clients: get().clients.filter(i => i.id !== clientId)
            })
        }
    })),
    tasks: create((set, get) => ({
        tasks: [],
        error: "",
        loaded: false,
        loadTasks: () => {
            const url = `${flowerApiUrl}/tasks`;
            fetch(url)
                .then(res => res.json())
                .then(taskList => {
                    let taskIds = Object.keys(taskList);
                    let tasks = [];
                    for (let taskId of taskIds) {
                        let task = taskList[taskId];
                        if (task.received) {
                            tasks.push(task);
                        }
                    }
                    tasks = sortTasks(tasks);
                    set({
                        tasks,
                        error: ""
                    })
                })
                .catch((error) => {
                    console.log(error);
                    set({
                        error: error,
                        tasks: []
                    })
                })
                .finally(() => {
                    set({
                        loaded: true
                    })
                })
        },
        addOrEditTask: task => {
            let tasks = []
            let edited = false;
            get().tasks.forEach(t => {
                if (t.uuid === task.uuid) {
                    tasks.push({
                        ...task,
                        output: t.output
                    })
                    edited = true;
                } else {
                    tasks.push(t);
                }
            })
            if (!edited) {
                tasks.push(task);
            }
            tasks = sortTasks(tasks)
            set({
                tasks: tasks
            })
        },
        editTaskOutput: task => {
            set({
                tasks: get().tasks.map(i => i.uuid === task.uuid ? {...i, output: task.output} : i)
            })
        }
    })),
    api: create((set, get) => ({
        addClient: body => {
            const token = getStore().keycloak.getState().token;
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            };
            return fetch(`${ansibleApiUrl}/client`, requestOptions)
                .then(response => response.json());
        },
        editClient: (clientId, body) => {
            const token = getStore().keycloak.getState().token;
            const requestOptions = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            };
            return fetch(`${ansibleApiUrl}/client/${clientId}`, requestOptions)
                .then(response => response.json());
        },
        getWireGuardConfig: clientId => {
            const token = getStore().keycloak.getState().token;
            const requestOptions = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            return fetch(`${ansibleApiUrl}/client/${clientId}/config`, requestOptions)
                .then(response => response.text());
        },
        getPlaybookOutput: taskId => {
            const token = getStore().keycloak.getState().token;
            const requestOptions = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            return fetch(`${ansibleApiUrl}/playbook/${taskId}`, requestOptions)
                .then(response => response.json());
        },
        cancelTask: taskId => {
            const requestOptions = {
                method: "POST"
            };
            return fetch(`${flowerApiUrl}/task/revoke/${taskId}?terminate=true`, requestOptions)
                .then(response => response.json());
        },
        deleteClient: clientId => {
            const token = getStore().keycloak.getState().token;
            const requestOptions = {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            return fetch(`${ansibleApiUrl}/client/${clientId}`, requestOptions);
        },
    })),
}));

export const useStoreKeycloak = (state) => useStore((s) => s.keycloak(state));
export const useStoreDialogs = (state) => useStore((s) => s.dialogs(state));
export const useStoreClientsApplied = (state) => useStore((s) => s.clientsApplied(state));
export const useStoreClients = (state) => useStore((s) => s.clients(state));
export const useStoreTasks = (state) => useStore((s) => s.tasks(state));
export const useStoreApi = (state) => useStore((s) => s.api(state));
