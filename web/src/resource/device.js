import { get_config_value, set_config_value } from './common.js'
import { DeviceServiceClient } from 'rmcs-resource-api/rmcs_resource_api/device_grpc_web_pb.js'
import {
    DeviceId as _DeviceId, 
    SerialNumber as _SerialNumber, 
    TypeId as _TypeId,
    DeviceName as _DeviceName,
    DeviceGatewayType as _DeviceGatewayType,
    DeviceGatewayName as _DeviceGatewayName,
    DeviceSchema as _DeviceSchema,
    DeviceUpdate as _DeviceUpdate,
    GatewayId as _GatewayId, 
    GatewayName as _GatewayName,
    GatewaySchema as _GatewaySchema,
    GatewayUpdate as _GatewayUpdate,
    ConfigId as _ConfigId,
    ConfigSchema as _ConfigSchema,
    ConfigUpdate as _ConfigUpdate,
    TypeSchema as _TypeSchema
} from 'rmcs-resource-api/rmcs_resource_api/device_pb.js'
import {
    base64_to_uuid_hex,
    uuid_hex_to_base64
} from "../utility.js"
import { get_type_schema } from './types.js'


/**
 * @typedef {(string|Uint8Array)} Uuid
 */

/**
 * @typedef {Object} DeviceId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {DeviceId}
 */
function get_device_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    }
}

/**
 * @typedef {Object} SerialNumber
 * @property {string} serial_number
 */

/**
 * @typedef {import('./types.js').TypeId} TypeId
 */

/**
 * @typedef {Object} DeviceName
 * @property {string} name
 */

/**
 * @typedef {Object} DeviceGatewayType
 * @property {Uuid} gateway_id
 * @property {Uuid} type_id
 */

/**
 * @typedef {Object} DeviceGatewayName
 * @property {Uuid} gateway_id
 * @property {string} name
 */

/**
 * @typedef {Object} DeviceSchema
 * @property {Uuid} id
 * @property {Uuid} gateway_id
 * @property {string} serial_number
 * @property {string} name
 * @property {string} description
 * @property {import('./types.js').TypeSchema} device_type
 * @property {DeviceConfigSchema[]} configs
 */

/**
 * @param {*} r 
 * @returns {DeviceSchema}
 */
function get_device_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        gateway_id: base64_to_uuid_hex(r.gatewayId),
        serial_number: r.serialNumber,
        name: r.name,
        description: r.description,
        device_type: get_type_schema(r.deviceType),
        configs: get_device_config_schema_vec(r.configsList)
    }
}

/**
 * @param {*} r 
 * @returns {DeviceSchema[]}
 */
function get_device_schema_vec(r) {
    return r.map((v) => {return get_device_schema(v)})
}

/**
 * @typedef {Object} DeviceCreate
 * @property {Uuid} id
 * @property {Uuid} gateway_id
 * @property {string} serial_number
 * @property {string} name
 * @property {string} description
 * @property {Uuid} type_id
 */

/**
 * @typedef {Object} DeviceUpdate
 * @property {Uuid} id
 * @property {?Uuid} gateway_id
 * @property {?string} serial_number
 * @property {?string} name
 * @property {?string} description
 * @property {?Uuid} type_id
 */

/**
 * @typedef {Object} GatewayId
 * @property {Uuid} id
 */

/**
 * @param {*} r 
 * @returns {GatewayId}
 */
function get_gateway_id(r) {
    return {
        id: base64_to_uuid_hex(r.id)
    }
}

/**
 * @typedef {Object} GatewayName
 * @property {string} name
 */

/**
 * @typedef {Object} GatewaySchema
 * @property {Uuid} id
 * @property {string} serial_number
 * @property {string} name
 * @property {string} description
 * @property {import('./types.js').TypeSchema} gateway_type
 * @property {GatewayConfigSchema[]} configs
 */

/**
 * @param {*} r 
 * @returns {GatewaySchema}
 */
function get_gateway_schema(r) {
    return {
        id: base64_to_uuid_hex(r.id),
        serial_number: r.serialNumber,
        name: r.name,
        description: r.description,
        gateway_type: get_type_schema(r.gatewayType),
        configs: get_device_config_schema_vec(r.configsList)
    }
}

