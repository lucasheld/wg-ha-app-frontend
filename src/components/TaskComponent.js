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
import {parseTaskDatetime} from "../utils";
import {useStoreApi} from "../store";

const TaskComponent = ({task}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    let taskSucceeded = task.state === "SUCCESS";
    let taskFailed = task.state === "FAILURE" || task.state === "REVOKED";
    let taskRunning = !(taskSucceeded || taskFailed);

    const cancelTask = useStoreApi((state) => state.cancelTask);

    return (
        <React.Fragment>
            {
                dialogOpen &&
                <PlaybookOutputDialog
                    isOpen={dialogOpen}
                    handleClose={() => setDialogOpen(false)}
                    task={task}
                />
            }
            <List
                disablePadding
            >
                <ListItem
                    disablePadding
                    key={`listitem-${task.uuid}`}
                >
                    <ListItemButton
                        onClick={() => setDialogOpen(true)}
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
                            primary="Ansible Playbook"
                            secondary={parseTaskDatetime(task)}
                        />
                        <ListItemSecondaryAction>
                            {
                                taskRunning &&
                                <Tooltip
                                    title="cancel task">
                                    <IconButton
                                        aria-label="cancel task"
                                        onClick={async () => {
                                            await cancelTask(task.uuid);
                                        }}
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
