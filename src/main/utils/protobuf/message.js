/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from 'protobufjs/light'

const $root = ($protobuf.roots['default'] || ($protobuf.roots['default'] = new $protobuf.Root()))
    .setOptions({
        syntax: 'proto3',
        go_package: 'pkg/protocol/pb'
    })
    .addJSON({
        pb: {
            nested: {
                CMD: {
                    values: {
                        Login: 0,
                        Uplink: 1,
                        Downlink: 2,
                        Heartbeat: 3,
                        Reconn: 4,
                        Ack: 5
                    }
                },
                Data: {
                    fields: {
                        cmd: {
                            type: 'CMD',
                            id: 1
                        },
                        payload: {
                            type: 'bytes',
                            id: 2
                        }
                    }
                },
                LoginMsg: {
                    fields: {
                        deviceId: {
                            type: 'int64',
                            id: 1
                        },
                        userId: {
                            type: 'int64',
                            id: 2
                        },
                        loginBody: {
                            type: 'bytes',
                            id: 3
                        }
                    }
                },
                UplinkMsg: {
                    fields: {
                        deviceId: {
                            type: 'int64',
                            id: 1
                        },
                        userId: {
                            type: 'int64',
                            id: 2
                        },
                        clientId: {
                            type: 'int64',
                            id: 3
                        },
                        sessionId: {
                            type: 'uint64',
                            id: 4
                        },
                        uplinkBody: {
                            type: 'bytes',
                            id: 5
                        }
                    }
                },
                DownlinkMsg: {
                    fields: {
                        seq: {
                            type: 'int64',
                            id: 1
                        },
                        senderId: {
                            type: 'int64',
                            id: 2
                        },
                        sessionId: {
                            type: 'uint64',
                            id: 3
                        },
                        downlinkBody: {
                            type: 'bytes',
                            id: 4
                        }
                    }
                },
                HeartbeatMsg: {
                    fields: {
                        heartbeatBody: {
                            type: 'bytes',
                            id: 2
                        }
                    }
                },
                ReconnMsg: {
                    fields: {
                        connId: {
                            type: 'int64',
                            id: 1
                        },
                        reconnBody: {
                            type: 'bytes',
                            id: 2
                        }
                    }
                },
                AckMsg: {
                    fields: {
                        code: {
                            type: 'int64',
                            id: 1
                        },
                        message: {
                            type: 'string',
                            id: 2
                        },
                        toType: {
                            type: 'CMD',
                            id: 3
                        },
                        connId: {
                            type: 'int64',
                            id: 4
                        },
                        userId: {
                            type: 'int64',
                            id: 5
                        },
                        deviceId: {
                            type: 'int64',
                            id: 6
                        },
                        clientId: {
                            type: 'int64',
                            id: 7
                        },
                        messageId: {
                            type: 'int64',
                            id: 8
                        },
                        sessionId: {
                            type: 'uint64',
                            id: 9
                        }
                    }
                }
            }
        }
    })

export { $root as default }
