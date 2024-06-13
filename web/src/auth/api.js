import pb_api from "rmcs-auth-api/rmcs_auth_api/api_grpc_web_pb.js";
import {
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
 * @typedef {Object} ApiId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {ApiId}
 */
function getApiId(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    };
}

/**
 * @typedef {Object} ApiName
 * @property {string} name
 */

/**
 * @typedef {Object} ApiCategory
 * @property {string} category
 */

/**
 * @typedef {Object} ApiSchema
 * @property {Uuid} id
 * @property {string} name
 * @property {string} address
 * @property {string} category
 * @property {string} description
 * @property {string} password
 * @property {string} access_key
 * @property {ProcedureSchema[]} procedures
 */

/**
 * @param {*} r 
 * @returns {ApiSchema}
 */
function get_api_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        name: r.name,
        address: r.address,
        category: r.category,
        description: r.description,
        password: r.password,
        access_key: r.accessKey,
        procedures: get_procedure_schema_vec(r.proceduresList)
    };
}

/**
 * @param {*} r 
 * @returns {ApiSchema[]}
 */
function get_api_schema_vec(r) {
    return r.map((v) => {return get_api_schema(v)});
}

/**
 * @typedef {Object} ApiUpdate
 * @property {Uuid} id
 * @property {?string} name
 * @property {?string} address
 * @property {?string} category
 * @property {?string} description
 * @property {?string} password
 * @property {?string} access_key
 */

/**
 * @typedef {Object} ProcedureId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {ProcedureId}
 */
function get_procedure_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    };
}

/**
 * @typedef {Object} ProcedureName
 * @property {Uuid} api_id
 * @property {string} name
 */

/**
 * @typedef {Object} ProcedureSchema
 * @property {Uuid} id
 * @property {string} api_id
 * @property {string} name
 * @property {string} description
 * @property {string[]} roles
 */

/**
 * @param {*} r 
 * @returns {ProcedureSchema}
 */
function get_procedure_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        api_id: base64_to_uuid_hex(r.apiId),
        name: r.name,
        description: r.description,
        roles: r.rolesList
    };
}

/**
 * @param {*} r 
 * @returns {ProcedureSchema[]}
 */
function get_procedure_schema_vec(r) {
    return r.map((v) => {return get_procedure_schema(v)});
}

/**
 * @typedef {Object} ProcedureUpdate
 * @property {Uuid} id
 * @property {?string} name
 * @property {?string} description
 */


/**
 * Read an api by uuid
 * @param {ServerConfig} server Server configuration
 * @param {ApiId} request api uuid: id
 * @param {function(?grpc.web.RpcError, ?ApiSchema)} callback The callback function(error, response)
 */
