import create from "zustand";
import Task from "./data-classes/Task";
import FlowerApi from "./api/FlowerApi";
import AnsibleApi from "./api/AnsibleApi";


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


export const useStoreClients = create((set) => ({
    clients: [],
    error: "",
    loaded: false,
    loadClients: () => {
        const url = `${AnsibleApi.baseUrl}/client`;
        fetch(url)
            .then(res => res.json())
            .then(clients => {
                set({
                    clients: clients,
                    error: "",
                })
            })
            .catch((error) => {
                console.log(error);
                set({
                    error: error,
                    clients: [],
                })
            })
            .finally(() => {
                set({
                    loaded: true,
                })
            })
    }
}));
