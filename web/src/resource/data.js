import { get_data_values, set_data_values, Tag } from './common.js';
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
 * @typedef {Object} DataTime
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataLatest
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} latest
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataRange
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} begin
 * @property {Date} end
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataNumber
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 * @property {number} number
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataSchema
 * @property {Uuid} model_id
 * @property {Uuid} device_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|Uint8Array|boolean)[]} data
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataMultipleSchema
 * @property {Uuid[]} model_ids
 * @property {Uuid[]} device_ids
 * @property {Date[]} timestamps
 * @property {(number|bigint|string|Uint8Array|boolean)[][]} data
 * @property {?number[]} tags
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
        data: get_data_values(r.dataBytes, r.dataTypeList),
        tag: r.tag ?? Tag.DEFAULT
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
 * @typedef {Object} DataGroupTime
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataGroupLatest
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} latest
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataGroupRange
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} begin
 * @property {Date} end
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataGroupNumber
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 * @property {number} number
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataSetTime
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataSetLatest
 * @property {Uuid} set_id
 * @property {Date} latest
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataSetRange
 * @property {Uuid} set_id
 * @property {Date} begin
 * @property {Date} end
 * @property {?number} tag
 */

/**
 * @typedef {Object} DataSetSchema
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|Uint8Array|boolean)[]} data
 * @property {?number} tag
 */

/**
 * @param {*} r 
 * @returns {DataSetSchema}
 */
function get_data_set_schema(r) {
    return {
        set_id: base64_to_uuid_hex(r.setId),
        timestamp: new Date(r.timestamp / 1000),
        data: get_data_values(r.dataBytes, r.dataTypeList),
        tag: r.tag ?? Tag.DEFAULT
    };
}

/**
 * @param {*} r 
 * @returns {DataSetSchema[]}
 */
function get_data_set_schema_vec(r) {
    return r.map((v) => {return get_data_set_schema(v)});
}


/**
 * Read a data by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data time: device_id, model_id, timestamp, tag
 * @returns {Promise<DataSchema>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function read_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    dataTime.setTag(request.tag);
    return client.readData(dataTime, metadata(server))
        .then(response => get_data_schema(response.toObject().result));
}

/**
 * Read multiple data by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data time: device_id, model_id, timestamp, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_by_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    dataTime.setTag(request.tag);
    return client.listDataByTime(dataTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataLatest} request data latest: device_id, model_id, latest, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_by_latest(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataLatest = new pb_data.DataLatest();
    dataLatest.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataLatest.setModelId(uuid_hex_to_base64(request.model_id));
    dataLatest.setLatest(request.latest.valueOf() * 1000);
    dataLatest.setTag(request.tag);
    return client.listDataByLatest(dataLatest, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataRange} request data range: device_id, model_id, begin, end, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_by_range(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataRange = new pb_data.DataRange();
    dataRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataRange.setModelId(uuid_hex_to_base64(request.model_id));
    dataRange.setBegin(request.begin.valueOf() * 1000);
    dataRange.setEnd(request.end.valueOf() * 1000);
    dataRange.setTag(request.tag);
    return client.listDataByRange(dataRange, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataNumber} request data time and number: device_id, model_id, timestamp, number, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_by_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataNumber = new pb_data.DataNumber();
    dataNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataNumber.setModelId(uuid_hex_to_base64(request.model_id));
    dataNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataNumber.setNumber(request.number);
    dataNumber.setTag(request.tag);
    return client.listDataByNumberBefore(dataNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataNumber} request data time and number: device_id, model_id, timestamp, number, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_by_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataNumber = new pb_data.DataNumber();
    dataNumber.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataNumber.setModelId(uuid_hex_to_base64(request.model_id));
    dataNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataNumber.setNumber(request.number);
    dataNumber.setTag(request.tag);
    return client.listDataByNumberAfter(dataNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupTime} request data id list and time: device_ids, model_ids, timestamp, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_group_by_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsTime = new pb_data.DataGroupTime();
    dataIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    dataIdsTime.setTag(request.tag);
    return client.listDataGroupByTime(dataIdsTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupLatest} request data id list and time: device_ids, model_ids, latest, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_group_by_latest(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataGroupLatest = new pb_data.DataGroupLatest();
    dataGroupLatest.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupLatest.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupLatest.setLatest(request.latest.valueOf() * 1000);
    dataGroupLatest.setTag(request.tag);
    return client.listDataGroupByLatest(dataGroupLatest, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupRange} request data id list and range: device_ids, model_ids, begin, end, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_group_by_range(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsRange = new pb_data.DataGroupRange();
    dataIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setBegin(request.begin.valueOf() * 1000);
    dataIdsRange.setEnd(request.end.valueOf() * 1000);
    dataIdsRange.setTag(request.tag);
    return client.listDataGroupByRange(dataIdsRange, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupNumber} request data id list, time and number: device_ids, model_ids, timestamp, number, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_group_by_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsNumber = new pb_data.DataGroupNumber();
    dataIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataIdsNumber.setNumber(request.number);
    dataIdsNumber.setTag(request.tag);
    return client.listDataGroupByNumberBefore(dataIdsNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupNumber} request data id list, time and number: device_ids, model_ids, timestamp, number, tag
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data, tag
 */
