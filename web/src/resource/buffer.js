import { get_data_value, set_data_value } from './common.js';
import { pb_buffer } from 'rmcs-resource-api';
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
 * @typedef {Object} BufferId
 * @property {number} id
 */

/**
 * @param {*} r 
 * @returns {BufferId}
 */
function get_buffer_id(r) {
    return {
        id: r.id
    };
}

/**
 * @typedef {Object} BufferTime
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferSelector
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BuffersSelector
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number|string} status
 * @property {number} number
 */

/**
 * @typedef {Object} BufferSchema
 * @property {number} id
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|boolean)[]} data
 * @property {number|string} status
 */

/**
 * @param {*} r 
 * @returns {BufferSchema}
 */
function get_buffer_schema(r) {
    return {
        id: r.id,
        device_id: base64_to_uuid_hex(r.deviceId),
        model_id: base64_to_uuid_hex(r.modelId),
        timestamp: new Date(r.timestamp / 1000),
        data: get_data_value(r.dataBytes, r.dataTypeList),
        status: get_buffer_status(r.status)
    };
}

/**
 * @param {*} r 
 * @returns {BufferSchema[]}
 */
function get_buffer_schema_vec(r) {
    return r.map((v) => {return get_buffer_schema(v)});
}

/**
 * @typedef {Object} BufferUpdate
 * @property {number} id
 * @property {?number|bigint|string|boolean} data
 * @property {?number|string} status
 */

/**
 * @param {number} status 
 * @returns {number|string}
 */
function get_buffer_status(status) {
    switch (status) {
        case 0: return "DEFAULT";
        case 1: return "ERROR";
        case 2: return "DELETE";
        case 3: return "HOLD";
        case 4: return "SEND_UPLINK";
        case 5: return "SEND_DOWNLINK";
        case 6: return "TRANSFER_LOCAL";
        case 7: return "TRANSFER_GATEWAY";
        case 8: return "TRANSFER_SERVER";
        case 9: return "BACKUP";
        case 10: return "RESTORE";
        case 11: return "ANALYSIS_1";
        case 12: return "ANALYSIS_2";
        case 13: return "ANALYSIS_3";
        case 14: return "ANALYSIS_4";
        case 15: return "ANALYSIS_5";
        case 16: return "ANALYSIS_6";
        case 17: return "ANALYSIS_7";
        case 18: return "ANALYSIS_8";
        case 19: return "ANALYSIS_9";
        case 20: return "ANALYSIS_10";
        case 21: return "EXTERNAL_OUTPUT";
        case 22: return "EXTERNAL_INPUT";
    }
    return status;
}

/**
 * @param {number|string} status 
 * @returns {number}
 */
function set_buffer_status(status) {
    if (typeof status == "number") {
        return status;
    }
    if (typeof status == "string") {
        status = status.replace(/[a-z][A-Z]/, s => `${s.charAt(0)}_${s.charAt(1)}`);
        switch (status.toUpperCase()) {
            case "DEFAULT": return 0;
            case "ERROR": return 1;
            case "DELETE": return 2;
            case "HOLD": return 3;
            case "SEND_UPLINK": return 4;
            case "SEND_DOWNLINK": return 5;
            case "TRANSFER_LOCAL": return 6;
            case "TRANSFER_GATEWAY": return 7;
            case "TRANSFER_SERVER": return 8;
            case "BACKUP": return 9;
            case "RESTORE": return 10;
            case "ANALYSIS_1": return 11;
            case "ANALYSIS_2": return 12;
            case "ANALYSIS_3": return 13;
            case "ANALYSIS_4": return 14;
            case "ANALYSIS_5": return 15;
            case "ANALYSIS_6": return 16;
            case "ANALYSIS_7": return 17;
            case "ANALYSIS_8": return 18;
            case "ANALYSIS_9": return 19;
            case "ANALYSIS_10": return 20;
            case "EXTERNAL_INPUT": return 21;
            case "EXTERNAL_OUTPUT": return 22;
        }
    }
    return 0;
}


/**
 * Read a data buffer by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferId} request data buffer id: id
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function read_buffer(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferId = new pb_buffer.BufferId();
    bufferId.setId(request.id);
    return client.readBuffer(bufferId, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read a data buffer by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferTime} request data buffer time: device_id, model_id, timestamp, status
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function read_buffer_by_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferTime = new pb_buffer.BufferTime();
    bufferTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferTime.setModelId(uuid_hex_to_base64(request.model_id));
    bufferTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferTime.setStatus(set_buffer_status(request.status));
    return client.readBufferByTime(bufferTime, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read first of a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, status
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function read_buffer_first(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSelector = new pb_buffer.BufferSelector();
    if (request.device_id) {
        bufferSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        bufferSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSelector.setStatus(set_buffer_status(request.status));
    }
    return client.readBufferFirst(bufferSelector, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read last of a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, status
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function read_buffer_last(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSelector = new pb_buffer.BufferSelector();
    if (request.device_id) {
        bufferSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        bufferSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSelector.setStatus(set_buffer_status(request.status));
    }
    return client.readBufferLast(bufferSelector, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read first of data buffers
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: device_id, model_id, status, number
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_first(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSelector = new pb_buffer.BuffersSelector();
    if (request.device_id) {
        buffersSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        buffersSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSelector.setNumber(request.number);
    return client.listBufferFirst(buffersSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: device_id, model_id, status, number
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_last(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSelector = new pb_buffer.BuffersSelector();
    if (request.device_id) {
        buffersSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        buffersSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSelector.setNumber(request.number);
    return client.listBufferLast(buffersSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Create a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSchema} request data buffer schema: device_id, model_id, timestamp, data, status
 * @returns {Promise<BufferId>} data buffer id: id
 */
export async function create_buffer(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSchema = new pb_buffer.BufferSchema();
    bufferSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferSchema.setModelId(uuid_hex_to_base64(request.model_id));
    bufferSchema.setTimestamp(request.timestamp.valueOf() * 1000);
    const value = set_data_value(request.data);
    bufferSchema.setDataBytes(value.bytes);
    for (const type of value.types) {
        bufferSchema.addDataType(type);
    }
    bufferSchema.setStatus(set_buffer_status(request.status));
    return client.createBuffer(bufferSchema, metadata(server))
        .then(response => get_buffer_id(response.toObject()));
}

/**
 * Update a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferUpdate} request data buffer update: id, data, status
* @returns {Promise<{}>} update response
 */
export async function update_buffer(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferUpdate = new pb_buffer.BufferUpdate();
    bufferUpdate.setId(request.id);
    const ty = typeof request.data;
    if (ty == "number" || ty == "string" || ty == "bigint" || ty == "boolean") {
        const value = set_data_value(request.data);
        bufferUpdate.setDataBytes(value.bytes);
        for (const type of value.types) {
            bufferUpdate.addDataType(type);
        }
    }
    bufferUpdate.setStatus(set_buffer_status(request.status));
    return client.updateBuffer(bufferUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferId} request data buffer id: id
* @returns {Promise<{}>} delete response
 */
export async function delete_buffer(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferId = new pb_buffer.BufferId();
    bufferId.setId(request.id);
    return client.deleteBuffer(bufferId, metadata(server))
        .then(response => response.toObject());
}
