import { get_config_value, set_config_value, get_data_type, set_data_type } from './common.js';
import { pb_model } from 'rmcs-resource-api';
import {
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
 * @param {ServerConfig} server Server configuration
 * @param {ModelId} request model uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelSchema)} callback The callback function(error, response)
 */
export async function read_model(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const modelId = new pb_model.ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    await client.readModel(modelId, {}, (e, r) => {
        const response = r ? get_model_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read models by name
 * @param {ServerConfig} server Server configuration
 * @param {ModelName} request model name: name
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_name(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const modelName = new pb_model.ModelName();
    modelName.setName(request.name);
    await client.listModelByName(modelName, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read models by category
 * @param {ServerConfig} server Server configuration
 * @param {ModelCategory} request model category: category
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_category(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const modelCategory = new pb_model.ModelCategory();
    modelCategory.setCategory(request.category);
    await client.listModelByCategory(modelCategory, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read models by name and category
 * @param {ServerConfig} server Server configuration
 * @param {ModelNameCategory} request model name and category: name, category
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_name_category(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const modelNameCategory = new pb_model.ModelNameCategory();
    modelNameCategory.setName(request.name);
    modelNameCategory.setCategory(request.category);
    await client.listModelByNameCategory(modelNameCategory, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read models by type
 * @param {ServerConfig} server Server configuration
 * @param {TypeId} request type uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_type(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const typeId = new pb_model.TypeId();
    typeId.setId(uuid_hex_to_base64(request.id));
    await client.listModelByType(modelNameCategory, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a model
 * @param {ServerConfig} server Server configuration
 * @param {ModelSchema} request model schema: id, data_type, category, name, description
 * @param {function(?grpc.web.RpcError, ?ModelId)} callback The callback function(error, response)
 */
export async function create_model(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const modelSchema = new pb_model.ModelSchema();
    modelSchema.setId(uuid_hex_to_base64(request.id));
    modelSchema.setDataTypeList(request.data_type.map((v) => {return set_data_type(v)}));
    modelSchema.setCategory(request.category);
    modelSchema.setName(request.name);
    modelSchema.setDescription(request.description);
    await client.createModel(modelSchema, {}, (e, r) => {
        const response = r ? get_model_id(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Update a model
 * @param {ServerConfig} server Server configuration
 * @param {ModelUpdate} request model update: id, data_type, category, name, description
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_model(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
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
    await client.updateModel(modelUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete a model
 * @param {ServerConfig} server Server configuration
 * @param {ModelId} request model id: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_model(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const modelId = new pb_model.ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    await client.deleteModel(modelId, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Read a model configuration by uuid
 * @param {ServerConfig} server Server configuration
 * @param {ModelConfigId} request model config uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelConfigSchema)} callback The callback function(error, response)
 */
export async function read_model_config(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const configId = new pb_model.ConfigId();
    configId.setId(request.id);
    await client.readModelConfig(configId, {}, (e, r) => {
        const response = r ? get_model_config_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read model configurations by model uuid
 * @param {ServerConfig} server Server configuration
 * @param {ModelId} request model uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelConfigSchema[])} callback The callback function(error, response)
 */
export async function list_model_config_by_model(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const modelId = new pb_model.ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    await client.listModelConfig(modelId, {}, (e, r) => {
        const response = r ? get_model_config_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a model configuration
 * @param {ServerConfig} server Server configuration
 * @param {ModelConfigSchema} request model config schema: model_id, index, name, value, category
 * @param {function(?grpc.web.RpcError, ?ModelConfigId)} callback The callback function(error, response)
 */
export async function create_model_config(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const configSchema = new pb_model.ConfigSchema();
    configSchema.setModelId(uuid_hex_to_base64(request.model_id));
    configSchema.setIndex(request.index);
    configSchema.setName(request.name);
    const value = set_config_value(request.value);
    configSchema.setConfigBytes(value.bytes);
    configSchema.setConfigType(value.type);
    configSchema.setCategory(request.category);
    await client.createModelConfig(configSchema, {}, (e, r) => {
        const response = r ? get_model_config_id(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Update a model configuration
 * @param {ServerConfig} server Server configuration
 * @param {ModelConfigUpdate} request model config update: id, name, value, category
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_model_config(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const configUpdate = new pb_model.ConfigUpdate();
    configUpdate.setId(request.id);
    configUpdate.setName(request.name);
    const value = set_config_value(request.value);
    configUpdate.setConfigBytes(value.bytes);
    configUpdate.setConfigType(value.type);
    configUpdate.setCategory(request.category);
    await client.updateModelConfig(configUpdate, {}, (e, r) => {
        callback(e, r.toObject());
    });
}

/**
 * Delete a model configuration
 * @param {ServerConfig} server Server configuration
 * @param {ModelConfigId} request model config uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_model_config(server, request, callback) {
    const client = new pb_model.ModelServiceClient(server.address, null, null);
    const configId = new pb_model.ConfigId();
    configId.setId(request.id);
    await client.deleteModelConfig(configId, {}, (e, r) => {
        callback(e, r.toObject());
    });
}
