import { UserServiceClient } from "rmcs-auth-api/rmcs_auth_api/user_grpc_web_pb.js"
import {
    UserId as _UserId,
    UserName as _UserName,
    RoleId as _RoleId,
    UserSchema as _UserSchema,
    UserUpdate as _UserUpdate,
    UserRole as _UserRole
} from "rmcs-auth-api/rmcs_auth_api/user_pb.js"
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64
} from "../utility.js"


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} UserId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {UserId}
 */
function get_user_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    }
}

/**
 * @typedef {Object} UserName
 * @property {string} name
 */

/**
 * @typedef {import('./role.js').RoleId} RoleId
 */

/**
 * @typedef {Object} UserRoleSchema
 * @property {Uuid} api_id
 * @property {string} role
 * @property {boolean} multi
 * @property {boolean} ip_lock
 * @property {number} access_duration
 * @property {number} refresh_duration
 * @property {string} access_key
 */

/**
 * @typedef {Object} UserSchema
 * @property {Uuid} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} password
 * @property {UserRoleSchema[]} roles
 */

/**
 * @param {*} r 
 * @returns {UserRoleSchema}
 */
function get_user_role_schema(r) {
    return {
        api_id: base64_to_uuid_hex(r.apiId),
        role: r.role,
        multi: r.multi,
        ip_lock: r.ipLock,
        access_duration: r.accessDuration,
        refresh_duration: r.refreshDuration,
        access_key: r.accessKey
    }
}

/**
 * @param {*} r 
 * @returns {UserSchema}
 */
function get_user_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        name: r.name,
        email: r.email,
        phone: r.phone,
        password: r.password,
        roles: r.rolesList.map((v) => {return get_user_role_schema(v)})
    }
}

/**
 * @param {*} r 
 * @returns {UserSchema[]}
 */
function get_user_schema_vec(r) {
    return r.map((v) => {return get_user_schema(v)})
}

/**
 * @typedef {Object} UserUpdate
 * @property {Uuid} id
 * @property {?string} name
 * @property {?string} email
 * @property {?string} phone
 * @property {?string} password
 */

/**
 * @typedef {Object} UserRole
 * @property {Uuid} user_id
 * @property {Uuid} role_id
 */


/**
 * Read a user by uuid
 * @param {Auth} auth Auth instance
 * @param {UserId} request user uuid: id
 * @param {function(?grpc.web.RpcError, ?UserSchema)} callback The callback function(error, response)
 */
export async function read_user(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const userId = new _UserId()
    userId.setId(uuid_hex_to_base64(request.id))
    await client.readUser(userId, {}, (e, r) => {
        const response = r ? get_user_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read a user by name
 * @param {Auth} auth Auth instance
 * @param {UserName} request user name: name
 * @param {function(?grpc.web.RpcError, ?UserSchema)} callback The callback function(error, response)
 */
export async function read_user_by_name(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const userName = new _UserName()
    userName.setName(request.name)
    await client.readUserByName(userName, {}, (e, r) => {
        const response = r ? get_user_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read users by role uuid
 * @param {Auth} auth Auth instance
 * @param {RoleId} request role uuid: role_id
 * @param {function(?grpc.web.RpcError, ?UserSchema[])} callback The callback function(error, response)
 */
export async function list_user_by_role(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const roleId = new _RoleId()
    roleId.setId(uuid_hex_to_base64(request.role_id))
    await client.listUserByRole(roleId, {}, (e, r) => {
        const response = r ? get_user_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create an user
 * @param {Auth} auth Auth instance
 * @param {UserSchema} request user schema: id, name, email, phone, password
 * @param {function(?grpc.web.RpcError, ?UserId)} callback The callback function(error, response)
 */
export async function create_user(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const userSchema = new _UserSchema()
    userSchema.setId(uuid_hex_to_base64(request.id))
    userSchema.setName(request.name)
    userSchema.setEmail(request.email)
    userSchema.setPhone(request.phone)
    userSchema.setPassword(request.password)
    await client.createUser(userSchema, {}, (e, r) => {
        const response = r ? get_user_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update an user
 * @param {Auth} auth Auth instance
 * @param {UserUpdate} request user update: id, name, email, phone, password
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_user(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const userUpdate = new _UserUpdate()
    userUpdate.setId(uuid_hex_to_base64(request.id))
    userUpdate.setName(request.name)
    userUpdate.setEmail(request.email)
    userUpdate.setPhone(request.phone)
    userUpdate.setPassword(request.password)
    await client.updateUser(userUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Delete an user
 * @param {Auth} auth Auth instance
 * @param {UserId} request user uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_user(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const userId = new _UserId()
    userId.setId(uuid_hex_to_base64(request.id))
    await client.deleteUser(userId, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Add a role to user
 * @param {Auth} auth Auth instance
 * @param {UserRole} request user role: user_id, role_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function add_user_role(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const userRole = new _UserRole()
    userRole.setUserId(uuid_hex_to_base64(request.user_id))
    userRole.setRoleId(uuid_hex_to_base64(request.role_id))
    await client.addUserRole(userRole, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Remove a role from user
 * @param {Auth} auth Auth instance
 * @param {UserRole} request user role: user_id, role_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function remove_user_role(auth, request, callback) {
    const client = new UserServiceClient(auth.address, null, null)
    const userRole = new _UserRole()
    userRole.setUserId(uuid_hex_to_base64(request.user_id))
    userRole.setRoleId(uuid_hex_to_base64(request.role_id))
    await client.removeUserRole(userRole, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}
