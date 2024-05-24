import { TokenServiceClient } from "rmcs-auth-api/rmcs_auth_api/token_grpc_web_pb.js";
import {
    AccessId as _AccessId,
    AuthToken as _AuthToken,
    UserId as _UserId,
    TokenSchema as _TokenSchema,
    AuthTokenCreate as _AuthTokenCreate,
    TokenUpdate as _TokenUpdate
} from "rmcs-auth-api/rmcs_auth_api/token_pb.js";
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64,
    base64_to_bytes,
    bytes_to_base64
} from "../utility.js";


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} AccessId
 * @property {number} access_id
 */

/**
 * @typedef {Object} AuthToken
 * @property {string} auth_token
 */

/**
 * @typedef {import('./user.js').UserId} UserId
 */

/**
 * @typedef {Object} TokenSchema
 * @property {number} access_id
 * @property {Uuid} user_id
 * @property {string} refresh_token
 * @property {string} auth_token
 * @property {Date} expire
 * @property {number[]|Uint8Array} ip
 */

/**
 * @param {*} r 
 * @returns {TokenSchema}
 */
function get_token_schema(r) {
    return {
        access_id: r.accessId,
        user_id: base64_to_uuid_hex(r.userId),
        refresh_token: r.refreshToken,
        auth_token: r.authToken,
        expire: new Date(r.expire / 1000),
        ip: base64_to_bytes(r.ip)
    };
}

/**
 * @param {*} r 
 * @returns {TokenSchema[]}
 */
function get_token_schema_vec(r) {
    return r.map((v) => {return get_token_schema(v)});
}

/**
 * @typedef {Object} AuthTokenCreate
 * @property {Uuid} user_id
 * @property {Date} expire
 * @property {number[]|Uint8Array} ip
 * @property {number} number
 */

/**
 * @typedef {Object} TokenUpdate
 * @property {?number} access_id
 * @property {?string} refresh_token
 * @property {?string} auth_token
 * @property {?Date} expire
 * @property {?number[]|Uint8Array} ip
 */

/**
 * @typedef {Object} TokenCreateResponse
 * @property {number} access_id
 * @property {string} refresh_token
 * @property {string} auth_token
 */

/**
 * @param {*} r 
 * @returns {TokenCreateResponse}
 */
function get_token_create_response(r) {
    return {
        access_id: r.accessId,
        refresh_token: r.refreshToken,
        auth_token: r.authToken,
    };
}

/**
 * @param {*} r 
 * @returns {TokenCreateResponse[]}
 */
function get_token_create_response_vec(r) {
    return r.map((v) => {return get_token_create_response(v)});
}

/**
 * @typedef {Object} TokenUpdateResponse
 * @property {string} refresh_token
 * @property {string} auth_token
 */

/**
 * @param {*} r 
 * @returns {TokenUpdateResponse}
 */
function get_token_update_response(r) {
    return {
        refresh_token: r.refreshToken,
        auth_token: r.authToken,
    };
}


/**
 * Read an access token by access id
 * @param {Auth} auth Auth instance
 * @param {AccessId} request access id: access_id
 * @param {function(?grpc.web.RpcError, ?TokenSchema)} callback The callback function(error, response)
 */
