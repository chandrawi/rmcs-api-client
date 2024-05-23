import { GroupServiceClient } from 'rmcs-resource-api/rmcs_resource_api/group_grpc_web_pb.js'
import {
    GroupId as _GroupId, 
    GroupName as _GroupName, 
    GroupCategory as _GroupCategory, 
    GroupNameCategory as _GroupNameCategory,
    GroupModelSchema as _GroupModelSchema,
    GroupDeviceSchema as _GroupDeviceSchema,
    GroupUpdate as _GroupUpdate, 
    GroupModel as _GroupModel,
    GroupDevice as _GroupDevice
} from 'rmcs-resource-api/rmcs_resource_api/group_pb.js'
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64
} from "../utility.js"


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} GroupId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {GroupId}
 */
function get_group_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    }
}

/**
 * @typedef {Object} GroupName
 * @property {string} name
 */

/**
 * @typedef {Object} GroupCategory
 * @property {string} category
 */

/**
 * @typedef {Object} GroupNameCategory
 * @property {string} name
 * @property {string} category
 */

/**
 * @typedef {Object} GroupModelSchema
 * @property {Uuid} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {Uuid[]} models
 */

/**
 * @typedef {Object} GroupDeviceSchema
 * @property {Uuid} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {Uuid[]} devices
 */

/**
 * @typedef {Object} GroupGatewaySchema
 * @property {Uuid} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {Uuid[]} gateways
 */

/**
 * @param {*} r 
 * @returns {GroupModelSchema}
 */
export function get_group_model_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        name: r.name,
        category: r.category,
        description: r.description,
        models: r.modelsList.map((v) => {return base64_to_uuid_hex(v)})
    }
}

/**
 * @param {*} r 
 * @returns {GroupModelSchema[]}
 */
function get_group_model_schema_vec(r) {
    return r.map((v) => {return get_group_model_schema(v)})
}

/**
 * @param {*} r 
 * @returns {GroupDeviceSchema}
 */
export function get_group_device_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        name: r.name,
        category: r.category,
        description: r.description,
        devices: r.devicesList.map((v) => {return base64_to_uuid_hex(v)})
    }
}

/**
 * @param {*} r 
 * @returns {GroupDeviceSchema[]}
 */
function get_group_device_schema_vec(r) {
    return r.map((v) => {return get_group_device_schema(v)})
}

/**
 * @param {*} r 
 * @returns {GroupGatewaySchema}
 */
export function get_group_gateway_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        name: r.name,
        category: r.category,
        description: r.description,
        gateways: r.devicesList.map((v) => {return base64_to_uuid_hex(v)})
    }
}

/**
 * @param {*} r 
 * @returns {GroupGatewaySchema[]}
 */
function get_group_gateway_schema_vec(r) {
    return r.map((v) => {return get_group_gateway_schema(v)})
}

/**
 * @typedef {Object} GroupUpdate
 * @property {Uuid} id
 * @property {?string} name
 * @property {?string} category
 * @property {?string} description
 */

/**
 * @typedef {Object} GroupModel
 * @property {Uuid} id
 * @property {Uuid} model_id
 */

/**
 * @typedef {Object} GroupDevice
 * @property {Uuid} id
 * @property {Uuid} device_id
 */

/**
 * @typedef {Object} GroupGateway
 * @property {Uuid} id
 * @property {Uuid} gateway_id
 */


/**
 * Read a group model by uuid
 * @param {Resource} resource Resource instance
 * @param {GroupId} request group model uuid: id
 * @param {function(?grpc.web.RpcError, ?GroupModelSchema)} callback The callback function(error, response)
 */
