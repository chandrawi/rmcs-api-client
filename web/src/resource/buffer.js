import { get_data_values, set_data_values, Tag } from './common.js';
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
 * @typedef {Object} BufferIds
 * @property {number[]} ids
 */

/**
 * @param {*} r 
 * @returns {BufferIds}
 */
function get_buffer_ids(r) {
    return {
        ids: r.idsList
    };
}

/**
 * @typedef {Object} BufferTime
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferRange
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} begin
 * @property {Date} end
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferNumber
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {number} number
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferSelector
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number} tag
 */

/**
 * @typedef {Object} BuffersSelector
 * @property {number} number
 * @property {number} offset
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferIdsTime
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferIdsRange
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} begin
 * @property {Date} end
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferIdsNumber
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 * @property {number} number
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferIdsSelector
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number} tag
 */

/**
 * @typedef {Object} BuffersIdsSelector
 * @property {number} number
 * @property {number} offset
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferSetId
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferSetTime
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferSetRange
 * @property {Uuid} set_id
 * @property {Date} begin
 * @property {Date} end
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferSchema
 * @property {number} id
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|Uint8Array|boolean)[]} data
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferMultipleSchema
 * @property {number[]} id
 * @property {Uuid[]} model_ids
 * @property {Uuid[]} device_ids
 * @property {Date[]} timestamps
 * @property {(number|bigint|string|Uint8Array|boolean)[][]} data
 * @property {?number[]} tags
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
        tag: r.tag ?? Tag.DEFAULT
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
 * @property {?(number|bigint|string|Uint8Array|boolean)[]} data
 * @property {?number} tag
 */

/**
 * @typedef {Object} BufferUpdateTime
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {?(number|bigint|string|Uint8Array|boolean)[]} data
 * @property {?number} tag
 */


