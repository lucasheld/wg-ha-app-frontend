import React, {useEffect, useState} from "react";
import AnsibleApi from "../api/AnsibleApi";
import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton
} from "@mui/material";
import {Download, QrCode, TextSnippet} from "@mui/icons-material";
import {QRCodeSVG} from "qrcode.react";
import {atomOneLight, CopyBlock} from "react-code-blocks";
import {useStoreDialogs} from "../store";

const modeEnum = {
    TEXT: "text",
    QR: "qr"
}

const WireGuardConfigDialog = () => {
    const [wireGuardConfig, setWireGuardConfig] = useState("");
    const [mode, setMode] = useState(modeEnum.TEXT);

    const open = useStoreDialogs((state) => state.open);
    const props = useStoreDialogs((state) => state.props);
    const closeDialog = useStoreDialogs((state) => state.closeDialog);

    useEffect(
        () => {
            if (open) {
                getOutput();
            }
        },
        [open]
    );

    const getOutput = () => {
        AnsibleApi.getWireGuardConfig(props.client.id)
            .then(response => {
                setWireGuardConfig(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={closeDialog}
                scroll="paper"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="scroll-dialog-title">
                    WireGuard Config: {props.client.title}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <ButtonGroup variant="contained" aria-label="switch mode">
                            <IconButton
                                aria-label="text"
                                onClick={() => setMode(modeEnum.TEXT)}
                                disabled={mode === modeEnum.TEXT}
                            >
                                <TextSnippet/>
                            </IconButton>
                            <IconButton
                                aria-label="qr code"
                                onClick={() => setMode(modeEnum.QR)}
                                disabled={mode === modeEnum.QR}
                            >
                                <QrCode/>
                            </IconButton>
                        </ButtonGroup>
                    </Grid>
                    <br/>
                    {
                        mode === modeEnum.TEXT &&
                        <React.Fragment>
                            <CopyBlock
                                text={wireGuardConfig}
                                language="text"
                                showLineNumbers={false}
                                theme={atomOneLight}
                                codeBlock
                            />
                            <Box mt={1}>
                                <Button
                                    aria-label="download"
                                    variant="contained"
                                    startIcon={<Download/>}
                                    onClick={() => {
                                        const file = new Blob([wireGuardConfig], {type: 'text/plain'});
                                        const element = document.createElement("a");
                                        element.href = URL.createObjectURL(file);
                                        element.download = "wg0.conf";
                                        document.body.appendChild(element);
                                        element.click();
                                        element.parentNode.removeChild(element);
                                    }}
                                >Download</Button>
                            </Box>
                        </React.Fragment>
                    }
                    {
                        mode === modeEnum.QR &&
                        <QRCodeSVG size="300" value={wireGuardConfig} />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default WireGuardConfigDialog;