export async function read_group_model(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupId = new _GroupId()
    groupId.setId(uuid_hex_to_base64(request.id))
    await client.readGroupModel(groupId, {}, (e, r) => {
        const response = r ? get_group_model_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read groups of model by name
 * @param {Resource} resource Resource instance
 * @param {GroupName} request group model name: name
 * @param {function(?grpc.web.RpcError, ?GroupModelSchema[])} callback The callback function(error, response)
 */
export async function list_group_model_by_name(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupName = new _GroupName()
    groupName.setName(request.name)
    await client.listGroupModelByName(groupName, {}, (e, r) => {
        const response = r ? get_group_model_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read groups of model by category
 * @param {Resource} resource Resource instance
 * @param {GroupCategory} request group model category: category
 * @param {function(?grpc.web.RpcError, ?GroupModelSchema[])} callback The callback function(error, response)
 */
export async function list_group_model_by_category(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupCategory = new _GroupCategory()
    groupCategory.setCategory(request.category)
    await client.listGroupModelByCategory(groupCategory, {}, (e, r) => {
        const response = r ? get_group_model_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read groups of model by name and category
 * @param {Resource} resource Resource instance
 * @param {GroupNameCategory} request group model name and category: name, category
 * @param {function(?grpc.web.RpcError, ?GroupModelSchema[])} callback The callback function(error, response)
 */
export async function list_group_model_by_name_category(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupNameCategory = new _GroupNameCategory()
    groupNameCategory.setName(request.name)
    groupNameCategory.setCategory(request.category)
    await client.listGroupModelByNameCategory(groupNameCategory, {}, (e, r) => {
        const response = r ? get_group_model_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a group model
 * @param {Resource} resource Resource instance
 * @param {GroupModelSchema} request group model schema: id, name, category, description
 * @param {function(?grpc.web.RpcError, ?GroupId)} callback The callback function(error, response)
 */
export async function create_group_model(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupSchema = new _GroupModelSchema()
    groupSchema.setId(uuid_hex_to_base64(request.id))
    groupSchema.setName(request.name)
    groupSchema.setCategory(request.category)
    groupSchema.setDescription(request.description)
    await client.createGroupModel(groupSchema, {}, (e, r) => {
        const response = r ? get_group_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a group model
 * @param {Resource} resource Resource instance
 * @param {GroupUpdate} request group model update: id, name, category, description
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_group_model(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupUpdate = new _GroupUpdate()
    groupUpdate.setId(uuid_hex_to_base64(request.id))
    groupUpdate.setName(request.name)
    groupUpdate.setCategory(request.category)
    groupUpdate.setDescription(request.description)
    await client.updateGroupModel(groupUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Delete a group model
 * @param {Resource} resource Resource instance
 * @param {GroupId} request group model uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_group_model(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupId = new _GroupId()
    groupId.setId(uuid_hex_to_base64(request.id))
    await client.deleteGroupModel(groupId, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Add a member to a group model
 * @param {Resource} resource Resource instance
 * @param {GroupModel} request group model member: id, model_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function add_group_model_member(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupModel = new _GroupModel()
    groupModel.setId(uuid_hex_to_base64(request.id))
    groupModel.setModelId(uuid_hex_to_base64(request.model_id))
    await client.addGroupModelMember(groupModel, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Remove a member to a group model
 * @param {Resource} resource Resource instance
 * @param {GroupModel} request group model member: id, model_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function remove_group_model_member(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupModel = new _GroupModel()
    groupModel.setId(uuid_hex_to_base64(request.id))
    groupModel.setModelId(uuid_hex_to_base64(request.model_id))
    await client.removeGroupModelMember(groupModel, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Read a group device by uuid
 * @param {Resource} resource Resource instance
 * @param {GroupId} request group device uuid: id
 * @param {function(?grpc.web.RpcError, ?GroupDeviceSchema)} callback The callback function(error, response)
 */
export async function read_group_device(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupId = new _GroupId()
    groupId.setId(uuid_hex_to_base64(request.id))
    await client.readGroupDevice(groupId, {}, (e, r) => {
        const response = r ? get_group_device_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read groups of device by name
 * @param {Resource} resource Resource instance
 * @param {GroupName} request group device name: name
 * @param {function(?grpc.web.RpcError, ?GroupDeviceSchema[])} callback The callback function(error, response)
 */
export async function list_group_device_by_name(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupName = new _GroupName()
    groupName.setName(request.name)
    await client.listGroupDeviceByName(groupName, {}, (e, r) => {
        const response = r ? get_group_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read groups of device by category
 * @param {Resource} resource Resource instance
 * @param {GroupCategory} request group device category: category
 * @param {function(?grpc.web.RpcError, ?GroupDeviceSchema[])} callback The callback function(error, response)
 */
export async function list_group_device_by_category(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupCategory = new _GroupCategory()
    groupCategory.setCategory(request.category)
    await client.listGroupDeviceByCategory(groupCategory, {}, (e, r) => {
        const response = r ? get_group_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read groups of device by name and category
 * @param {Resource} resource Resource instance
 * @param {GroupNameCategory} request group device name and category: name, category
 * @param {function(?grpc.web.RpcError, ?GroupDeviceSchema[])} callback The callback function(error, response)
 */
export async function list_group_device_by_name_category(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupNameCategory = new _GroupNameCategory()
    groupNameCategory.setName(request.name)
    groupNameCategory.setCategory(request.category)
    await client.listGroupDeviceByNameCategory(groupNameCategory, {}, (e, r) => {
        const response = r ? get_group_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a group device
 * @param {Resource} resource Resource instance
 * @param {GroupDeviceSchema} request group device schema: id, name, category, description
 * @param {function(?grpc.web.RpcError, ?GroupId)} callback The callback function(error, response)
 */
export async function create_group_device(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupSchema = new _GroupDeviceSchema()
    groupSchema.setId(uuid_hex_to_base64(request.id))
    groupSchema.setName(request.name)
    groupSchema.setCategory(request.category)
    groupSchema.setDescription(request.description)
    await client.createGroupDevice(groupSchema, {}, (e, r) => {
        const response = r ? get_group_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a group device
 * @param {Resource} resource Resource instance
 * @param {GroupUpdate} request group device update: id, name, category, description
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_group_device(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupUpdate = new _GroupUpdate()
    groupUpdate.setId(uuid_hex_to_base64(request.id))
    groupUpdate.setName(request.name)
    groupUpdate.setCategory(request.category)
    groupUpdate.setDescription(request.description)
    await client.updateGroupDevice(groupUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Delete a group device
 * @param {Resource} resource Resource instance
 * @param {GroupId} request group device uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_group_device(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupId = new _GroupId()
    groupId.setId(uuid_hex_to_base64(request.id))
    await client.deleteGroupDevice(groupId, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Add a member to a group device
 * @param {Resource} resource Resource instance
 * @param {GroupDevice} request group device member: id, device_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function add_group_device_member(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupDevice = new _GroupDevice()
    groupDevice.setId(uuid_hex_to_base64(request.id))
    groupDevice.setDeviceId(uuid_hex_to_base64(request.device_id))
    await client.addGroupDeviceMember(groupDevice, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Remove a member to a group device
 * @param {Resource} resource Resource instance
 * @param {GroupDevice} request group device member: id, device_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function remove_group_device_member(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupDevice = new _GroupDevice()
    groupDevice.setId(uuid_hex_to_base64(request.id))
    groupDevice.setDeviceId(uuid_hex_to_base64(request.device_id))
    await client.removeGroupDeviceMember(groupDevice, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Read a group gateway by uuid
 * @param {Resource} resource Resource instance
 * @param {GroupId} request group gateway uuid: id
 * @param {function(?grpc.web.RpcError, ?GroupGatewaySchema)} callback The callback function(error, response)
 */
export async function read_group_gateway(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupId = new _GroupId()
    groupId.setId(uuid_hex_to_base64(request.id))
    await client.readGroupGateway(groupId, {}, (e, r) => {
        const response = r ? get_group_gateway_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read groups of gateway by name
 * @param {Resource} resource Resource instance
 * @param {GroupName} request group gateway name: name
 * @param {function(?grpc.web.RpcError, ?GroupGatewaySchema[])} callback The callback function(error, response)
 */
export async function list_group_gateway_by_name(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupName = new _GroupName()
    groupName.setName(request.name)
    await client.listGroupGatewayByName(groupName, {}, (e, r) => {
        const response = r ? get_group_gateway_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read groups of gateway by category
 * @param {Resource} resource Resource instance
 * @param {GroupCategory} request group gateway category: category
 * @param {function(?grpc.web.RpcError, ?GroupGatewaySchema[])} callback The callback function(error, response)
 */
export async function list_group_gateway_by_category(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupCategory = new _GroupCategory()
    groupCategory.setCategory(request.category)
    await client.listGroupGatewayByCategory(groupCategory, {}, (e, r) => {
        const response = r ? get_group_gateway_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read groups of gateway by name and category
 * @param {Resource} resource Resource instance
 * @param {GroupNameCategory} request group gateway name and category: name, category
 * @param {function(?grpc.web.RpcError, ?GroupGatewaySchema[])} callback The callback function(error, response)
 */
export async function list_group_gateway_by_name_category(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupNameCategory = new _GroupNameCategory()
    groupNameCategory.setName(request.name)
    groupNameCategory.setCategory(request.category)
    await client.listGroupGatewayByNameCategory(groupNameCategory, {}, (e, r) => {
        const response = r ? get_group_gateway_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a group gateway
 * @param {Resource} resource Resource instance
 * @param {GroupGatewaySchema} request group gateway schema: id, name, category, description
 * @param {function(?grpc.web.RpcError, ?GroupId)} callback The callback function(error, response)
 */
export async function create_group_gateway(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupSchema = new _GroupDeviceSchema()
    groupSchema.setId(uuid_hex_to_base64(request.id))
    groupSchema.setName(request.name)
    groupSchema.setCategory(request.category)
    groupSchema.setDescription(request.description)
    await client.createGroupGateway(groupSchema, {}, (e, r) => {
        const response = r ? get_group_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a group gateway
 * @param {Resource} resource Resource instance
 * @param {GroupUpdate} request group gateway update: id, name, category, description
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_group_gateway(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupUpdate = new _GroupUpdate()
    groupUpdate.setId(uuid_hex_to_base64(request.id))
    groupUpdate.setName(request.name)
    groupUpdate.setCategory(request.category)
    groupUpdate.setDescription(request.description)
    await client.updateGroupGateway(groupUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Delete a group gateway
 * @param {Resource} resource Resource instance
 * @param {GroupId} request group gateway uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_group_gateway(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupId = new _GroupId()
    groupId.setId(uuid_hex_to_base64(request.id))
    await client.deleteGroupGateway(groupId, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Add a member to a group gateway
 * @param {Resource} resource Resource instance
 * @param {GroupGateway} request group gateway member: id, gateway_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function add_group_gateway_member(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupDevice = new _GroupDevice()
    groupDevice.setId(uuid_hex_to_base64(request.id))
    groupDevice.setDeviceId(uuid_hex_to_base64(request.gateway_id))
    await client.addGroupGatewayMember(groupDevice, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Remove a member to a group gateway
 * @param {Resource} resource Resource instance
 * @param {GroupGateway} request group gateway member: id, gateway_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function remove_group_gateway_member(resource, request, callback) {
    const client = new GroupServiceClient(resource.address, null, null)
    const groupDevice = new _GroupDevice()
    groupDevice.setId(uuid_hex_to_base64(request.id))
    groupDevice.setDeviceId(uuid_hex_to_base64(request.gateway_id))
    await client.removeGroupGatewayMember(groupDevice, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}