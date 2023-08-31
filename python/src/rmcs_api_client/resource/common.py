from enum import Enum
from typing import Union, List
from struct import pack, unpack


class DataIndexing(Enum):
    TIMESTAMP = 0
    INDEX = 1
    TIMESTAMP_INDEX = 2

    def from_int(data_indexing: int):
        if data_indexing == 1: return DataIndexing.INDEX
        elif data_indexing == 2: return DataIndexing.TIMESTAMP_INDEX
        else: return DataIndexing.TIMESTAMP


class ConfigType(Enum):
    NULL = 0
    INT = 1
    FLOAT = 2
    STR = 3

    def from_int(config_type: int):
        if config_type == 1: return ConfigType.INT
        elif config_type == 2: return ConfigType.FLOAT
        elif config_type == 3: return ConfigType.STR
        else: ConfigType.NULL

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
    U8 = 5
    U16 = 6
    U32 = 7
    U64 = 8
    F32 = 9
    F64 = 10
    CHAR = 11
    BOOL = 12

    def from_int(data_type: int):
        if data_type == 1: return DataType.I8
        elif data_type == 2: return DataType.I16
        elif data_type == 3: return DataType.I32
        elif data_type == 4: return DataType.I64
        elif data_type == 5: return DataType.U8
        elif data_type == 6: return DataType.U16
        elif data_type == 7: return DataType.U32
        elif data_type == 8: return DataType.U64
        elif data_type == 9: return DataType.F32
        elif data_type == 10: return DataType.F64
        elif data_type == 11: return DataType.CHAR
        elif data_type == 12: return DataType.BOOL
        else: return DataType.NULL

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
