/**
 * @enum {number}
 */
export const DataType = {
    NULLD: 0,
    I8: 1,
    I16: 2,
    I32: 3,
    I64: 4,
    I128: 5,
    U8: 6,
    U16: 7,
    U32: 8,
    U64: 9,
    U128: 10,
    F32: 12,
    F64: 13,
    BOOL: 15,
    CHAR: 16,
    STRING: 17,
    BYTES: 18
};

/**
 * @param {number|string} type
 * @returns {number}
 */
export function set_data_type(type) {
    if (typeof type === "number") {
        if (type >= 0 && type <= 12) {
            return type;
        }
    }
    else if (typeof type === "string") {
        switch (type.toUpperCase()) {
            case "I8": return DataType.I8;
            case "I16": return DataType.I16;
            case "I32": return DataType.I32;
            case "I64": return DataType.I64;
            case "I128": return DataType.I128;
            case "U8": return DataType.U8;
            case "U16": return DataType.U16;
            case "U32": return DataType.U32;
            case "U64": return DataType.U64;
            case "U128": return DataType.U128;
            case "F32": return DataType.F32;
            case "F64": return DataType.F64;
            case "BOOL": return DataType.BOOL;
            case "CHAR": return DataType.CHAR;
            case "STRING": return DataType.STRING;
            case "BYTES": return DataType.BYTES;
        }
    }
    return DataType.NULLD;
}

/**
 * @param {number[]|string[]} types
 * @returns {string}
 */
export function set_data_type_bytes(types) {
    const type_code = types.map((value) => { return set_data_type(value); });
    const type_str = type_code.map((value) => { return String.fromCharCode(value); }).join("");
    return btoa(type_str)
}

/**
 * @param {number} type 
 * @returns {string}
 */
export function get_data_type(type) {
    switch (type) {
        case DataType.I8: return "I8";
        case DataType.I16: return "I16";
        case DataType.I32: return "I32";
        case DataType.I64: return "I64";
        case DataType.I128: return "I128";
        case DataType.U8: return "U8";
        case DataType.U16: return "U16";
        case DataType.U32: return "U32";
        case DataType.U64: return "U64";
        case DataType.U128: return "U128";
        case DataType.F32: return "F32";
        case DataType.F64: return "F64";
        case DataType.BOOL: return "BOOL";
        case DataType.CHAR: return "CHAR";
        case DataType.STRING: return "STRING";
        case DataType.BYTES: return "BYTES";
    }
    return "NULL";
}

/**
 * @param {string} types
 * @returns {string[]}
 */
export function get_data_type_bytes(types) {
    const type_str = atob(types);
    const type_code = type_str.split("").map((value) => { return value.charCodeAt(); });
    return type_code.map((value) => { return get_data_type(value) });
}

/**
 * @param {string} base64 
 * @returns {ArrayBufferLike}
 */
