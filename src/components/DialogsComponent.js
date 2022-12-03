import ConfirmationDialog from "./ConfirmationDialog";
import {useStoreDialogs} from "../store";
import AddClientDialog from "./AddClientDialog";
import WireGuardConfigDialog from "./WireGuardConfigDialog";

export const CONFIRMATION_DIALOG = "CONFIRMATION_DIALOG";
export const CLIENT_DIALOG = "CLIENT_DIALOG";
export const WIREGUARD_CONFIG_DIALOG = "WIREGUARD_CONFIG_DIALOG";

const DialogsComponent = () => {
    const type = useStoreDialogs((state) => state.type);

    switch (type) {
        case CONFIRMATION_DIALOG:
            return <ConfirmationDialog/>;
        case CLIENT_DIALOG:
            return <AddClientDialog/>;
        case WIREGUARD_CONFIG_DIALOG:
            return <WireGuardConfigDialog/>
        default:
            return null;
    }
}

export default DialogsComponent;
