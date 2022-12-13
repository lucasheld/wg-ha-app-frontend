import create from "zustand";
import FlowerApi from "./api/FlowerApi";
import {CLIENT_DIALOG, CONFIRMATION_DIALOG, WIREGUARD_CONFIG_DIALOG} from "./components/DialogsComponent";

const sortTasks = tasks => {
    return tasks.sort((a, b) => parseFloat(b.received) - parseFloat(a.received));
};

export const useStoreTasks = create((set, get) => ({
    tasks: [],
    error: "",
    loaded: false,
    loadTasks: () => {
        const url = `${FlowerApi.baseUrl}/tasks`;
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
                    tasks: tasks,
                    error: "",
                })
            })
            .catch((error) => {
                console.log(error);
                set({
                    error: error,
                    tasks: [],
                })
            })
            .finally(() => {
                set({
                    loaded: true,
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
            tasks: get().tasks.map(t => t.uuid === task.uuid ? {...t, output: task.output} : t)
        })
    }
}));

export const useStoreClients = create((set, get) => ({
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
            clients: get().clients.map(c => c.id === client.id ? client : c)
        })
    },
    deleteClient: clientId => {
        set({
            clients: get().clients.filter(c => c.id !== clientId)
        })
    }
}));

export const useStoreClientsApplied = create((set) => ({
    clientsApplied: [],
    setClientsApplied: clientsApplied => {
        set({
            clientsApplied: clientsApplied
        })
    },
}));

export const useStoreTags = create((set) => ({
    tags: [],
    error: "",
    loaded: false,
    loadTags: () => {
        console.error("todo: implement")
    }
}));

export const useStoreDialogs = create((set, get) => ({
    open: false,
    type: null,
    props: {},
    openDialog: (type, props) => {
        set({
            open: true,
            type: type,
            props: props,
        })
    },
    openConfirmationDialog: (props) => get().openDialog(CONFIRMATION_DIALOG, props),
    openClientDialog: (props) => get().openDialog(CLIENT_DIALOG, props),
    openWireGuardConfigDialog: (props) => get().openDialog(WIREGUARD_CONFIG_DIALOG, props),
    closeDialog: () => {
        set({
            open: false,
            type: null,
        })
    }
}));
