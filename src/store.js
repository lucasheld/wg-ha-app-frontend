import create from "zustand";
import Task from "./data-classes/Task";
import FlowerApi from "./api/FlowerApi";
import {CLIENT_DIALOG, CONFIRMATION_DIALOG, WIREGUARD_CONFIG_DIALOG} from "./components/DialogsComponent";


const parseTask = (rawTask) => {
    let task = new Task();
    task.id = rawTask["uuid"];
    task.state = rawTask["state"];
    task.name = rawTask["kwargs"];
    task.datetime = rawTask["received"];
    return task;
};

const sortTasks = (tasks) => {
    return tasks.sort((a, b) => parseFloat(b.datetime) - parseFloat(a.datetime));
};

export const useStoreTasks = create((set) => ({
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
                    let task = parseTask(taskList[taskId]);
                    tasks.push(task);
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
