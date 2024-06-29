import { get_config_value, set_config_value, get_data_type, set_data_type } from './common.js';
import { pb_model } from 'rmcs-resource-api';
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
 * @typedef {Object} ModelId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {ModelId}
 */
function get_model_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    };
}

/**
 * @typedef {Object} ModelName
 * @property {string} name
 */

/**
 * @typedef {Object} ModelCategory
 * @property {string} category
 */

/**
 * @typedef {Object} ModelNameCategory
 * @property {string} name
 * @property {string} category
 */

/**
 * @typedef {Object} TypeId
 * @property {Uuid} id
 */

/**
 * @typedef {Object} ModelSchema
 * @property {Uuid} id
 * @property {string} category
 * @property {string} name
 * @property {string} description
 * @property {number[]|string[]} data_type
 * @property {ModelConfigSchema[][]} configs
 */

/**
 * @param {*} r 
 * @returns {ModelSchema}
 */
function get_model_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        category: r.category,
        name: r.name,
        description: r.description,
        data_type: r.dataTypeList.map((v) => { return get_data_type(v) }),
        configs: r.configsList.map((v) => { return get_model_config_schema_vec(v.configsList) })
    };
}

/**
 * @param {*} r 
 * @returns {ModelSchema[]}
 */
function get_model_schema_vec(r) {
    return r.map((v) => {return get_model_schema(v)});
}

/**
 * @typedef {Object} ModelUpdate
 * @property {Uuid} id
 * @property {?string} category
 * @property {?string} name
 * @property {?string} description
 * @property {?number[]|string[]} data_type
 */

/**
 * @typedef {Object} ModelConfigId
 * @property {number} id
 */

/**
 * @param {*} r 
 * @returns {ModelConfigId}
 */
function get_model_config_id(r) {
    return {
        id: r.id
    };
}

/**
 * @typedef {Object} ModelConfigSchema
 * @property {number} id
 * @property {Uuid} model_id
 * @property {number} index
 * @property {string} name
 * @property {number|string} value
 * @property {string} category
 */

/**
 * @param {*} r 
 * @returns {ModelConfigSchema}
 */
function get_model_config_schema(r) {
    return {
        id: r.id,
        model_id: base64_to_uuid_hex(r.modelId),
        index: r.index,
        name: r.name,
        value: get_config_value(r.configBytes, r.configType),
        category: r.category
    };
}

/**
 * @param {*} r 
 * @returns {ModelConfigSchema[]}
 */
function get_model_config_schema_vec(r) {
    return r.map((v) => {return get_model_config_schema(v)});
}

/**
 * @typedef {Object} ModelConfigUpdate
 * @property {number} id
 * @property {?string} name
 * @property {?number|string} value
 * @property {?string} category
 */


/**
 * Read a model by uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelId} request model uuid: id
 * @returns {Promise<ModelSchema>} model schema: id, category, name, description, data_type, configs
 */
export async function read_model(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelId = new pb_model.ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    return client.readModel(modelId, metadata(server))
        .then(response => get_model_schema(response.toObject().result));
}

/**
 * Read models by name
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelName} request model name: name
 * @returns {Promise<ModelSchema[]>} model schema: id, category, name, description, data_type, configs
 */
export async function list_model_by_name(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelName = new pb_model.ModelName();
    modelName.setName(request.name);
    return client.listModelByName(modelName, metadata(server))
        .then(response => get_model_schema_vec(response.toObject().resultsList));
}

/**
 * Read models by category
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelCategory} request model category: category
 * @returns {Promise<ModelSchema[]>} model schema: id, category, name, description, data_type, configs
 */
export async function list_model_by_category(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelCategory = new pb_model.ModelCategory();
    modelCategory.setCategory(request.category);
    return client.listModelByCategory(modelCategory, metadata(server))
        .then(response => get_model_schema_vec(response.toObject().resultsList));
}

/**
 * Read models by name and category
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelNameCategory} request model name and category: name, category
 * @returns {Promise<ModelSchema[]>} model schema: id, category, name, description, data_type, configs
 */
export async function list_model_by_name_category(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelNameCategory = new pb_model.ModelNameCategory();
    modelNameCategory.setName(request.name);
    modelNameCategory.setCategory(request.category);
    return client.listModelByNameCategory(modelNameCategory, metadata(server))
        .then(response => get_model_schema_vec(response.toObject().resultsList));
}

