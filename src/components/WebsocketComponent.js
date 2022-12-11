import {useEffect, useState} from "react";
import io from "socket.io-client";
import {useStoreClients} from "../store";

const socket = io("http://127.0.0.1:5000");

const WebsocketComponent = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    const setClients = useStoreClients((state) => state.setClients);
    const addClient = useStoreClients((state) => state.addClient);
    const editClient = useStoreClients((state) => state.editClient);
    const deleteClient = useStoreClients((state) => state.deleteClient);

    useEffect(() => {
        socket.on("connect", r => {
            console.log(`connect: ${r}`);
            setIsConnected(true);
        });

        socket.on("disconnect", r => {
            console.log(`disconnect: ${r}`);
            setIsConnected(false);
        });

        socket.on("setClients", r => {
            console.log(`setClients: ${JSON.stringify(r)}`);
            setClients(r);
        });

        socket.on("addClient", r => {
            console.log(`addClient: ${JSON.stringify(r)}`);
            addClient(r);
        });

        socket.on("editClient", r => {
            console.log(`editClient: ${JSON.stringify(r)}`);
            editClient(r);
        });

        socket.on("deleteClient", r => {
            console.log(`deleteClient: ${r}`);
            deleteClient(r);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("setClients");
            socket.off("addClient");
            socket.off("editClient");
            socket.off("deleteClient");
        };
    }, []);

    return null;
};

export default WebsocketComponent;
