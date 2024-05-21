import { RoleServiceClient } from "rmcs-auth-api/rmcs_auth_api/role_grpc_web_pb.js"
import {
    RoleId as _RoleId,
    RoleName as _RoleName,
    ApiId as _ApiId,
    UserId as _UserId,
    RoleSchema as _RoleSchema,
    RoleUpdate as _RoleUpdate,
    RoleAccess as _RoleAccess
} from "rmcs-auth-api/rmcs_auth_api/role_pb.js"
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64
} from "../utility.js"


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} RoleId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {RoleId}
 */
function get_role_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    }
}

/**
 * @typedef {Object} RoleName
 * @property {Uuid} api_id
 * @property {string} name
 */

/**
 * @typedef {import('./api.js').ApiId} ApiId
 */

/**
 * @typedef {import('./user.js').UserId} UserId
 */

/**
 * @typedef {Object} RoleSchema
 * @property {Uuid} id
 * @property {Uuid} api_id
 * @property {string} name
 * @property {boolean} multi
 * @property {boolean} ip_lock
 * @property {number} access_duration
 * @property {number} refresh_duration
 * @property {string} access_key
 * @property {string[]} procedures
 */

/**
 * @param {*} r 
 * @returns {RoleSchema}
 */
function get_role_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        api_id: base64_to_uuid_hex(r.apiId),
        name: r.name,
        multi: r.multi,
        ip_lock: r.ipLock,
        access_duration: r.accessDuration,
        refresh_duration: r.refreshDuration,
        access_key: r.accessKey,
        procedures: r.proceduresList.map((v) => {return base64_to_uuid_hex(v)})
    }
}

/**
 * @param {*} r 
 * @returns {RoleSchema[]}
 */
function get_role_schema_vec(r) {
    return r.map((v) => {return get_role_schema(v)})
}

/**
 * @typedef {Object} RoleUpdate
 * @property {Uuid} id
 * @property {?string} name
 * @property {?boolean} multi
 * @property {?boolean} ip_lock
 * @property {?number} access_duration
 * @property {?number} refresh_duration
 */

/**
 * @typedef {Object} RoleAccess
 * @property {Uuid} id
 * @property {Uuid} procedure_id
 */


/**
 * Read a role by uuid
 * @param {Auth} auth Auth instance
 * @param {RoleId} request role uuid: id
 * @param {function(?grpc.web.RpcError, ?RoleSchema)} callback The callback function(error, response)
 */
export async function read_role(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const roleId = new _RoleId()
    roleId.setId(uuid_hex_to_base64(request.id))
    await client.readRole(roleId, {}, (e, r) => {
        const response = r ? get_role_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read a role by name
 * @param {Auth} auth Auth instance
 * @param {RoleName} request role name: api_id, name
 * @param {function(?grpc.web.RpcError, ?RoleSchema)} callback The callback function(error, response)
 */
export async function read_role_by_name(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const roleName = new _RoleName()
    roleName.setApiId(uuid_hex_to_base64(request.api_id))
    roleName.setName(request.name)
    await client.readRoleByName(roleName, {}, (e, r) => {
        const response = r ? get_role_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read roles by api uuid
 * @param {Auth} auth Auth instance
 * @param {ApiId} request api uuid: api_id
 * @param {function(?grpc.web.RpcError, ?RoleSchema[])} callback The callback function(error, response)
 */
export async function list_role_by_api(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const apiId = new _ApiId()
    apiId.setApiId(uuid_hex_to_base64(request.api_id))
    await client.listRoleByApi(apiId, {}, (e, r) => {
        const response = r ? get_role_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read roles by user uuid
 * @param {Auth} auth Auth instance
 * @param {UserId} request user uuid: user_id
 * @param {function(?grpc.web.RpcError, ?RoleSchema[])} callback The callback function(error, response)
 */
export async function list_role_by_user(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const userId = new _UserId()
    userId.setUserId(uuid_hex_to_base64(request.user_id))
    await client.listRoleByUser(userId, {}, (e, r) => {
        const response = r ? get_role_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a role
 * @param {Auth} auth Auth instance
 * @param {RoleSchema} request role schema: id, api_id, name, multi, ip_lock, access_duration, refresh_duration, access_key
 * @param {function(?grpc.web.RpcError, ?RoleId)} callback The callback function(error, response)
 */
export async function create_role(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const roleSchema = new _RoleSchema()
    roleSchema.setId(uuid_hex_to_base64(request.id))
    roleSchema.setApiId(uuid_hex_to_base64(request.api_id))
    roleSchema.setName(request.name)
    roleSchema.setMulti(request.multi)
    roleSchema.setIpLock(request.ip_lock)
    roleSchema.setAccessDuration(request.access_duration)
    roleSchema.setRefreshDuration(request.refresh_duration)
    roleSchema.setAccessKey(request.access_key)
    await client.createRole(roleSchema, {}, (e, r) => {
        const response = r ? get_role_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a role
 * @param {Auth} auth Auth instance
 * @param {RoleUpdate} request role update: id, name, multi, ip_lock, access_duration, refresh_duration
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_role(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const roleUpdate = new _RoleUpdate()
    roleUpdate.setId(uuid_hex_to_base64(request.id))
    roleUpdate.setName(request.name)
    roleUpdate.setMulti(request.multi)
    roleUpdate.setIpLock(request.ip_lock)
    roleUpdate.setAccessDuration(request.access_duration)
    roleUpdate.setRefreshDuration(request.refresh_duration)
    await client.updateRole(roleUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Delete a role
 * @param {Auth} auth Auth instance
 * @param {RoleId} request role uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_role(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const roleId = new _RoleId()
    roleId.setId(uuid_hex_to_base64(request.id))
    await client.deleteRole(roleId, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Add a role access
 * @param {Auth} auth Auth instance
 * @param {RoleAccess} request role access: id, procedure_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function add_role_access(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const roleAccess = new _RoleAccess()
    roleAccess.setId(uuid_hex_to_base64(request.id))
    roleAccess.setProcedureId(uuid_hex_to_base64(request.procedure_id))
    await client.addRoleAccess(roleAccess, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Remove a role access
 * @param {Auth} auth Auth instance
 * @param {RoleAccess} request role access: id, procedure_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function remove_role_access(auth, request, callback) {
    const client = new RoleServiceClient(auth.address, null, null)
    const roleAccess = new _RoleAccess()
    roleAccess.setId(uuid_hex_to_base64(request.id))
    roleAccess.setProcedureId(uuid_hex_to_base64(request.procedure_id))
    await client.removeRoleAccess(roleAccess, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}
