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

    it("should create data model", async function() {
        const modelId = await resource.create_model(server, {
            id: model_id,
            name: "speed and direction",
            category: "UPLINK",
            description: "",
            data_type: ["F32", "F32"]
        });
        expect(modelId.id).toEqual(model_id);
    });

    it("should create buffer model", async function() {
        const modelId = await resource.create_model(server, {
            id: model_buf_id,
            name: "buffer 4",
            category: "UPLINK",
            description: "",
            data_type: ["U8", "U8", "U8", "U8"]
        });
        expect(modelId.id).toEqual(model_buf_id);
    });

    it("should create model configurations", async function() {
        const config1 = await resource.create_model_config(server, 
            { model_id: model_id, index: 0, name: "scale_0", value: "speed", category: "SCALE" });
        const config2 = await resource.create_model_config(server, 
            { model_id: model_id, index: 0, name: "scale_1", value: "direction", category: "SCALE" });
        const config3 = await resource.create_model_config(server, 
            { model_id: model_id, index: 1, name: "unit_0", value: "meter/second", category: "UNIT" });
        const config4 = await resource.create_model_config(server, 
            { model_id: model_id, index: 1, name: "unit_1", value: "degree", category: "UNIT" });
        const config5 = await resource.create_model_config(server, 
            { model_id: model_id, index: 0, name: "upper_threshold", value: 250, category: "THRESHOLD" });
        expect(config1.id).toBeDefined();
        expect(config2.id).toBeDefined();
        expect(config3.id).toBeDefined();
        expect(config4.id).toBeDefined();
        expect(config5.id).toBeDefined();
        model_cfg_id = config5.id;
    });

    it("should create a type", async function() {
        const typeId = await resource.create_type(server, {
            id: type_id,
            name: "Speedometer Compass",
            description: ""
        });
        expect(typeId.id).toBeDefined();
    });

    it("should add data model to type", async function() {
        const typeModel = await resource.add_type_model(server, { id: type_id, model_id: model_id });
        expect(typeModel).toEqual({});
    });

    it("should add buffer model to type", async function() {
        const typeModel = await resource.add_type_model(server, { id: type_id, model_id: model_buf_id });
        expect(typeModel).toEqual({});
    });

    it("should create device 1", async function() {
        const deviceId = await resource.create_device(server, {
            id: device_id_1,
            gateway_id: gateway_id,
            type_id: type_id,
            serial_number: "TEST01",
            name: "Speedometer Compass 1",
            description: ""
        });
        expect(deviceId.id).toBeDefined();
    });

    it("should create device 2", async function() {
        const deviceId = await resource.create_device(server, {
            id: device_id_2,
            gateway_id: gateway_id,
            type_id: type_id,
            serial_number: "TEST02",
            name: "Speedometer Compass 2",
            description: ""
        });
        expect(deviceId.id).toBeDefined();
    });

    it("should create device 1 configurations", async function() {
        const config1 = await resource.create_device_config(server, 
            { device_id: device_id_1, name: "coef_0", value: -21, category: "CONVERSION" });
        const config2 = await resource.create_device_config(server, 
            { device_id: device_id_1, name: "coef_1", value: 0.1934, category: "CONVERSION" });
        expect(config1.id).toBeDefined();
        expect(config2.id).toBeDefined();
    });

    it("should create device 2 configurations", async function() {
        const config1 = await resource.create_device_config(server, { device_id: device_id_2, name: "coef_0", value: 44, category: "CONVERSION" });
        const config2 = await resource.create_device_config(server, { device_id: device_id_2, name: "coef_1", value: 0.2192, category: "CONVERSION" });
        const config3 = await resource.create_device_config(server, { device_id: device_id_2, name: "period", value: 120, category: "NETWORK" });
        expect(config1.id).toBeDefined();
        expect(config2.id).toBeDefined();
        expect(config3.id).toBeDefined();
        device_cfg_id = config3.id;
    });

    it("should create a model group", async function() {
        const groupId = await resource.create_group_model(server, { id: group_model_id, name: "data", category: "APPLICATION", description: "" });
        expect(groupId.id).toBeDefined();
    });

    it("should add data model to model group", async function() {
        const groupMember = await resource.add_group_model_member(server, { id: group_model_id, model_id: model_id });
        expect(groupMember).toEqual({});
    });

    it("should create a device group", async function() {
        const groupId = await resource.create_group_device(server, { id: group_device_id, name: "sensor", category: "APPLICATION", description: "" });
        expect(groupId.id).toBeDefined();
    });

    it("should add device 1 and 2 to device group", async function() {
        const groupMember1 = await resource.add_group_device_member(server, { id: group_device_id, device_id: device_id_1 });
        const groupMember2 = await resource.add_group_device_member(server, { id: group_device_id, device_id: device_id_2 });
        expect(groupMember1).toEqual({});
        expect(groupMember2).toEqual({});
    });

    it("should read data model", async function() {
        model = await resource.read_model(server, { id: model_id });
        expect(model.id).toEqual(model_id);
        expect(model.name).toEqual("speed and direction");
        expect(model.category).toEqual("UPLINK");
        expect(model.data_type).toEqual(["F32", "F32"]);
    });

    it("should read multiple models", async function() {
        const models = await resource.list_model_by_name(server, { name: "speed" });
        const model_ids = [];
        for (const model of models) {
            model_ids.push(model.id);
        }
        expect(model_ids).toContain(model_id);
    });

    it("should read multiple model configurations", async function() {
        model_configs = await resource.list_model_config_by_model(server, { id: model_id });
        for (const configs of model.configs) {
            for (const config of configs) {
                expect(model_configs).toContain(config);
            }
        }
    });

    it("should read device 1", async function() {
        device_1 = await resource.read_device(server, { id: device_id_1 });
        expect(device_1.id).toEqual(device_id_1);
        expect(device_1.serial_number).toEqual("TEST01");
        expect(device_1.name).toEqual("Speedometer Compass 1");
    });

    it("should read multiple devices", async function() {
        const devices = await resource.list_device_by_gateway(server, { id: gateway_id });
        const device_ids = [];
        for (const device of devices) {
            device_ids.push(device.id);
        }
        expect(device_ids).toContain(device_id_1);
    });

    it("should read device configurations", async function() {
        device_configs = await resource.list_device_config_by_device(server, { id: device_id_1 });
        for (const config of device_1.configs) {
            expect(device_configs).toContain(config);
        }
    });

    it("should read types", async function() {
        const types = await resource.list_type_by_name(server, { name: "Speedometer" });
        let type;
        for (const ty of types) {
            if (ty.id == type_id) {
                type = ty;
            }
        }
        expect(type).toEqual(device_1.device_type);
    });

    it("should read model groups", async function() {
        const groups = await resource.list_group_model_by_category(server, { category: "APPLICATION" });
        let group_model;
        for (const group of groups) {
            if (group.id == group_model_id) {
                group_model = group;
            }
        }
        expect(group_model.models).toContain(model_id);
        expect(group_model.name).toEqual("data");
        expect(group_model.category).toEqual("APPLICATION");
    });

    it("should read device groups", async function() {
        const groups = await resource.list_group_device_by_name(server, { category: "sensor" });
        let group_device;
        for (const group of groups) {
            if (group.id == group_device_id) {
                group_device = group;
            }
        }
        expect(group_device.devices).toContain(device_id_1);
        expect(group_device.devices).toContain(device_id_2);
        expect(group_device.name).toEqual("sensor");
        expect(group_device.category).toEqual("APPLICATION");
    });

    it("should update buffer model", async function() {
        await resource.update_model(server, {
            id: model_buf_id,
            name: "buffer 2 integer",
            description: "Model for store 2 i32 temporary data",
            data_type: ["I32", "I32"]
        });
        const model = await resource.read_model(server, { id: model_buf_id });
        expect(model.name).toEqual("buffer 2 integer");
    });

    it("should update data model configuration", async function() {
        await resource.update_model_config(server, { id: model_cfg_id, value: 238 });
        const modelConfig = await resource.read_model_config(server, { id: model_cfg_id });
        expect(modelConfig.value).toEqual(238);
    });

    it("should update a type", async function() {
        await resource.update_type(server, { id: type_id, description: "Speedometer and compass sensor" });
        const type = await resource.read_type(server, { id: type_id });
        expect(type.description).toEqual("Speedometer and compass sensor");
    });

    it("should update device 2", async function() {
        await resource.update_device(server, { id: device_id_2, description: "E-bike speedometer and compass sensor 2" });
        const device = await resource.read_device(server, { id: device_id_2 });
        expect(device.description).toEqual("E-bike speedometer and compass sensor 2");
    });

    it("should update device 2 configuration", async function() {
        await resource.update_device_config(server, { id: device_cfg_id, value: 60 });
        const deviceConfig = await resource.read_device_config(server, { id: device_cfg_id });
        expect(deviceConfig.value).toEqual(60);
    });

    it("should update a model group", async function() {
        await resource.update_group_model(server, { id: group_model_id, description: "Data models" });
        const groupModel = await resource.read_group_model(server, { id: group_model_id });
        expect(groupModel.description).toEqual("Data models");
    });

    it("should update a device group", async function() {
        await resource.update_group_device(server, { id: group_device_id, description: "Sensor devices" });
        const groupDevice = await resource.read_group_device(server, { id: group_device_id });
        expect(groupDevice.description).toEqual("Sensor devices");
    });

    const timestamp = new Date(2023, 4, 7, 7, 8, 48);
    const raw_1 = [1231, 890];
    const raw_2 = [1452, -341];
    let buffers = [];

    it("should create buffers", async function() {
        const bufferId1 = await resource.create_buffer(server, {
            device_id: device_id_1,
            model_id: model_buf_id,
            timestamp: timestamp,
            data: raw_1,
            status: "ANALYSIS_1"
        });
        expect(bufferId1.id).toBeDefined();
        const bufferId2 = await resource.create_buffer(server, {
            device_id: device_id_2,
            model_id: model_buf_id,
            timestamp: timestamp,
            data: raw_2,
            status: "ANALYSIS_1"
        });
        expect(bufferId2.id).toBeDefined();
    });

    it("should read buffers", async function() {
        buffers = await resource.list_buffer_first(server, { number: 100 });
        for (const buffer of buffers) {
            expect([raw_1, raw_2]).toContain(buffer.data);
        }
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

    it("should create a data", async function() {
        const coef_0 = get_conf(device_configs, "coef_0");
        const coef_1 = get_conf(device_configs, "coef_1");
        speed = (raw_1[0] - coef_0) * coef_1;
        direction = (raw_1[1] - coef_0) * coef_1;
        const dataCreate = await resource.create_data(server, {
            device_id: device_id_1,
            model_id: model_id,
            timestamp: timestamp,
            data: [speed, direction]
        });
        expect(dataCreate).toEqual({});
    });

    it("should read data", async function() {
        let dataVec = await resource.list_data_by_number_before(server, {
            device_id: device_id_1,
            model_id: model_id,
            timestamp: timestamp,
            number: 100
        });
        let data;
        for (const dataSchema of dataVec) {
            if (dataSchema.timestamp.valueOf() == timestamp.valueOf()) {
                data = dataSchema;
            }
        }
        expect(data.data[0]).toBeCloseTo(speed, 0.1);
        expect(data.data[1]).toBeCloseTo(direction, 0.1);
    });

    it("should delete a data", async function() {
        await resource.delete_data(server, { device_id: device_id_1, model_id: model_id, timestamp: timestamp });
        const data = await resource.read_data(server, { device_id: device_id_1, model_id: model_id, timestamp: timestamp })
            .catch(() => null);
        expect(data).toBeNull();
    });

    it("should update a buffer", async function() {
        await resource.update_buffer(server, { id: buffers[0].id, status: "DELETE" });
        const buffer = await resource.read_buffer(server, { id: buffers[0].id });
        expect(buffer.data).toEqual(buffers[0].data);
        expect(buffer.status).toEqual("DELETE");
    });

    it("should delete buffers", async function() {
        await resource.delete_buffer(server, { id: buffers[0].id });
        await resource.delete_buffer(server, { id: buffers[1].id });
        const buffer1 = await resource.read_buffer(server, { id: buffers[0].id })
            .catch(() => null);
        const buffer2 = await resource.read_buffer(server, { id: buffers[1].id })
            .catch(() => null);
        expect(buffer1).toBeNull();
        expect(buffer2).toBeNull();
    });

    let slice_id;

    it("should create a data slice", async function() {
        const sliceId = await resource.create_slice(server, {
            device_id: device_id_1,
            model_id: model_id,
            timestamp_begin: timestamp,
            timestamp_end: timestamp,
            name: "Speed and compass slice",
            description: ""
        });
        slice_id = sliceId.id;
        expect(sliceId.id).toBeDefined();
    });

    it("should read data slices", async function() {
        const slices = await resource.list_slice_by_name(server, { name: "slice" });
        for (const slice of slices) {
            expect(slice.timestamp_begin).toEqual(timestamp);
            expect(slice.name).toEqual("Speed and compass slice");
        }
    });

    it("should update a data slice", async function() {
        await resource.update_slice(server, { id: slice_id, description: "Speed and compass sensor 1 at '2023-05-07 07:08:48'" });
        const slice = await resource.read_slice(server, { id: slice_id });
        expect(slice.description).toEqual("Speed and compass sensor 1 at '2023-05-07 07:08:48'");
    });

    it("should delete a data slice", async function() {
        await resource.delete_slice(server, { id: slice_id });
        const slice = await resource.read_slice(server, { id: slice_id })
            .catch(() => null);
        expect(slice).toBeNull();
    });

    it("should create a system log", async function() {
        const createLog = await resource.create_log(server, {
            device_id: device_id_1,
            timestamp: timestamp,
            status: "UNKNOWN_ERROR",
            value: "testing success"
        });
        expect(createLog).toEqual({});
    });

    it("should read system logs", async function() {
        const logs = await resource.list_log_by_range_time(server, { begin: timestamp, end: new Date() });
        let log;
        for (const logSchema of logs) {
            if (logSchema.timestamp.valueOf() == timestamp.valueOf() && logSchema.device_id == device_id_1) {
                log = logSchema;
            }
        }
        expect(log.value).toEqual("testing success");
    });

    it("should update a system log", async function() {
        await resource.update_log(server, { device_id: device_id_1, timestamp: timestamp, status: "SUCCESS" });
        const log = await resource.read_log(server, { device_id: device_id_1, timestamp: timestamp });
        expect(log.status).toEqual("SUCCESS");
    });

    it("should delete a system log", async function() {
        await resource.delete_log(server, { device_id: device_id_1, timestamp: timestamp });
        const log = await resource.read_log(server, { device_id: device_id_1, timestamp: timestamp })
            .catch(() => null);
        expect(log).toBeNull();
    });

    it("should delete model configs", async function() {
        await resource.delete_model_config(server, { id: model_configs[0].id });
        const modelConfig = await resource.read_model_config(server, { id: model_configs[0].id })
            .catch(() => null);
        expect(modelConfig).toBeNull();
    });

    it("should delete a model", async function() {
        await resource.delete_model(server, { id: model_id });
        const model = await resource.read_model(server, { id: model_id })
            .catch(() => null);
        expect(model).toBeNull();
        const modelConfigs = await resource.list_model_config_by_model(server, { id: model_id });
        expect(modelConfigs).toEqual([]);
    });

    it("should delete device configs", async function() {
        await resource.delete_device_config(server, { id: device_configs[0].id });
        const deviceConfig = await resource.read_device_config(server, { id: device_configs[0].id })
            .catch(() => null);
        expect(deviceConfig).toBeNull();
    });

    it("should delete a device", async function() {
        await resource.delete_device(server, { id: device_id_1 });
        const device = await resource.read_device(server, { id: device_id_1 })
            .catch(() => null);
        expect(device).toBeNull();
        const deviceConfigs = await resource.list_device_config_by_device(server, { id: device_id_1 });
        expect(deviceConfigs).toEqual([]);
    });

    it("should failed to delete a type", async function() {
        const deleteType = await resource.delete_type(server, { id: type_id })
            .catch(() => null);
        expect(deleteType).toBeNull();
    });

    it("should delete devices associated with type", async function() {
        const devices = await resource.list_device_by_type(server, { id: type_id });
        for (const device of devices) {
            const deleteDevice = await resource.delete_device(server, { id: device.id });
            expect(deleteDevice).toEqual({});
        }
    });

    it("should delete a type", async function() {
        await resource.delete_type(server, { id: type_id });
        const type = await resource.read_type(server, { id: type_id })
            .catch(() => null);
        expect(type).toBeNull();
    });

    it("should delete a model group", async function() {
        await resource.delete_group_model(server, { id: group_model_id });
        const group = await resource.read_group_model(server, { id: group_model_id })
            .catch(() => null);
        expect(group).toBeNull();
    });

    it("should delete a device group", async function() {
        await resource.delete_group_device(server, { id: group_device_id });
        const group = await resource.read_group_device(server, { id: group_device_id })
            .catch(() => null);
        expect(group).toBeNull();
    });

});
