import { get_data_values, set_data_values } from './common.js';
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
 * @typedef {Object} BufferRange
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} begin
 * @property {Date} end
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferNumber
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {number} number
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
 * @property {number} offset
 */

/**
 * @typedef {Object} BufferIdsTime
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferIdsRange
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} begin
 * @property {Date} end
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferIdsNumber
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 * @property {number} number
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferIdsSelector
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BuffersIdsSelector
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number|string} status
 * @property {number} number
 * @property {number} offset
 */

/**
 * @typedef {Object} BufferSetTime
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferSetRange
 * @property {Uuid} set_id
 * @property {Date} begin
 * @property {Date} end
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferSetNumber
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {number} number
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BufferSetSelector
 * @property {Uuid} set_id
 * @property {?number|string} status
 */

/**
 * @typedef {Object} BuffersSetSelector
 * @property {Uuid} set_id
 * @property {?number|string} status
 * @property {number} number
 * @property {number} offset
 */

/**
 * @typedef {Object} BufferSchema
 * @property {number} id
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|Uint8Array|boolean)[]} data
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
        data: get_data_values(r.dataBytes, r.dataTypeList),
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
 * @property {?number|bigint|string|Uint8Array|boolean} data
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
 * Read data buffers by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferTime} request data buffer time: device_id, model_id, timestamp, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_last_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferTime = new pb_buffer.BufferTime();
    bufferTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferTime.setModelId(uuid_hex_to_base64(request.model_id));
    bufferTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferTime.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByLastTime(bufferTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferRange} request data buffer range: device_id, model_id, begin, end, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_range_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferRange = new pb_buffer.BufferRange();
    bufferRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferRange.setModelId(uuid_hex_to_base64(request.model_id));
    bufferRange.setBegin(request.begin.valueOf() * 1000);
    bufferRange.setEnd(request.end.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferRange.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByRangeTime(bufferRange, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferNumber} request data buffer time and number: device_id, model_id, timestamp, number, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_number_before(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferNumber = new pb_buffer.BufferNumber();
    bufferNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferNumber.setModelId(uuid_hex_to_base64(request.model_id));
    bufferNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferNumber.setNumber(request.number);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferNumber.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByNumberBefore(bufferNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferNumber} request data buffer time and number: device_id, model_id, timestamp, number, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_number_after(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferNumber = new pb_buffer.BufferNumber();
    bufferNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferNumber.setModelId(uuid_hex_to_base64(request.model_id));
    bufferNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferNumber.setNumber(request.number);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferNumber.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByNumberAfter(bufferNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
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
 * Read first of data buffers with offset
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: device_id, model_id, status, number, offset
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_first_offset(server, request) {
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
    buffersSelector.setOffset(request.offset);
    return client.listBufferFirstOffset(buffersSelector, metadata(server))
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
 * Read last of data buffers with offset
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: device_id, model_id, status, number, offset
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_last_offset(server, request) {
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
    buffersSelector.setOffset(request.offset);
    return client.listBufferLastOffset(buffersSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsTime} request data buffer id list and time: device_ids, model_ids, timestamp, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_ids_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsTime = new pb_buffer.BufferIdsTime();
    bufferIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferIdsTime.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByIdsTime(bufferIdsTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsTime} request data buffer id list and time: device_ids, model_ids, timestamp, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_ids_last_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsTime = new pb_buffer.BufferIdsTime();
    bufferIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferIdsTime.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByIdsLastTime(bufferIdsTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsRange} request data buffer id list and range: device_ids, model_ids, begin, end, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_ids_range_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsRange = new pb_buffer.BufferIdsRange();
    bufferIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsRange.setBegin(request.begin.valueOf() * 1000);
    bufferIdsRange.setEnd(request.end.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferIdsRange.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByIdsRangeTime(bufferIdsRange, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list, specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsNumber} request data buffer id list, time and number: device_ids, model_ids, timestamp, number, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_ids_number_before(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsNumber = new pb_buffer.BufferIdsNumber();
    bufferIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferIdsNumber.setNumber(request.number);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferIdsNumber.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByIdsNumberBefore(bufferIdsNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list, specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsNumber} request data buffer id list, time and number: device_ids, model_ids, timestamp, number, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_ids_number_after(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsNumber = new pb_buffer.BufferIdsNumber();
    bufferIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferIdsNumber.setNumber(request.number);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferIdsNumber.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferByIdsNumberAfter(bufferIdsNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of data buffers by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: device_ids, model_ids, status, number
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_first_by_ids(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersIdsSelector = new pb_buffer.BuffersIdsSelector();
    if (request.device_ids) {
        buffersIdsSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        buffersIdsSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersIdsSelector.setStatus(set_buffer_status(request.status));
    }
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferFirstByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of data buffers with offset by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: device_ids, model_ids, status, number, offset
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_first_offset_by_ids(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersIdsSelector = new pb_buffer.BuffersIdsSelector();
    if (request.device_ids) {
        buffersIdsSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        buffersIdsSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersIdsSelector.setStatus(set_buffer_status(request.status));
    }
    buffersIdsSelector.setNumber(request.number);
    buffersIdsSelector.setOffset(request.offset);
    return client.listBufferFirstOffsetByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: device_ids, model_ids, status, number
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_last_by_ids(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersIdsSelector = new pb_buffer.BuffersIdsSelector();
    if (request.device_ids) {
        buffersIdsSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        buffersIdsSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersIdsSelector.setStatus(set_buffer_status(request.status));
    }
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferLastByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers with offset by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: device_ids, model_ids, status, number, offset
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_last_offset_by_ids(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersIdsSelector = new pb_buffer.BuffersIdsSelector();
    if (request.device_ids) {
        buffersIdsSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        buffersIdsSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersIdsSelector.setStatus(set_buffer_status(request.status));
    }
    buffersIdsSelector.setNumber(request.number);
    buffersIdsSelector.setOffset(request.offset);
    return client.listBufferLastOffsetByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by set uuid and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetTime} request data buffer set time: set_id, timestamp, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_set_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetTime = new pb_buffer.BufferSetTime();
    bufferSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSetTime.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferBySetTime(bufferSetTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by set uuid and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetTime} request data buffer set time: set_id, timestamp, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_set_last_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetTime = new pb_buffer.BufferSetTime();
    bufferSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSetTime.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferBySetLastTime(bufferSetTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by set uuid and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetRange} request data buffer set range: set_id, begin, end, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_set_range_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetRange = new pb_buffer.BufferSetRange();
    bufferSetRange.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetRange.setBegin(request.begin.valueOf() * 1000);
    bufferSetRange.setEnd(request.end.valueOf() * 1000);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSetRange.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferBySetRangeTime(bufferSetRange, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by set uuid, specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetNumber} request data buffer set time and number: set_id, timestamp, number, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_set_number_before(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetNumber = new pb_buffer.BufferSetNumber();
    bufferSetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferSetNumber.setNumber(request.number);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSetNumber.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferBySetNumberBefore(bufferSetNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by set uuid, specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetNumber} request data buffer set time and number: set_id, timestamp, number, status
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_by_set_number_after(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetNumber = new pb_buffer.BufferSetNumber();
    bufferSetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferSetNumber.setNumber(request.number);
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSetNumber.setStatus(set_buffer_status(request.status));
    }
    return client.listBufferBySetNumberAfter(bufferSetNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of data buffers by set uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSetSelector} request data buffer set selector: set_id, status, number
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_first_by_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSetSelector = new pb_buffer.BuffersSetSelector();
    buffersSetSelector.setSetId(uuid_hex_to_base64(request.set_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSetSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSetSelector.setNumber(request.number);
    return client.listBufferFirstBySet(buffersSetSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of data buffers with offset by set uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSetSelector} request data buffer set selector: set_id, status, number, offset
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_first_offset_by_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSetSelector = new pb_buffer.BuffersSetSelector();
    buffersSetSelector.setSetId(uuid_hex_to_base64(request.set_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSetSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSetSelector.setNumber(request.number);
    buffersSetSelector.setOffset(request.offset);
    return client.listBufferFirstOffsetBySet(buffersSetSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers by set uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSetSelector} request data buffer set selector: set_id, status, number
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_last_by_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSetSelector = new pb_buffer.BuffersSetSelector();
    buffersSetSelector.setSetId(uuid_hex_to_base64(request.set_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSetSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSetSelector.setNumber(request.number);
    return client.listBufferLastBySet(buffersSetSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers with offset by set uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSetSelector} request data buffer set selector: set_id, status, number, offset
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, status
 */
