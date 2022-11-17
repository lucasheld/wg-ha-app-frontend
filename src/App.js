import "./App.css";
import TasksComponent from "./components/TasksComponent";
import React, {useState} from "react";
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
import {Memory, Person} from "@mui/icons-material";
import UsersComponent from "./components/UsersComponent";


const App = (props) => {
    const [displayComponent, setDisplayComponent] = useState(<TasksComponent/>);

    const countRunningTasks = () => {
        // TODO
        return 0
    }

    const drawerWidth = 240;

    return (
        <React.Fragment>
            <TitleComponent title="frontend" count={countRunningTasks()}/>

            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItem key="tasks" disablePadding>
                                <ListItemButton
                                    onClick={() => setDisplayComponent(<TasksComponent />)}
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
                            <ListItem key="users" disablePadding>
                                <ListItemButton
                                    onClick={() => setDisplayComponent(<UsersComponent />)}
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
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    {displayComponent}
                </Box>
            </Box>
        </React.Fragment>
    )
};

export default App;
