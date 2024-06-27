import { get_data_value, set_data_value } from './common.js';
import { pb_data } from 'rmcs-resource-api';
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
 * @typedef {Object} DataId
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DataTime
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DataRange
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} begin
 * @property {Date} end
 */

/**
 * @typedef {Object} DataNumber
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {number} number
 */

/**
 * @typedef {Object} DataSchema
 * @property {Uuid} model_id
 * @property {Uuid} device_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|boolean)[]} data
 */

/**
 * @param {*} r 
 * @returns {DataSchema}
 */
function get_data_schema(r) {
    return {
        device_id: base64_to_uuid_hex(r.deviceId),
        model_id: base64_to_uuid_hex(r.modelId),
        timestamp: new Date(r.timestamp / 1000),
        data: get_data_value(r.dataBytes, r.dataTypeList)
    };
}

/**
 * @param {*} r 
 * @returns {DataSchema[]}
 */
function get_data_schema_vec(r) {
    return r.map((v) => {return get_data_schema(v)});
}


/**
 * Read a data by id
 * @param {ServerConfig} server Server configuration
 * @param {DataId} request data id: device_id, model_id, timestamp
 * @param {function(?grpc.web.RpcError, ?DataSchema)} callback The callback function(error, response)
 */
export async function read_data(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataId = new pb_data.DataId();
    dataId.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataId.setModelId(uuid_hex_to_base64(request.model_id));
    dataId.setTimestamp(request.timestamp.valueOf() * 1000);
    await client.readData(dataId, metadata(server), (e, r) => {
        const response = r ? get_data_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read multiple data by specific time
 * @param {ServerConfig} server Server configuration
 * @param {DataTime} request data time: device_id, model_id, timestamp
 * @param {function(?grpc.web.RpcError, ?DataSchema[])} callback The callback function(error, response)
 */
export async function list_data_by_time(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    await client.listDataByTime(dataTime, metadata(server), (e, r) => {
        const response = r ? get_data_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read multiple data by last time
 * @param {ServerConfig} server Server configuration
 * @param {DataTime} request data time: device_id, model_id, timestamp
 * @param {function(?grpc.web.RpcError, ?DataSchema[])} callback The callback function(error, response)
 */
export async function list_data_by_last_time(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    await client.listDataByLastTime(dataTime, metadata(server), (e, r) => {
        const response = r ? get_data_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read multiple data by range time
 * @param {ServerConfig} server Server configuration
 * @param {DataRange} request data range: device_id, model_id, begin, end
 * @param {function(?grpc.web.RpcError, ?DataSchema[])} callback The callback function(error, response)
 */
export async function list_data_by_range_time(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataRange = new pb_data.DataRange();
    dataRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataRange.setModelId(uuid_hex_to_base64(request.model_id));
    dataRange.setBegin(request.begin.valueOf() * 1000);
    dataRange.setEnd(request.end.valueOf() * 1000);
    await client.listDataByRangeTime(dataRange, metadata(server), (e, r) => {
        const response = r ? get_data_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read multiple data by specific time and number before
 * @param {ServerConfig} server Server configuration
 * @param {DataNumber} request data time and number: device_id, model_id, timestamp, number
 * @param {function(?grpc.web.RpcError, ?DataSchema[])} callback The callback function(error, response)
 */
export async function list_data_by_number_before(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataNumber = new pb_data.DataNumber();
    dataNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataNumber.setModelId(uuid_hex_to_base64(request.model_id));
    dataNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataNumber.setNumber(request.number);
    await client.listDataByNumberBefore(dataNumber, metadata(server), (e, r) => {
        const response = r ? get_data_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read multiple data by specific time and number after
 * @param {ServerConfig} server Server configuration
 * @param {DataNumber} request data time and number: device_id, model_id, timestamp, number
 * @param {function(?grpc.web.RpcError, ?DataSchema[])} callback The callback function(error, response)
 */
export async function list_data_by_number_after(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataNumber = new pb_data.DataNumber();
    dataNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataNumber.setModelId(uuid_hex_to_base64(request.model_id));
    dataNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataNumber.setNumber(request.number);
    await client.listDataByNumberAfter(dataNumber, metadata(server), (e, r) => {
        const response = r ? get_data_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a data
 * @param {ServerConfig} server Server configuration
 * @param {DataSchema} request data schema: device_id, model_id, timestamp, data
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function create_data(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataSchema = new pb_data.DataSchema();
    dataSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataSchema.setModelId(uuid_hex_to_base64(request.model_id));
    dataSchema.setTimestamp(request.timestamp.valueOf() * 1000);
    const value = set_data_value(request.data);
    dataSchema.setDataBytes(value.bytes);
    for (const type of value.types) {
        dataSchema.addDataType(type);
    }
    await client.createData(dataSchema, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete a data
 * @param {ServerConfig} server Server configuration
 * @param {DataId} request data id: device_id, model_id, timestamp
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_data(server, request, callback) {
    const client = new pb_data.DataServiceClient(server.address, null, null);
    const dataId = new pb_data.DataId();
    dataId.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataId.setModelId(uuid_hex_to_base64(request.model_id));
    dataId.setTimestamp(request.timestamp.valueOf() * 1000);
    await client.deleteData(dataId, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}
