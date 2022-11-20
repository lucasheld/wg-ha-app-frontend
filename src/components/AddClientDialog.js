import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useState} from "react";

const AddClientDialog = (props) => {
    const [publicKey, setPublicKey] = useState("");
    // const [tags, setTags] = useState([]);
    // const [services, setServices] = useState([]);

    return (
        <Dialog
            open={true}
            onClose={props.handleClose}
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">
                Add Client
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    id="publicKey"
                    label="Public Key"
                    type="text"
                    fullWidth
                    value={publicKey}
                    onChange={e => setPublicKey(e.target.value)}
                />
                {/*<SelectTagsComponent/>*/}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => props.handleOk(publicKey)} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;