export async function read_access_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const accessId = new _AccessId();
    accessId.setAccessId(request.access_id);
    await client.readAccessToken(accessId, {}, (e, r) => {
        const response = r ? get_token_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read tokens by auth token
 * @param {Auth} auth Auth instance
 * @param {AuthToken} request auth token: auth_token
 * @param {function(?grpc.web.RpcError, ?TokenSchema[])} callback The callback function(error, response)
 */
export async function list_auth_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const authToken = new _AuthToken();
    authToken.setAuthToken(request.auth_token);
    await client.listAuthToken(authToken, {}, (e, r) => {
        const response = r ? get_token_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read tokens by user id
 * @param {Auth} auth Auth instance
 * @param {UserId} request user id: id
 * @param {function(?grpc.web.RpcError, ?TokenSchema[])} callback The callback function(error, response)
 */
export async function list_token_by_user(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const userId = new _UserId();
    userId.setUserId(uuid_hex_to_base64(request.id));
    await client.listTokenByUser(userId, {}, (e, r) => {
        const response = r ? get_token_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create an access token
 * @param {Auth} auth Auth instance
 * @param {TokenSchema} request token schema: user_id, auth_token, expire, ip
 * @param {function(?grpc.web.RpcError, ?TokenCreateResponse)} callback The callback function(error, response)
 */
export async function create_access_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const tokenSchema = new _TokenSchema();
    tokenSchema.setUserId(uuid_hex_to_base64(request.user_id));
    tokenSchema.setAuthToken(request.auth_token);
    tokenSchema.setExpire(request.expire.valueOf() * 1000);
    tokenSchema.setIp(bytes_to_base64(request.ip));
    await client.createAccessToken(tokenSchema, {}, (e, r) => {
        const response = r ? get_token_create_response(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Create tokens with shared auth token
 * @param {Auth} auth Auth instance
 * @param {AuthTokenCreate} request token schema: user_id, expire, ip, number
 * @param {function(?grpc.web.RpcError, ?TokenCreateResponse[])} callback The callback function(error, response)
 */
export async function create_auth_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const authTokenCreate = new _AuthTokenCreate();
    authTokenCreate.setUserId(uuid_hex_to_base64(request.user_id));
    authTokenCreate.setExpire(request.expire.valueOf() * 1000);
    authTokenCreate.setIp(bytes_to_base64(request.ip));
    authTokenCreate.setNumber(request.number);
    await client.createAuthToken(authTokenCreate, {}, (e, r) => {
        const response = r ? get_token_create_response_vec(r.toObject().tokensList) : null;
        callback(e, response);
    });
}

/**
 * Update an access token
 * @param {Auth} auth Auth instance
 * @param {TokenUpdate} request token update: access_id, expire, ip
 * @param {function(?grpc.web.RpcError, ?TokenUpdateResponse)} callback The callback function(error, response)
 */
export async function update_access_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const tokenUpdate = new _TokenUpdate();
    tokenUpdate.setAccessId(request.access_id);
    if (request.expire instanceof Date) {
        tokenUpdate.setExpire(request.expire.valueOf() * 1000);
    }
    if (request.ip) {
        tokenUpdate.setIp(bytes_to_base64(request.ip));
    }
    await client.updateAccessToken(tokenUpdate, {}, (e, r) => {
        const response = r ? get_token_update_response(r.toObject()) : null;
        callback(e, response);
    })
}

/**
 * Update all tokens with shared auth token
 * @param {Auth} auth Auth instance
 * @param {TokenUpdate} request token update: auth_token, expire, ip
 * @param {function(?grpc.web.RpcError, ?TokenUpdateResponse)} callback The callback function(error, response)
 */
export async function update_auth_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const tokenUpdate = new _TokenUpdate();
    tokenUpdate.setAuthToken(request.auth_token);
    if (request.expire instanceof Date) {
        tokenUpdate.setExpire(request.expire.valueOf() * 1000);
    }
    if (request.ip) {
        tokenUpdate.setIp(bytes_to_base64(request.ip));
    }
    await client.updateAuthToken(tokenUpdate, {}, (e, r) => {
        const response = r ? get_token_update_response(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Delete an access token by access id
 * @param {Auth} auth Auth instance
 * @param {AccessId} request access id: access_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_access_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const accessId = new _AccessId();
    accessId.setAccessId(request.access_id);
    await client.deleteAccessToken(accessId, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete tokens by auth token
 * @param {Auth} auth Auth instance
 * @param {AuthToken} request auth token: auth_token
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_auth_token(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const authToken = new _AuthToken();
    authToken.setAuthToken(request.auth_token);
    await client.deleteAuthToken(authToken, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete tokens by user id
 * @param {Auth} auth Auth instance
 * @param {UserId} request user id: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_token_by_user(auth, request, callback) {
    const client = new TokenServiceClient(auth.address, null, null);
    const userId = new _UserId();
    userId.setUserId(uuid_hex_to_base64(request.id));
    await client.deleteTokenByUser(userId, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}