function base64_to_array_buffer(base64) {
    let binaryString = atob(base64);
    let bytes = new Uint8Array(binaryString.length);
    for (let i=0; i<binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * @param {ArrayBufferLike} buffer 
 * @returns {string}
 */
function array_buffer_to_base64(buffer) {
    let bytes = new Uint8Array(buffer);
    let binaryString = String.fromCharCode.apply(null, bytes);
    return btoa(binaryString);
}

/**
 * @param {string} base64 
 * @param {number[]} types 
 * @returns {(number|bigint|string|Uint8Array|boolean|null)[]}
 */
export function get_data_value(base64, types) {
    const buffer = base64_to_array_buffer(base64);
    const array = new Uint8Array(buffer);
    const view = new DataView(buffer);
    let values = [];
    let offset = 0;
    let length = 0;
    for (const type of types) {
        switch (type) {
            case DataType.I8: 
                if (offset + 1 <= view.byteLength) values.push(view.getInt8(offset));
                offset += 1;
                break;
            case DataType.I16: 
                if (offset + 2 <= view.byteLength) values.push(view.getInt16(offset));
                offset += 2;
                break;
            case DataType.I32: 
                if (offset + 4 <= view.byteLength) values.push(view.getInt32(offset));
                offset += 4;
                break;
            case DataType.I64: 
                if (offset + 8 <= view.byteLength) values.push(view.getBigInt64(offset));
                offset += 8;
                break;
            case DataType.I128: 
                if (offset + 16 <= view.byteLength) values.push(view.getBigInt64(offset));
                offset += 16;
                break;
            case DataType.U8: 
                if (offset + 1 <= view.byteLength) values.push(view.getUint8(offset));
                offset += 1;
                break;
            case DataType.U16: 
                if (offset + 2 <= view.byteLength) values.push(view.getUint16(offset));
                offset += 2;
                break;
            case DataType.U32: 
                if (offset + 4 <= view.byteLength) values.push(view.getUint32(offset));
                offset += 4;
                break;
            case DataType.U64: 
                if (offset + 8 <= view.byteLength) values.push(view.getBigUint64(offset));
                offset += 8;
                break;
            case DataType.U128: 
                if (offset + 16 <= view.byteLength) values.push(view.getBigUint64(offset));
                offset += 16;
                break;
            case DataType.F32: 
                if (offset + 4 <= view.byteLength) values.push(view.getFloat32(offset));
                offset += 4;
                break;
            case DataType.F64: 
                if (offset + 8 <= view.byteLength) values.push(view.getFloat64(offset));
                offset += 8;
                break;
            case DataType.CHAR: 
                if (offset + 1 <= view.byteLength) values.push(String.fromCharCode(view.getUint8(offset)));
                offset += 1;
                break;
            case DataType.BOOL: 
                if (offset + 1 <= view.byteLength) values.push(Boolean(view.getUint8(offset)));
                offset += 1;
                break;
            case DataType.STRING:
                length = 0;
                if (offset + 1 <= array.byteLength) length = array[offset];
                if (offset + length + 1 <= array.byteLength) {
                    const arrayString = array.slice(offset + 1, offset + length + 1);
                    values.push(new TextDecoder("utf-8").decode(arrayString));
                }
                offset += length + 1;
                break;
            case DataType.BYTES:
                length = 0;
                if (offset + 1 <= array.byteLength) length = array[offset];
                if (offset + length + 1 <= array.byteLength) {
                    const arrayBytes = array.slice(offset + 1, offset + length + 1);
                    values.push(new Uint8Array(arrayBytes));
                }
                offset += length + 1;
                break;
            default:
                values.push(null);
        }
    }
    return values;
}

/**
 * @param {(number|bigint|string|Uint8Array|boolean)[]} values
 */
export function set_data_value(values) {
    if (values === undefined) {
        return {
            bytes: "",
            types: []
        };
    }
    let base64 = "";
    let types = [];
    for (const value of values) {
        let type = DataType.NULLD;
        if (typeof value == "number") {
            if (Number.isInteger(value)) {
                const buffer = new ArrayBuffer(4);
                const view = new DataView(buffer);
                view.setInt32(0, value);
                type = DataType.I32;
                base64 += array_buffer_to_base64(view.buffer);
            } else {
                const buffer = new ArrayBuffer(8);
                const view = new DataView(buffer);
                view.setFloat64(0, value);
                type = DataType.F64;
                base64 += array_buffer_to_base64(view.buffer);
            }
        }
        if (typeof value == "bigint") {
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setBigInt64(0, value);
            type = DataType.I64;
            base64 += array_buffer_to_base64(view.buffer);
        }
        else if (typeof value == "string") {
            if (value.length == 1) {
                type = DataType.CHAR;
                base64 += btoa(value);
            }
            else {
                type = DataType.STRING;
                let array = new Uint8Array(value.length + 1);
                array.set(new Uint8Array([value.length]));
                array.set(new TextEncoder("utf-8").encode(value), 1);
                base64 += array_buffer_to_base64(array.buffer);
            }
        }
        else if (value instanceof Uint8Array) {
            type = DataType.BYTES;
            let array = new Uint8Array(value.length + 1);
            array.set(new Uint8Array([value.length]));
            array.set(value, 1);
            base64 += array_buffer_to_base64(array.buffer);
        }
        else if (typeof value == "boolean") {
            type = DataType.BOOL;
            base64 += btoa(String.fromCharCode(value));
        }
        types.push(type);
    }
    return {
        bytes: base64,
        types: types
    };
}
