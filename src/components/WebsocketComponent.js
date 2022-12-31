import {useEffect} from "react";
import io from "socket.io-client";
import {useStoreClients, useStoreClientsApplied, useStoreSession, useStoreTasks, useStoreUsers} from "../store";

const WebsocketComponent = () => {
    const setClients = useStoreClients((state) => state.setClients);
    const addClient = useStoreClients((state) => state.addClient);
    const editClient = useStoreClients((state) => state.editClient);
    const deleteClient = useStoreClients((state) => state.deleteClient);

    const setClientsApplied = useStoreClientsApplied((state) => state.setClientsApplied);

    const setUsers = useStoreUsers((state) => state.setUsers);
    const addUser = useStoreUsers((state) => state.addUser);
    const editUser = useStoreUsers((state) => state.editUser);
    const deleteUser = useStoreUsers((state) => state.deleteUser);

    const addOrEditTask = useStoreTasks((state) => state.addOrEditTask);
    const editTaskOutput = useStoreTasks((state) => state.editTaskOutput);

    const token = useStoreSession((state) => state.token);

    useEffect(() => {
        const socket = io("http://127.0.0.1:5000", {
            extraHeaders: {
                "Authorization": `Bearer ${token}`
            }
        });

        socket.on("connect", r => {

        });

        socket.on("disconnect", r => {

        });


        socket.on("setClients", r => {
            setClients(r);
        });

        socket.on("addClient", r => {
            addClient(r);
        });

        socket.on("editClient", r => {
            editClient(r);
        });

        socket.on("deleteClient", r => {
            deleteClient(r);
        });


        socket.on("setClientsApplied", r => {
            setClientsApplied(r);
        });


        socket.on("setUsers", r => {
            setUsers(r);
        });

        socket.on("addUser", r => {
            addUser(r);
        });

        socket.on("editUser", r => {
            editUser(r);
        });

        socket.on("deleteUser", r => {
            deleteUser(r);
        });


        [
            "task-sent",
            "task-received",
            "task-started",
            "task-succeeded",
            "task-failed",
            "task-rejected",
            "task-revoked",
            "task-retried"
        ].forEach(e => {
            socket.on(e, r => {
                addOrEditTask(r);
            })
        })

        socket.on("task-progress", r => {
            editTaskOutput(r);
        })

        socket.onAny((event, data) => {
            console.log({event, data})
        })

        return () => {
            [
                "connect",
                "disconnect",
                "setClients",
                "addClient",
                "editClient",
                "deleteClient",
                "setClientsApplied",
                "setUsers",
                "addUser",
                "editUser",
                "deleteUser",
                "task-sent",
                "task-received",
                "task-started",
                "task-succeeded",
                "task-failed",
                "task-rejected",
                "task-revoked",
                "task-retried",
                "task-progress",
            ].forEach(e => {
                socket.off(e)
            })

            socket.offAny();
        };
    }, []);

    return null;
};

export default WebsocketComponent;
