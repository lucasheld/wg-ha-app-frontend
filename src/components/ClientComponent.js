import React from "react";
import {IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {useStoreDialogs} from "../store";
import AnsibleApi from "../api/AnsibleApi";

const ClientComponent = (props) => {
    const openClientDialog = useStoreDialogs((state) => state.openClientDialog);
    const openConfirmationDialog = useStoreDialogs((state) => state.openConfirmationDialog);
    const openWireGuardConfigDialog = useStoreDialogs((state) => state.openWireGuardConfigDialog);

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
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => {
                                    openClientDialog({
                                        client: props.client,
                                        handleOk: async (body) => {
                                            await AnsibleApi.editClient(props.client.id, body);
                                        }
                                    });
                                }}
                            >
                                <Edit/>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => {
                                    openConfirmationDialog({
                                        title: "Delete client",
                                        content: `Are you sure you want to delete the client "${props.client.title}"?`,
                                        handleOk: () => AnsibleApi.deleteClient(props.client.id)
                                    })
                                }}
                            >
                                <Delete/>
                            </IconButton>
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
