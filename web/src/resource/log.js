import { get_data_value, set_data_value, Tag } from './common.js';
import { pb_log } from 'rmcs-resource-api';
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
 * @typedef {Object} LogId
 * @property {number} id
 */

/**
 * @param {*} r 
 * @returns {LogId}
 */
function get_log_id(r) {
    return {
        id: r.id
    };
}

/**
 * @typedef {Object} LogIds
 * @property {number[]} ids
 */

/**
 * @param {*} r 
 * @returns {LogIds}
 */
function get_log_ids(r) {
    return {
        ids: r.idsList
    };
}

/**
 * @typedef {Object} LogTime
 * @property {Date} timestamp
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogLatest
 * @property {Date} latest
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogRange
 * @property {Date} begin
 * @property {Date} end
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogSelector
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogsSelector
 * @property {number} number
 * @property {number} offset
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogSchema
 * @property {number} id
 * @property {Date} timestamp
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {number|bigint|string|Uint8Array|boolean} value
 * @property {?number} tag
 */

/**
 * @param {*} r 
 * @returns {LogSchema}
 */
function get_log_schema(r) {
    return {
        id: r.id,
        timestamp: new Date(r.timestamp / 1000),
        device_id: r.deviceId ? base64_to_uuid_hex(r.deviceId) : null,
        model_id: r.model_id ? base64_to_uuid_hex(r.model_id) : null,
        value: get_data_value(r.logBytes, r.logType),
        tag: r.tag
    };
}

/**
 * @param {*} r 
 * @returns {LogSchema[]}
 */
function get_log_schema_vec(r) {
    return r.map((v) => {return get_log_schema(v)});
}

/**
 * @typedef {Object} LogUpdate
 * @property {number} id
 * @property {?number|bigint|string|Uint8Array|boolean} value
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogUpdateTime
 * @property {Date} timestamp
 * @property {?Uuid} model_id
 * @property {?Uuid} device_id
 * @property {?number|bigint|string|Uint8Array|boolean} value
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogGroupTime
 * @property {Date} timestamp
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogGroupLatest
 * @property {Date} latest
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogGroupRange
 * @property {Date} begin
 * @property {Date} end
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogGroupSelector
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number} tag
 */

/**
 * @typedef {Object} LogsGroupSelector
 * @property {number} number
 * @property {number} offset
 * @property {?Uuid[]} device_ids
 * @property {?Uuid[]} model_ids
 * @property {?number} tag
 */


