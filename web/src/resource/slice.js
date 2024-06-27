import { pb_slice } from 'rmcs-resource-api';
import {
    metadata,
    base64_to_uuid_hex,
    uuid_hex_to_base64
} from "../utility.js";


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} ServerConfig
 * @property {string} address
 * @property {?string} token
 */

/**
 * @typedef {Object} SliceId
 * @property {number} id
 */

/**
 * @param {*} r 
 * @returns {SliceId}
 */
function get_slice_id(r) {
    return {
        id: r.id    
    };
}

/**
 * @typedef {Object} SliceName
 * @property {string} name
 */

/**
 * @typedef {Object} SliceDevice
 * @property {Uuid} device_id
 */

/**
 * @typedef {Object} SliceModel
 * @property {Uuid} model_id
 */

/**
 * @typedef {Object} SliceDeviceModel
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 */

/**
 * @typedef {Object} SliceSchema
 * @property {number} id
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp_begin
 * @property {Date} timestamp_end
 * @property {string} name
 * @property {string} description
 */

/**
 * @param {*} r 
 * @returns {SliceSchema}
 */
function get_slice_schema(r) {
    return {
        id: r.id,
        device_id: base64_to_uuid_hex(r.deviceId),
        model_id: base64_to_uuid_hex(r.modelId),
        timestamp_begin: new Date(r.timestampBegin / 1000),
        timestamp_end: new Date(r.timestampEnd / 1000),
        name: r.name,
        description: r.description
    };
}

/**
 * @param {*} r 
 * @returns {SliceSchema[]}
 */
function get_slice_schema_vec(r) {
    return r.map((v) => {return get_slice_schema(v)});
}

/**
 * @typedef {Object} SliceUpdate
 * @property {number} id
 * @property {?Date} timestamp_begin
 * @property {?Date} timestamp_end
 * @property {?string} name
 * @property {?string} description
 */


/**
 * Read a data slice by id
 * @param {ServerConfig} server Server configuration
 * @param {SliceId} request data slice id: id
 * @param {function(?grpc.web.RpcError, ?SliceSchema)} callback The callback function(error, response)
 */
export async function read_slice(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceId = new pb_slice.SliceId();
    sliceId.setId(request.id);
    await client.readSlice(sliceId, metadata(server), (e, r) => {
        const response = r ? get_slice_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read data slices by name
 * @param {ServerConfig} server Server configuration
 * @param {SliceName} request data slice name: name
 * @param {function(?grpc.web.RpcError, ?SliceSchema[])} callback The callback function(error, response)
 */
export async function list_slice_by_name(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceName = new pb_slice.SliceName();
    sliceName.setName(request.name);
    await client.listSliceByName(sliceName, metadata(server), (e, r) => {
        const response = r ? get_slice_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read data slices by device
 * @param {ServerConfig} server Server configuration
 * @param {SliceDevice} request data slice device: device_id
 * @param {function(?grpc.web.RpcError, ?SliceSchema[])} callback The callback function(error, response)
 */
export async function list_slice_by_device(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceDevice = new pb_slice.SliceDevice();
    sliceDevice.setDeviceId(uuid_hex_to_base64(request.device_id));
    await client.listSliceByDevice(sliceDevice, metadata(server), (e, r) => {
        const response = r ? get_slice_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read data slices by model
 * @param {ServerConfig} server Server configuration
 * @param {SliceModel} request data slice model: model_id
 * @param {function(?grpc.web.RpcError, ?SliceSchema[])} callback The callback function(error, response)
 */
export async function list_slice_by_model(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceModel = new pb_slice.SliceModel();
    sliceModel.setModelId(uuid_hex_to_base64(request.model_id));
    await client.listSliceByModel(sliceModel, metadata(server), (e, r) => {
        const response = r ? get_slice_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read data slices by device and model
 * @param {ServerConfig} server Server configuration
 * @param {SliceDeviceModel} request data slice device and model: device_id, model_id
 * @param {function(?grpc.web.RpcError, ?SliceSchema[])} callback The callback function(error, response)
 */
export async function list_slice_by_device_model(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceDeviceModel = new pb_slice.SliceDeviceModel();
    sliceDeviceModel.setDeviceId(uuid_hex_to_base64(request.device_id));
    sliceDeviceModel.setModelId(uuid_hex_to_base64(request.model_id));
    await client.listSliceByDeviceModel(sliceDeviceModel, metadata(server), (e, r) => {
        const response = r ? get_slice_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a data slice
 * @param {ServerConfig} server Server configuration
 * @param {SliceSchema} request data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 * @param {function(?grpc.web.RpcError, ?SliceId)} callback The callback function(error, response)
 */
export async function create_slice(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceSchema = new pb_slice.SliceSchema();
    sliceSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    sliceSchema.setModelId(uuid_hex_to_base64(request.model_id));
    sliceSchema.setTimestampBegin(request.timestamp_begin.valueOf() * 1000);
    sliceSchema.setTimestampEnd(request.timestamp_end.valueOf() * 1000);
    sliceSchema.setName(request.name);
    sliceSchema.setDescription(request.description);
    await client.createSlice(sliceSchema, metadata(server), (e, r) => {
        const response = r ? get_slice_id(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Update a data slice
 * @param {ServerConfig} server Server configuration
 * @param {SliceUpdate} request data slice update: id, timestamp_begin, timestamp_end, name, description
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_slice(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceUpdate = new pb_slice.SliceUpdate();
    sliceUpdate.setId(request.id);
    if (request.timestamp_begin instanceof Date) {
        sliceUpdate.setTimestampBegin(request.timestamp_begin.valueOf() * 1000);
    }
    if (request.timestamp_end instanceof Date) {
        sliceUpdate.setTimestampEnd(request.timestamp_end.valueOf() * 1000);
    }
    sliceUpdate.setName(request.name);
    sliceUpdate.setDescription(request.description);
    await client.updateSlice(sliceUpdate, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete a data slice
 * @param {ServerConfig} server Server configuration
 * @param {SliceId} request data slice id: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_slice(server, request, callback) {
    const client = new pb_slice.SliceServiceClient(server.address, null, null);
    const sliceId = new pb_slice.SliceId();
    sliceId.setId(request.id);
    await client.deleteSlice(sliceId, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}
