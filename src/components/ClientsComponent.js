import React from "react";
import {Alert, Fab, List, Paper, Tooltip} from "@mui/material";
import {Add} from "@mui/icons-material";
import AnsibleApi from "../api/AnsibleApi";
import {useStoreClients, useStoreDialogs} from "../store";
import ClientComponent from "./ClientComponent";

const ClientsComponent = () => {
    const openClientDialog = useStoreDialogs((state) => state.openClientDialog);

    const clients = useStoreClients((state) => state.clients);

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
                                        key={client.public_key}
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
                                await AnsibleApi.addClient(body);
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
