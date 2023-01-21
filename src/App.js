import "./App.css";
import TasksComponent from "./components/TasksComponent";
import React, {useEffect, useState} from "react";
import TitleComponent from "./components/TitleComponent";
import {
    AppBar,
    Badge,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {Devices, Logout, Memory, Reviews, Settings} from "@mui/icons-material";
import ClientsComponent from "./components/ClientsComponent";
import {useStoreClients, useStoreKeycloak, useStoreNotification, useStoreSettings, useStoreTasks} from "./store";
import DialogsComponent from "./components/DialogsComponent";
import WebsocketComponent from "./components/WebsocketComponent";
import KeycloakComponent from "./components/KeycloakComponent";
import SnackbarComponent from "./components/SnackbarComponent";
import ReviewsComponent from "./components/ReviewsComponent";

const App = () => {
    const token = useStoreKeycloak((state) => state.token);

    const logout = useStoreKeycloak((state) => state.logout);
    const roles = useStoreKeycloak((state) => state.roles);
    const tasks = useStoreTasks((state) => state.tasks);

    const loadTasks = useStoreTasks((state) => state.loadTasks);
    const [displayComponent, setDisplayComponent] = useState(<div/>);

    const addSuccessNotification = useStoreNotification(state => state.addSuccessNotification);
    const review = useStoreSettings(state => state.review);
    const setReview = useStoreSettings(state => state.setReview);

    const clients = useStoreClients((state) => state.clients);
    const reviewClients = clients.filter(client => client.permitted === "PENDING");

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        if (roles) {
            if (roles.includes("app-admin")) {
                setDisplayComponent(<TasksComponent/>);
            } else {
                setDisplayComponent(<ClientsComponent/>);
            }
        }
    }, [roles]);

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
            <SnackbarComponent/>

            {
                !token ?
                <KeycloakComponent/> :
                <Box sx={{display: "flex"}}>
                    <CssBaseline/>
                    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                        <Toolbar>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                frontend
                            </Typography>
                            <span style={{marginRight: "20px"}}>
                                {
                                    roles.includes("app-admin") ? "admin" : "user"
                                }
                            </span>
                            {
                                roles.includes("app-admin") &&
                                <IconButton
                                    onClick={() => {
                                        setReview(!review);
                                        addSuccessNotification(`Review ${!review ? "enabled" : "disabled"}`);
                                    }}
                                    color="inherit"
                                >
                                    <Settings/>
                                </IconButton>
                            }
                            <Tooltip
                                title="Logout"
                            >
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={() => {
                                        logout();
                                    }}
                                >
                                    <Logout/>
                                </IconButton>
                            </Tooltip>
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
                                {
                                    roles.includes("app-admin") &&
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
                                }
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
                                {
                                    review &&
                                    <ListItem key="reviews" disablePadding>
                                        <ListItemButton
                                            onClick={() => setDisplayComponent(<ReviewsComponent/>)}
                                        >
                                            <ListItemIcon>
                                                <Badge badgeContent={reviewClients.length} color="primary">
                                                    <Reviews/>
                                                </Badge>
                                            </ListItemIcon>
                                            <ListItemText primary="Reviews"/>
                                        </ListItemButton>
                                    </ListItem>
                                }
                            </List>
                        </Box>
                    </Drawer>
                    <Box component="main" sx={{flexGrow: 1, p: 3}}>
                        <Toolbar/>
                        {
                            token &&
                            <WebsocketComponent/>
                        }
                        {displayComponent}
                    </Box>
                </Box>
            }
        </React.Fragment>
    );
};

export default App;
