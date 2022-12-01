import React, {useEffect, useState} from "react";
import AnsibleApi from "../api/AnsibleApi";
import {Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton} from "@mui/material";
import {QrCode, TextSnippet} from "@mui/icons-material";
import {QRCodeSVG} from "qrcode.react";
import {atomOneLight, CopyBlock} from "react-code-blocks";

const WireGuardConfigDialog = (props) => {
    const [wireGuardConfig, setWireGuardConfig] = useState("");
    const [mode, setMode] = useState("text");  // text, qr

    useEffect(
        () => {
            if (props.isOpen) {
                getOutput();
            }
        },
        [props.isOpen]
    );

    const getOutput = () => {
        AnsibleApi.getWireGuardConfig(props.client.public_key)
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
                open={props.isOpen}
                onClose={props.handleClose}
                scroll="paper"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="scroll-dialog-title">WireGuard Config</DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <ButtonGroup variant="contained" aria-label="switch mode">
                            <IconButton
                                aria-label="text"
                                onClick={() => setMode("text")}
                                disabled={mode === "text"}
                            >
                                <TextSnippet/>
                            </IconButton>
                            <IconButton
                                aria-label="qr code"
                                onClick={() => setMode("qr")}
                                disabled={mode === "qr"}
                            >
                                <QrCode/>
                            </IconButton>
                        </ButtonGroup>
                    </Grid>
                    <br/>
                    {
                        mode === "text" &&
                        <CopyBlock
                            text={wireGuardConfig}
                            language="text"
                            showLineNumbers={false}
                            theme={atomOneLight}
                            codeBlock
                        />
                    }
                    {
                        mode === "qr" &&
                        <QRCodeSVG size="300" value={wireGuardConfig} />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default WireGuardConfigDialog;