/**
 * @param {*} r 
 * @returns {GatewaySchema[]}
 */
function get_gateway_schema_vec(r) {
    return r.map((v) => {return get_gateway_schema(v)})
}

/**
 * @typedef {Object} GatewayCreate
 * @property {Uuid} id
 * @property {string} serial_number
 * @property {string} name
 * @property {string} description
 * @property {?Uuid} type_id
 */

/**
 * @typedef {Object} GatewayUpdate
 * @property {Uuid} id
 * @property {?string} serial_number
 * @property {?string} name
 * @property {?string} description
 * @property {?Uuid} type_id
 */

/**
 * @typedef {Object} ConfigId
 * @property {number} id
 */

/**
 * @param {*} r 
 * @returns {ConfigId}
 */
function get_config_id(r) {
    return {
        id: r.id
    }
}

/**
 * @typedef {Object} DeviceConfigSchema
 * @property {number} id
 * @property {Uuid} device_id
 * @property {string} name
 * @property {number|string} value
 * @property {string} category
 */

/**
 * @typedef {Object} GatewayConfigSchema
 * @property {number} id
 * @property {Uuid} gateway_id
 * @property {string} name
 * @property {number|string} value
 * @property {string} category
 */

/**
 * @param {*} r 
 * @returns {DeviceConfigSchema}
 */
function get_device_config_schema(r) {
    return {
        id: r.id,
        device_id: base64_to_uuid_hex(r.deviceId),
        name: r.name,
        value: get_config_value(r.configBytes, r.configType),
        category: r.category
    }
}

/**
 * @param {*} r 
 * @returns {DeviceConfigSchema[]}
 */
function get_device_config_schema_vec(r) {
    return r.map((v) => {return get_device_config_schema(v)})
}

/**
 * @param {*} r 
 * @returns {GatewayConfigSchema}
 */
function get_gateway_config_schema(r) {
    return {
        id: r.id,
        gateway_id: base64_to_uuid_hex(r.deviceId),
        name: r.name,
        value: get_config_value(r.configBytes, r.configType),
        category: r.category
    }
}

/**
 * @param {*} r 
 * @returns {GatewayConfigSchema[]}
 */
function get_gateway_config_schema_vec(r) {
    return r.map((v) => {return get_gateway_config_schema(v)})
}

/**
 * @typedef {Object} ConfigUpdate
 * @property {number} id
 * @property {?string} name
 * @property {?number|string} value
 * @property {?string} category
 */


/**
 * Read a device by uuid
 * @param {Resource} resource Resource instance
 * @param {DeviceId} request device uuid: id
 * @param {function(?grpc.web.RpcError, ?DeviceSchema)} callback The callback function(error, response)
 */
