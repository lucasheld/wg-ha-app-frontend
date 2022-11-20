import {Box, Button, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useEffect, useState} from "react";
import MultiChipInputComponent from "./MultiChipInputComponent";
import {Add, Delete} from "@mui/icons-material";

const SelectServicesComponent = ({services, setServices}) => {
    useEffect(() => {
        let newServices = services.map(service => ({
            ...service,
            rules: service.rules ?
                service.rules.map(rule => ({
                    ...rule,
                    ports: rule.ports ?
                        rule.ports.map(port => port.toString())
                        : []
                }))
                : [],
            allowed_tags: service.allowed_tags ? service.allowed_tags : []
        }))
        setServices(newServices);
    }, []);

    const generateNewRule = () => {
        return {
            "protocol": "",
            "ports": []
        }
    }

    const generateNewService = () => {
        let rule = generateNewRule();
        return {
            "rules": [
                rule
            ],
            "allowed_tags": []
        }
    }

    return (
        <React.Fragment>
            {
                services.map((service, serviceIndex) =>
                    <Box
                        key={`${serviceIndex}-div`}
                    >
                        {
                            service.rules.map((rule, ruleIndex) => {
                                let displayPorts = ["tcp", "udp"].includes(rule.protocol);
                                let displayDelete = service.rules.length > 1;
                                let xsProtocol = displayPorts ? 4 : displayDelete ? 11 : 12;
                                let xsPorts = displayDelete ? 7 : 8;
                                let xsDelete = 1;

                                return (
                                    <Grid
                                        container
                                        spacing={2}
                                        key={`${serviceIndex}${ruleIndex}-grid`}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Grid item xs={xsProtocol}>
                                            <FormControl
                                                fullWidth
                                                margin="dense"
                                                key={`${serviceIndex}${ruleIndex}-protocol-formcontrol`}
                                            >
                                                <InputLabel id={`${serviceIndex}${ruleIndex}-protocol-select-label`}>
                                                    Protocol
                                                </InputLabel>
                                                <Select
                                                    labelId={`${serviceIndex}${ruleIndex}-protocol-select-label`}
                                                    id={`${serviceIndex}${ruleIndex}-protocol-select`}
                                                    value={rule.protocol}
                                                    label="Protocol"
                                                    onChange={e => {
                                                        let protocol = e.target.value;
                                                        let displayPortsNew = ["tcp", "udp"].includes(rule.protocol);
                                                        let newServices = services.map(s => ({
                                                            ...s,
                                                            rules: service === s ?
                                                                s.rules.map(r => ({
                                                                    ...r,
                                                                    protocol: rule === r ?
                                                                        protocol :
                                                                        r.protocol,
                                                                    ports: rule === r && !displayPortsNew ?
                                                                        [] :
                                                                        r.ports
                                                                })) :
                                                                s.rules
                                                        }))
                                                        setServices(newServices);
                                                    }}
                                                >
                                                    <MenuItem value="all">all</MenuItem>
                                                    <MenuItem value="tcp">tcp</MenuItem>
                                                    <MenuItem value="udp">udp</MenuItem>
                                                    <MenuItem value="udplite">udplite</MenuItem>
                                                    <MenuItem value="icmp">icmp</MenuItem>
                                                    <MenuItem value="icmpv6">icmpv6</MenuItem>
                                                    <MenuItem value="esp">esp</MenuItem>
                                                    <MenuItem value="ah">ah</MenuItem>
                                                    <MenuItem value="sctp">sctp</MenuItem>
                                                    <MenuItem value="mh">mh</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {
                                            displayPorts &&
                                            <Grid item xs={xsPorts}>
                                                <MultiChipInputComponent
                                                    selected={rule.ports}
                                                    setSelected={ports => {
                                                        let newServices = services.map(s => ({
                                                            ...s,
                                                            rules: service === s ?
                                                                s.rules.map(r => ({
                                                                    ...r,
                                                                    ports: rule === r ?
                                                                        ports :
                                                                        r.ports
                                                                })) :
                                                                s.rules
                                                        }))
                                                        setServices(newServices);
                                                    }}
                                                    id={`${serviceIndex}${ruleIndex}-ports`}
                                                    title="Ports"
                                                    key={`${serviceIndex}${ruleIndex}-ports`}
                                                />
                                            </Grid>
                                        }
                                        {
                                            displayDelete &&
                                            <Grid item xs={xsDelete}>
                                                <Grid container justifyContent="center">
                                                    <IconButton
                                                        color="error"
                                                        aria-label="delete"
                                                        onClick={() => {
                                                            let newServices = services.map(s => ({
                                                                ...s,
                                                                rules: service === s ?
                                                                    s.rules.filter(item => item !== rule) :
                                                                    s.rules
                                                            }))
                                                            setServices(newServices);
                                                        }}
                                                    >
                                                        <Delete/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                )
                            })
                        }
                        <Box mt={1}>
                            <Button
                                onClick={() => {
                                    let rule = generateNewRule();
                                    let newServices = services.map(s => ({
                                        ...s,
                                        rules: service === s ? [...s.rules, rule]: s.rules
                                    }))
                                    setServices(newServices);
                                }}
                                variant="outlined"
                                startIcon={<Add/>}
                            >
                                Add Rule
                            </Button>
                        </Box>
                        <Box mt={1}>
                            <MultiChipInputComponent
                                selected={service.allowed_tags}
                                setSelected={allowed_tags => {
                                    let newServices = services.map(s => ({
                                        ...s,
                                        allowed_tags: service === s ? allowed_tags: s.allowed_tags
                                    }))
                                    setServices(newServices);
                                }}
                                id={`${serviceIndex}-allowedTags`}
                                title="Allowed tags"
                                key={`${serviceIndex}-allowedTags`}
                            />
                        </Box>
                        <Box mt={1}>
                            <Grid container justifyContent="flex-end">
                                <Button
                                    onClick={() => {
                                        let newServices = services.filter(item => item !== service);
                                        setServices(newServices);
                                    }}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete/>}
                                >
                                    Remove Service
                                </Button>
                            </Grid>
                        </Box>
                        <Box my={2}>
                            <Divider variant="middle"/>
                        </Box>
                    </Box>
                )
            }
            <Box mt={1}>
                <Button
                    onClick={() => {
                        let service = generateNewService();
                        let newServices = [...services, service]
                        setServices(newServices);
                    }}
                    variant="outlined"
                    startIcon={<Add/>}
                >
                    Add Service
                </Button>
            </Box>
        </React.Fragment>

    )
}

export default SelectServicesComponent;