/**
 * Read a data buffer by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferId} request data buffer id: id
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
 * @param {BufferTime} request data buffer time: device_id, model_id, timestamp, tag
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function read_buffer_by_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferTime = new pb_buffer.BufferTime();
    bufferTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferTime.setModelId(uuid_hex_to_base64(request.model_id));
    bufferTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferTime.setTag(request.tag);
    return client.readBufferByTime(bufferTime, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read data buffers by multiple id
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIds} request data buffer id: ids
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIds = new pb_buffer.BufferIds();
    bufferIds.setIdsList(request.ids);
    return client.listBuffer(bufferIds, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferTime} request data buffer time: device_id, model_id, timestamp, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferTime = new pb_buffer.BufferTime();
    bufferTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferTime.setModelId(uuid_hex_to_base64(request.model_id));
    bufferTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferTime.setTag(request.tag);
    return client.listBufferByTime(bufferTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferTime} request data buffer time: device_id, model_id, timestamp, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_last_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferTime = new pb_buffer.BufferTime();
    bufferTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferTime.setModelId(uuid_hex_to_base64(request.model_id));
    bufferTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferTime.setTag(request.tag);
    return client.listBufferByLastTime(bufferTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferRange} request data buffer range: device_id, model_id, begin, end, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_range_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferRange = new pb_buffer.BufferRange();
    bufferRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferRange.setModelId(uuid_hex_to_base64(request.model_id));
    bufferRange.setBegin(request.begin.valueOf() * 1000);
    bufferRange.setEnd(request.end.valueOf() * 1000);
    bufferRange.setTag(request.tag);
    return client.listBufferByRangeTime(bufferRange, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferNumber} request data buffer time and number: device_id, model_id, timestamp, number, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_number_before(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferNumber = new pb_buffer.BufferNumber();
    bufferNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferNumber.setModelId(uuid_hex_to_base64(request.model_id));
    bufferNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferNumber.setNumber(request.number);
    bufferNumber.setTag(request.tag);
    return client.listBufferByNumberBefore(bufferNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferNumber} request data buffer time and number: device_id, model_id, timestamp, number, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_number_after(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferNumber = new pb_buffer.BufferNumber();
    bufferNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferNumber.setModelId(uuid_hex_to_base64(request.model_id));
    bufferNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferNumber.setNumber(request.number);
    bufferNumber.setTag(request.tag);
    return client.listBufferByNumberAfter(bufferNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, tag
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    bufferSelector.setTag(request.tag);
    return client.readBufferFirst(bufferSelector, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read last of a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, tag
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    bufferSelector.setTag(request.tag);
    return client.readBufferLast(bufferSelector, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read first of data buffers
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: number, device_id, model_id, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersSelector.setTag(request.tag);
    buffersSelector.setNumber(request.number);
    return client.listBufferFirst(buffersSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of data buffers with offset
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: number, offset, device_id, model_id, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersSelector.setTag(request.tag);
    buffersSelector.setNumber(request.number);
    buffersSelector.setOffset(request.offset);
    return client.listBufferFirstOffset(buffersSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: number, device_id, model_id, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersSelector.setTag(request.tag);
    buffersSelector.setNumber(request.number);
    return client.listBufferLast(buffersSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers with offset
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: number, offset, device_id, model_id, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersSelector.setTag(request.tag);
    buffersSelector.setNumber(request.number);
    buffersSelector.setOffset(request.offset);
    return client.listBufferLastOffset(buffersSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsTime} request data buffer id list and time: device_ids, model_ids, timestamp, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_ids_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsTime = new pb_buffer.BufferIdsTime();
    bufferIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferIdsTime.setTag(request.tag);
    return client.listBufferByIdsTime(bufferIdsTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsTime} request data buffer id list and time: device_ids, model_ids, timestamp, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_ids_last_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsTime = new pb_buffer.BufferIdsTime();
    bufferIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferIdsTime.setTag(request.tag);
    return client.listBufferByIdsLastTime(bufferIdsTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsRange} request data buffer id list and range: device_ids, model_ids, begin, end, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_ids_range_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsRange = new pb_buffer.BufferIdsRange();
    bufferIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsRange.setBegin(request.begin.valueOf() * 1000);
    bufferIdsRange.setEnd(request.end.valueOf() * 1000);
    bufferIdsRange.setTag(request.tag);
    return client.listBufferByIdsRangeTime(bufferIdsRange, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list, specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsNumber} request data buffer id list, time and number: device_ids, model_ids, timestamp, number, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_ids_number_before(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsNumber = new pb_buffer.BufferIdsNumber();
    bufferIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferIdsNumber.setNumber(request.number);
    bufferIdsNumber.setTag(request.tag);
    return client.listBufferByIdsNumberBefore(bufferIdsNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffers by uuid list, specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsNumber} request data buffer id list, time and number: device_ids, model_ids, timestamp, number, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_by_ids_number_after(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferIdsNumber = new pb_buffer.BufferIdsNumber();
    bufferIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    bufferIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferIdsNumber.setNumber(request.number);
    bufferIdsNumber.setTag(request.tag);
    return client.listBufferByIdsNumberAfter(bufferIdsNumber, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of data buffers by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: number, device_ids, model_ids, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersIdsSelector.setTag(request.tag);
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferFirstByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of data buffers with offset by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: number, offset, device_ids, model_ids, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersIdsSelector.setTag(request.tag);
    buffersIdsSelector.setNumber(request.number);
    buffersIdsSelector.setOffset(request.offset);
    return client.listBufferFirstOffsetByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: number, device_ids, model_ids, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersIdsSelector.setTag(request.tag);
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferLastByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of data buffers with offset by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: number, offset, device_ids, model_ids, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
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
    buffersIdsSelector.setTag(request.tag);
    buffersIdsSelector.setNumber(request.number);
    buffersIdsSelector.setOffset(request.offset);
    return client.listBufferLastOffsetByIds(buffersIdsSelector, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read a data buffer set by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetId} request data buffer set id: set_id, timestamp, tag
 * @returns {Promise<BufferSchema>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function read_buffer_set(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetId = new pb_buffer.BufferSetId();
    bufferSetId.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetId.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferSetId.setTag(request.tag);
    return client.readBufferSet(bufferSetId, metadata(server))
        .then(response => get_buffer_schema(response.toObject().result));
}

/**
 * Read data buffer sets by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetTime} request data buffer set id: set_id, timestamp, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_set_by_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetTime = new pb_buffer.BufferSetTime();
    bufferSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferSetTime.setTag(request.tag);
    return client.listBufferSetByTime(bufferSetTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffer sets by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetTime} request data buffer set id: set_id, timestamp, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_set_by_last_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetTime = new pb_buffer.BufferSetTime();
    bufferSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferSetTime.setTag(request.tag);
    return client.listBufferSetByLastTime(bufferSetTime, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Read data buffer sets by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSetRange} request data buffer set range: set_id, begin, end, tag
 * @returns {Promise<BufferSchema[]>} data buffer schema: id, device_id, model_id, timestamp, data, tag
 */
export async function list_buffer_set_by_range_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferSetRange = new pb_buffer.BufferSetRange();
    bufferSetRange.setSetId(uuid_hex_to_base64(request.set_id));
    bufferSetRange.setBegin(request.begin.valueOf() * 1000);
    bufferSetRange.setEnd(request.end.valueOf() * 1000);
    bufferSetRange.setTag(request.tag);
    return client.listBufferSetByRangeTime(bufferSetRange, metadata(server))
        .then(response => get_buffer_schema_vec(response.toObject().resultsList));
}

/**
 * Create a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSchema} request data buffer schema: device_id, model_id, timestamp, data, tag
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
    bufferSchema.setTag(request.tag ?? Tag.DEFAULT);
    return client.createBuffer(bufferSchema, metadata(server))
        .then(response => get_buffer_id(response.toObject()));
}

/**
 * Create multiple data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferMultipleSchema} request data buffer schema: device_ids, model_ids, timestamps, data, tags
 * @returns {Promise<BufferIds>} data buffer id: ids
 */
