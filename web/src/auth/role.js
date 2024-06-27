import { pb_role } from "rmcs-auth-api";
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
    };
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
    };
}

/**
 * @param {*} r 
 * @returns {RoleSchema[]}
 */
function get_role_schema_vec(r) {
    return r.map((v) => {return get_role_schema(v)});
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
 * @param {ServerConfig} server Server configuration
 * @param {RoleId} request role uuid: id
 * @param {function(?grpc.web.RpcError, ?RoleSchema)} callback The callback function(error, response)
 */
export async function read_role(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const roleId = new pb_role.RoleId();
    roleId.setId(uuid_hex_to_base64(request.id));
    await client.readRole(roleId, metadata(server), (e, r) => {
        const response = r ? get_role_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read a role by name
 * @param {ServerConfig} server Server configuration
 * @param {RoleName} request role name: api_id, name
 * @param {function(?grpc.web.RpcError, ?RoleSchema)} callback The callback function(error, response)
 */
export async function read_role_by_name(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const roleName = new pb_role.RoleName();
    roleName.setApiId(uuid_hex_to_base64(request.api_id));
    roleName.setName(request.name);
    await client.readRoleByName(roleName, metadata(server), (e, r) => {
        const response = r ? get_role_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read roles by api uuid
 * @param {ServerConfig} server Server configuration
 * @param {ApiId} request api uuid: id
 * @param {function(?grpc.web.RpcError, ?RoleSchema[])} callback The callback function(error, response)
 */
export async function list_role_by_api(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const apiId = new pb_role.ApiId();
    apiId.setApiId(uuid_hex_to_base64(request.id));
    await client.listRoleByApi(apiId, metadata(server), (e, r) => {
        const response = r ? get_role_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read roles by user uuid
 * @param {ServerConfig} server Server configuration
 * @param {UserId} request user uuid: id
 * @param {function(?grpc.web.RpcError, ?RoleSchema[])} callback The callback function(error, response)
 */
export async function list_role_by_user(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const userId = new pb_role.UserId();
    userId.setUserId(uuid_hex_to_base64(request.id));
    await client.listRoleByUser(userId, metadata(server), (e, r) => {
        const response = r ? get_role_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a role
 * @param {ServerConfig} server Server configuration
 * @param {RoleSchema} request role schema: id, api_id, name, multi, ip_lock, access_duration, refresh_duration, access_key
 * @param {function(?grpc.web.RpcError, ?RoleId)} callback The callback function(error, response)
 */
export async function create_role(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const roleSchema = new pb_role.RoleSchema();
    roleSchema.setId(uuid_hex_to_base64(request.id));
    roleSchema.setApiId(uuid_hex_to_base64(request.api_id));
    roleSchema.setName(request.name);
    roleSchema.setMulti(request.multi);
    roleSchema.setIpLock(request.ip_lock);
    roleSchema.setAccessDuration(request.access_duration);
    roleSchema.setRefreshDuration(request.refresh_duration);
    roleSchema.setAccessKey(request.access_key);
    await client.createRole(roleSchema, metadata(server), (e, r) => {
        const response = r ? get_role_id(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Update a role
 * @param {ServerConfig} server Server configuration
 * @param {RoleUpdate} request role update: id, name, multi, ip_lock, access_duration, refresh_duration
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_role(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const roleUpdate = new pb_role.RoleUpdate();
    roleUpdate.setId(uuid_hex_to_base64(request.id));
    roleUpdate.setName(request.name);
    roleUpdate.setMulti(request.multi);
    roleUpdate.setIpLock(request.ip_lock);
    roleUpdate.setAccessDuration(request.access_duration);
    roleUpdate.setRefreshDuration(request.refresh_duration);
    await client.updateRole(roleUpdate, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete a role
 * @param {ServerConfig} server Server configuration
 * @param {RoleId} request role uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_role(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const roleId = new pb_role.RoleId();
    roleId.setId(uuid_hex_to_base64(request.id));
    await client.deleteRole(roleId, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Add a role access
 * @param {ServerConfig} server Server configuration
 * @param {RoleAccess} request role access: id, procedure_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function add_role_access(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const roleAccess = new pb_role.RoleAccess();
    roleAccess.setId(uuid_hex_to_base64(request.id));
    roleAccess.setProcedureId(uuid_hex_to_base64(request.procedure_id));
    await client.addRoleAccess(roleAccess, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Remove a role access
 * @param {ServerConfig} server Server configuration
 * @param {RoleAccess} request role access: id, procedure_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function remove_role_access(server, request, callback) {
    const client = new pb_role.RoleServiceClient(server.address, null, null);
    const roleAccess = new pb_role.RoleAccess();
    roleAccess.setId(uuid_hex_to_base64(request.id));
    roleAccess.setProcedureId(uuid_hex_to_base64(request.procedure_id));
    await client.removeRoleAccess(roleAccess, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}
