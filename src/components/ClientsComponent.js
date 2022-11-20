import React, {useEffect, useState} from "react";
import {Alert, Fab, List, Paper, Tooltip} from "@mui/material";
import {Add} from "@mui/icons-material";
import AnsibleApi from "../api/AnsibleApi";
import AddClientDialog from "./AddClientDialog";
import {useStoreClients} from "../store";
import ClientComponent from "./ClientComponent";

const ClientsComponent = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const loadClients = useStoreClients((state) => state.loadClients);

    const clients = useStoreClients((state) => state.clients);
    const error = useStoreClients((state) => state.error);
    const loaded = useStoreClients((state) => state.loaded);

    useEffect(() => {
        loadClients();
    }, []);

    const handleDialogOk = async (publicKey, tags, services) => {
        setDialogOpen(false);

        console.log({publicKey, tags, services});

        await AnsibleApi.addClient({
            "public_key": publicKey,
            "tags": tags,
            "services": services
        });
    };

    return (
        <React.Fragment>
            {
                dialogOpen &&
                <AddClientDialog
                    handleClose={() => setDialogOpen(false)}
                    handleOk={handleDialogOk}
                />
            }

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
                    onClick={() => setDialogOpen(true)}
                >
                    <Add/>
                </Fab>
            </Tooltip>
        </React.Fragment>
    );
};

export default ClientsComponent;
