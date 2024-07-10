from enum import Enum
from typing import Union, List
from struct import pack, unpack


class ConfigType(Enum):
    NULL = 0
    INT = 1
    FLOAT = 2
    STR = 3

    def from_value(value: Union[int, float, str, None]):
        if type(value) == int: return ConfigType.INT
        elif type(value) == float: return ConfigType.FLOAT
        elif type(value) == str: return ConfigType.STR
        else: return ConfigType.NULL


class DataType(Enum):
    NULL = 0
    I8 = 1
    I16 = 2
    I32 = 3
    I64 = 4
    I128 = 5
    U8 = 6
    U16 = 7
    U32 = 8
    U64 = 9
    U128 = 10
    F32 = 12
    F64 = 13
    BOOL = 15
    CHAR = 16

    def from_value(value: Union[int, float, str, bool, None]):
        if type(value) == int: return DataType.I64
        elif type(value) == float: return DataType.F64
        elif type(value) == str: return DataType.CHAR
        else: return DataType.NULL


def pack_config(value: Union[int, float, str, None]) -> bytes:
    if type(value) == int:
        return pack('>q', value)
    elif type(value) == float:
        return pack('>d', value)
    elif type(value) == str:
        return bytes(value, 'utf-8')
    else:
        return bytes()

def unpack_config(binary: bytes, type: ConfigType) -> Union[int, float, str, None]:
    if type == ConfigType.INT:
        return unpack('>q', binary)[0]
    elif type == ConfigType.FLOAT:
        return unpack('>d', binary)[0]
    elif type == ConfigType.STR:
        return str(binary, 'utf-8')
    else:
        return None

def pack_data(value: Union[int, float, str, bool, None]) -> bytes:
    if type(value) == int:
        return pack('>q', value)
    elif type(value) == float:
        return pack('>d', value)
    elif type(value) == str:
        return bytes(value, 'utf-8')
    elif type(value) == bool:
        if value: return b'\x01'
        else: return b'\x00'
    else:
        return bytes()

def pack_data_array(values: List[Union[int, float, str, bool, None]]) -> bytes:
    binary = bytes()
    for value in values:
        binary = binary + pack_data(value)
    return binary

def pack_data_model(value: Union[int, float, str, bool, None], type: DataType):
    if type == DataType.I8:
        return pack('b', value)
    elif type == DataType.I16:
        return pack('>h', value)
    elif type == DataType.I32:
        return pack('>l', value)
    elif type == DataType.I64:
        return pack('>q', value)
    elif type == DataType.U8:
        return pack('B', value)
    elif type == DataType.U16:
        return pack('>H', value)
    elif type == DataType.U32:
        return pack('>L', value)
    elif type == DataType.U64:
        return pack('>Q', value)
    elif type == DataType.F32:
        return pack('>f', value)
    elif type == DataType.F64:
        return pack('>d', value)
    elif type == DataType.CHAR:
        return bytes(value, 'utf-8')
    elif type == DataType.BOOL:
        if value: return b'\x01'
        else: return b'\x00'
    else:
        return bytes()

def pack_data_array_model(values: List[Union[int, float, str, bool, None]], types: List[DataType]) -> bytes:
    binary = bytes()
    for i, type in enumerate(types):
        binary = binary + pack_data_model(values[i], type)
    return binary

def unpack_data(binary: bytes, type: DataType) -> Union[int, float, str, bool, None]:
    if type == DataType.I8:
        return unpack('b', binary)[0]
    elif type == DataType.I16:
        return unpack('>h', binary)[0]
    elif type == DataType.I32:
        return unpack('>l', binary)[0]
    elif type == DataType.I64:
        return unpack('>q', binary)[0]
    elif type == DataType.I128:
        return unpack('>q', binary)[0]
    elif type == DataType.U8:
        return unpack('B', binary)[0]
    elif type == DataType.U16:
        return unpack('>H', binary)[0]
    elif type == DataType.U32:
        return unpack('>L', binary)[0]
    elif type == DataType.U64:
        return unpack('>Q', binary)[0]
    elif type == DataType.U128:
        return unpack('>Q', binary)[0]
    elif type == DataType.F32:
        return unpack('>f', binary)[0]
    elif type == DataType.F64:
        return unpack('>d', binary)[0]
    elif type == DataType.CHAR:
        return str(binary, 'utf-8')
    elif type == DataType.BOOL:
        if binary == b'\x00': return False
        else: return True
    else:
        return None

def unpack_data_array(binary: bytes, types: List[DataType]) -> List[Union[int, float, str, bool, None]]:
    index = 0
    values = []
    for ty in types:
        size = 0
        if ty == DataType.I8 or ty == DataType.U8 or ty == DataType.CHAR or ty == DataType.BOOL:
            size = 1
        elif ty == DataType.I16 or ty == DataType.U16:
            size = 2
        elif ty == DataType.I32 or ty == DataType.U32 or ty == DataType.F32:
            size = 4
        elif ty == DataType.I64 or ty == DataType.U64 or ty == DataType.F64:
            size = 8
        elif ty == DataType.I128 or ty == DataType.U128:
            size = 16
        value = unpack_data(binary[index:index + size], ty)
        values.append(value)
        index += size
    return values
