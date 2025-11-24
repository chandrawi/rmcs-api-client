import { pb_device } from 'rmcs-resource-api';
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
 * @typedef {Object} TypeId
 * @property {Uuid} id
 */

/**
 * @typedef {Object} TypeIds
 * @property {Uuid[]} ids
 */

/**
 * @typedef {Object} TypeName
 * @property {string} name
 */

/**
 * @typedef {Object} TypeOption
 * @property {?string} name
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
 * @property {Uuid[]} model_ids
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
        model_ids: r.modelIdsList.map((v) => {return base64_to_uuid_hex(v)})
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
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeId} request type uuid: id
 * @returns {Promise<TypeSchema>} type schema: id, name, description, model_ids
 */
export async function read_type(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeId = new pb_device.TypeId();
    typeId.setId(uuid_hex_to_base64(request.id));
    return client.readType(typeId, metadata(server))
        .then(response => get_type_schema(response.toObject().result));
}

/**
 * Read device types by uuid list
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeIds} request type uuid list: ids
 * @returns {Promise<TypeSchema[]>} type schema: id, name, description, model_ids
 */
export async function list_type_by_ids(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeIds = new pb_device.TypeIds();
    typeIds.setIdsList(request.ids.map((id) => uuid_hex_to_base64(id)));
    return client.listTypeByIds(typeIds, metadata(server))
        .then(response => get_type_schema_vec(response.toObject().resultsList));
}

/**
 * Read device types by name
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeName} request type name: name
 * @returns {Promise<TypeSchema[]>} type schema: id, name, description, model_ids
 */
export async function list_type_by_name(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeName = new pb_device.TypeName();
    typeName.setName(request.name);
    return client.listTypeByName(typeName, metadata(server))
        .then(response => get_type_schema_vec(response.toObject().resultsList));
}

/**
 * Read device types with select options
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeOption} request type select option: name
 * @returns {Promise<TypeSchema[]>} type schema: id, name, description, model_ids
 */
export async function list_type_option(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeOption = new pb_device.TypeOption();
    typeOption.setName(request.name);
    return client.listTypeOption(typeOption, metadata(server))
        .then(response => get_type_schema_vec(response.toObject().resultsList));
}

/**
 * Create a device type
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeSchema} request type schema: id, name, description
 * @returns {Promise<TypeId>} type uuid: id
 */
export async function create_type(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeSchema = new pb_device.TypeSchema();
    typeSchema.setId(uuid_hex_to_base64(request.id));
    typeSchema.setName(request.name);
    typeSchema.setDescription(request.description);
    return client.createType(typeSchema, metadata(server))
        .then(response => get_type_id(response.toObject()));
}

/**
 * Update a device type
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeUpdate} request type update: id, name, description
 * @returns {Promise<{}>} update response
 */
export async function update_type(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeUpdate = new pb_device.TypeUpdate();
    typeUpdate.setId(uuid_hex_to_base64(request.id));
    typeUpdate.setName(request.name);
    typeUpdate.setDescription(request.description);
    return client.updateType(typeUpdate, metadata(server))
        .then(response => response.toObject());
}

/**
 * Delete a device type
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeId} request type id: id
 * @returns {Promise<{}>} delete response
 */
export async function delete_type(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeId = new pb_device.TypeId();
    typeId.setId(uuid_hex_to_base64(request.id));
    return client.deleteType(typeId, metadata(server))
        .then(response => response.toObject());
}

/**
 * Add model to a device type
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeModel} request type id: id, model_id
 * @returns {Promise<{}>} change response
 */
export async function add_type_model(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeModel = new pb_device.TypeModel();
    typeModel.setId(uuid_hex_to_base64(request.id));
    typeModel.setModelId(uuid_hex_to_base64(request.model_id));
    return client.addTypeModel(typeModel, metadata(server))
        .then(response => response.toObject());
}

/**
 * Remove model from a device type
 * @param {ServerConfig} server server configuration: address, token
 * @param {TypeModel} request type id: id, model_id
 * @returns {Promise<{}>} change response
 */
export async function remove_type_model(server, request) {
    const client = new pb_device.DeviceServicePromiseClient(server.address, null, null);
    const typeModel = new pb_device.TypeModel();
    typeModel.setId(uuid_hex_to_base64(request.id));
    typeModel.setModelId(uuid_hex_to_base64(request.model_id));
    return client.removeTypeModel(typeModel, metadata(server))
        .then(response => response.toObject());
}
