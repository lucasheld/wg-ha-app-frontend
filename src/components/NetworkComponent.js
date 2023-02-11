import React, {useCallback} from "react";
import ReactFlow, {
    addEdge,
    Background,
    BaseEdge,
    Controls,
    EdgeLabelRenderer,
    EdgeTypes,
    getBezierPath,
    MarkerType,
    useEdgesState,
    useNodesState
} from "reactflow";
import ELK from "elkjs";
import Address from "ipaddr.js";

import "reactflow/dist/style.css";
import {useStoreClients, useStoreCustomRules} from "../store";

const initialNodes = [];
const initialEdges = [];

const elkLayout = (nodes, edges) => {
    const nodesForElk = nodes.map((node) => {
        return {
            id: node.id,
            width: 400,
            height: 150
        };
    });
    const graph = {
        id: "root",
        layoutOptions: {
            "elk.algorithm": "layered",
            "elk.direction": "DOWN",
            "nodePlacement.strategy": "SIMPLE"
        },

        children: nodesForElk,
        edges: edges
    };
    const elk = new ELK();
    return elk.layout(graph);
};

const CustomEdge = (props) => {
    const [path, labelX, labelY] = getBezierPath(props);

    return (
        <>
            <BaseEdge path={path} labelX={labelX} labelY={labelY} {...props} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: 'white',
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: props.selected ? "bold" : "unset",
                        pointerEvents: "all",
                        zIndex: props.selected ? 1000 : "unset",
                        whiteSpace: "pre-line"
                    }}
                    className="nodrag nopan"
                >
                    {props.data.text}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

const edgeTypes: EdgeTypes = {
    custom: CustomEdge,
};