export async function read_api(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const apiId = new pb_api.ApiId();
    apiId.setId(uuid_hex_to_base64(request.id));
    await client.readApi(apiId, {}, (e, r) => {
        const response = r ? get_api_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read an api by name
 * @param {ServerConfig} server Server configuration
 * @param {ApiName} request api name: id, name
 * @param {function(?grpc.web.RpcError, ?ApiSchema)} callback The callback function(error, response)
 */
export async function read_api_by_name(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const apiName = new pb_api.ApiName();
    apiName.setName(request.name);
    await client.readApiByName(apiName, {}, (e, r) => {
        const response = r ? get_api_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read apis by category
 * @param {ServerConfig} server Server configuration
 * @param {ApiCategory} request api category: category
 * @param {function(?grpc.web.RpcError, ?ApiSchema[])} callback The callback function(error, response)
 */
export async function list_api_by_category(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const apiCategory = new pb_api.ApiCategory();
    apiCategory.setCategory(request.category);
    await client.listApiByCategory(apiCategory, {}, (e, r) => {
        const response = r ? get_api_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create an api
 * @param {ServerConfig} server Server configuration
 * @param {ApiSchema} request api schema: id, name, address, category, description, password, access_key
 * @param {function(?grpc.web.RpcError, ?ApiId)} callback The callback function(error, response)
 */
export async function create_api(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const apiSchema = new pb_api.ApiSchema();
    apiSchema.setId(uuid_hex_to_base64(request.id));
    apiSchema.setName(request.name);
    apiSchema.setAddress(request.address);
    apiSchema.setCategory(request.category);
    apiSchema.setDescription(request.description);
    apiSchema.setPassword(request.password);
    apiSchema.setAccessKey(request.access_key);
    await client.createApi(apiSchema, {}, (e, r) => {
        const response = r ? getApiId(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Update an api
 * @param {ServerConfig} server Server configuration
 * @param {ApiUpdate} request api update: id, name, address, category, description, password, access_key
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_api(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const apiUpdate = new pb_api.ApiUpdate();
    apiUpdate.setId(uuid_hex_to_base64(request.id));
    apiUpdate.setName(request.name);
    apiUpdate.setAddress(request.address);
    apiUpdate.setCategory(request.category);
    apiUpdate.setDescription(request.description);
    apiUpdate.setPassword(request.password);
    apiUpdate.setAccessKey(request.access_key);
    await client.updateApi(apiUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete an api
 * @param {ServerConfig} server Server configuration
 * @param {ApiId} request api uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_api(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const apiId = new pb_api.ApiId();
    apiId.setId(uuid_hex_to_base64(request.id));
    await client.deleteApi(apiId, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Read an procedure by uuid
 * @param {ServerConfig} server Server configuration
 * @param {ProcedureId} request procedure uuid: id
 * @param {function(?grpc.web.RpcError, ?ProcedureSchema)} callback The callback function(error, response)
 */
export async function read_procedure(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const procedureId = new pb_api.ProcedureId();
    procedureId.setId(uuid_hex_to_base64(request.id));
    await client.readProcedure(procedureId, {}, (e, r) => {
        const response = r ? get_procedure_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read an procedure by name
 * @param {ServerConfig} server Server configuration
 * @param {ProcedureName} request procedure name: api_id, name
 * @param {function(?grpc.web.RpcError, ?ProcedureSchema)} callback The callback function(error, response)
 */
export async function read_procedure_by_name(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const procedureName = new pb_api.ProcedureName();
    procedureName.setApiId(uuid_hex_to_base64(request.api_id));
    procedureName.setName(request.name);
    await client.readProcedureByName(procedureName, {}, (e, r) => {
        const response = r ? get_procedure_schema(r.toObject().result) : null;
        callback(e, response);
    });
}

/**
 * Read procedures by api uuid
 * @param {ServerConfig} server Server configuration
 * @param {ApiId} request api uuid: id
 * @param {function(?grpc.web.RpcError, ?ProcedureSchema[])} callback The callback function(error, response)
 */
export async function list_procedure_by_api(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const apiId = new pb_api.ApiId();
    apiId.setId(uuid_hex_to_base64(request.id));
    await client.listProcedureByApi(apiId, {}, (e, r) => {
        const response = r ? get_procedure_schema_vec(r.toObject().resultsList) : null;
        callback(e, response);
    });
}

/**
 * Create a procedure
 * @param {ServerConfig} server Server configuration
 * @param {ProcedureSchema} request procedure schema: id, api_id, name, description
 * @param {function(?grpc.web.RpcError, ?ProcedureSchema)} callback The callback function(error, response)
 */
export async function create_procedure(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const procedureSchema = new pb_api.ProcedureSchema();
    procedureSchema.setId(uuid_hex_to_base64(request.id));
    procedureSchema.setApiId(uuid_hex_to_base64(request.api_id));
    procedureSchema.setName(request.name);
    procedureSchema.setDescription(request.description);
    await client.createProcedure(procedureSchema, {}, (e, r) => {
        const response = r ? get_procedure_id(r.toObject()) : null;
        callback(e, response);
    });
}

/**
 * Update a procedure
 * @param {ServerConfig} server Server configuration
 * @param {ProcedureUpdate} request procedure update: id, name, description
 * @param {function(?grpc.web.RpcError, ?ProcedureSchema)} callback The callback function(error, response)
 */
export async function update_procedure(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const procedureUpdate = new pb_api.ProcedureUpdate();
    procedureUpdate.setId(uuid_hex_to_base64(request.id));
    procedureUpdate.setName(request.name);
    procedureUpdate.setDescription(request.description);
    await client.updateProcedure(procedureUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}

/**
 * Delete a procedure
 * @param {ServerConfig} server Server configuration
 * @param {ProcedureId} request procedure uuid: id
 * @param {function(?grpc.web.RpcError, ?ProcedureSchema)} callback The callback function(error, response)
 */
export async function delete_procedure(server, request, callback) {
    const client = new pb_api.ApiServiceClient(server.address, null, null);
    const procedureId = new pb_api.ProcedureId();
    procedureId.setId(uuid_hex_to_base64(request.id));
    await client.deleteProcedure(procedureId, {}, (e, r) => {
        const response = r ? r.toObject() : null;
        callback(e, response);
    });
}
