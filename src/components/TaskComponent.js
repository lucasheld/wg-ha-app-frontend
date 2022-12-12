import React, {useState} from "react";
import {
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip
} from "@mui/material";
import {Cancel, Done, ErrorOutline} from "@mui/icons-material";
import PlaybookOutputDialog from "./PlaybookOutputDialog";
import FlowerApi from "../api/FlowerApi";
import {parseTaskDatetime} from "../utils";

const TaskComponent = ({task}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const cancelTask = async () => {
        await FlowerApi.cancelTask(task.uuid);
    };

    let taskSucceeded = task.state === "SUCCESS";
    let taskFailed = task.state === "FAILURE" || task.state === "REVOKED";
    let taskRunning = !(taskSucceeded || taskFailed);

    return (
        <React.Fragment>
            <PlaybookOutputDialog
                isOpen={dialogOpen}
                handleClose={closeDialog}
                task={task}
            />
            <List
                disablePadding
            >
                <ListItem
                    disablePadding
                    key={`listitem-${task.uuid}`}
                >
                    <ListItemButton
                        onClick={openDialog}
                    >
                        <ListItemIcon>
                            {
                                taskSucceeded ?
                                    <Done/> :
                                    taskFailed ?
                                        <ErrorOutline/> :
                                        <CircularProgress size={24}/>
                            }
                        </ListItemIcon>
                        <ListItemText
                            id={`label-${task.uuid}`}
                            primary={task.kwargs}
                            secondary={parseTaskDatetime(task)}
                        />
                        <ListItemSecondaryAction>
                            {
                                taskRunning &&
                                <Tooltip
                                    title="cancel task">
                                    <IconButton
                                        aria-label="cancel task"
                                        onClick={cancelTask}
                                    >
                                        <Cancel/>
                                    </IconButton>
                                </Tooltip>
                            }
                        </ListItemSecondaryAction>
                    </ListItemButton>
                </ListItem>
            </List>
        </React.Fragment>
    );
};

export default TaskComponent;
