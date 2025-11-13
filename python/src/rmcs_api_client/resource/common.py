from enum import Enum
from typing import Union, List
from struct import pack, unpack


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
    STRING = 17
    BYTES = 18

    def from_value(value: Union[int, float, str, bytes, bool, None]):
        if type(value) == int: return DataType.I64
        elif type(value) == float: return DataType.F64
        elif type(value) == str: 
            if len(value) == 1: return DataType.CHAR
            else: return DataType.STRING
        elif type(value) == bytes: return DataType.BYTES
        elif type(value) == bool: return DataType.BOOL
        else: return DataType.NULL


def pack_data(value: Union[int, float, str, bytes, bool, None]) -> bytes:
    if type(value) == int:
        return pack('>q', value)
    elif type(value) == float:
        return pack('>d', value)
    elif type(value) == str:
        return bytes(value, 'utf-8')
    elif type(value) == bytes:
        return value
    elif type(value) == bool:
        if value: return b'\x01'
        else: return b'\x00'
    else:
        return bytes()

def pack_data_array(values: List[Union[int, float, str, bool, None]]) -> bytes:
    binary = bytes()
    for value in values:
        binary_value = pack_data(value)
        if type(value) == bytes or (type(value) == str and len(value) != 1):
            binary = binary + bytes((len(binary_value) % 256,)) # insert length at first element
        binary = binary + binary_value
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
    elif type == DataType.BOOL:
        if value: return b'\x01'
        else: return b'\x00'
    elif type == DataType.CHAR:
        return bytes(value, 'utf-8')
    elif type == DataType.STRING:
        return bytes(value, 'utf-8')
    elif type == DataType.BYTES:
        return bytes(value)
    else:
        return bytes()

def pack_data_array_model(values: List[Union[int, float, str, bool, None]], types: List[DataType]) -> bytes:
    binary = bytes()
    for i, type in enumerate(types):
        binary_value = pack_data_model(values[i], type)
        if type == DataType.STRING or type == DataType.BYTES:
            binary = binary + bytes((len(binary_value) % 256,)) # insert length at first element
        binary = binary + binary_value
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
    elif type == DataType.BOOL:
        if binary == b'\x00': return False
        else: return True
    elif type == DataType.CHAR:
        return str(binary, 'utf-8')
    elif type == DataType.STRING:
        return str(binary, 'utf-8')
    elif type == DataType.BYTES:
        return binary
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
        elif ty == DataType.STRING or ty == DataType.BYTES:
            if index < len(binary): 
                size = int(binary[index]) # first element is the length
                index += 1 # skip first element
            else: size = 1
        if index + size > len(binary): break
        value = unpack_data(binary[index:index + size], ty)
        values.append(value)
        index += size
    return values


class Tag:
    DEFAULT = 0
    MINUTELY = 1
    MINUTELY_AVG = 2
    MINUTELY_MIN = 3
    MINUTELY_MAX = 4
    HOURLY = 5
    HOURLY_AVG = 6
    HOURLY_MIN = 7
    HOURLY_MAX = 8
    DAILY = 9
    DAILY_AVG = 10
    DAILY_MIN = 11
    DAILY_MAX = 12
    WEEKLY = 13
    WEEKLY_AVG = 14
    WEEKLY_MIN = 15
    WEEKLY_MAX = 16
    MONTHLY = 17
    MONTHLY_AVG = 18
    MONTHLY_MIN = 19
    MONTHLY_MAX = 20
    ANNUAL = 21
    ANNUAL_AVG = 22
    ANNUAL_MIN = 23
    ANNUAL_MAX = 24
    GROUP_MINUTELY = 25
    GROUP_HOURLY = 26
    GROUP_DAILY = 27
    GROUP_WEEKLY = 28
    GROUP_MONTHLY = 29
    GROUP_ANNUAL = 30
    ERROR = -1
    DELETE = -2
    HOLD = -3
    SEND_UPLINK = -4
    SEND_DOWNLINK = -5
    TRANSFER_LOCAL = -6
    TRANSFER_GATEWAY = -7
    TRANSFER_SERVER = -8
    BACKUP = -9
    RESTORE = -10
    ANALYSIS_1 = -11
    ANALYSIS_2 = -12
    ANALYSIS_3 = -13
    ANALYSIS_4 = -14
    ANALYSIS_5 = -15
    ANALYSIS_6 = -16
    ANALYSIS_7 = -17
    ANALYSIS_8 = -18
    ANALYSIS_9 = -19
    ANALYSIS_10 = -20
    EXTERNAL_INPUT = -21
    EXTERNAL_OUTPUT = -22
    SUCCESS = 1
    ERROR_UNKNOWN = -1
    ERROR_LOG = -2
    ERROR_SEND = -3
    ERROR_TRANSFER = -4
    ERROR_ANALYSIS = -5
    ERROR_NETWORK = -6
    FAIL_READ = -7
    FAIL_CREATE = -8
    FAIL_UPDATE = -9
    FAIL_DELETE = -10
    INVALID_TOKEN = -11
    INVALID_REQUEST = -12
