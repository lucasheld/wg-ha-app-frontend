import React from "react";
import {
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip
} from "@mui/material";
import {Delete, Done, Edit} from "@mui/icons-material";
import {useStoreApi, useStoreClients, useStoreClientsApplied, useStoreDialogs} from "../store";

const ClientComponent = (props) => {
    const openClientDialog = useStoreDialogs((state) => state.openClientDialog);
    const openConfirmationDialog = useStoreDialogs((state) => state.openConfirmationDialog);
    const openWireGuardConfigDialog = useStoreDialogs((state) => state.openWireGuardConfigDialog);

    const clients = useStoreClients(state => state.clients);

    const clientsApplied = useStoreClientsApplied(state => state.clientsApplied);

    const editClient = useStoreApi((state) => state.editClient);
    const deleteClient = useStoreApi((state) => state.deleteClient);

    const clientAndClientAppliedMatch = () => {
        // compare client and clientApplied and ignore id

        const client = {
            ...clients.find(client => client.public_key === props.client.public_key),
            id: null,
            title: null
        };
        const clientApplied = {
            ...clientsApplied.find(client => client.public_key === props.client.public_key),
            id: null,
            title: null
        };

        let clientJson = JSON.stringify(client, Object.keys(client).sort());
        let clientAppliedJson = JSON.stringify(clientApplied, Object.keys(clientApplied).sort());

        return clientJson === clientAppliedJson;
    }

    const clientApplied = clientAndClientAppliedMatch();

    return (
        <React.Fragment>
            <List
                disablePadding
            >
                <ListItem
                    disablePadding
                    key={`listitem-${props.client.id}`}
                    secondaryAction={
                        <React.Fragment>
                            <Tooltip
                                title="Edit client"
                                aria-label="edit client"
                            >
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => {
                                        openClientDialog({
                                            client: props.client,
                                            handleOk: async (body) => {
                                                await editClient(props.client.id, body);
                                            }
                                        });
                                    }}
                                >
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Delete client"
                                aria-label="delete client"
                            >
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => {
                                        openConfirmationDialog({
                                            title: "Delete client",
                                            content: `Are you sure you want to delete the client "${props.client.title}"?`,
                                            handleOk: () => deleteClient(props.client.id)
                                        })
                                    }}
                                >
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>
                    }
                >
                    <ListItemButton
                        onClick={() => {
                            openWireGuardConfigDialog({
                                client: props.client
                            })
                        }}
                    >
                        <ListItemIcon>
                            {
                                clientApplied ?
                                    <Done/> :
                                    <CircularProgress size={24}/>
                            }
                        </ListItemIcon>
                        <ListItemText
                            id={`label-${props.client.id}`}
                            primary={props.client.title}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </React.Fragment>
    );
};

export default ClientComponent;
