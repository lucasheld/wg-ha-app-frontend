import React from "react";
import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";

const ClientComponent = (props) => {
    return (
        <React.Fragment>
            <List
                disablePadding
            >
                <ListItem
                    disablePadding
                    key={`listitem-${props.client.public_key}`}
                >
                    <ListItemButton
                        onClick={() => {
                            console.log(props.client);
                        }}
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