export async function create_buffer_multiple(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferMultiSchema = new pb_buffer.BufferMultipleSchema();
    const number = request.device_ids.length;
    const tags = request.tags ?? Array(number).fill(Tag.DEFAULT);
    const lengths = [request.model_ids.length, request.timestamps.length, request.data.length, tags.length];
    if (lengths.some(length => length != number)) {
        throw new Error("INVALID_ARGUMENT");
    }
    for (let i=0; i<number; i++) {
        const bufferSchema = new pb_buffer.BufferSchema();
        bufferSchema.setDeviceId(uuid_hex_to_base64(request.device_ids[i]));
        bufferSchema.setModelId(uuid_hex_to_base64(request.model_ids[i]));
        bufferSchema.setTimestamp(request.timestamps[i].valueOf() * 1000);
        const value = set_data_values(request.data[i]);
        bufferSchema.setDataBytes(value.bytes);
        for (const type of value.types) {
            bufferSchema.addDataType(type);
        }
        bufferSchema.setTag(tags[i] ?? Tag.DEFAULT);
        bufferMultiSchema.addSchemas(bufferSchema);
    }
    return client.createBufferMultiple(bufferMultiSchema, metadata(server))
        .then(response => get_buffer_ids(response.toObject()));
}

/**
 * Update a data buffer
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferUpdate} request data buffer update: id, data, tag
 * @returns {Promise<{}>} update response
 */
export async function update_buffer(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferUpdate = new pb_buffer.BufferUpdate();
    bufferUpdate.setId(request.id);
    if (typeof request.data == "object" && 'length' in request.data) {
        const value = set_data_values(request.data);
        bufferUpdate.setDataBytes(value.bytes);
        for (const type of value.types) {
            bufferUpdate.addDataType(type);
        }
    }
    bufferUpdate.setTag(request.tag);
    return client.updateBuffer(bufferUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Update a data buffer by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferUpdateTime} request data buffer update: device_id, model_id, timestamp, data, tag
 * @returns {Promise<{}>} update response
 */
export async function update_buffer_by_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferUpdateTime = new pb_buffer.BufferUpdateTime();
    bufferUpdateTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferUpdateTime.setModelId(uuid_hex_to_base64(request.model_id));
    bufferUpdateTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (typeof request.data == "object" && 'length' in request.data) {
        const value = set_data_values(request.data);
        BufferUpdateTime.setDataBytes(value.bytes);
        for (const type of value.types) {
            BufferUpdateTime.addDataType(type);
        }
    }
    BufferUpdateTime.setTag(request.tag);
    return client.updateBufferByTime(BufferUpdateTime, metadata(server))
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
 * Delete a data buffer by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferTime} request data buffer time: device_id, model_id, timestamp, tag
 * @returns {Promise<{}>} delete response
 */
export async function delete_buffer_by_time(server, request) {
    const client = new pb_buffer.BufferServicePromiseClient(server.address, null, null);
    const bufferTime = new pb_buffer.BufferTime();
    bufferTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    bufferTime.setModelId(uuid_hex_to_base64(request.model_id));
    bufferTime.setTimestamp(request.timestamp.valueOf() * 1000);
    bufferTime.setTag(request.tag);
    return client.deleteBufferByTime(bufferTime, metadata(server))
        .then(response => response.toObject());
}

/**
 * Read first of a data buffer timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, tag
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
    bufferSelector.setTag(request.tag);
    return client.readBufferTimestampFirst(bufferSelector, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read last of a data buffer timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, tag
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
    bufferSelector.setTag(request.tag);
    return client.readBufferTimestampLast(bufferSelector, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read first of data buffers timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: number, device_id, model_id, tag
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
    buffersSelector.setNumber(request.number);
    buffersSelector.setTag(request.tag);
    return client.listBufferTimestampFirst(buffersSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read last of data buffers timestamp
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersSelector} request data buffer selector: number, device_id, model_id, tag
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
    buffersSelector.setNumber(request.number);
    buffersSelector.setTag(request.tag);
    return client.listBufferTimestampLast(buffersSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read first of data buffers timestamp by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: number, device_ids, model_ids, tag
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
    buffersIdsSelector.setTag(request.tag);
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferTimestampFirstByIds(buffersIdsSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read last of data buffers timestamp by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BuffersIdsSelector} request data buffer selector with id list: number, device_ids, model_ids, tag
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
    buffersIdsSelector.setTag(request.tag);
    buffersIdsSelector.setNumber(request.number);
    return client.listBufferTimestampLastByIds(buffersIdsSelector, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Count data buffers
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferSelector} request data buffer selector: device_id, model_id, tag
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
    bufferSelector.setTag(request.tag);
    return client.countBuffer(bufferSelector, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data buffers by id list
 * @param {ServerConfig} server server configuration: address, token
 * @param {BufferIdsSelector} request data buffer selector with id list: device_ids, model_ids, tag
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
    bufferIdsSelector.setTag(request.tag);
    return client.countBufferByIds(bufferIdsSelector, metadata(server))
        .then(response => response.toObject().count);
}
