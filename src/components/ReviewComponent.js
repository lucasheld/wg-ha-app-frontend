import React from "react";
import {Button, IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip} from "@mui/material";
import {ThumbDown, ThumbUp} from "@mui/icons-material";
import {useStoreApi, useStoreDialogs} from "../store";

const ReviewComponent = (props) => {
    const editClient = useStoreApi((state) => state.editClient);

    const openClientDialog = useStoreDialogs((state) => state.openClientDialog);
    const closeDialog = useStoreDialogs((state) => state.closeDialog);

    const declineClient = () => {
        editClient(props.client.id, {
            "permitted": "DECLINED"
        })
    }

    const acceptClient = () => {
        editClient(props.client.id, {
            "permitted": "ACCEPTED"
        })
    }

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
                                title="Decline client"
                            >
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        declineClient()
                                    }}
                                >
                                    <ThumbDown/>
                                </IconButton>
                            </Tooltip>
                            <span style={{marginRight: 10}}></span>
                            <Tooltip
                                title="Accept client"
                            >
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        acceptClient();
                                        closeDialog();
                                    }}
                                >
                                    <ThumbUp/>
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>
                    }
                >
                    <ListItemButton
                        onClick={() => {
                            openClientDialog({
                                title: "Review client",
                                client: props.client,
                                disabled: true,
                                customDialogActions: <div>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            declineClient();
                                            closeDialog();
                                        }}
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            acceptClient();
                                            closeDialog();
                                        }}
                                    >
                                        Accept
                                    </Button>
                                </div>
                            });
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

export default ReviewComponent;
