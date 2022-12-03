import React, {useState} from "react";
import {IconButton, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import WireGuardConfigDialog from "./WireGuardConfigDialog";
import {Delete, Edit} from "@mui/icons-material";
import {useStoreDialogs} from "../store";
import AnsibleApi from "../api/AnsibleApi";

const ClientComponent = (props) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const openConfirmationDialog = useStoreDialogs((state) => state.openConfirmationDialog);

    return (
        <React.Fragment>
            <WireGuardConfigDialog
                isOpen={dialogOpen}
                handleClose={() => setDialogOpen(false)}
                client={props.client}
            />
            <List
                disablePadding
            >
                <ListItem
                    disablePadding
                    key={`listitem-${props.client.public_key}`}
                    secondaryAction={
                        <React.Fragment>
                            <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => {
                                    console.log("edit");
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
                                        handleOk: () => AnsibleApi.deleteClient(props.client.public_key)
                                    })
                                }}
                            >
                                <Delete/>
                            </IconButton>
                        </React.Fragment>
                    }
                >
                    <ListItemButton
                        onClick={() => setDialogOpen(true)}
                    >
                        <ListItemText
                            id={`label-${props.client.public_key}`}
                            primary={props.client.title}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </React.Fragment>
    );
};

export default ClientComponent;
