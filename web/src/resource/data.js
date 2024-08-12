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
 * @typedef {Object} DataCount
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {?Date} timestamp
 * @property {?Date} begin
 * @property {?Date} end
 */

/**
 * @typedef {Object} DataCountResult
 * @property {number} count
 */

/**
 * @typedef {Object} DataSchema
 * @property {Uuid} model_id
 * @property {Uuid} device_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|Uint8Array|boolean)[]} data
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
 * @typedef {Object} DatasetId
 * @property {Uuid} set_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DatasetTime
 * @property {Uuid} set_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DatasetRange
 * @property {Uuid} set_id
 * @property {Date} begin
 * @property {Date} end
 */

/**
 * @typedef {Object} DatasetNumber
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {number} number
 */

/**
 * @typedef {Object} DatasetSchema
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|Uint8Array|boolean)[]} data
 */

/**
 * @param {*} r 
 * @returns {DatasetSchema}
 */
function get_data_set_schema(r) {
    return {
        set_id: base64_to_uuid_hex(r.set_id),
        timestamp: new Date(r.timestamp / 1000),
        data: get_data_value(r.dataBytes, r.dataTypeList)
    };
}

/**
 * @param {*} r 
 * @returns {DatasetSchema[]}
 */
function get_data_set_schema_vec(r) {
    return r.map((v) => {return get_data_set_schema(v)});
}


/**
 * Read a data by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataId} request data id: device_id, model_id, timestamp
 * @returns {Promise<DataSchema>} data schema: device_id, model_id, timestamp, data
 */
export async function read_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataId = new pb_data.DataId();
    dataId.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataId.setModelId(uuid_hex_to_base64(request.model_id));
    dataId.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.readData(dataId, metadata(server))
        .then(response => get_data_schema(response.toObject().result));
}

/**
 * Read multiple data by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data time: device_id, model_id, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataByTime(dataTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data time: device_id, model_id, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataByLastTime(dataTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataRange} request data range: device_id, model_id, begin, end
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataRange = new pb_data.DataRange();
    dataRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataRange.setModelId(uuid_hex_to_base64(request.model_id));
    dataRange.setBegin(request.begin.valueOf() * 1000);
    dataRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataByRangeTime(dataRange, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataNumber} request data time and number: device_id, model_id, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataNumber = new pb_data.DataNumber();
    dataNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataNumber.setModelId(uuid_hex_to_base64(request.model_id));
    dataNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataNumber.setNumber(request.number);
    return client.listDataByNumberBefore(dataNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataNumber} request data time and number: device_id, model_id, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataNumber = new pb_data.DataNumber();
    dataNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataNumber.setModelId(uuid_hex_to_base64(request.model_id));
    dataNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataNumber.setNumber(request.number);
    return client.listDataByNumberAfter(dataNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Create a data
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSchema} request data schema: device_id, model_id, timestamp, data
 * @returns {Promise<{}>} create response
 */
export async function create_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSchema = new pb_data.DataSchema();
    dataSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataSchema.setModelId(uuid_hex_to_base64(request.model_id));
    dataSchema.setTimestamp(request.timestamp.valueOf() * 1000);
    const value = set_data_value(request.data);
    dataSchema.setDataBytes(value.bytes);
    for (const type of value.types) {
        dataSchema.addDataType(type);
    }
    return client.createData(dataSchema, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a data
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataId} request data id: device_id, model_id, timestamp
 * @returns {Promise<{}>} delete response
 */
export async function delete_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataId = new pb_data.DataId();
    dataId.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataId.setModelId(uuid_hex_to_base64(request.model_id));
    dataId.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.deleteData(dataId, metadata(server))
        .then(response => response.toObject());
}

/**
 * Count data
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataCount} request data count: device_id, model_id
 * @returns {Promise<DataCountResult>} data count: count
 */
export async function count_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataCount = new pb_data.DataCount();
    dataCount.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataCount.setModelId(uuid_hex_to_base64(request.model_id));
    return client.countData(dataCount, metadata(server))
        .then(response => response.toObject());
}

