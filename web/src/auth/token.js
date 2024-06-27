import { pb_token } from "rmcs-auth-api";
import {
    metadata,
    base64_to_uuid_hex,
    uuid_hex_to_base64,
    base64_to_bytes,
    bytes_to_base64
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
 * @param {ServerConfig} server Server configuration
 * @param {AccessId} request access id: access_id
 * @param {function(?grpc.web.RpcError, ?TokenSchema)} callback The callback function(error, response)
 */
export async function read_access_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const accessId = new pb_token.AccessId();
    accessId.setAccessId(request.access_id);
    await client.readAccessToken(accessId, metadata(server), (e, r) => {
        const response = r ? get_token_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read tokens by auth token
 * @param {ServerConfig} server Server configuration
 * @param {AuthToken} request auth token: auth_token
 * @param {function(?grpc.web.RpcError, ?TokenSchema[])} callback The callback function(error, response)
 */
export async function list_auth_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const authToken = new pb_token.AuthToken();
    authToken.setAuthToken(request.auth_token);
    await client.listAuthToken(authToken, metadata(server), (e, r) => {
        const response = r ? get_token_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Read tokens by user id
 * @param {ServerConfig} server Server configuration
 * @param {UserId} request user id: id
 * @param {function(?grpc.web.RpcError, ?TokenSchema[])} callback The callback function(error, response)
 */
export async function list_token_by_user(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const userId = new pb_token.UserId();
    userId.setUserId(uuid_hex_to_base64(request.id));
    await client.listTokenByUser(userId, metadata(server), (e, r) => {
        const response = r ? get_token_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create an access token
 * @param {ServerConfig} server Server configuration
 * @param {TokenSchema} request token schema: user_id, auth_token, expire, ip
 * @param {function(?grpc.web.RpcError, ?TokenCreateResponse)} callback The callback function(error, response)
 */
export async function create_access_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const tokenSchema = new pb_token.TokenSchema();
    tokenSchema.setUserId(uuid_hex_to_base64(request.user_id));
    tokenSchema.setAuthToken(request.auth_token);
    tokenSchema.setExpire(request.expire.valueOf() * 1000);
    tokenSchema.setIp(bytes_to_base64(request.ip));
    await client.createAccessToken(tokenSchema, metadata(server), (e, r) => {
        const response = r ? get_token_create_response(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Create tokens with shared auth token
 * @param {ServerConfig} server Server configuration
 * @param {AuthTokenCreate} request token schema: user_id, expire, ip, number
 * @param {function(?grpc.web.RpcError, ?TokenCreateResponse[])} callback The callback function(error, response)
 */
export async function create_auth_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const authTokenCreate = new pb_token.AuthTokenCreate();
    authTokenCreate.setUserId(uuid_hex_to_base64(request.user_id));
    authTokenCreate.setExpire(request.expire.valueOf() * 1000);
    authTokenCreate.setIp(bytes_to_base64(request.ip));
    authTokenCreate.setNumber(request.number);
    await client.createAuthToken(authTokenCreate, metadata(server), (e, r) => {
        const response = r ? get_token_create_response_vec(r.toObject().tokensList) : null;
        callback(e, response);
    });
}

/**
 * Update an access token
 * @param {ServerConfig} server Server configuration
 * @param {TokenUpdate} request token update: access_id, expire, ip
 * @param {function(?grpc.web.RpcError, ?TokenUpdateResponse)} callback The callback function(error, response)
 */
export async function update_access_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const tokenUpdate = new pb_token.TokenUpdate();
    tokenUpdate.setAccessId(request.access_id);
    if (request.expire instanceof Date) {
        tokenUpdate.setExpire(request.expire.valueOf() * 1000);
    }
    if (request.ip) {
        tokenUpdate.setIp(bytes_to_base64(request.ip));
    }
    await client.updateAccessToken(tokenUpdate, metadata(server), (e, r) => {
        const response = r ? get_token_update_response(r.toObject()) : null;
        callback(e, response);
    })
}

/**
 * Update all tokens with shared auth token
 * @param {ServerConfig} server Server configuration
 * @param {TokenUpdate} request token update: auth_token, expire, ip
 * @param {function(?grpc.web.RpcError, ?TokenUpdateResponse)} callback The callback function(error, response)
 */
export async function update_auth_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const tokenUpdate = new pb_token.TokenUpdate();
    tokenUpdate.setAuthToken(request.auth_token);
    if (request.expire instanceof Date) {
        tokenUpdate.setExpire(request.expire.valueOf() * 1000);
    }
    if (request.ip) {
        tokenUpdate.setIp(bytes_to_base64(request.ip));
    }
    await client.updateAuthToken(tokenUpdate, metadata(server), (e, r) => {
        const response = r ? get_token_update_response(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Delete an access token by access id
 * @param {ServerConfig} server Server configuration
 * @param {AccessId} request access id: access_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_access_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const accessId = new pb_token.AccessId();
    accessId.setAccessId(request.access_id);
    await client.deleteAccessToken(accessId, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete tokens by auth token
 * @param {ServerConfig} server Server configuration
 * @param {AuthToken} request auth token: auth_token
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_auth_token(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const authToken = new pb_token.AuthToken();
    authToken.setAuthToken(request.auth_token);
    await client.deleteAuthToken(authToken, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete tokens by user id
 * @param {ServerConfig} server Server configuration
 * @param {UserId} request user id: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_token_by_user(server, request, callback) {
    const client = new pb_token.TokenServiceClient(server.address, null, null);
    const userId = new pb_token.UserId();
    userId.setUserId(uuid_hex_to_base64(request.id));
    await client.deleteTokenByUser(userId, metadata(server), (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}
