import {useStoreDialogs} from "../store";
import {Controller, useForm} from "react-hook-form";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useRef} from "react";

const PasswordDialogComponent = () => {
    const open = useStoreDialogs((state) => state.open);
    const props = useStoreDialogs((state) => state.props);
    const closeDialog = useStoreDialogs((state) => state.closeDialog);

    const {control, handleSubmit} = useForm({
        defaultValues: {
            password: "",
        }
    });

    const onSubmit = data => {
        props.handleOk(data);
        closeDialog();
    }

    const formRef = useRef(null)

    return (
        <Dialog
            open={open}
            onClose={closeDialog}
            fullWidth
        >
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle id="alert-dialog-title">
                    Edit user
                </DialogTitle>
                <DialogContent dividers>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                margin="dense"
                                label="Password"
                                type="password"
                                fullWidth
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={closeDialog}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                    >
                        Ok
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default PasswordDialogComponent;