/**
 * Count data by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataCount} request data count: device_id, model_id, timestamp
 * @returns {Promise<DataCountResult>} data count: count
 */
export async function count_data_by_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataCount = new pb_data.DataCount();
    dataCount.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataCount.setModelId(uuid_hex_to_base64(request.model_id));
    if (request.timestamp) {
        dataCount.setTimestamp(request.timestamp.valueOf() * 1000);
    }
    return client.countDataByLastTime(dataCount, metadata(server))
        .then(response => response.toObject());
}

/**
 * Count data by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataCount} request data count: device_id, model_id, begin, end
 * @returns {Promise<DataCountResult>} data count: count
 */
export async function count_data_by_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataCount = new pb_data.DataCount();
    dataCount.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataCount.setModelId(uuid_hex_to_base64(request.model_id));
    if (request.begin) {
        dataCount.setTimestamp(request.begin.valueOf() * 1000);
    }
    if (request.end) {
        dataCount.setTimestamp(request.end.valueOf() * 1000);
    }
    return client.countDataByRangeTime(dataCount, metadata(server))
        .then(response => response.toObject());
}

/**
 * Read multiple data by set uuid and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetTime} request dataset time: set_id, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetTime = new pb_data.DataSetTime();
    datasetTime.setSetId(uuid_hex_to_base64(request.set_id));
    datasetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataBySetTime(datasetTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetTime} request dataset time: set_id, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetTime = new pb_data.DataSetTime();
    datasetTime.setSetId(uuid_hex_to_base64(request.set_id));
    datasetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataBySetLastTime(datasetTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetRange} request dataset range: set_id, begin, end
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetRange = new pb_data.DataSetRange();
    datasetRange.setSetId(uuid_hex_to_base64(request.set_id));
    datasetRange.setBegin(request.begin.valueOf() * 1000);
    datasetRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataBySetRangeTime(datasetRange, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetNumber = new pb_data.DataSetNumber();
    datasetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    datasetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    datasetNumber.setNumber(request.number);
    return client.listDataBySetNumberBefore(datasetNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetNumber = new pb_data.DataSetNumber();
    datasetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    datasetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    datasetNumber.setNumber(request.number);
    return client.listDataBySetNumberAfter(datasetNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read a dataset by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetId} request dataset id: set_id, timestamp
 * @returns {Promise<DatasetSchema>} data schema: set_id, timestamp, data
 */
export async function read_data_set(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataId = new pb_data.DataSetId();
    dataId.setSetId(uuid_hex_to_base64(request.set_id));
    dataId.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.readDataset(dataId, metadata(server))
        .then(response => get_data_set_schema(response.toObject().result));
}

/**
 * Read multiple dataset by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetTime} request dataset time: set_id, timestamp
 * @returns {Promise<DatasetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetTime = new pb_data.DataSetTime();
    datasetTime.setSetId(uuid_hex_to_base64(request.set_id));
    datasetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDatasetByTime(datasetTime, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetTime} request dataset time: set_id, timestamp
 * @returns {Promise<DatasetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetTime = new pb_data.DataSetTime();
    datasetTime.setSetId(uuid_hex_to_base64(request.set_id));
    datasetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDatasetByLastTime(datasetTime, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetRange} request dataset range: set_id, begin, end
 * @returns {Promise<DatasetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetRange = new pb_data.DataSetRange();
    datasetRange.setSetId(uuid_hex_to_base64(request.set_id));
    datasetRange.setBegin(request.begin.valueOf() * 1000);
    datasetRange.setEnd(request.end.valueOf() * 1000);
    return client.listDatasetByRangeTime(datasetRange, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DatasetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetNumber = new pb_data.DataSetNumber();
    datasetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    datasetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    datasetNumber.setNumber(request.number);
    return client.listDatasetByNumberBefore(datasetNumber, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DatasetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DatasetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetNumber = new pb_data.DataSetNumber();
    datasetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    datasetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    datasetNumber.setNumber(request.number);
    return client.listDatasetByNumberAfter(datasetNumber, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}
