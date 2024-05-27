import { get_config_value, set_config_value, get_data_type, set_data_type } from './common.js';
import { ModelServiceClient } from 'rmcs-resource-api/rmcs_resource_api/model_grpc_web_pb.js';
import {
    ModelId as _ModelId, 
    ModelName as _ModelName, 
    ModelCategory as _ModelCategory, 
    ModelNameCategory as _ModelNameCategory, 
    TypeId as _TypeId,
    ModelSchema as _ModelSchema,
    ModelUpdate as _ModelUpdate,
    ConfigId as _ConfigId,
    ConfigSchema as _ConfigSchema,
    ConfigUpdate as _ConfigUpdate
} from 'rmcs-resource-api/rmcs_resource_api/model_pb.js';
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64
} from "../utility.js";


/**
 * @typedef {(string|Uint8Array)} Uuid
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
 * @param {Resource} resource Resource instance
 * @param {ModelId} request model uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelSchema)} callback The callback function(error, response)
 */
export async function read_model(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelId = new _ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    await client.readModel(modelId, {}, (e, r) => {
        const response = r ? get_model_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read models by name
 * @param {Resource} resource Resource instance
 * @param {ModelName} request model name: name
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_name(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelName = new _ModelName();
    modelName.setName(request.name);
    await client.listModelByName(modelName, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read models by category
 * @param {Resource} resource Resource instance
 * @param {ModelCategory} request model category: category
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_category(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelCategory = new _ModelCategory();
    modelCategory.setCategory(request.category);
    await client.listModelByCategory(modelCategory, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read models by name and category
 * @param {Resource} resource Resource instance
 * @param {ModelNameCategory} request model name and category: name, category
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_name_category(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelNameCategory = new _ModelNameCategory();
    modelNameCategory.setName(request.name);
    modelNameCategory.setCategory(request.category);
    await client.listModelByNameCategory(modelNameCategory, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read models by type
 * @param {Resource} resource Resource instance
 * @param {TypeId} request type uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelSchema[])} callback The callback function(error, response)
 */
export async function list_model_by_type(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const typeId = new _TypeId();
    typeId.setId(uuid_hex_to_base64(request.id));
    await client.listModelByType(modelNameCategory, {}, (e, r) => {
        const response = r ? get_model_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a model
 * @param {Resource} resource Resource instance
 * @param {ModelSchema} request model schema: id, data_type, category, name, description
 * @param {function(?grpc.web.RpcError, ?ModelId)} callback The callback function(error, response)
 */
export async function create_model(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelSchema = new _ModelSchema();
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
 * @param {Resource} resource Resource instance
 * @param {ModelUpdate} request model update: id, data_type, category, name, description
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_model(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelUpdate = new _ModelUpdate();
    modelUpdate.setId(uuid_hex_to_base64(request.id));
    if (request.data_type) {
        modelUpdate.setDataTypeList(request.data_type.map((v) => {return set_data_type(v)}));
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
 * @param {Resource} resource Resource instance
 * @param {ModelId} request model id: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_model(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelId = new _ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    await client.deleteModel(modelId, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Read a model configuration by uuid
 * @param {Resource} resource Resource instance
 * @param {ModelConfigId} request model config uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelConfigSchema)} callback The callback function(error, response)
 */
export async function read_model_config(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const configId = new _ConfigId();
    configId.setId(request.id);
    await client.readModelConfig(configId, {}, (e, r) => {
        const response = r ? get_model_config_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read model configurations by model uuid
 * @param {Resource} resource Resource instance
 * @param {ModelId} request model uuid: id
 * @param {function(?grpc.web.RpcError, ?ModelConfigSchema[])} callback The callback function(error, response)
 */
export async function list_model_config_by_model(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const modelId = new _ModelId();
    modelId.setId(uuid_hex_to_base64(request.id));
    await client.listModelConfig(modelId, {}, (e, r) => {
        const response = r ? get_model_config_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a model configuration
 * @param {Resource} resource Resource instance
 * @param {ModelConfigSchema} request model config schema: model_id, index, name, value, category
 * @param {function(?grpc.web.RpcError, ?ModelConfigId)} callback The callback function(error, response)
 */
export async function create_model_config(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const configSchema = new _ConfigSchema();
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
 * @param {Resource} resource Resource instance
 * @param {ModelConfigUpdate} request model config update: id, name, value, category
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_model_config(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const configUpdate = new _ConfigUpdate();
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
 * @param {Resource} resource Resource instance
 * @param {ModelConfigId} request model config uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_model_config(resource, request, callback) {
    const client = new ModelServiceClient(resource.address, null, null);
    const configId = new _ConfigId();
    configId.setId(request.id);
    await client.deleteModelConfig(configId, {}, (e, r) => {
        callback(e, r.toObject());
    });
}
