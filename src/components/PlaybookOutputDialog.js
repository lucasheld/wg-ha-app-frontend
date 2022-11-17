import {useEffect, useRef, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import AnsibleApi from "../api/AnsibleApi";

const PlaybookOutputDialog = (props) => {
    const [taskOutput, setTaskOutput] = useState("");
    const intervalRef = useRef({
        interval: null
    });

    // componentWillUnmount
    const val = useRef();
    useEffect(
        () => {
            val.current = props;
        },
        [props]
    );
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.interval);
        };
    }, []);

    // componentDidUpdate - isOpen
    useEffect(
        () => {
            if (props.isOpen) {
                getOutput();
                intervalRef.interval = setInterval(getOutput, 1000);
            } else if (intervalRef.interval) {
                clearInterval(intervalRef.interval);
            }
        },
        [props.isOpen]
    );

    const getOutput = () => {
        AnsibleApi.getPlaybookOutput(props.task.id)
            .then(response => {
                let taskOutput = response.output;
                setTaskOutput(taskOutput);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.handleClose}
            scroll="paper"
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle id="scroll-dialog-title">Playbook output</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    <Typography component="span">
                        Command: {props.task.name}
                    </Typography>
                    <br/>
                    <Typography component="span">
                        Started: {props.task.parsedDatetime()}
                    </Typography>
                    <br/>
                    <Typography component="span">
                        State: {props.task.state}
                    </Typography>
                    <br/>
                    {taskOutput && <br/>}
                </DialogContentText>
                <Typography component="span" variant="body1" style={{whiteSpace: 'pre-line'}}>
                    {taskOutput}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PlaybookOutputDialog;