/**
 * Read a system log by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogId} request system log id: id
 * @returns {Promise<LogSchema>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function read_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logId = new pb_log.LogId();
    logId.setId(request.id);
    return client.readLog(logId, metadata(server))
        .then(response => get_log_schema(response.toObject().result));
}

/**
 * Read a system log by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogTime} request system log time: timestamp, device_id, model_id, tag
 * @returns {Promise<LogSchema>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function read_log_by_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logTime = new pb_log.LogTime();
    logTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logTime.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logTime.setTag(request.tag);
    return client.readLogByTime(logTime, metadata(server))
        .then(response => get_log_schema(response.toObject().result));
}

/**
 * Read system logs by multiple id
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogIds} request system log id: ids
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_by_ids(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logIds = new pb_log.LogIds();
    logIds.setIdsList(request.ids);
    return client.listLogByIds(logIds, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogTime} request system log time: timestamp, device_id, model_id, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_by_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logTime = new pb_log.LogTime();
    logTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logTime.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logTime.setTag(request.tag);
    return client.listLogByTime(logTime, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs by latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogLatest} request system log latest: latest, device_id, model_id, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_by_latest(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logLatest = new pb_log.LogLatest();
    logLatest.setLatest(request.latest.valueOf() * 1000);
    if (request.device_id) {
        logLatest.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logLatest.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logLatest.setTag(request.tag);
    return client.listLogByLatest(logLatest, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogRange} request system log time: begin, end, device_id, model_id, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_by_range(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logRange = new pb_log.LogRange();
    logRange.setBegin(request.begin.valueOf() * 1000);
    logRange.setEnd(request.end.valueOf() * 1000);
    if (request.device_id) {
        logRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logRange.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logRange.setTag(request.tag);
    return client.listLogByRange(logRange, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogSelector} request system log selector: device_id, model_id, tag
 * @returns {Promise<LogSchema>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function read_log_first(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logSelector = new pb_log.LogSelector();
    logSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logSelector.setTag(request.tag);
    return client.readLogFirst(logSelector, metadata(server))
        .then(response => get_log_schema(response.toObject().result));
}

/**
 * Read last of a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogSelector} request system log selector: device_id, model_id, tag
 * @returns {Promise<LogSchema>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function read_log_last(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logSelector = new pb_log.LogSelector();
    logSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logSelector.setTag(request.tag);
    return client.readLogLast(logSelector, metadata(server))
        .then(response => get_log_schema(response.toObject().result));
}

/**
 * Read first of system logs
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsSelector} request system log selector: number, device_id, model_id, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_first(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsSelector = new pb_log.LogsSelector();
    logsSelector.setNumber(request.number);
    logsSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logsSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logsSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logsSelector.setTag(request.tag);
    return client.listLogFirst(logsSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of system logs with offset
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsSelector} request system log selector: number, offset, device_id, model_id, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_first_offset(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsSelector = new pb_log.LogsSelector();
    logsSelector.setNumber(request.number);
    logsSelector.setOffset(request.offset);
    logsSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logsSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logsSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logsSelector.setTag(request.tag);
    return client.listLogFirstOffset(logsSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of system logs
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsSelector} request system log selector: number, device_id, model_id, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_last(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsSelector = new pb_log.LogsSelector();
    logsSelector.setNumber(request.number);
    logsSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logsSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logsSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logsSelector.setTag(request.tag);
    return client.listLogLast(logsSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of system logs with offset
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsSelector} request system log selector: number, offset, device_id, model_id, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_last_offset(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsSelector = new pb_log.LogsSelector();
    logsSelector.setNumber(request.number);
    logsSelector.setOffset(request.offset);
    logsSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logsSelector.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logsSelector.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logsSelector.setTag(request.tag);
    return client.listLogLastOffset(logsSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs with device or model group by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogGroupTime} request system log time: timestamp, device_ids, model_ids, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_group_by_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logGroupTime = new pb_log.LogGroupTime();
    logGroupTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_ids) {
        logGroupTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logGroupTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logGroupTime.setTag(request.tag);
    return client.listLogGroupByTime(logGroupTime, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs with device or model group by latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogGroupLatest} request system log latest: latest, device_ids, model_ids, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_group_by_latest(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logGroupLatest = new pb_log.LogGroupLatest();
    logGroupLatest.setLatest(request.latest.valueOf() * 1000);
    if (request.device_ids) {
        logGroupLatest.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logGroupLatest.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logGroupLatest.setTag(request.tag);
    return client.listLogGroupByLatest(logGroupLatest, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs with device or model group by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogGroupRange} request system log time: begin, end, device_ids, model_ids, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_group_by_range(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logGroupRange = new pb_log.LogGroupRange();
    logGroupRange.setBegin(request.begin.valueOf() * 1000);
    logGroupRange.setEnd(request.end.valueOf() * 1000);
    if (request.device_ids) {
        logGroupRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logGroupRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logGroupRange.setTag(request.tag);
    return client.listLogGroupByRange(logGroupRange, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of a system log with device or model group
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogGroupSelector} request system log selector: device_ids, model_ids, tag
 * @returns {Promise<LogSchema>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function read_log_group_first(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logGroupSelector = new pb_log.LogGroupSelector();
    logGroupSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_ids) {
        logGroupSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logGroupSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logGroupSelector.setTag(request.tag);
    return client.readLogGroupFirst(logGroupSelector, metadata(server))
        .then(response => get_log_schema(response.toObject().result));
}

/**
 * Read last of a system log with device or model group
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogGroupSelector} request system log selector: device_ids, model_ids, tag
 * @returns {Promise<LogSchema>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function read_log_group_last(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logGroupSelector = new pb_log.LogGroupSelector();
    logGroupSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_ids) {
        logGroupSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logGroupSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logGroupSelector.setTag(request.tag);
    return client.readLogGroupLast(logGroupSelector, metadata(server))
        .then(response => get_log_schema(response.toObject().result));
}

/**
 * Read first of system logs with device or model group
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsGroupSelector} request system log selector: number, device_ids, model_ids, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_group_first(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsGroupSelector = new pb_log.LogsGroupSelector();
    logsGroupSelector.setNumber(request.number);
    logsGroupSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_ids) {
        logsGroupSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logsGroupSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logsGroupSelector.setTag(request.tag);
    return client.listLogGroupFirst(logsGroupSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read first of system logs with offset and device or model group
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsGroupSelector} request system log selector: number, offset, device_ids, model_ids, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_group_first_offset(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsGroupSelector = new pb_log.LogsGroupSelector();
    logsGroupSelector.setNumber(request.number);
    logsGroupSelector.setOffset(request.offset);
    logsGroupSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_ids) {
        logsGroupSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logsGroupSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logsGroupSelector.setTag(request.tag);
    return client.listLogGroupFirstOffset(logsGroupSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of system logs with device or model group
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsGroupSelector} request system log selector: number, device_ids, model_ids, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_group_last(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsGroupSelector = new pb_log.LogsGroupSelector();
    logsGroupSelector.setNumber(request.number);
    logsGroupSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_ids) {
        logsGroupSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logsGroupSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logsGroupSelector.setTag(request.tag);
    return client.listLogGroupLast(logsGroupSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read last of system logs with offset and device or model group
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogsGroupSelector} request system log selector: number, offset, device_ids, model_ids, tag
 * @returns {Promise<LogSchema[]>} system log schema: id, timestamp, device_id, model_id, value, tag
 */
