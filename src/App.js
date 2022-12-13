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
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {AccountCircle, Devices, Memory, Person} from "@mui/icons-material";
import UsersComponent from "./components/UsersComponent";
import ClientsComponent from "./components/ClientsComponent";
import {useStoreSession, useStoreTasks} from "./store";
import DialogsComponent from "./components/DialogsComponent";
import WebsocketComponent from "./components/WebsocketComponent";
import LoginComponent from "./components/LoginComponent";


const App = () => {
    const [displayComponent, setDisplayComponent] = useState(<TasksComponent/>);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const tasks = useStoreTasks((state) => state.tasks);
    const loadTasks = useStoreTasks((state) => state.loadTasks);

    const logout = useStoreSession((state) => state.logout);
    const token = useStoreSession((state) => state.token);
    const username = useStoreSession((state) => state.username);

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

            {
                !token ?
                <LoginComponent/> :
                <Box sx={{display: "flex"}}>
                    <CssBaseline/>
                    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                        <Toolbar>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                frontend
                            </Typography>
                            {
                                !!token &&
                                <div>
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={event => setAnchorEl(event.currentTarget)}
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu
                                        id="user-menu"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={() => setAnchorEl(null)}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                setAnchorEl(null);
                                                // TODO: open edit user dialog
                                            }}
                                        >
                                            Edit user
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setAnchorEl(null);
                                                logout();
                                            }}
                                        >
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            }
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
            }
        </React.Fragment>
    );
};

export default App;
