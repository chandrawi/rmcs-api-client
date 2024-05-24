import { DeviceServiceClient } from 'rmcs-resource-api/rmcs_resource_api/device_grpc_web_pb.js';
import {
    TypeId as _TypeId, 
    TypeName as _TypeName,
    TypeSchema as _TypeSchema,
    TypeUpdate as _TypeUpdate,
    TypeModel as _TypeModel
} from 'rmcs-resource-api/rmcs_resource_api/device_pb.js';
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64
} from "../utility.js";


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} TypeId
 * @property {Uuid} id
 */

/**
 * @typedef {Object} TypeName
 * @property {string} name
 */

/**
 * @param {*} r 
 * @returns {TypeId}
 */
function get_type_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    };
}

/**
 * @typedef {Object} TypeSchema
 * @property {Uuid} id
 * @property {string} name
 * @property {string} description
 * @property {Uuid[]} models
 */

/**
 * @param {*} r 
 * @returns {TypeSchema}
 */
export function get_type_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        name: r.name,
        description: r.description,
        models: r.modelsList.map((v) => {return base64_to_uuid_hex(v)})
    };
}

/**
 * @param {*} r 
 * @returns {TypeSchema[]}
 */
function get_type_schema_vec(r) {
    return r.map((v) => {return get_type_schema(v)});
}

/**
 * @typedef {Object} TypeUpdate
 * @property {Uuid} id
 * @property {?string} name
 * @property {?string} description
 */

/**
 * @typedef {Object} TypeModel
 * @property {Uuid} id
 * @property {Uuid} model_id
 */


/**
 * Read a device type by uuid
 * @param {Resource} resource Resource instance
 * @param {TypeId} request type uuid: id
 * @param {function(?grpc.web.RpcError, ?TypeSchema)} callback The callback function(error, response)
 */
export async function read_type(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null);
    const typeId = new _TypeId();
    typeId.setId(uuid_hex_to_base64(request.id));
    await client.readType(typeId, {}, (e, r) => {
        const response = r ? get_type_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read device types by name
 * @param {Resource} resource Resource instance
 * @param {TypeName} request type name: name
 * @param {function(?grpc.web.RpcError, ?TypeSchema[])} callback The callback function(error, response)
 */
export async function list_type_by_name(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null);
    const typeName = new _TypeName();
    typeName.setName(request.name);
    await client.listTypeByName(typeName, {}, (e, r) => {
        const response = r ? get_type_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a device type
 * @param {Resource} resource Resource instance
 * @param {TypeSchema} request type schema: id, name, description
 * @param {function(?grpc.web.RpcError, ?TypeId)} callback The callback function(error, response)
 */
export async function create_type(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null);
    const typeSchema = new _TypeSchema();
    typeSchema.setId(uuid_hex_to_base64(request.id));
    typeSchema.setName(request.name);
    typeSchema.setDescription(request.description);
    await client.createType(typeSchema, {}, (e, r) => {
        const response = r ? get_type_id(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Update a device type
 * @param {Resource} resource Resource instance
 * @param {TypeUpdate} request type update: id, name, description
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_type(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null);
    const typeUpdate = new _TypeUpdate();
    typeUpdate.setId(uuid_hex_to_base64(request.id));
    typeUpdate.setName(request.name);
    typeUpdate.setDescription(request.description);
    await client.updateType(typeUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete a device type
 * @param {Resource} resource Resource instance
 * @param {TypeId} request type id: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_type(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null);
    const typeId = new _TypeId();
    typeId.setId(uuid_hex_to_base64(request.id));
    await client.deleteType(typeId, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Add model to a device type
 * @param {Resource} resource Resource instance
 * @param {TypeModel} request type id: id, model_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function add_type_model(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null);
    const typeModel = new _TypeModel();
    typeModel.setId(uuid_hex_to_base64(request.id));
    typeModel.setModelId(uuid_hex_to_base64(request.model_id));
    await client.addTypeModel(typeModel, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Remove model from a device type
 * @param {Resource} resource Resource instance
 * @param {TypeModel} request type id: id, model_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function remove_type_model(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null);
    const typeModel = new _TypeModel();
    typeModel.setId(uuid_hex_to_base64(request.id));
    typeModel.setModelId(uuid_hex_to_base64(request.model_id));
    await client.removeTypeModel(typeModel, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}
