import ConfirmationDialog from "./ConfirmationDialog";
import {useStoreDialogs} from "../store";

export const CONFIRMATION_DIALOG = "CONFIRMATION_DIALOG";

const DialogsComponent = () => {
    const type = useStoreDialogs((state) => state.type);

    switch (type) {
        case CONFIRMATION_DIALOG:
            return <ConfirmationDialog/>;
        default:
            return null;
    }
}

export default DialogsComponent;
