import { AuthServiceClient } from "rmcs-auth-api/rmcs_auth_api/auth_grpc_web_pb.js"
import {
    ApiKeyRequest as _ApiKeyRequest,
    ApiKeyResponse as _ApiKeyResponse,
    ApiLoginRequest as _ApiLoginRequest,
    UserKeyRequest as _UserKeyRequest,
    UserLoginRequest as _UserLoginRequest,
    UserRefreshRequest as _UserRefreshRequest,
    UserLogoutRequest as _UserLogoutRequest
} from "rmcs-auth-api/rmcs_auth_api/auth_pb.js"
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64,
    string_to_array_buffer
} from "../utility.js"


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} UserKeyResponse
 * @property {string} public_key
 */

/**
 * @typedef {Object} UserLoginRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} AccessTokenMap
 * @property {Uuid} api_id
 * @property {string} access_token
 * @property {string} refresh_token
 */

/**
 * @param {*} r 
 * @returns {AccessTokenMap}
 */
function get_access_token(r) {
    return {
        api_id: base64_to_uuid_hex(r.apiId),
        access_token: r.accessToken,
        refresh_token: r.refreshToken
    }
}

/**
 * @typedef {Object} UserLoginResponse
 * @property {Uuid} user_id
 * @property {string} auth_token
 * @property {AccessTokenMap} access_tokens
 */

/**
 * @param {*} r 
 * @returns {UserLoginResponse}
 */
function get_login_response(r) {
    return {
        user_id: base64_to_uuid_hex(r.userId),
        auth_token: r.authToken,
        access_tokens: r.accessTokensList.map((v) => {return get_access_token(v)})
    }
}

/**
 * @typedef {Object} UserRefreshRequest
 * @property {Uuid} api_id
 * @property {string} access_token
 * @property {string} refresh_token
 */

/**
 * @typedef {Object} UserRefreshResponse
 * @property {string} access_token
 * @property {string} refresh_token
 */

/**
 * @param {*} r 
 * @returns {UserRefreshResponse}
 */
function get_refresh_response(r) {
    return {
        access_token: r.accessToken,
        refresh_token: r.refreshToken
    }
}

/**
 * @typedef {Object} UserLogoutRequest
 * @property {Uuid} user_id
 * @property {string} auth_token
 */

/**
 * Import a PEM encoded RSA public key, to use for RSA-OAEP / RSASSA-PKCS1-v1_5 encryption
 * @param {string} pem 
 * @returns 
 */
function importKey(pem) {
    try {
        const binaryDerString = window.atob(pem);
        const binaryDer = string_to_array_buffer(binaryDerString);
        return window.crypto.subtle.importKey(
            "spki",
            binaryDer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["encrypt"]
        );
    } catch {
        return null
    }
}

/**
 * Get the encoded message, encrypt it and display a representation of the ciphertext
 * @param {string} message 
 * @param {CryptoKey} encryptionKey 
 * @returns 
 */
async function encryptMessage(message, encryptionKey)
{
    try {
        const enc = new TextEncoder();
        const encoded = enc.encode(message);
        const buf = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            encryptionKey,
            encoded
        );
        const chars = String.fromCharCode.apply(null, new Uint8Array(buf));
        return btoa(chars);
    } catch {
        return null;
    }
}


/**
 * Get user login key
 * @param {Auth} auth Auth instance
 * @param {} request empty object
 * @param {function(?grpc.web.RpcError, ?UserKeyResponse)} callback The callback function(error, response)
 */
export async function user_login_key(auth, request, callback) {
    const client = new AuthServiceClient(auth.address, null, null)
    const userKeyRequest = new _UserKeyRequest()
    await client.userLoginKey(userKeyRequest, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * User login
 * @param {Auth} auth Auth instance
 * @param {UserLoginRequest} request user login request: username, password
 * @param {function(?grpc.web.RpcError, ?UserLoginResponse)} callback The callback function(error, response)
 */
export async function user_login(auth, request, callback) {
    const client = new AuthServiceClient(auth.address, null, null)
    const userKeyRequest = new _UserKeyRequest()
    const userLoginRequest = new _UserLoginRequest()
    userLoginRequest.setUsername(request.username)
    await client.userLoginKey(userKeyRequest, {}, async (e, r) => {
        if (r) {
            const key = r.toObject().publicKey
            const pubkey = await importKey(key)
            const ciphertext = await encryptMessage(request.password, pubkey)
            userLoginRequest.setPassword(ciphertext)
            await client.userLogin(userLoginRequest, {}, (e, r) => {
                const response = r ? get_login_response(r.toObject()) : null
                callback(e, response)
            })
        }
    })
}

/**
 * Refresh user token
 * @param {Auth} auth Auth instance
 * @param {UserRefreshRequest} request user refresh request: api_id, access_token, refresh_token
 * @param {function(?grpc.web.RpcError, ?UserRefreshResponse)} callback The callback function(error, response)
 */
export async function user_refresh(auth, request, callback) {
    const client = new AuthServiceClient(auth.address, null, null)
    const userRefreshRequest = new _UserRefreshRequest()
    userRefreshRequest.setApiId(request.api_id)
    userRefreshRequest.setAccessToken(request.access_token)
    userRefreshRequest.setRefreshToken(request.refresh_token)
    await client.userRefresh(userRefreshRequest, {}, (e, r) => {
        const response = r ? get_refresh_response(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * User logout
 * @param {Auth} auth Auth instance
 * @param {UserLogoutRequest} request user logout request: user_id, auth_token
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function user_logout(auth, request, callback) {
    const client = new AuthServiceClient(auth.address, null, null)
    const userLogoutRequest = new _UserLogoutRequest()
    userLogoutRequest.setUserId(uuid_hex_to_base64(request.user_id))
    userLogoutRequest.setAuthToken(request.auth_token)
    await client.userLogout(userLogoutRequest, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}