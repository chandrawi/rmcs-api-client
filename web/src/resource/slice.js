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
 * @typedef {Object} SliceTime
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} SliceRange
 * @property {Uuid} device_id
 * @property {Uuid} model_id
 * @property {Date} begin
 * @property {Date} end
 */

/**
 * @typedef {Object} SliceNameTime
 * @property {string} name
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} SliceNameRange
 * @property {string} name
 * @property {Date} begin
 * @property {Date} end
 */

/**
 * @typedef {Object} SliceOption
 * @property {?Uuid} device_id
 * @property {?Uuid} model_id
 * @property {?string} name
 * @property {?Date} begin_or_timestamp
 * @property {?Date} end
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
 * @typedef {Object} SliceSetTime
 * @property {Uuid} set_id
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} SliceSetRange
 * @property {Uuid} set_id
 * @property {Date} begin
 * @property {Date} end
 */

/**
 * @typedef {Object} SliceSetOption
 * @property {Uuid} set_id
 * @property {?string} name
 * @property {?Date} begin_or_timestamp
 * @property {?Date} end
 */

/**
 * @typedef {Object} SliceSetSchema
 * @property {number} id
 * @property {Uuid} set_id
 * @property {Date} timestamp_begin
 * @property {Date} timestamp_end
 * @property {string} name
 * @property {string} description
 */

/**
 * @param {*} r 
 * @returns {SliceSetSchema}
 */
function get_slice_set_schema(r) {
    return {
        id: r.id,
        set_id: base64_to_uuid_hex(r.setId),
        timestamp_begin: new Date(r.timestampBegin / 1000),
        timestamp_end: new Date(r.timestampEnd / 1000),
        name: r.name,
        description: r.description
    };
}

/**
 * @param {*} r 
 * @returns {SliceSetSchema[]}
 */
function get_slice_set_schema_vec(r) {
    return r.map((v) => {return get_slice_set_schema(v)});
}


/**
 * Read a data slice by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceId} request data slice id: id
 * @returns {Promise<SliceSchema>} data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 */
export async function read_slice(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceId = new pb_slice.SliceId();
    sliceId.setId(request.id);
    return client.readSlice(sliceId, metadata(server))
        .then(response => get_slice_schema(response.toObject().result));
}

/**
 * Read data slices by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceTime} request data slice time: device_id, model_id, timestamp
 * @returns {Promise<SliceSchema[]>} data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_by_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceTime = new pb_slice.SliceTime();
    sliceTime.setDeviceId(uuid_hex_to_base64(request.device_id));
    sliceTime.setModelId(uuid_hex_to_base64(request.model_id));
    sliceTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listSliceByTime(sliceTime, metadata(server))
        .then(response => get_slice_schema_vec(response.toObject().resultsList));
}

/**
 * Read data slices by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceRange} request data slice range: device_id, model_id, begin, end
 * @returns {Promise<SliceSchema[]>} data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_by_range_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceRange = new pb_slice.SliceRange();
    sliceRange.setDeviceId(uuid_hex_to_base64(request.device_id));
    sliceRange.setModelId(uuid_hex_to_base64(request.model_id));
    sliceRange.setBegin(request.begin.valueOf() * 1000);
    sliceRange.setEnd(request.end.valueOf() * 1000);
    return client.listSliceByRangeTime(sliceRange, metadata(server))
        .then(response => get_slice_schema_vec(response.toObject().resultsList));
}

/**
 * Read data slices by name and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceNameTime} request data slice name and time: name, timestamp
 * @returns {Promise<SliceSchema[]>} data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_by_name_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceNameTime = new pb_slice.SliceNameTime();
    sliceNameTime.setName(request.name);
    sliceNameTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listSliceByNameTime(sliceNameTime, metadata(server))
        .then(response => get_slice_schema_vec(response.toObject().resultsList));
}

/**
 * Read data slices by name and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceNameRange} request data slice name and range: name, begin, end
 * @returns {Promise<SliceSchema[]>} data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_by_name_range_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceNameRange = new pb_slice.SliceNameRange();
    sliceNameRange.setName(request.name);
    sliceNameRange.setBegin(request.begin.valueOf() * 1000);
    sliceNameRange.setEnd(request.end.valueOf() * 1000);
    return client.listSliceByNameRangeTime(sliceNameRange, metadata(server))
        .then(response => get_slice_schema_vec(response.toObject().resultsList));
}

/**
 * Read data slices by options
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceOption} request data slice selection option: device_id, model_id, name, begin_or_timestamp, end
 * @returns {Promise<SliceSchema[]>} data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_option(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceOption = new pb_slice.SliceOption();
    if (request.device_id) {
        sliceOption.setDeviceId(uuid_hex_to_base64(request.device_id));
    }
    if (request.model_id) {
        sliceOption.setModelId(uuid_hex_to_base64(request.model_id));
    }
    sliceOption.setName(request.name);
    if (request.begin instanceof Date) {
        sliceOption.setBegin(request.timestamp_begin.valueOf() * 1000);
    }
    if (request.end instanceof Date) {
        sliceOption.setEnd(request.timestamp_end.valueOf() * 1000);
    }
    return client.listSliceOption(sliceOption, metadata(server))
        .then(response => get_slice_schema_vec(response.toObject().resultsList));
}

/**
 * Create a data slice
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceSchema} request data slice schema: device_id, model_id, timestamp_begin, timestamp_end, name, description
 * @returns {Promise<SliceId>} data slice id: id
 */
