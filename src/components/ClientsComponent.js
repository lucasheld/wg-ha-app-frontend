import React, {useEffect} from "react";
import {Alert, Fab, List, Paper, Tooltip} from "@mui/material";
import {Add} from "@mui/icons-material";
import AnsibleApi from "../api/AnsibleApi";
import {useStoreClients, useStoreDialogs} from "../store";
import ClientComponent from "./ClientComponent";

const ClientsComponent = () => {
    const openClientDialog = useStoreDialogs((state) => state.openClientDialog);

    const loadClients = useStoreClients((state) => state.loadClients);

    const clients = useStoreClients((state) => state.clients);
    const error = useStoreClients((state) => state.error);
    const loaded = useStoreClients((state) => state.loaded);

    useEffect(() => {
        loadClients();
    }, []);

    const handleDialogOk = async (title, privateKey, tags, services) => {
        await AnsibleApi.addClient({
            // "public_key": publicKey,
            "title": title,
            "private_key": privateKey,
            "tags": tags,
            "services": services
        });
    };

    return (
        <React.Fragment>
            {
                loaded &&
                error ?
                    <Alert variant="outlined" severity="error">
                        Clients could not be loaded
                    </Alert>
                    :
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
                            handleOk: handleDialogOk
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
