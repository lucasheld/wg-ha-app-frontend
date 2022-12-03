import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField} from "@mui/material";
import {useState} from "react";
import MultiChipInputComponent from "./MultiChipInputComponent";
import SelectServicesComponent from "./SelectServicesComponent";
import {useStoreDialogs} from "../store";

const AddClientDialog = () => {
    // const [publicKey, setPublicKey] = useState("");
    const [title, setTitle] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [tags, setTags] = useState([]);
    const [services, setServices] = useState([]);

    const open = useStoreDialogs((state) => state.open);
    const props = useStoreDialogs((state) => state.props);
    const closeDialog = useStoreDialogs((state) => state.closeDialog);

    return (
        <Dialog
            open={open}
            onClose={closeDialog}
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Add Client
            </DialogTitle>
            <DialogContent dividers>
                {/*<TextField*/}
                {/*    autoFocus*/}
                {/*    margin="dense"*/}
                {/*    id="publicKey"*/}
                {/*    label="Public Key"*/}
                {/*    type="text"*/}
                {/*    fullWidth*/}
                {/*    value={publicKey}*/}
                {/*    onChange={e => setPublicKey(e.target.value)}*/}
                {/*/>*/}
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="privateKey"
                    label="Private Key"
                    type="text"
                    fullWidth
                    value={privateKey}
                    onChange={e => setPrivateKey(e.target.value)}
                />
                <MultiChipInputComponent
                    selected={tags}
                    setSelected={setTags}
                    id="tags"
                    title="Tags"
                />
                <Box my={2}>
                    <Divider/>
                </Box>
                <SelectServicesComponent
                    services={services}
                    setServices={setServices}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        props.handleOk(title, privateKey, tags, services)
                    }}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;