export async function create_slice(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceSchema = new pb_slice.SliceSchema();
    sliceSchema.setDeviceId(uuid_hex_to_base64(request.device_id));
    sliceSchema.setModelId(uuid_hex_to_base64(request.model_id));
    sliceSchema.setTimestampBegin(request.timestamp_begin.valueOf() * 1000);
    sliceSchema.setTimestampEnd(request.timestamp_end.valueOf() * 1000);
    sliceSchema.setName(request.name);
    sliceSchema.setDescription(request.description);
    return client.createSlice(sliceSchema, metadata(server))
        .then(response => get_slice_id(response.toObject()));
}

/**
 * Update a data slice
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceUpdate} request data slice update: id, timestamp_begin, timestamp_end, name, description
 * @returns {Promise<{}>} update response
 */
export async function update_slice(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
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
    return client.updateSlice(sliceUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a data slice
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceId} request data slice id: id
 * @returns {Promise<{}>} delete response
 */
export async function delete_slice(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceId = new pb_slice.SliceId();
    sliceId.setId(request.id);
    return client.deleteSlice(sliceId, metadata(server))
        .then(response => response.toObject());
}

/**
 * Read a data set slice by id
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceId} request data set slice id: id
 * @returns {Promise<SliceSetSchema>} data set slice schema: set_id, timestamp_begin, timestamp_end, name, description
 */
export async function read_slice_set(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceId = new pb_slice.SliceId();
    sliceId.setId(request.id);
    return client.readSliceSet(sliceId, metadata(server))
        .then(response => get_slice_set_schema(response.toObject().result));
}

/**
 * Read data set slices by specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceSetTime} request data set slice time: set_id, timestamp
 * @returns {Promise<SliceSetSchema[]>} data set slice schema: set_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_set_by_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceTime = new pb_slice.SliceSetTime();
    sliceTime.setSetId(uuid_hex_to_base64(request.set_id));
    sliceTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listSliceSetByTime(sliceTime, metadata(server))
        .then(response => get_slice_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read data set slices by range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceSetRange} request data set slice range: set_id, begin, end
 * @returns {Promise<SliceSetSchema[]>} data set slice schema: set_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_set_by_range_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceRange = new pb_slice.SliceSetRange();
    sliceRange.setSetId(uuid_hex_to_base64(request.set_id));
    sliceRange.setBegin(request.begin.valueOf() * 1000);
    sliceRange.setEnd(request.end.valueOf() * 1000);
    return client.listSliceSetByRangeTime(sliceRange, metadata(server))
        .then(response => get_slice_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read data set slices by name and specific time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceNameTime} request data set slice name and time: name, timestamp
 * @returns {Promise<SliceSetSchema[]>} data slice schema: set_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_set_by_name_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceNameTime = new pb_slice.SliceNameTime();
    sliceNameTime.setName(request.name);
    sliceNameTime.setTimestamp(request.timestamp.valueOf() * 1000);
    return client.listSliceSetByNameTime(sliceNameTime, metadata(server))
        .then(response => get_slice_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read data set slices by name and range time
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceNameRange} request data set slice name and range: name, begin, end
 * @returns {Promise<SliceSetSchema[]>} data set slice schema: set_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_set_by_name_range_time(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceNameRange = new pb_slice.SliceNameRange();
    sliceNameRange.setName(request.name);
    sliceNameRange.setBegin(request.begin.valueOf() * 1000);
    sliceNameRange.setEnd(request.end.valueOf() * 1000);
    return client.listSliceSetByNameRangeTime(sliceNameRange, metadata(server))
        .then(response => get_slice_set_schema_vec(response.toObject().resultsList));
}

/**
 * Read data set slices by options
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceSetOption} request data set slice selection option: set_id, name, begin_or_timestamp, end
 * @returns {Promise<SliceSetSchema[]>} data set slice schema: set_id, timestamp_begin, timestamp_end, name, description
 */
export async function list_slice_set_option(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceOption = new pb_slice.SliceSetOption();
    if (request.set_id) {
        sliceOption.setSetId(uuid_hex_to_base64(request.set_id));
    }
    sliceOption.setName(request.name);
    if (request.begin instanceof Date) {
        sliceOption.setBegin(request.timestamp_begin.valueOf() * 1000);
    }
    if (request.end instanceof Date) {
        sliceOption.setEnd(request.timestamp_end.valueOf() * 1000);
    }
    return client.listSliceSetOption(sliceOption, metadata(server))
        .then(response => get_slice_set_schema_vec(response.toObject().resultsList));
}

/**
 * Create a data set slice
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceSetSchema} request data set slice schema: set_id, timestamp_begin, timestamp_end, name, description
 * @returns {Promise<SliceId>} data set slice id: id
 */
export async function create_slice_set(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceSchema = new pb_slice.SliceSetSchema();
    sliceSchema.setSetId(uuid_hex_to_base64(request.set_id));
    sliceSchema.setTimestampBegin(request.timestamp_begin.valueOf() * 1000);
    sliceSchema.setTimestampEnd(request.timestamp_end.valueOf() * 1000);
    sliceSchema.setName(request.name);
    sliceSchema.setDescription(request.description);
    return client.createSliceSet(sliceSchema, metadata(server))
        .then(response => get_slice_id(response.toObject()));
}

/**
 * Update a data set slice
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceUpdate} request data set slice update: id, timestamp_begin, timestamp_end, name, description
 * @returns {Promise<{}>} update response
 */
export async function update_slice_set(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
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
    return client.updateSliceSet(sliceUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a data set slice
 * @param {ServerConfig} server server configuration: address, token
 * @param {SliceId} request data set slice id: id
 * @returns {Promise<{}>} delete response
 */
export async function delete_slice_set(server, request) {
    const client = new pb_slice.SliceServicePromiseClient(server.address, null, null);
    const sliceId = new pb_slice.SliceId();
    sliceId.setId(request.id);
    return client.deleteSliceSet(sliceId, metadata(server))
        .then(response => response.toObject());
}
