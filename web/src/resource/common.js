/**
 * @enum {number}
 */
export const DataType = {
    NULLD: 0,
    I8: 1,
    I16: 2,
    I32: 3,
    I64: 4,
    U8: 5,
    U16: 6,
    U32: 7,
    U64: 8,
    F32: 9,
    F64: 10,
    CHAR: 11,
    BOOL: 12
}

/**
 * @enum {number}
 */
export const ConfigType = {
    NULLC: 0,
    INT: 1,
    FLOAT: 2,
    STR: 3
}

/**
 * @param {number|string} type
 * @returns {number}
 */
export function set_data_type(type) {
    if (typeof type === "number") {
        if (type >= 0 && type <= 12) {
            return type
        }
    }
    else if (typeof type === "string") {
        switch (type.toUpperCase()) {
            case "I8": return DataType.I8
            case "I16": return DataType.I16
            case "I32": return DataType.I32
            case "I64": return DataType.I64
            case "U8": return DataType.U8
            case "U16": return DataType.U16
            case "U32": return DataType.U32
            case "U64": return DataType.U64
            case "F32": return DataType.F32
            case "F64": return DataType.F64
            case "CHAR": return DataType.CHAR
            case "BOOL": return DataType.BOOL
        }
    }
    return DataType.NULLD
}

/**
 * @param {number} type 
 * @returns {string}
 */
export function get_data_type(type) {
    switch (type) {
        case DataType.I8: return "I8"
        case DataType.I16: return "I16"
        case DataType.I32: return "I32"
        case DataType.I64: return "I64"
        case DataType.U8: return "U8"
        case DataType.U16: return "U16"
        case DataType.U32: return "U32"
        case DataType.U64: return "U64"
        case DataType.F32: return "F32"
        case DataType.F64: return "F64"
        case DataType.CHAR: return "CHAR"
        case DataType.BOOL: return "BOOL"
    }
    return "NULL"
}

/**
 * @param {string} base64 
 * @returns {ArrayBufferLike}
 */
function base64_to_array_buffer(base64) {
    let binaryString = atob(base64)
    let bytes = new Uint8Array(binaryString.length)
    for (let i=0; i<binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
}

/**
 * @param {ArrayBufferLike} buffer 
 * @returns {string}
 */
function array_buffer_to_base64(buffer) {
    let bytes = new Uint8Array(buffer)
    let binaryString = String.fromCharCode.apply(null, bytes)
    return btoa(binaryString)
}

/**
 * @param {string} base64 
 * @param {ConfigType} type 
 * @returns {(number|string|null)[]}
 */
export function get_config_value(base64, type) {
    const view = new DataView(base64_to_array_buffer(base64))
    if (type == ConfigType.STR) {
        return atob(base64)
    }
    else if (type == ConfigType.INT) {
        return view.getInt32(0, true)
    }
    else if (type == ConfigType.FLOAT) {
        return view.getFloat64(0, true)
    }
    else {
        return null
    }
}

/**
 * @param {?number|string} value 
 */
export function set_config_value(value) {
    if (value === undefined) {
        return {
            bytes: undefined,
            type: undefined
        }
    }
    let base64 = ""
    let type = ConfigType.NULLC
    if (typeof value == "number") {
        const buffer = new ArrayBuffer(8)
        const view = new DataView(buffer)
        if (Number.isInteger(value)) {
            view.setInt32(4, value)
            type = ConfigType.INT
        } else {
            view.setFloat64(0, value)
            type = ConfigType.FLOAT
        }
        base64 = array_buffer_to_base64(view.buffer)
    }
    else if (typeof value == "string") {
        type = ConfigType.STR
        base64 = btoa(value)
    }
    return {
        bytes: base64,
        type: type
    }
}
