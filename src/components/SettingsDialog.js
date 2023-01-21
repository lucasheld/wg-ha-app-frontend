import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel} from "@mui/material";
import {useRef} from "react";
import {useStoreApi, useStoreDialogs, useStoreSettings} from "../store";
import {Controller, useForm} from "react-hook-form";

const SettingsDialog = () => {
    const open = useStoreDialogs((state) => state.open);
    const closeDialog = useStoreDialogs((state) => state.closeDialog);

    const settings = useStoreSettings((state) => state.settings);
    const setSettings = useStoreApi((state) => state.setSettings);

    const {control, handleSubmit} = useForm({
        defaultValues: {...settings}
    });

    const onSubmit = data => {
        setSettings(data);
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
                    Edit settings
                </DialogTitle>
                <DialogContent dividers>
                    <FormControlLabel
                        control={
                            <Controller
                                name="review"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        {...field}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                )}
                            />
                        }
                        label="Enable client review"
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

export default SettingsDialog;
