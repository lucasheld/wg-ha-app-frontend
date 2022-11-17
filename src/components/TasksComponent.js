import {useStoreTasks} from "../store";
import {useEffect} from "react";
import {Alert, List, Paper} from "@mui/material";
import TaskComponent from "./TaskComponent";

const TasksComponent = () => {
    const loadTasks = useStoreTasks((state) => state.loadTasks);

    const tasks = useStoreTasks((state) => state.tasks);
    const error = useStoreTasks((state) => state.error);
    const loaded = useStoreTasks((state) => state.loaded);

    useEffect(() => {
        loadTasks()
    }, []);

    return (
        <div>
            {
                loaded &&
                error ?
                    <Alert variant="outlined" severity="error">
                        Tasks could not be loaded
                    </Alert>
                    :
                    tasks.length === 0 ?
                        <Alert variant="outlined" severity="info">
                            No Tasks available
                        </Alert>
                        :
                        <Paper>
                            <List>
                                {
                                    tasks.map((task) =>
                                        <TaskComponent
                                            key={task.id}
                                            task={task}
                                        />
                                    )
                                }
                            </List>
                        </Paper>
            }
        </div>
    )
}

export default TasksComponent;