export async function list_buffer_last_offset_by_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSetSelector = new pb_buffer.BuffersSetSelector();
    buffersSetSelector.setSetId(uuid_hex_to_base64(request.set_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSetSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSetSelector.setNumber(request.number);
    buffersSetSelector.setOffset(request.offset);
    return client.listBufferLastOffsetBySet(buffersSetSelector, metadata(server))
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
    const value = set_data_values(request.data);
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
        const value = set_data_values(request.data);
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

/**
 * Read first of a data buffer timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, status
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function read_buffer_timestamp_first(server, request) {
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
    return client.readBufferTimestampFirst(bufferSelector, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read last of a data buffer timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, status
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function read_buffer_timestamp_last(server, request) {
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
    return client.readBufferTimestampLast(bufferSelector, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read first of data buffers timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: device_id, model_id, status, number
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function list_buffer_timestamp_first(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSelector = new pb_buffer.BufferSelector();
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
    return client.listBufferTimestampFirst(buffersSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read last of data buffers timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: device_id, model_id, status, number
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function list_buffer_timestamp_last(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSelector = new pb_buffer.BufferSelector();
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
    return client.listBufferTimestampLast(buffersSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read first of data buffers timestamp by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: device_ids, model_ids, status, number
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function list_buffer_timestamp_first_by_ids(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersIdsSelector = new pb_buffer.BuffersIdsSelector();
    if (request.device_ids) {
        buffersIdsSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        buffersIdsSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersIdsSelector.setStatus(set_buffer_status(request.status));
    }
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferTimestampFirstByIds(buffersIdsSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read last of data buffers timestamp by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: device_ids, model_ids, status, number
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function list_buffer_timestamp_last_by_ids(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersIdsSelector = new pb_buffer.BuffersIdsSelector();
    if (request.device_ids) {
        buffersIdsSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        buffersIdsSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersIdsSelector.setStatus(set_buffer_status(request.status));
    }
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferTimestampLastByIds(buffersIdsSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read first of data buffers timestamp by set uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSetSelector} request data buffer set selector: set_id, status, number
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function list_buffer_timestamp_first_by_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSetSelector = new pb_buffer.BuffersSetSelector();
    buffersSetSelector.setSetId(uuid_hex_to_base64(request.set_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSetSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSetSelector.setNumber(request.number);
    return client.listBufferTimestampFirstBySet(buffersSetSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read last of data buffers timestamp by set uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSetSelector} request data buffer set selector: set_id, status, number
 * @returns {Promise<Date>} data buffer timestamp
 */
export async function list_buffer_timestamp_last_by_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const buffersSetSelector = new pb_buffer.BuffersSetSelector();
    buffersSetSelector.setSetId(uuid_hex_to_base64(request.set_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        buffersSetSelector.setStatus(set_buffer_status(request.status));
    }
    buffersSetSelector.setNumber(request.number);
    return client.listBufferTimestampLastBySet(buffersSetSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Count data buffers
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, status
 * @returns {Promise<number>} data buffer count
 */
export async function count_buffer(server, request) {
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
    return client.countBuffer(bufferSelector, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data buffers by id list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsSelector} request data buffer selector with id list: device_ids, model_ids, status
 * @returns {Promise<number>} data buffer count
 */
export async function count_buffer_by_ids(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsSelector = new pb_buffer.BufferIdsSelector();
    if (request.device_ids) {
        bufferIdsSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        bufferIdsSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferIdsSelector.setStatus(set_buffer_status(request.status));
    }
    return client.countBufferByIds(bufferIdsSelector, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data buffers by set id
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetSelector} request data buffer set selector: set_id, status
 * @returns {Promise<number>} data buffer count
 */
export async function count_buffer_by_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetSelector = new pb_buffer.BufferSetSelector();
    bufferSetSelector.setSetId(uuid_hex_to_base64(request.set_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        bufferSetSelector.setStatus(set_buffer_status(request.status));
    }
    return client.countBufferBySet(bufferSetSelector, metadata(server))
        .then(response => response.toObject().count);
}
