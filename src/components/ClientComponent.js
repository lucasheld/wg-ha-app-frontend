import React, {useState} from "react";
import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import WireGuardConfigDialog from "./WireGuardConfigDialog";

const ClientComponent = (props) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const openDialog = () => {
        console.log(props.client);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    return (
        <React.Fragment>
            <WireGuardConfigDialog
                isOpen={dialogOpen}
                handleClose={closeDialog}
                client={props.client}
            />
            <List
                disablePadding
            >
                <ListItem
                    disablePadding
                    key={`listitem-${props.client.public_key}`}
                >
                    <ListItemButton
                        onClick={openDialog}
                    >
                        <ListItemText
                            id={`label-${props.client.public_key}`}
                            primary={props.client.public_key}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </React.Fragment>
    );
};

export default ClientComponent;
