import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField} from "@mui/material";
import {useState} from "react";
import MultiChipInputComponent from "./MultiChipInputComponent";
import SelectServicesComponent from "./SelectServicesComponent";

const AddClientDialog = (props) => {
    // const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [tags, setTags] = useState([]);
    const [services, setServices] = useState([]);

    return (
        <Dialog
            open={true}
            onClose={props.handleClose}
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
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => props.handleOk(privateKey, tags, services)} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;
