import { get_data_values, set_data_values } from './common.js';
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
        data: get_data_values(r.dataBytes, r.dataTypeList)
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
 * @typedef {Object} DataIds
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DataIdsTime
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DataIdsRange
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} begin
 * @property {Date} end
 */

/**
 * @typedef {Object} DataIdsNumber
 * @property {Uuid[]} device_ids
 * @property {Uuid[]} model_ids
 * @property {Date} timestamp
 * @property {number} number
 */

/**
 * @typedef {Object} DataSetId
 * @property {Uuid} set_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DataSetTime
 * @property {Uuid} set_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DataSetRange
 * @property {Uuid} set_id
 * @property {Date} begin
 * @property {Date} end
 */

/**
 * @typedef {Object} DataSetNumber
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {number} number
 */

/**
 * @typedef {Object} DataSetSchema
 * @property {Uuid} set_id
 * @property {Date} timestamp
 * @property {(number|bigint|string|Uint8Array|boolean)[]} data
 */

/**
 * @param {*} r 
 * @returns {DataSetSchema}
 */
function get_data_set_schema(r) {
    return {
        set_id: base64_to_uuid_hex(r.setId),
        timestamp: new Date(r.timestamp / 1000),
        data: get_data_values(r.dataBytes, r.dataTypeList)
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
 * Read multiple data by uuid list and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsTime} request data id list and time: device_ids, model_ids, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_ids_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsTime = new pb_data.DataIdsTime();
    dataIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataByIdsTime(dataIdsTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsTime} request data id list and time: device_ids, model_ids, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_ids_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsTime = new pb_data.DataIdsTime();
    dataIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataByIdsLastTime(dataIdsTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsRange} request data id list and range: device_ids, model_ids, begin, end
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_ids_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsRange = new pb_data.DataIdsRange();
    dataIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setBegin(request.begin.valueOf() * 1000);
    dataIdsRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataByIdsRangeTime(dataIdsRange, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsNumber} request data id list, time and number: device_ids, model_ids, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_ids_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsNumber = new pb_data.DataIdsNumber();
    dataIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataIdsNumber.setNumber(request.number);
    return client.listDataByIdsNumberBefore(dataIdsNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by uuid list and specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetNumber} request data id list, time and number: device_ids, model_ids, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_ids_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsNumber = new pb_data.DataIdsNumber();
    dataIdsNumber.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataIdsNumber.setNumber(request.number);
    return client.listDataByIdsNumberAfter(dataIdsNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request dataset time: set_id, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetTime = new pb_data.DataSetTime();
    dataSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataBySetTime(dataSetTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request dataset time: set_id, timestamp
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetTime = new pb_data.DataSetTime();
    dataSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataBySetLastTime(dataSetTime, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetRange} request dataset range: set_id, begin, end
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetRange = new pb_data.DataSetRange();
    dataSetRange.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetRange.setBegin(request.begin.valueOf() * 1000);
    dataSetRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataBySetRangeTime(dataSetRange, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetNumber = new pb_data.DataSetNumber();
    dataSetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataSetNumber.setNumber(request.number);
    return client.listDataBySetNumberBefore(dataSetNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple data by set uuid and specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DataSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_by_set_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetNumber = new pb_data.DataSetNumber();
    dataSetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    dataSetNumber.setNumber(request.number);
    return client.listDataBySetNumberAfter(dataSetNumber, metadata(server))
        .then(response => get_data_schema_vec(response.toObject().resultsList));
}

/**
 * Read a dataset by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetId} request dataset id: set_id, timestamp
 * @returns {Promise<DataSetSchema>} data schema: set_id, timestamp, data
 */
export async function read_data_set(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetId = new pb_data.DataSetId();
    datasetId.setSetId(uuid_hex_to_base64(request.set_id));
    datasetId.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.readDataSet(datasetId, metadata(server))
        .then(response => get_data_set_schema(response.toObject().result));
}

/**
 * Read multiple dataset by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request dataset time: set_id, timestamp
 * @returns {Promise<DataSetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetTime = new pb_data.DataSetTime();
    datasetTime.setSetId(uuid_hex_to_base64(request.set_id));
    datasetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataSetByLastTime(datasetTime, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetRange} request dataset range: set_id, begin, end
 * @returns {Promise<DataSetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetRange = new pb_data.DataSetRange();
    datasetRange.setSetId(uuid_hex_to_base64(request.set_id));
    datasetRange.setBegin(request.begin.valueOf() * 1000);
    datasetRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataSetByRangeTime(datasetRange, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by specific time and number before
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DataSetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_number_before(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetNumber = new pb_data.DataSetNumber();
    datasetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    datasetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    datasetNumber.setNumber(request.number);
    return client.listDataSetByNumberBefore(datasetNumber, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read multiple dataset by specific time and number after
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetNumber} request dataset time and number: set_id, timestamp, number
 * @returns {Promise<DataSetSchema[]>} data schema: device_id, model_id, timestamp, data
 */
export async function list_data_set_by_number_after(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const datasetNumber = new pb_data.DataSetNumber();
    datasetNumber.setSetId(uuid_hex_to_base64(request.set_id));
    datasetNumber.setTimestamp(request.timestamp.valueOf() * 1000);
    datasetNumber.setNumber(request.number);
    return client.listDataSetByNumberAfter(datasetNumber, metadata(server))
        .then(response => get_data_set_schema_vec(response.toObject().resultsList));
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
    const value = set_data_values(request.data);
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
 * Read a data timestamp by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataId} request data id: device_id, model_id, timestamp
 * @returns {Promise<Date>} data timestamp
 */
export async function read_data_timestamp(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataId = new pb_data.DataId();
    dataId.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataId.setModelId(uuid_hex_to_base64(request.model_id));
    dataId.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.readDataTimestamp(dataId, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read multiple data timestamp by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data time: device_id, model_id, timestamp
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_timestamp_by_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataTimestampByLastTime(dataTime, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read multiple data timestamp by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataRange} request data range: device_id, model_id, begin, end
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_timestamp_by_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataRange = new pb_data.DataRange();
    dataRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataRange.setModelId(uuid_hex_to_base64(request.model_id));
    dataRange.setBegin(request.begin.valueOf() * 1000);
    dataRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataTimestampByRangeTime(dataRange, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read a data timestamp by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIds} request data id list: device_ids, model_ids, timestamp
 * @returns {Promise<Date>} data timestamp
 */
export async function read_data_timestamp_by_ids(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIds = new pb_data.DataIds();
    dataIds.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIds.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIds.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.readDataTimestampByIds(dataIds, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read multiple data timestamp by uuid list and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsTime} request data id list and time: device_ids, model_ids, timestamp
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_timestamp_by_ids_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsTime = new pb_data.DataIdsTime();
    dataIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataTimestampByIdsLastTime(dataIdsTime, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read multiple data timestamp by uuid list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsRange} request data id list and range: device_ids, model_ids, begin, end
 * @returns {Promise<Date[]>} data timestamp
 */
export async function list_data_timestamp_by_ids_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsRange = new pb_data.DataIdsRange();
    dataIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setBegin(request.begin.valueOf() * 1000);
    dataIdsRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataTimestampByIdsRangeTime(dataIdsRange, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read a data set timestamp by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetId} request data set id: set_id, timestamp
 * @returns {Promise<Date>} data set timestamp
 */
export async function read_data_timestamp_by_set(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetId = new pb_data.DataSetId();
    dataSetId.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetId.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.readDataTimestampBySet(dataSetId, metadata(server))
        .then(response => new Date(response.toObject().timestamp / 1000));
}

/**
 * Read multiple data set timestamp by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request data set time: set_id, timestamp
 * @returns {Promise<Date[]>} data set timestamp
 */
export async function list_data_timestamp_by_set_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetTime = new pb_data.DataSetTime();
    dataSetTime.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listDataTimestampBySetLastTime(dataSetTime, metadata(server))
        .then(response => response.toObject().timestampsList.map((v) => new Date(v / 1000)));
}

/**
 * Read multiple data set timestamp by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetRange} request data set range: set_id, begin, end
 * @returns {Promise<Date[]>} data set timestamp
 */
export async function list_data_timestamp_by_set_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetRange = new pb_data.DataSetRange();
    dataSetRange.setSetId(uuid_hex_to_base64(request.set_id));
    dataSetRange.setBegin(request.begin.valueOf() * 1000);
    dataSetRange.setEnd(request.end.valueOf() * 1000);
    return client.listDataTimestampBySetRangeTime(dataSetRange, metadata(server))
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
 * Count data by last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataTime} request data count: device_id, model_id, timestamp
 * @returns {Promise<number>} data count
 */
export async function count_data_by_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataTime = new pb_data.DataTime();
    dataTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataTime.setModelId(uuid_hex_to_base64(request.model_id));
    dataTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.countDataByLastTime(dataTime, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataRange} request data range: device_id, model_id, begin, end
 * @returns {Promise<number>} data count
 */
export async function count_data_by_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataRange = new pb_data.DataRange();
    dataRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    dataRange.setModelId(uuid_hex_to_base64(request.model_id));
    dataRange.setBegin(request.begin.valueOf() * 1000);
    dataRange.setEnd(request.end.valueOf() * 1000);
    return client.countDataByRangeTime(dataRange, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by id list
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsTime} request data id list and time: device_ids, model_ids, timestamp
 * @returns {Promise<number>} data count
 */
export async function count_data_by_ids(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsTime = new pb_data.DataIdsTime();
    dataIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    return client.countDataByIds(dataIdsTime, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by id list and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsTime} request data id list and time: device_ids, model_ids, timestamp
 * @returns {Promise<number>} data count
 */
export async function count_data_by_ids_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsTime = new pb_data.DataIdsTime();
    dataIdsTime.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.countDataByIdsLastTime(dataIdsTime, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by id list and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataIdsRange} request data id list and range: device_ids, model_ids, begin, end
 * @returns {Promise<number>} data count
 */
export async function count_data_by_ids_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataIdsRange = new pb_data.DataIdsRange();
    dataIdsRange.setDeviceIdsList(request.device_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setModelIdsList(request.model_ids.map((id) => uuid_hex_to_base64(id)));
    dataIdsRange.setBegin(request.begin.valueOf() * 1000);
    dataIdsRange.setEnd(request.end.valueOf() * 1000);
    return client.countDataByIdsRangeTime(dataIdsRange, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by set id
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request data set time: set_id, timestamp
 * @returns {Promise<number>} data count
 */
export async function count_data_by_set(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetTime = new pb_data.DataSetTime();
    dataSetTime.setSetId(uuid_hex_to_base64(request.device_id));
    return client.countDataBySet(dataSetTime, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by set id and last time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetTime} request data set time: set_id, timestamp
 * @returns {Promise<number>} data count
 */
export async function count_data_by_set_last_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetTime = new pb_data.DataSetTime();
    dataSetTime.setSetId(uuid_hex_to_base64(request.device_id));
    dataSetTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.countDataBySetLastTime(dataSetTime, metadata(server))
        .then(response => response.toObject().count);
}

/**
 * Count data by set id and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {DataSetRange} request data set range: set_id, begin, end
 * @returns {Promise<number>} data count
 */
export async function count_data_by_set_range_time(server, request) {
    const client = new pb_data.DataServicePromiseClient(server.address, null, null);
    const dataSetRange = new pb_data.DataSetRange();
    dataSetRange.setSetId(uuid_hex_to_base64(request.device_id));
    dataSetRange.setBegin(request.begin.valueOf() * 1000);
    dataSetRange.setEnd(request.end.valueOf() * 1000);
    return client.countDataBySetRangeTime(dataSetRange, metadata(server))
        .then(response => response.toObject().count);
}
