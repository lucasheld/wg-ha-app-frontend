import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField} from "@mui/material";
import {useRef} from "react";
import MultiChipInputComponent from "./MultiChipInputComponent";
import SelectServicesComponent from "./SelectServicesComponent";
import {useStoreDialogs} from "../store";
import {Controller, useForm} from "react-hook-form";

const AddClientDialog = () => {
    const open = useStoreDialogs((state) => state.open);
    const props = useStoreDialogs((state) => state.props);
    const closeDialog = useStoreDialogs((state) => state.closeDialog);

    const {control, handleSubmit} = useForm({
        defaultValues:
            props.client ?
            {
                ...props.client,
                services: props.client.services.map(service => ({
                    ...service,
                    rules: service.rules ?
                        service.rules.map(rule => ({
                            ...rule,
                            ports: rule.ports ?
                                rule.ports.map(port => port.toString())
                                : []
                        }))
                        : [],
                    allowed_tags: service.allowed_tags ? service.allowed_tags : []
                }))
            } :
            {
                title: "",
                private_key: "",
                tags: [],
                services: [],
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
                    Add Client
                </DialogTitle>
                <DialogContent dividers>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                autoFocus
                                margin="dense"
                                label="Title"
                                type="text"
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="private_key"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                margin="dense"
                                label="Private Key"
                                type="text"
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <MultiChipInputComponent
                                {...field}
                                id="tags"
                                title="Tags"
                            />
                        )}
                    />
                    <Box my={2}>
                        <Divider/>
                    </Box>
                    <Controller
                        name="services"
                        control={control}
                        render={({ field }) => (
                            <SelectServicesComponent
                                {...field}
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
};

export default AddClientDialog;
