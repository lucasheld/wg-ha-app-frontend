import {useEffect, useState} from "react";
import io from "socket.io-client";
import {useStoreClients, useStoreTasks} from "../store";

const socket = io("http://127.0.0.1:5000");

const WebsocketComponent = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    const setClients = useStoreClients((state) => state.setClients);
    const addClient = useStoreClients((state) => state.addClient);
    const editClient = useStoreClients((state) => state.editClient);
    const deleteClient = useStoreClients((state) => state.deleteClient);

    const loadTasks = useStoreTasks((state) => state.loadTasks);

    useEffect(() => {
        socket.on("connect", r => {
            setIsConnected(true);
        });

        socket.on("disconnect", r => {
            setIsConnected(false);
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
                loadTasks();
            })
        })

        socket.onAny((event, data) => {
            console.log({event, data})
        })

        return () => {
            socket.off("connect");
            socket.off("disconnect");

            socket.off("setClients");
            socket.off("addClient");
            socket.off("editClient");
            socket.off("deleteClient");

            socket.off("task-sent");
            socket.off("task-received");
            socket.off("task-started");
            socket.off("task-succeeded");
            socket.off("task-failed");
            socket.off("task-rejected");
            socket.off("task-revoked");
            socket.off("task-retried");

            socket.offAny();
        };
    }, []);

    return null;
};

export default WebsocketComponent;
