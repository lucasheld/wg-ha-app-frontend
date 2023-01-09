import {useStoreNotification} from "../store";
import {Alert, Snackbar} from "@mui/material";

const SnackbarComponent = () => {
    const open = useStoreNotification(state => state.open);
    const message = useStoreNotification(state => state.message);
    const severity = useStoreNotification(state => state.severity);
    const clearNotification = useStoreNotification(state => state.clearNotification);

    return (
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            open={open}
            autoHideDuration={6000}
            onClose={clearNotification}
        >
            <Alert
                onClose={clearNotification}
                severity={severity}
                elevation={6}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarComponent;
