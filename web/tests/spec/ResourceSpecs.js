import { resource, utility } from '../../build/bundle.js';

let server = { address: "http://localhost:9002" };

describe("RMCS Resource test", function() {

    const model_id = utility.uuid_v4_hex();
    const model_buf_id = utility.uuid_v4_hex();
    let model_cfg_id;
    const type_id = utility.uuid_v4_hex();
    const gateway_id = utility.uuid_v4_hex();
    const device_id_1 = utility.uuid_v4_hex();
    const device_id_2 = utility.uuid_v4_hex();
    let device_cfg_id;
    const group_model_id = utility.uuid_v4_hex();
    const group_device_id = utility.uuid_v4_hex();
    let model;
    let device_1;
    let model_configs = [];
    let device_configs = [];

    it("should create data model", function(done) {
        resource.create_model(server, {
            id: model_id,
            name: "speed and direction",
            category: "UPLINK",
            description: "",
            data_type: ["F32", "F32"]
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create buffer model", function(done) {
        resource.create_model(server, {
            id: model_buf_id,
            name: "buffer 4",
            category: "UPLINK",
            description: "",
            data_type: ["U8", "U8", "U8", "U8"]
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create model configurations", function(done) {
        resource.create_model_config(server, { model_id: model_id, index: 0, name: "scale_0", value: "speed", category: "SCALE" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.create_model_config(server, { model_id: model_id, index: 0, name: "scale_1", value: "direction", category: "SCALE" }, (e, r) => {
                expect(e).toBeNull(e);
                resource.create_model_config(server, { model_id: model_id, index: 1, name: "unit_0", value: "meter/second", category: "UNIT" }, (e, r) => {
                    expect(e).toBeNull(e);
                    resource.create_model_config(server, { model_id: model_id, index: 1, name: "unit_1", value: "degree", category: "UNIT" }, (e, r) => {
                        expect(e).toBeNull(e);
                        resource.create_model_config(server, { model_id: model_id, index: 0, name: "upper_threshold", value: 250, category: "THRESHOLD" }, (e, r) => {
                            expect(e).toBeNull(e);
                            model_cfg_id = r.id;
                            done();
                        });
                    });
                });
            });
        });
    });

    it("should create a type", function(done) {
        resource.create_type(server, {
            id: type_id,
            name: "Speedometer Compass",
            description: ""
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should add data model to type", function(done) {
        resource.add_type_model(server, { id: type_id, model_id: model_id }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should add buffer model to type", function(done) {
        resource.add_type_model(server, { id: type_id, model_id: model_buf_id }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create device 1", function(done) {
        resource.create_device(server, {
            id: device_id_1,
            gateway_id: gateway_id,
            type_id: type_id,
            serial_number: "TEST01",
            name: "Speedometer Compass 1",
            description: ""
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create device 2", function(done) {
        resource.create_device(server, {
            id: device_id_2,
            gateway_id: gateway_id,
            type_id: type_id,
            serial_number: "TEST02",
            name: "Speedometer Compass 2",
            description: ""
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create device 1 configurations", function(done) {
        resource.create_device_config(server, { device_id: device_id_1, name: "coef_0", value: -21, category: "CONVERSION" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.create_device_config(server, { device_id: device_id_1, name: "coef_1", value: 0.1934, category: "CONVERSION" }, (e, r) => {
                expect(e).toBeNull(e);
                done();
            });
        });
    });

    it("should create device 2 configurations", function(done) {
        resource.create_device_config(server, { device_id: device_id_2, name: "coef_0", value: 44, category: "CONVERSION" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.create_device_config(server, { device_id: device_id_2, name: "coef_1", value: 0.2192, category: "CONVERSION" }, (e, r) => {
                expect(e).toBeNull(e);
                resource.create_device_config(server, { device_id: device_id_2, name: "period", value: 120, category: "NETWORK" }, (e, r) => {
                    expect(e).toBeNull(e);
                    device_cfg_id = r.id;
                    done();
                });
            });
        });
    });

    it("should create a model group", function(done) {
        resource.create_group_model(server, { id: group_model_id, name: "data", category: "APPLICATION", description: "" }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should add data model to model group", function(done) {
        resource.add_group_model_member(server, { id: group_model_id, model_id: model_id }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create a device group", function(done) {
        resource.create_group_device(server, { id: group_device_id, name: "sensor", category: "APPLICATION", description: "" }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should add device 1 and 2 to device group", function(done) {
        resource.add_group_device_member(server, { id: group_device_id, device_id: device_id_1 }, (e, r) => {
            expect(e).toBeNull(e);
            resource.add_group_device_member(server, { id: group_device_id, device_id: device_id_2 }, (e, r) => {
                expect(e).toBeNull(e);
                done();
            });
        });
    });

    it("should read data model", function(done) {
        resource.read_model(server, { id: model_id }, (e, r) => {
            expect(e).toBeNull(e);
            model = r;
            expect(r.id).toEqual(model_id);
            expect(r.name).toEqual("speed and direction");
            expect(r.category).toEqual("UPLINK");
            expect(r.data_type).toEqual(["F32", "F32"]);
            done();
        });
    });

    it("should read multiple models", function(done) {
        resource.list_model_by_name(server, { name: "speed" }, (e, r) => {
            expect(e).toBeNull(e);
            const model_ids = [];
            for (const model of r) {
                model_ids.push(model.id);
            }
            expect(model_ids).toContain(model_id);
            done();
        });
    });

    it("should read multiple model configurations", function(done) {
        resource.list_model_config_by_model(server, { id: model_id }, (e, r) => {
            expect(e).toBeNull(e);
            model_configs = r;
            for (const configs of model.configs) {
                for (const config of configs) {
                    expect(r).toContain(config);
                }
            }
            done();
        });
    });

    it("should read device 1", function(done) {
        resource.read_device(server, { id: device_id_1 }, (e, r) => {
            expect(e).toBeNull(e);
            device_1 = r;
            expect(r.id).toEqual(device_id_1);
            expect(r.serial_number).toEqual("TEST01");
            expect(r.name).toEqual("Speedometer Compass 1");
            done();
        });
    });

    it("should read multiple devices", function(done) {
        resource.list_device_by_gateway(server, { id: gateway_id }, (e, r) => {
            expect(e).toBeNull(e);
            const device_ids = [];
            for (const device of r) {
                device_ids.push(device.id);
            }
            expect(device_ids).toContain(device_id_1);
            done();
        });
    });

    it("should read device configurations", function(done) {
        resource.list_device_config_by_device(server, { id: device_id_1 }, (e, r) => {
            expect(e).toBeNull(e);
            device_configs = r;
            for (const config of device_1.configs) {
                expect(r).toContain(config);
            }
            done();
        });
    });

    it("should read types", function(done) {
        resource.list_type_by_name(server, { name: "Speedometer" }, (e, r) => {
            expect(e).toBeNull(e);
            let type;
            for (const ty of r) {
                if (ty.id == type_id) {
                    type = ty;
                }
            }
            expect(type).toEqual(device_1.device_type);
            done();
        });
    });

    it("should read model groups", function(done) {
        resource.list_group_model_by_category(server, { category: "APPLICATION" }, (e, r) => {
            expect(e).toBeNull(e);
            let group_model;
            for (const group of r) {
                if (group.id == group_model_id) {
                    group_model = group;
                }
            }
            expect(group_model.models).toContain(model_id);
            expect(group_model.name).toEqual("data");
            expect(group_model.category).toEqual("APPLICATION");
            done();
        });
    });

    it("should read device groups", function(done) {
        resource.list_group_device_by_name(server, { category: "sensor" }, (e, r) => {
            expect(e).toBeNull(e);
            let group_device;
            for (const group of r) {
                if (group.id == group_device_id) {
                    group_device = group;
                }
            }
            expect(group_device.devices).toContain(device_id_1);
            expect(group_device.devices).toContain(device_id_2);
            expect(group_device.name).toEqual("sensor");
            expect(group_device.category).toEqual("APPLICATION");
            done();
        });
    });

    it("should update buffer model", function(done) {
        resource.update_model(server, {
            id: model_buf_id,
            name: "buffer 2 integer",
            description: "Model for store 2 i32 temporary data",
            data_type: ["I32", "I32"]
        }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_model(server, { id: model_buf_id }, (e, r) => {
                expect(r.name).toEqual("buffer 2 integer");
                done();
            });
        });
    });

    it("should update data model configuration", function(done) {
        resource.update_model_config(server, { id: model_cfg_id, value: 238 }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_model_config(server, { id: model_cfg_id }, (e, r) => {
                expect(r.value).toEqual(238);
                done();
            });
        });
    });

    it("should update a type", function(done) {
        resource.update_type(server, { id: type_id, description: "Speedometer and compass sensor" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_type(server, { id: type_id }, (e, r) => {
                expect(r.description).toEqual("Speedometer and compass sensor");
                done();
            });
        });
    });

    it("should update device 2", function(done) {
        resource.update_device(server, { id: device_id_2, description: "E-bike speedometer and compass sensor 2" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_device(server, { id: device_id_2 }, (e, r) => {
                expect(r.description).toEqual("E-bike speedometer and compass sensor 2");
                done();
            });
        });
    });

    it("should update device 2 configuration", function(done) {
        resource.update_device_config(server, { id: device_cfg_id, value: 60 }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_device_config(server, { id: device_cfg_id }, (e, r) => {
                expect(r.value).toEqual(60);
                done();
            });
        });
    });

    it("should update a model group", function(done) {
        resource.update_group_model(server, { id: group_model_id, description: "Data models" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_group_model(server, { id: group_model_id }, (e, r) => {
                expect(r.description).toEqual("Data models");
                done();
            });
        });
    });

    it("should update a device group", function(done) {
        resource.update_group_device(server, { id: group_device_id, description: "Sensor devices" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_group_device(server, { id: group_device_id }, (e, r) => {
                expect(r.description).toEqual("Sensor devices");
                done();
            });
        });
    });

    const timestamp = new Date(2023, 4, 7, 7, 8, 48);
    const raw_1 = [1231, 890];
    const raw_2 = [1452, -341];
    let buffers = [];

    it("should create buffers", function(done) {
        resource.create_buffer(server, {
            device_id: device_id_1,
            model_id: model_buf_id,
            timestamp: timestamp,
            data: raw_1,
            status: "ANALYSIS_1"
        }, (e, r) => {
            expect(e).toBeNull(e);
            resource.create_buffer(server, {
                device_id: device_id_2,
                model_id: model_buf_id,
                timestamp: timestamp,
                data: raw_2,
                status: "ANALYSIS_1"
            }, (e, r) => {
                expect(e).toBeNull(e);
                done();
            });
        });
    });

    it("should read buffers", function(done) {
        resource.list_buffer_first(server, { number: 100 }, (e, r) => {
            expect(e).toBeNull(e);
            buffers = r;
            for (const buffer of r) {
                expect([raw_1, raw_2]).toContain(buffer.data);
            }
            done();
        });
    });

    const get_conf = (configs, name) => {
        for (const config of configs) {
            if (config.name == name) {
                return config.value;
            }
        }
    };

    let speed = 0;
    let direction = 0;

    it("should create a data", function(done) {
        const coef_0 = get_conf(device_configs, "coef_0");
        const coef_1 = get_conf(device_configs, "coef_1");
        speed = (raw_1[0] - coef_0) * coef_1;
        direction = (raw_1[1] - coef_0) * coef_1;
        resource.create_data(server, {
            device_id: device_id_1,
            model_id: model_id,
            timestamp: timestamp,
            data: [speed, direction]
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should read data", function(done) {
        resource.list_data_by_number_before(server, {
            device_id: device_id_1,
            model_id: model_id,
            timestamp: timestamp,
            number: 100
        }, (e, r) => {
            expect(e).toBeNull(e);
            let data;
            for (const dataSchema of r) {
                if (dataSchema.timestamp.valueOf() == timestamp.valueOf()) {
                    data = dataSchema;
                }
            }
            expect(data.data[0]).toBeCloseTo(speed, 0.1);
            expect(data.data[1]).toBeCloseTo(direction, 0.1);
            done();
        });
    });

    it("should delete a data", function(done) {
        resource.delete_data(server, { device_id: device_id_1, model_id: model_id, timestamp: timestamp }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_data(server, { device_id: device_id_1, model_id: model_id, timestamp: timestamp }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should update a buffer", function(done) {
        resource.update_buffer(server, { id: buffers[0].id, status: "DELETE" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_buffer(server, { id: buffers[0].id }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.data).toEqual(buffers[0].data);
                expect(r.status).toEqual("DELETE");
                done();
            });
        });
    });

    it("should delete buffers", function(done) {
        resource.delete_buffer(server, { id: buffers[0].id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.delete_buffer(server, { id: buffers[1].id }, (e, r) => {
                expect(e).toBeNull(e);
                resource.read_buffer(server, { id: buffers[0].id }, (e, r) => {
                    expect(e).not.toBeNull(e);
                    resource.read_buffer(server, { id: buffers[1].id }, (e, r) => {
                        expect(e).not.toBeNull(e);
                        done();
                    });
                });
            });
        });
    });

    let slice_id;

    it("should create a data slice", function(done) {
        resource.create_slice(server, {
            device_id: device_id_1,
            model_id: model_id,
            timestamp_begin: timestamp,
            timestamp_end: timestamp,
            name: "Speed and compass slice",
            description: ""
        }, (e, r) => {
            expect(e).toBeNull(e);
            slice_id = r.id;
            done();
        });
    });

    it("should read data slices", function(done) {
        resource.list_slice_by_name(server, { name: "slice" }, (e, r) => {
            expect(e).toBeNull(e);
            for (const slice of r) {
                expect(slice.timestamp_begin).toEqual(timestamp);
                expect(slice.name).toEqual("Speed and compass slice");
            }
            done();
        });
    });

    it("should update a data slice", function(done) {
        resource.update_slice(server, { id: slice_id, description: "Speed and compass sensor 1 at '2023-05-07 07:08:48'" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_slice(server, { id: slice_id }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.description).toEqual("Speed and compass sensor 1 at '2023-05-07 07:08:48'");
                done();
            });
        });
    });

    it("should delete a data slice", function(done) {
        resource.delete_slice(server, { id: slice_id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_slice(server, { id: slice_id }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should create a system log", function(done) {
        resource.create_log(server, {
            device_id: device_id_1,
            timestamp: timestamp,
            status: "UNKNOWN_ERROR",
            value: "testing success"
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should read system logs", function(done) {
        resource.list_log_by_range_time(server, { begin: timestamp, end: new Date() }, (e, r) => {
            expect(e).toBeNull(e);
            let log;
            for (const logSchema of r) {
                if (logSchema.timestamp.valueOf() == timestamp.valueOf() && logSchema.device_id == device_id_1) {
                    log = logSchema;
                }
            }
            expect(log.value).toEqual("testing success");
            done();
        });
    });

    it("should update a system log", function(done) {
        resource.update_log(server, { device_id: device_id_1, timestamp: timestamp, status: "SUCCESS" }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_log(server, { device_id: device_id_1, timestamp: timestamp }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.status).toEqual("SUCCESS");
                done();
            });
        });
    });

    it("should delete a system log", function(done) {
        resource.delete_log(server, { device_id: device_id_1, timestamp: timestamp }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_log(server, { device_id: device_id_1, timestamp: timestamp }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should delete model configs", function(done) {
        resource.delete_model_config(server, { id: model_configs[0].id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_model_config(server, { id: model_configs[0].id }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should delete a model", function(done) {
        resource.delete_model(server, { id: model_id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_model(server, { id: model_id }, (e, r) => {
                expect(e).not.toBeNull(e);
                resource.list_model_config_by_model(server, { id: model_id }, (e, r) => {
                    expect(r).toEqual([]);
                    done();
                });
            });
        });
    });

    it("should delete device configs", function(done) {
        resource.delete_device_config(server, { id: device_configs[0].id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_model_config(server, { id: device_configs[0].id }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should delete a device", function(done) {
        resource.delete_device(server, { id: device_id_1 }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_device(server, { id: device_id_1 }, (e, r) => {
                expect(e).not.toBeNull(e);
                resource.list_device_config_by_device(server, { id: device_id_1 }, (e, r) => {
                    expect(r).toEqual([]);
                    done();
                });
            });
        });
    });

    it("should failed to delete a type", function(done) {
        resource.delete_type(server, { id: type_id }, (e, r) => {
            expect(e).not.toBeNull(e);
            done();
        });
    });

    it("should delete devices associated with type", function(done) {
        resource.list_device_by_type(server, { id: type_id }, (e, r) => {
            expect(e).toBeNull(e);
            const length = r.length;
            for (let i=1; i<=length; i++) {
                resource.delete_device(server, { id: r[0].id }, (e, r) => {
                    expect(e).toBeNull(e);
                    if (i == length) {
                        done();
                    }
                });
            }
        });
    });

    it("should delete a type", function(done) {
        resource.delete_type(server, { id: type_id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_type(server, { id: type_id }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should delete a model group", function(done) {
        resource.delete_group_model(server, { id: group_model_id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_group_model(server, { id: group_model_id }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should delete a device group", function(done) {
        resource.delete_group_device(server, { id: group_device_id }, (e, r) => {
            expect(e).toBeNull(e);
            resource.read_group_device(server, { id: group_device_id }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

});
