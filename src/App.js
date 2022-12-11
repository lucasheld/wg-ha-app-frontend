import "./App.css";
import TasksComponent from "./components/TasksComponent";
import React, {useEffect, useRef, useState} from "react";
import TitleComponent from "./components/TitleComponent";
import {
    AppBar,
    Badge,
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import {Devices, Memory, Person} from "@mui/icons-material";
import UsersComponent from "./components/UsersComponent";
import ClientsComponent from "./components/ClientsComponent";
import {useStoreTasks} from "./store";
import DialogsComponent from "./components/DialogsComponent";
import WebsocketComponent from "./components/WebsocketComponent";


const App = () => {
    const [displayComponent, setDisplayComponent] = useState(<TasksComponent/>);

    const tasks = useStoreTasks((state) => state.tasks);
    const loadTasks = useStoreTasks((state) => state.loadTasks);

    useEffect(() => {
        loadTasks();
    }, []);

    const countRunningTasks = () => {
        return tasks.filter(task => !(
            task.state === "SUCCESS" ||
            task.state === "FAILURE" ||
            task.state === "REVOKED"
        )).length;
    };

    const drawerWidth = 240;

    return (
        <React.Fragment>
            <TitleComponent title="frontend" count={countRunningTasks()}/>
            <DialogsComponent/>

            <Box sx={{display: "flex"}}>
                <CssBaseline/>
                <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            frontend
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: "border-box"},
                    }}
                >
                    <Toolbar/>
                    <Box sx={{overflow: "auto"}}>
                        <List>
                            <ListItem key="tasks" disablePadding>
                                <ListItemButton
                                    onClick={() => setDisplayComponent(<TasksComponent/>)}
                                >
                                    <ListItemIcon>
                                        <Badge
                                            badgeContent={countRunningTasks()}
                                            color="primary"
                                        >
                                            <Memory/>
                                        </Badge>
                                    </ListItemIcon>
                                    <ListItemText primary="Tasks"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="clients" disablePadding>
                                <ListItemButton
                                    onClick={() => setDisplayComponent(<ClientsComponent/>)}
                                >
                                    <ListItemIcon>
                                        <Devices/>
                                    </ListItemIcon>
                                    <ListItemText primary="Clients"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="users" disablePadding>
                                <ListItemButton
                                    onClick={() => setDisplayComponent(<UsersComponent/>)}
                                >
                                    <ListItemIcon>
                                        <Person/>
                                    </ListItemIcon>
                                    <ListItemText primary="Users"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" sx={{flexGrow: 1, p: 3}}>
                    <Toolbar/>
                    <WebsocketComponent/>
                    {displayComponent}
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default App;
