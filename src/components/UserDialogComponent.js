import {useStoreDialogs} from "../store";
import {Controller, useForm} from "react-hook-form";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import MultiChipInputComponent from "./MultiChipInputComponent";
import {useRef} from "react";

const UserDialogComponent = () => {
    const open = useStoreDialogs((state) => state.open);
    const props = useStoreDialogs((state) => state.props);
    const closeDialog = useStoreDialogs((state) => state.closeDialog);

    const {control, handleSubmit} = useForm({
        defaultValues:
            props.user ?
                {
                    ...props.user,
                    password: ""
                } :
                {
                    username: "",
                    password: "",
                    roles: []
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
                    {props.edit ? "Edit" : "Add"} User
                </DialogTitle>
                <DialogContent dividers>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                autoFocus
                                margin="dense"
                                label="Username"
                                type="text"
                                fullWidth
                            />
                        )}
                    />
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
                    <Controller
                        name="roles"
                        control={control}
                        render={({ field }) => (
                            <MultiChipInputComponent
                                {...field}
                                id="roles"
                                title="Roles"
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

export default UserDialogComponent;