export async function list_log_group_last_offset(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logsGroupSelector = new pb_log.LogsGroupSelector();
    logsGroupSelector.setNumber(request.number);
    logsGroupSelector.setOffset(request.offset);
    logsGroupSelector.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_ids) {
        logsGroupSelector.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    }
    if (request.model_ids) {
        logsGroupSelector.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    }
    logsGroupSelector.setTag(request.tag);
    return client.listLogGroupLastOffset(logsGroupSelector, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Create a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogSchema} request system log schema: timestamp, device_id, model_id, value, tag
 * @returns {Promise<LogId>} data buffer id: id
 */
export async function create_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logSchema = new pb_log.LogSchema();
    logSchema.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logSchema.setModelId(uuid_hex_to_base64(request.model_id));
    }
    const value = set_data_value(request.value);
    logSchema.setLogBytes(value.bytes);
    logSchema.setLogType(value.type);
    logSchema.setTag(request.tag ?? Tag.DEFAULT);
    return client.createLog(logSchema, metadata(server))
        .then(response => get_log_id(response.toObject()));
}

/**
 * Update a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogUpdate} request system log update: id, value, tag
 * @returns {Promise<{}>} update response
 */
export async function update_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logUpdate = new pb_log.LogUpdate();
    logUpdate.setId(request.id);
    const value = set_data_value(request.value);
    logUpdate.setLogBytes(value.bytes);
    logUpdate.setLogType(value.type);
    logUpdate.setTag(request.tag);
    return client.updateLog(logUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Update a system log by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogUpdateTime} request system log update time: timestamp, model_id, device_id, value, tag
 * @returns {Promise<{}>} update response
 */
export async function update_log_by_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logUpdateTime = new pb_log.LogUpdateTime();
    logUpdateTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logUpdateTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logUpdateTime.setModelId(uuid_hex_to_base64(request.model_id));
    }
    const value = set_data_value(request.value);
    logUpdateTime.setLogBytes(value.bytes);
    logUpdateTime.setLogType(value.type);
    logUpdateTime.setTag(request.tag);
    return client.updateLogByTime(logUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogId} request system log id: id
 * @returns {Promise<{}>} delete response
 */
export async function delete_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logId = new pb_log.LogId();
    logId.setId(request.id);
    return client.deleteLog(logId, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a system log by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogTime} request system log id: timestamp, model_id, device_id, tag
 * @returns {Promise<{}>} delete response
 */
export async function delete_log_by_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logTime = new pb_log.LogTime();
    logTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        logTime.setModelId(uuid_hex_to_base64(request.model_id));
    }
    logTime.setTag(request.tag);
    return client.deleteLogByTime(logTime, metadata(server))
        .then(response => response.toObject());
}