export async function read_device(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const deviceId = new _DeviceId()
    deviceId.setId(uuid_hex_to_base64(request.id))
    await client.readDevice(deviceId, {}, (e, r) => {
        const response = r ? get_device_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read a device by serial number
 * @param {Resource} resource Resource instance
 * @param {SerialNumber} request serial number: serial_number
 * @param {function(?grpc.web.RpcError, ?DeviceSchema)} callback The callback function(error, response)
 */
export async function read_device_by_sn(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const serialNumber = new _SerialNumber()
    serialNumber.setSerialNumber(request.serial_number)
    await client.readDeviceBySn(serialNumber, {}, (e, r) => {
        const response = r ? get_device_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read devices by gateway
 * @param {Resource} resource Resource instance
 * @param {GatewayId} request gateway uuid: id
 * @param {function(?grpc.web.RpcError, ?DeviceSchema[])} callback The callback function(error, response)
 */
export async function list_device_by_gateway(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayId = new _GatewayId()
    gatewayId.setId(uuid_hex_to_base64(request.id))
    await client.listDeviceByGateway(gatewayId, {}, (e, r) => {
        const response = r ? get_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read devices by type
 * @param {Resource} resource Resource instance
 * @param {TypeId} request type uuid: id
 * @param {function(?grpc.web.RpcError, ?DeviceSchema[])} callback The callback function(error, response)
 */
export async function list_device_by_type(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const typeId = new _TypeId()
    typeId.setId(uuid_hex_to_base64(request.id))
    await client.listDeviceByType(typeId, {}, (e, r) => {
        const response = r ? get_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read devices by name
 * @param {Resource} resource Resource instance
 * @param {DeviceName} request device name: name
 * @param {function(?grpc.web.RpcError, ?DeviceSchema[])} callback The callback function(error, response)
 */
export async function list_device_by_name(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const deviceName = new _DeviceName()
    deviceName.setName(request.name)
    await client.listDeviceByName(deviceName, {}, (e, r) => {
        const response = r ? get_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read devices by gateway and type
 * @param {Resource} resource Resource instance
 * @param {DeviceGatewayType} request gateway and type: gateway_id, type_id
 * @param {function(?grpc.web.RpcError, ?DeviceSchema[])} callback The callback function(error, response)
 */
export async function list_device_by_gateway_type(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayType = new _DeviceGatewayType()
    gatewayType.setId(uuid_hex_to_base64(request.gateway_id))
    gatewayType.setId(uuid_hex_to_base64(request.type_id))
    await client.listDeviceByGatewayType(gatewayType, {}, (e, r) => {
        const response = r ? get_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read devices by gateway and name
 * @param {Resource} resource Resource instance
 * @param {DeviceGatewayName} request gateway and name: gateway_id, name
 * @param {function(?grpc.web.RpcError, ?DeviceSchema[])} callback The callback function(error, response)
 */
export async function list_device_by_gateway_name(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayName = new _DeviceGatewayName()
    gatewayName.setId(uuid_hex_to_base64(request.gateway_id))
    gatewayName.setId(request.name)
    await client.listDeviceByGatewayName(gatewayName, {}, (e, r) => {
        const response = r ? get_device_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a device
 * @param {Resource} resource Resource instance
 * @param {DeviceCreate} request device schema: id, gateway_id, serial_number, name, description, type_id
 * @param {function(?grpc.web.RpcError, ?DeviceId)} callback The callback function(error, response)
 */
export async function create_device(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const typeSchema = new _TypeSchema()
    typeSchema.setId(uuid_hex_to_base64(request.type_id))
    const deviceSchema = new _DeviceSchema()
    deviceSchema.setId(uuid_hex_to_base64(request.id))
    deviceSchema.setGatewayId(uuid_hex_to_base64(request.gateway_id))
    deviceSchema.setSerialNumber(request.serial_number)
    deviceSchema.setName(request.name)
    deviceSchema.setDescription(request.description)
    deviceSchema.setDeviceType(typeSchema)
    await client.createDevice(deviceSchema, {}, (e, r) => {
        const response = r ? get_device_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a device
 * @param {Resource} resource Resource instance
 * @param {DeviceUpdate} request device update: id, gateway_id, serial_number, name, description, type_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_device(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const deviceUpdate = new _DeviceUpdate()
    deviceUpdate.setId(uuid_hex_to_base64(request.id))
    if (request.gateway_id) {
        deviceUpdate.setGatewayId(uuid_hex_to_base64(request.gateway_id))
    }
    deviceUpdate.setSerialNumber(request.serial_number)
    deviceUpdate.setName(request.name)
    deviceUpdate.setDescription(request.description)
    deviceUpdate.setTypeId(request.type_id)
    await client.updateDevice(deviceUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Delete a device
 * @param {Resource} resource Resource instance
 * @param {DeviceId} request device uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_device(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const deviceId = new _DeviceId()
    deviceId.setId(uuid_hex_to_base64(request.id))
    await client.deleteDevice(deviceId, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Read a gateway by uuid
 * @param {Resource} resource Resource instance
 * @param {GatewayId} request gateway uuid: id
 * @param {function(?grpc.web.RpcError, ?GatewaySchema)} callback The callback function(error, response)
 */
export async function read_gateway(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayId = new _GatewayId()
    gatewayId.setId(uuid_hex_to_base64(request.id))
    await client.readGateway(gatewayId, {}, (e, r) => {
        const response = r ? get_gateway_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read a gateway by serial number
 * @param {Resource} resource Resource instance
 * @param {SerialNumber} request serial number: serial_number
 * @param {function(?grpc.web.RpcError, ?GatewaySchema)} callback The callback function(error, response)
 */
export async function read_gateway_by_sn(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const serialNumber = new _SerialNumber()
    serialNumber.setSerialNumber(request.serial_number)
    await client.readGatewayBySn(serialNumber, {}, (e, r) => {
        const response = r ? get_gateway_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read gateways by type
 * @param {Resource} resource Resource instance
 * @param {TypeId} request type uuid: id
 * @param {function(?grpc.web.RpcError, ?GatewaySchema[])} callback The callback function(error, response)
 */
export async function list_gateway_by_type(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const typeId = new _TypeId()
    typeId.setId(uuid_hex_to_base64(request.id))
    await client.listGatewayByType(typeId, {}, (e, r) => {
        const response = r ? get_gateway_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Read gateways by name
 * @param {Resource} resource Resource instance
 * @param {GatewayName} request gateway name: name
 * @param {function(?grpc.web.RpcError, ?GatewaySchema[])} callback The callback function(error, response)
 */
export async function list_gateway_by_name(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayName = new _GatewayName()
    gatewayName.setName(request.name)
    await client.listGatewayByName(gatewayName, {}, (e, r) => {
        const response = r ? get_gateway_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a gateway
 * @param {Resource} resource Resource instance
 * @param {GatewayCreate} request gateway schema: id, serial_number, name, description, type_id
 * @param {function(?grpc.web.RpcError, ?GatewayId)} callback The callback function(error, response)
 */
export async function create_gateway(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const typeSchema = new _TypeSchema()
    typeSchema.setId(uuid_hex_to_base64(request.type_id))
    const gatewaySchema = new _GatewaySchema()
    gatewaySchema.setId(uuid_hex_to_base64(request.id))
    gatewaySchema.setSerialNumber(request.serial_number)
    gatewaySchema.setName(request.name)
    gatewaySchema.setDescription(request.description)
    gatewaySchema.setGatewayType(typeSchema)
    await client.createGateway(gatewaySchema, {}, (e, r) => {
        const response = r ? get_gateway_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a gateway
 * @param {Resource} resource Resource instance
 * @param {GatewayUpdate} request gateway update: id, serial_number, name, description, type_id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_gateway(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayUpdate = new _GatewayUpdate()
    gatewayUpdate.setId(uuid_hex_to_base64(request.id))
    gatewayUpdate.setSerialNumber(request.serial_number)
    gatewayUpdate.setName(request.name)
    gatewayUpdate.setDescription(request.description)
    gatewayUpdate.setTypeId(request.type_id)
    await client.updateGateway(gatewayUpdate, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Delete a gateway
 * @param {Resource} resource Resource instance
 * @param {GatewayId} request gateway uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_gateway(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayId = new _GatewayId()
    gatewayId.setId(uuid_hex_to_base64(request.id))
    await client.deleteGateway(gatewayId, {}, (e, r) => {
        const response = r ? r.toObject() : null
        callback(e, response)
    })
}

/**
 * Read a device configuration by uuid
 * @param {Resource} resource Resource instance
 * @param {ConfigId} request device config uuid: id
 * @param {function(?grpc.web.RpcError, ?DeviceConfigSchema)} callback The callback function(error, response)
 */
export async function read_device_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configId = new _ConfigId()
    configId.setId(request.id)
    await client.readDeviceConfig(configId, {}, (e, r) => {
        const response = r ? get_device_config_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read device configurations by device uuid
 * @param {Resource} resource Resource instance
 * @param {DeviceId} request device uuid: id
 * @param {function(?grpc.web.RpcError, ?DeviceConfigSchema[])} callback The callback function(error, response)
 */
export async function list_device_config_by_device(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const deviceId = new _DeviceId()
    deviceId.setId(uuid_hex_to_base64(request.id))
    await client.listDeviceConfig(deviceId, {}, (e, r) => {
        const response = r ? get_device_config_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a device configuration
 * @param {Resource} resource Resource instance
 * @param {DeviceConfigSchema} request device config schema: device_id, name, value, category
 * @param {function(?grpc.web.RpcError, ?ConfigId)} callback The callback function(error, response)
 */
export async function create_device_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configSchema = new _ConfigSchema()
    configSchema.setDeviceId(uuid_hex_to_base64(request.device_id))
    configSchema.setName(request.name)
    const value = set_config_value(request.value)
    configSchema.setConfigBytes(value.bytes)
    configSchema.setConfigType(value.type)
    configSchema.setCategory(request.category)
    await client.createDeviceConfig(configSchema, {}, (e, r) => {
        const response = r ? get_config_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a device configuration
 * @param {Resource} resource Resource instance
 * @param {ConfigUpdate} request device config update: id, name, value, category
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_device_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configUpdate = new _ConfigUpdate()
    configUpdate.setId(request.id)
    configUpdate.setName(request.name)
    const value = set_config_value(request.value)
    configUpdate.setConfigBytes(value.bytes)
    configUpdate.setConfigType(value.type)
    configUpdate.setCategory(request.category)
    await client.updateDeviceConfig(configUpdate, {}, (e, r) => {
        callback(e, r.toObject())
    })
}

/**
 * Delete a device configuration
 * @param {Resource} resource Resource instance
 * @param {ConfigId} request device config uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_device_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configId = new _ConfigId()
    configId.setId(request.id)
    await client.deleteDeviceConfig(configId, {}, (e, r) => {
        callback(e, r.toObject())
    })
}

/**
 * Read a gateway configuration by uuid
 * @param {Resource} resource Resource instance
 * @param {ConfigId} request gateway config uuid: id
 * @param {function(?grpc.web.RpcError, ?GatewayConfigSchema)} callback The callback function(error, response)
 */
export async function read_gateway_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configId = new _ConfigId()
    configId.setId(request.id)
    await client.readGatewayConfig(configId, {}, (e, r) => {
        const response = r ? get_gateway_config_schema(r.toObject().result) : null
        callback(e, response)
    })
}

/**
 * Read gateway configurations by gateway uuid
 * @param {Resource} resource Resource instance
 * @param {GatewayId} request gateway uuid: id
 * @param {function(?grpc.web.RpcError, ?GatewayConfigSchema[])} callback The callback function(error, response)
 */
export async function list_gateway_config_by_gateway(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const gatewayId = new _GatewayId()
    gatewayId.setId(uuid_hex_to_base64(request.id))
    await client.listGatewayConfig(gatewayId, {}, (e, r) => {
        const response = r ? get_gateway_config_schema_vec(r.toObject().resultsList) : null
        callback(e, response)
    })
}

/**
 * Create a gateway configuration
 * @param {Resource} resource Resource instance
 * @param {GatewayConfigSchema} request gateway config schema: gateway_id, name, value, category
 * @param {function(?grpc.web.RpcError, ?ConfigId)} callback The callback function(error, response)
 */
export async function create_gateway_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configSchema = new _ConfigSchema()
    configSchema.setDeviceId(uuid_hex_to_base64(request.gateway_id))
    configSchema.setName(request.name)
    const value = set_config_value(request.value)
    configSchema.setConfigBytes(value.bytes)
    configSchema.setConfigType(value.type)
    configSchema.setCategory(request.category)
    await client.createGatewayConfig(configSchema, {}, (e, r) => {
        const response = r ? get_config_id(r.toObject()) : null
        callback(e, response)
    })
}

/**
 * Update a gateway configuration
 * @param {Resource} resource Resource instance
 * @param {ConfigUpdate} request gateway config update: id, name, value, category
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function update_gateway_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configUpdate = new _ConfigUpdate()
    configUpdate.setId(request.id)
    configUpdate.setName(request.name)
    const value = set_config_value(request.value)
    configUpdate.setConfigBytes(value.bytes)
    configUpdate.setConfigType(value.type)
    configUpdate.setCategory(request.category)
    await client.updateGatewayConfig(configUpdate, {}, (e, r) => {
        callback(e, r.toObject())
    })
}

/**
 * Delete a gateway configuration
 * @param {Resource} resource Resource instance
 * @param {ConfigId} request gateway config uuid: id
 * @param {function(?grpc.web.RpcError, ?{})} callback The callback function(error, response)
 */
export async function delete_gateway_config(resource, request, callback) {
    const client = new DeviceServiceClient(resource.address, null, null)
    const configId = new _ConfigId()
    configId.setId(request.id)
    await client.deleteGatewayConfig(configId, {}, (e, r) => {
        callback(e, r.toObject())
    })
}