/**
 * Read models by type
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeId} request type uuid: id
 * @returns {Promise<ModelSchema[]>} model schema: id, category, name, description, data_type, configs
 */
export async function list_model_by_type(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const typeId = new pb_model.TypeId();
    typeId.setId(uuid_hex_to_base64(request.id));
    return client.listModelByType(modelNameCategory, metadata(server))
        .then(response => get_model_schema_vec(response.toObject().resultsList));
}

/**
 * Create a model
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelSchema} request model schema: id, data_type, category, name, description
 * @returns {Promise<ModelId>} model id: id
 */
export async function create_model(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelSchema = new pb_model.ModelSchema();
    modelSchema.setId(uuid_hex_to_base64(request.id));
    modelSchema.setDataTypeList(request.data_type.map((v) => {return set_data_type(v)}));
    modelSchema.setCategory(request.category);
    modelSchema.setName(request.name);
    modelSchema.setDescription(request.description);
    return client.createModel(modelSchema, metadata(server))
        .then(response => get_model_id(response.toObject()));
}

/**
 * Update a model
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelUpdate} request model update: id, data_type, category, name, description
 * @returns {Promise<{}>} update response
 */
export async function update_model(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelUpdate = new pb_model.ModelUpdate();
    modelUpdate.setId(uuid_hex_to_base64(request.id));
    if (request.data_type) {
        modelUpdate.setDataTypeList(request.data_type.map((v) => {return set_data_type(v)}));
        modelUpdate.setDataTypeFlag(true);
    } else {
        modelUpdate.setDataTypeFlag(false);
    }
    modelUpdate.setCategory(request.category);
    modelUpdate.setName(request.name);
    modelUpdate.setDescription(request.description);
    return client.updateModel(modelUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a model
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelId} request model uuid: id
 * @returns {Promise<{}>} delete response
 */
export async function delete_model(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelId = new pb_model.ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    return client.deleteModel(modelId, metadata(server))
        .then(response => response.toObject());
}

/**
 * Read a model configuration by uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelConfigId} request model config uuid: id
 * @returns {Promise<ModelConfigSchema>} model config schema: model_id, index, name, value, category
 */
export async function read_model_config(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const configId = new pb_model.ConfigId();
    configId.setId(request.id);
    return client.readModelConfig(configId, metadata(server))
        .then(response => get_model_config_schema(response.toObject().result));
}

/**
 * Read model configurations by model uuid
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelId} request model uuid: id
 * @returns {Promise<ModelConfigSchema[]>} model config schema: model_id, index, name, value, category
 */
export async function list_model_config_by_model(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const modelId = new pb_model.ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    return client.listModelConfig(modelId, metadata(server))
        .then(response => get_model_config_schema_vec(response.toObject().resultsList));
}

/**
 * Create a model configuration
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelConfigSchema} request model config schema: model_id, index, name, value, category
 * @returns {Promise<ModelConfigId>} model config uuid: id
 */
export async function create_model_config(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const configSchema = new pb_model.ConfigSchema();
    configSchema.setModelId(uuid_hex_to_base64(request.model_id));
    configSchema.setIndex(request.index);
    configSchema.setName(request.name);
    const value = set_config_value(request.value);
    configSchema.setConfigBytes(value.bytes);
    configSchema.setConfigType(value.type);
    configSchema.setCategory(request.category);
    return client.createModelConfig(configSchema, metadata(server))
        .then(response => get_model_config_id(response.toObject()));
}

/**
 * Update a model configuration
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelConfigUpdate} request model config update: id, name, value, category
 * @returns {Promise<{}>} update response 
 */
export async function update_model_config(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const configUpdate = new pb_model.ConfigUpdate();
    configUpdate.setId(request.id);
    configUpdate.setName(request.name);
    const value = set_config_value(request.value);
    configUpdate.setConfigBytes(value.bytes);
    configUpdate.setConfigType(value.type);
    configUpdate.setCategory(request.category);
    return client.updateModelConfig(configUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a model configuration
 * @param {ServerConfig} server server configuration: address, token
 * @param {ModelConfigId} request model config uuid: id
 * @returns {Promise<{}>} delete response 
 */
export async function delete_model_config(server, request) {
    const client = new pb_model.ModelServicePromiseClient(server.address, null, null);
    const configId = new pb_model.ConfigId();
    configId.setId(request.id);
    return client.deleteModelConfig(configId, metadata(server))
        .then(response => response.toObject());
}