const NetworkComponent = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodesForFlow = (nodes, graph) => {
        return [
            ...graph.children.map((node) => {
                return {
                    ...nodes.find((n) => n.id === node.id),
                    position: { x: node.x, y: node.y }
                };
            })
        ];
    };
    const edgesForFlow = (graph) => {
        return graph.edges;
    };

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const customRules = useStoreCustomRules(state => state.customRules);
    const clients = useStoreClients(state => state.clients);

    const find_peers_and_services_by_allowed_tag = (peers, allowed_tag) => {
        let out = [];
        peers.forEach(peer => {
            peer.services.forEach(service => {
                service.allowed_tags.forEach(allowed_tag_1 => {
                    if (allowed_tag_1 === allowed_tag) {
                        out.push({
                            peer,
                            service
                        })
                    }
                })
            })
        })
        return out;
    }

    const allowed_ips_to_ips = (allowed_ips) => {
        let ips = []
        allowed_ips.forEach(allowed_ip => {
            let ip = allowed_ip.split("/")[0]
            ips.push(ip)
        })
        return ips
    }

    const get_ip_version = (ip_address) => {
        const addr = Address.parse(ip_address);
        return addr.kind();
    }

    const groupBy = (list, keyGetter) => {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    const removeDuplicates = arr => {
        return Array.from(new Set(arr.map(JSON.stringify))).map(JSON.parse);
    };

    const generateClientsNodesEdges = (newNodes, newEdges) => {
        clients.forEach(client => {
            newNodes.push({
                id: `client-${client.id}`,
                position: {
                    x: 0,
                    y: 0
                },
                data: {
                    label: `${client.title}`
                }
            });
        });

        // generate edges
        let rules = []
        clients.forEach(peer => {
            peer.tags.forEach(tag => {
                let allowed_peers_and_services = find_peers_and_services_by_allowed_tag(clients, tag)
                allowed_peers_and_services.forEach(allowed_peer_and_service => {
                    let allowed_peer = allowed_peer_and_service.peer;
                    let service = allowed_peer_and_service.service;
                    let peer_ips = allowed_ips_to_ips(peer.allowed_ips);
                    let allowed_peer_ips = allowed_ips_to_ips(allowed_peer.allowed_ips);
                    peer_ips.forEach(peer_ip => {
                        allowed_peer_ips.forEach(allowed_peer_ip => {
                            let peer_ip_version = get_ip_version(peer_ip);
                            let allowed_peer_ip_version = get_ip_version(allowed_peer_ip);
                            if (peer_ip_version === allowed_peer_ip_version) {
                                service.rules.forEach(service_rule => {
                                    if (service_rule.ports?.length) {
                                        service_rule.ports.forEach(port => {
                                            rules.push({
                                                "src": peer,
                                                "dst": allowed_peer,
                                                "protocol": service_rule.protocol,
                                                "port": port,
                                                "type": peer_ip_version
                                            })
                                        })
                                    } else {
                                        rules.push({
                                            "src": peer,
                                            "dst": allowed_peer,
                                            "protocol": service_rule.protocol,
                                            "type": peer_ip_version
                                        })
                                    }
                                })
                            }
                        })
                    })
                })
            })
        })

        let groupedRules = groupBy(rules, rule => `client-${rule.src.id}-client-${rule.dst.id}`);
        groupedRules = Array.from(groupedRules);

        groupedRules.forEach(groupedRule => {
            let labels = [];
            groupedRule[1].forEach(rule => {
                labels.push({
                    protocol: rule.protocol,
                    port: rule.port
                })
            })
            labels = removeDuplicates(labels);
            let label = "";
            labels.forEach((l, index) => {
                if (index !== 0) {
                    label += "\n";
                }
                label += `${l.protocol}${l.port ? ` ${l.port}` : ""}`
            })

            let rule = groupedRule[1][0];

            newEdges.push({
                id: `client-${rule.src.id}-client-${rule.dst.id}`,
                source: `client-${rule.src.id}`,
                target: `client-${rule.dst.id}`,
                markerEnd: {
                    type: MarkerType.Arrow
                },
                animated: true,
                style: {
                    strokeWidth: 2
                },
                data: {
                    text: label
                },
                type: 'custom'
            })
        })
    }

    const generateCustomRulesNodesEdges = (newNodes, newEdges) => {
        // create a list of edges containing source node, destination node and label
        let newEdgesTemp = []
        clients.forEach(client_src => {
            let client_src_ips = allowed_ips_to_ips(client_src.allowed_ips);
            clients.forEach(client_dst => {
                if (client_src !== client_dst) {
                    let client_dst_ips = allowed_ips_to_ips(client_dst.allowed_ips);

                    client_src_ips.forEach(client_src_ip => {
                        client_dst_ips.forEach(client_dst_ip => {
                            customRules.forEach(customRule => {
                                if (
                                    get_ip_version(client_src_ip) === get_ip_version(client_dst_ip) &&
                                    get_ip_version(client_src_ip) === Address.parseCIDR(customRule.src)[0].kind()
                                ) {
                                    let src_ip_match = Address.parse(client_src_ip).match(Address.parseCIDR(customRule.src));
                                    let dst_ip_match = Address.parse(client_dst_ip).match(Address.parseCIDR(customRule.dst));
                                    if (src_ip_match && dst_ip_match) {
                                        newEdgesTemp.push({
                                            src: client_src.id,
                                            dst: client_dst.id,
                                            label: customRule.title,
                                        })
                                    }
                                }
                            })
                        })
                    })
                }
            })
        })

        // add bidirectional value to edges
        newEdgesTemp = newEdgesTemp.map(edge => {
            let isBidirectional = false;
            newEdgesTemp.forEach(edge2 => {
                if (edge !== edge2) {
                    if (edge.src === edge2.dst && edge.dst === edge2.src && edge.label === edge2.label) {
                        isBidirectional = true;
                    }
                }
            })
            if (isBidirectional) {
                edge.bidirectional = true;
                return edge;
            } else {
                edge.bidirectional = false;
                return edge;
            }
        })

        // remove one bidirectional edge
        let newEdgesTempMap = {};
        newEdgesTemp.forEach(edge => {
            let key = [edge.src, edge.dst].sort().join() + edge.label;
            newEdgesTempMap[key] = edge;
        })
        newEdgesTemp = Object.values(newEdgesTempMap);

        // merge edges with same source and destination
        let newEdgesTempMap2 = {};
        newEdgesTemp.forEach(edge => {
            let key = [edge.src, edge.dst].sort().join();
            if (!newEdgesTempMap2[key]) {
                newEdgesTempMap2[key] = []
            }
            newEdgesTempMap2[key].push(edge);
        })
        newEdgesTemp = []
        Object.values(newEdgesTempMap2).forEach(edges => {
            let label = "";
            let edgeMerged = edges[0]
            edges.forEach((edge, index) => {
                if (index !== 0) {
                    label += "\n";
                }
                label += edge.label;
            })
            newEdgesTemp.push({
                ...edgeMerged,
                label: label
            })
        })

        // add edges to newEdges
        newEdgesTemp.forEach(edge => {
            let newEdge;
            if (!edge.bidirectional) {
                newEdge = {
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    animated: true
                }
            } else {
                newEdge = {
                    style: {
                        strokeDasharray: 5
                    },
                }
            }
            newEdges.push({
                ...newEdge,
                id: `client-${edge.src}-client-${edge.dst}`,
                source: `client-${edge.src}`,
                target: `client-${edge.dst}`,
                data: {
                    text: edge.label,
                },
                style: {
                    ...newEdge.style,
                    strokeWidth: 2
                },
                type: 'custom'
            })
        })
    }

    React.useEffect(() => {
        let newNodes = [];
        let newEdges = [];

        generateClientsNodesEdges(newNodes, newEdges);
        generateCustomRulesNodesEdges(newNodes, newEdges);

        elkLayout(newNodes, newEdges).then((graph) => {
            setNodes(nodesForFlow(newNodes, graph));
            setEdges(edgesForFlow(graph));
        });
    }, [clients, customRules]);

    return (
        <div
            style={{
                display: "flex",
                height: "calc(100vh - 112px)"
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                elevateEdgesOnSelect
                edgeTypes={edgeTypes}
            >
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
}

export default NetworkComponent;
