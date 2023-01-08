import React, {useEffect} from "react";
import Keycloak from "keycloak-js";
import {useStoreKeycloak} from "../store";
import {CircularProgress, Grid} from "@mui/material";

const KeycloakComponent = () => {
    const setKeycloak = useStoreKeycloak((state) => state.setKeycloak);
    const setToken = useStoreKeycloak((state) => state.setToken);
    const setRoles = useStoreKeycloak((state) => state.setRoles);

    useEffect(() => {
        const keycloak = new Keycloak("/keycloak.json");
        keycloak.init({
            onLoad: "login-required"
        }).then(authenticated => {
            setKeycloak(keycloak);
            if (authenticated) {
                let roles = keycloak.realmAccess.roles;
                setRoles(roles);
                let token = keycloak.token;
                setToken(token);
            }
        })
    }, []);

    return <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{
            minHeight: "100vh"
        }}
    >
        <Grid item>
            <CircularProgress size={50} />
        </Grid>
    </Grid>;
}

export default KeycloakComponent;
