import { get_data_value, set_data_value } from './common.js';
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
 * @property {Date} timestamp
 * @property {Uuid} device_id
 */

/**
 * @typedef {Object} LogTime
 * @property {Date} timestamp
 * @property {?Uuid} device_id
 * @property {?number|string} status
 */

/**
 * @typedef {Object} LogRange
 * @property {Date} begin
 * @property {Date} end
 * @property {?Uuid} device_id
 * @property {?number|string} status
 */

/**
 * @typedef {Object} LogSchema
 * @property {Date} timestamp
 * @property {Uuid} device_id
 * @property {number|string} status
 * @property {number|bigint|string|Uint8Array|boolean} value
 */

/**
 * @param {*} r 
 * @returns {LogSchema}
 */
function get_log_schema(r) {
    return {
        timestamp: new Date(r.timestamp / 1000),
        device_id: base64_to_uuid_hex(r.deviceId),
        status: get_log_status(r.status),
        value: get_data_value(r.logBytes, [r.logType])[0]
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
 * @property {Date} timestamp
 * @property {Uuid} device_id
 * @property {?number|string} status
 * @property {?number|string} value
 */

/**
 * @param {number} status 
 * @returns {number|string}
 */
function get_log_status(status) {
    switch (status) {
        case 0: return "DEFAULT";
        case 1: return "SUCCESS";
        case 2: return "ERROR_SEND";
        case 3: return "ERROR_TRANSFER";
        case 4: return "ERROR_ANALYSIS";
        case 5: return "ERROR_NETWORK";
        case 6: return "FAIL_READ";
        case 7: return "FAIL_CREATE";
        case 8: return "FAIL_UPDATE";
        case 9: return "FAIL_DELETE";
        case 10: return "INVALID_TOKEN";
        case 11: return "INVALID_REQUEST";
        case 12: return "UNKNOWN_ERROR";
        case 13: return "UNKNOWN_STATUS";
    }
    return status;
}

/**
 * @param {number|string} status 
 * @returns {number}
 */
function set_log_status(status) {
    if (typeof status == "number") {
        return status;
    }
    if (typeof status == "string") {
        status = status.replace(/[a-z][A-Z]/, s => `${s.charAt(0)}_${s.charAt(1)}`);
        switch (status.toUpperCase()) {
            case "DEFAULT": return 0;
            case "SUCCESS": return 1;
            case "ERROR_SEND": return 2;
            case "ERROR_TRANSFER": return 3;
            case "ERROR_ANALYSIS": return 4;
            case "ERROR_NETWORK": return 5;
            case "FAIL_READ": return 6;
            case "FAIL_CREATE": return 7;
            case "FAIL_UPDATE": return 8;
            case "FAIL_DELETE": return 9;
            case "INVALID_TOKEN": return 10;
            case "INVALID_REQUEST": return 11;
            case "UNKNOWN_ERROR": return 12;
            case "UNKNOWN_STATUS": return 13;
        }
    }
    return 0;
}


/**
 * Read a system log by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogId} request system log id: timestamp, device_id
 * @returns {Promise<LogSchema>} system log schema: timestamp, device_id, status, value
 */
export async function read_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logId = new pb_log.LogId();
    logId.setTimestamp(request.timestamp.valueOf() * 1000);
    logId.setDeviceId(uuid_hex_to_base64(request.device_id));
    return client.readLog(logId, metadata(server))
        .then(response => get_log_schema(response.toObject().result));
}

/**
 * Read system logs by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogTime} request system log time: timestamp, device_id, status
 * @returns {Promise<LogSchema[]>} system log schema: timestamp, device_id, status, value
 */
export async function list_log_by_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logTime = new pb_log.LogTime();
    logTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        logTime.setStatus(request.status);
    }
    return client.listLogByTime(logTime, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogTime} request system log last time: timestamp, device_id, status
 * @returns {Promise<LogSchema[]>} system log schema: timestamp, device_id, status, value
 */
export async function list_log_by_last_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logTime = new pb_log.LogTime();
    logTime.setTimestamp(request.timestamp.valueOf() * 1000);
    if (request.device_id) {
        logTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        logTime.setStatus(request.status);
    }
    return client.listLogByLastTime(logTime, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Read system logs by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogRange} request system log time: begin, end, device_id, status
 * @returns {Promise<LogSchema[]>} system log schema: timestamp, device_id, status, value
 */
export async function list_log_by_range_time(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logRange = new pb_log.LogRange();
    logRange.setBegin(request.begin.valueOf() * 1000);
    logRange.setEnd(request.end.valueOf() * 1000);
    if (request.device_id) {
        logRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (typeof request.status == "number" || typeof request.status == "string") {
        logRange.setStatus(request.status);
    }
    return client.listLogByRangeTime(logRange, metadata(server))
        .then(response => get_log_schema_vec(response.toObject().resultsList));
}

/**
 * Create a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogSchema} request system log schema: timestamp, device_id, status, value
 * @returns {Promise<{}>} create response
 */
export async function create_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logSchema = new pb_log.LogSchema();
    logSchema.setTimestamp(request.timestamp.valueOf() * 1000);
    logSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    logSchema.setStatus(set_log_status(request.status));
    const value = set_data_value([request.value]);
    logSchema.setLogBytes(value.bytes);
    logSchema.setLogType(value.types[0]);
    return client.createLog(logSchema, metadata(server))
        .then(response => response.toObject());
}

/**
 * Update a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogUpdate} request system log id: timestamp, device_id, status, value
 * @returns {Promise<{}>} update response
 */
export async function update_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logUpdate = new pb_log.LogUpdate();
    logUpdate.setTimestamp(request.timestamp.valueOf() * 1000);
    logUpdate.setDeviceId(uuid_hex_to_base64(request.device_id));
    if (typeof request.status == "number" || typeof request.status == "string") {
        logUpdate.setStatus(set_log_status(request.status));
    }
    const value = set_data_value([request.value]);
    logUpdate.setLogBytes(value.bytes);
    logUpdate.setLogType(value.types[0]);
    return client.updateLog(logUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a system log
 * @param {ServerConfig} server server configuration: address, token
 * @param {LogId} request system log id: timestamp, device_id
 * @returns {Promise<{}>} delete response
 */
export async function delete_log(server, request) {
    const client = new pb_log.LogServicePromiseClient(server.address, null, null);
    const logId = new pb_log.LogId();
    logId.setTimestamp(request.timestamp.valueOf() * 1000);
    logId.setDeviceId(uuid_hex_to_base64(request.device_id));
    return client.deleteLog(logId, metadata(server))
        .then(response => response.toObject());
}