export async function list_data_group_by_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsNumber = new pb_data.DataGroupNumber();
    dataIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataIdsNumber.setNumber(request.number);
    dataIdsNumber.setTag(request.tag);
    return client.listDataGroupByNumberAfter(dataIdsNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read a dataset by time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request dataset time: set_id, timestamp, tag
 * @returns {Promise<DataSetSchema>} data set schema: set_id, timestamp, data, tag
 */
export async function read_data_set(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetTime = new pb_data.DataSetTime();
    dataSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    dataSetTime.setTag(request.tag);
    return client.readDataSet(dataSetTime, metadata(server))
        .then(response => get_data_set_schema(response.toObject().result));
}

/**
 * Read multiple dataset by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request dataset time: set_id, timestamp, tag
 * @returns {Promise<DataSetSchema[]>} data set schema: set_id, timestamp, data, tag
 */
export async function list_data_set_by_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetTime = new pb_data.DataSetTime();
    datasetTime.setSetId(uuid_hex_to_base64(request.set_id));
    datasetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    datasetTime.setTag(request.tag);
    return client.listDataSetByTime(datasetTime, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetLatest} request dataset latest: set_id, latest, tag
 * @returns {Promise<DataSetSchema[]>} data set schema: set_id, timestamp, data, tag
 */
export async function list_data_set_by_latest(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetLatest = new pb_data.DataSetLatest();
    dataSetLatest.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetLatest.setLatest(request.latest.valueOf() * 1000);
    dataSetLatest.setTag(request.tag);
    return client.listDataSetByLatest(dataSetLatest, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetRange} request dataset range: set_id, begin, end, tag
 * @returns {Promise<DataSetSchema[]>} data set schema: set_id, timestamp, data, tag
 */
export async function list_data_set_by_range(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetRange = new pb_data.DataSetRange();
    datasetRange.setSetId(uuid_hex_to_base64(request.set_id));
    datasetRange.setBegin(request.begin.valueOf() * 1000);
    datasetRange.setEnd(request.end.valueOf() * 1000);
    datasetRange.setTag(request.tag);
    return client.listDataSetByRange(datasetRange, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Create a data
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSchema} request data schema: device_id, model_id, timestamp, data, tag
 * @returns {Promise<{}>} create response
 */
export async function create_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSchema = new pb_data.DataSchema();
    dataSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataSchema.setModelId(uuid_hex_to_base64(request.model_id));
    dataSchema.setTimestamp(request.timestamp.valueOf() * 1000);
    const value = set_data_values(request.data);
    dataSchema.setDataBytes(value.bytes);
    dataSchema.setTag(request.tag ?? Tag.DEFAULT);
    for (const type of value.types) {
        dataSchema.addDataType(type);
    }
    return client.createData(dataSchema, metadata(server))
        .then(response => response.toObject());
}

/**
 * Create multiple data
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataMultipleSchema} request data multiple schema: device_ids, model_ids, timestamps, data, tags
 * @returns {Promise<{}>} create response
 */
export async function create_data_multiple(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataMultiSchema = new pb_data.DataMultipleSchema();
    const number = request.device_ids.length;
    const tags = request.tags ?? Array(number).fill(Tag.DEFAULT);
    const lengths = [request.model_ids.length, request.timestamps.length, request.data.length, tags.length];
    if (lengths.some(length => length != number)) {
        throw new Error("INVALID_ARGUMENT");
    }
    for (let i=0; i<number; i++) {
        const dataSchema = new pb_data.DataSchema();
        dataSchema.setDeviceId(uuid_hex_to_base64(request.device_ids[i]));
        dataSchema.setModelId(uuid_hex_to_base64(request.model_ids[i]));
        dataSchema.setTimestamp(request.timestamps[i].valueOf() * 1000);
        const value = set_data_values(request.data[i]);
        dataSchema.setDataBytes(value.bytes);
        for (const type of value.types) {
            dataSchema.addDataType(type);
        }
        dataSchema.setTag(tags[i] ?? Tag.DEFAULT);
        dataMultiSchema.addSchemas(dataSchema);
    }
    return client.createDataMultiple(dataMultiSchema, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a data
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data time: device_id, model_id, timestamp, tag
 * @returns {Promise<{}>} delete response
 */
export async function delete_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    dataTime.setTag(request.tag);
    return client.deleteData(dataTime, metadata(server))
        .then(response => response.toObject());
}

/**
 * Read a data timestamp by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data time: device_id, model_id, timestamp, tag
 * @returns {Promise<Date>} data timestamp
 */
export async function read_data_timestamp(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    dataTime.setTag(request.tag);
    return client.readDataTimestamp(dataTime, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read multiple data timestamp by latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataLatest} request data latest: device_id, model_id, latest, tag
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_timestamp_by_latest(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataLatest = new pb_data.DataLatest();
    dataLatest.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataLatest.setModelId(uuid_hex_to_base64(request.model_id));
    dataLatest.setLatest(request.latest.valueOf() * 1000);
    dataLatest.setTag(request.tag);
    return client.listDataTimestampByLatest(dataLatest, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read multiple data timestamp by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataRange} request data range: device_id, model_id, begin, end, tag
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_timestamp_by_range(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataRange = new pb_data.DataRange();
    dataRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataRange.setModelId(uuid_hex_to_base64(request.model_id));
    dataRange.setBegin(request.begin.valueOf() * 1000);
    dataRange.setEnd(request.end.valueOf() * 1000);
    dataRange.setTag(request.tag);
    return client.listDataTimestampByRange(dataRange, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read a data timestamp by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupTime} request data id list and time: device_ids, model_ids, timestamp, tag
 * @returns {Promise<Date>} data timestamp
 */
export async function read_data_group_timestamp(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataGroupTime = new pb_data.DataGroupTime();
    dataGroupTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupTime.setTimestamp(request.timestamp.valueOf() * 1000);
    dataGroupTime.setTag(request.tag);
    return client.readDataGroupTimestamp(dataGroupTime, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read multiple data timestamp by uuid list and latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupLatest} request data id list and latest: device_ids, model_ids, latest, tag
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_group_timestamp_by_latest(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataGroupLatest = new pb_data.DataGroupLatest();
    dataGroupLatest.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupLatest.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupLatest.setLatest(request.latest.valueOf() * 1000);
    dataGroupLatest.setTag(request.tag);
    return client.listDataGroupTimestampByLatest(dataGroupLatest, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read multiple data timestamp by uuid list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupRange} request data id list and range: device_ids, model_ids, begin, end, tag
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_group_timestamp_by_range(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsRange = new pb_data.DataGroupRange();
    dataIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setBegin(request.begin.valueOf() * 1000);
    dataIdsRange.setEnd(request.end.valueOf() * 1000);
    dataIdsRange.setTag(request.tag);
    return client.listDataGroupTimestampByRange(dataIdsRange, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Count data
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data count: device_id, model_id
 * @returns {Promise<number>} data count
 */
export async function count_data(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    return client.countData(dataTime, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataLatest} request data latest: device_id, model_id, latest, tag
 * @returns {Promise<number>} data count
 */
export async function count_data_by_latest(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataLatest = new pb_data.DataLatest();
    dataLatest.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataLatest.setModelId(uuid_hex_to_base64(request.model_id));
    dataLatest.setLatest(request.latest.valueOf() * 1000);
    dataLatest.setTag(request.tag);
    return client.countDataByLatest(dataLatest, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataRange} request data range: device_id, model_id, begin, end, tag
 * @returns {Promise<number>} data count
 */
export async function count_data_by_range(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataRange = new pb_data.DataRange();
    dataRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataRange.setModelId(uuid_hex_to_base64(request.model_id));
    dataRange.setBegin(request.begin.valueOf() * 1000);
    dataRange.setEnd(request.end.valueOf() * 1000);
    dataRange.setTag(request.tag);
    return client.countDataByRange(dataRange, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by id list
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupTime} request data id list and time: device_ids, model_ids, timestamp, tag
 * @returns {Promise<number>} data count
 */
export async function count_data_group(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsTime = new pb_data.DataGroupTime();
    dataIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setTag(request.tag);
    return client.countDataGroup(dataIdsTime, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by id list and latest time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupLatest} request data id list and latest: device_ids, model_ids, latest, tag
 * @returns {Promise<number>} data count
 */
export async function count_data_group_by_latest(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataGroupLatest = new pb_data.DataGroupLatest();
    dataGroupLatest.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupLatest.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataGroupLatest.setLatest(request.latest.valueOf() * 1000);
    dataGroupLatest.setTag(request.tag);
    return client.countDataGroupByLatest(dataGroupLatest, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by id list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataGroupRange} request data id list and range: device_ids, model_ids, begin, end, tag
 * @returns {Promise<number>} data count
 */
export async function count_data_group_by_range(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsRange = new pb_data.DataGroupRange();
    dataIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setBegin(request.begin.valueOf() * 1000);
    dataIdsRange.setEnd(request.end.valueOf() * 1000);
    dataIdsRange.setTag(request.tag);
    return client.countDataGroupByRange(dataIdsRange, metadata(server))
        .then(response => response.toObject().count);
}
