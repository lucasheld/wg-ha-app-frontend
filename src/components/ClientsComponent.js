import React from "react";
import {Alert, Fab, List, Paper, Tooltip} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useStoreClients, useStoreDialogs, useStoreSession} from "../store";
import ClientComponent from "./ClientComponent";
import {ansibleApiUrl} from "../utils";

const ClientsComponent = () => {
    const openClientDialog = useStoreDialogs((state) => state.openClientDialog);

    const clients = useStoreClients((state) => state.clients);
    const token = useStoreSession((state) => state.token);

    const addClient = body => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        };
        return fetch(`${ansibleApiUrl}/client`, requestOptions)
            .then(response => response.json());
    }

    return (
        <React.Fragment>
            {
                clients.length === 0 ?
                    <Alert variant="outlined" severity="info">
                        No Clients available
                    </Alert>
                    :
                    <Paper>
                        <List>
                            {
                                clients.map((client) =>
                                    <ClientComponent
                                        key={client.id}
                                        client={client}
                                    />
                                )
                            }
                        </List>
                    </Paper>
            }

            <Tooltip title="Add Client" aria-label="add client">
                <Fab
                    color="primary"
                    sx={{
                        position: "absolute",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2)
                    }}
                    onClick={() => {
                        openClientDialog({
                            handleOk: async (body) => {
                                await addClient(body);
                            }
                        });
                    }}
                >
                    <Add/>
                </Fab>
            </Tooltip>
        </React.Fragment>
    );
};

export default ClientsComponent;
