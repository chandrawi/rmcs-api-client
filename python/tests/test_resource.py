import os
import sys

SOURCE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))),"src")
sys.path.append(SOURCE_PATH)

from datetime import datetime
import uuid
import dotenv
import pytest
from rmcs_api_client.resource import Resource, DataType
from uuid import UUID
import utility

def test_resource():
    dotenv.load_dotenv()
    address = os.getenv('SERVER_ADDRESS_RESOURCE')
    db_resource_url_test = os.getenv("DATABASE_URL_RESOURCE_TEST")
    resource = Resource(address)

    # truncate resource tables before testing
    utility.truncate_tables_resource(db_resource_url_test)

    # start resource server for testing
    utility.start_resource_server()

    # create new data model and add data types
    model_id = resource.create_model(uuid.uuid4(), [DataType.F64, DataType.F64], "UPLINK", "speed and direction", None)
    model_buf_id = resource.create_model(uuid.uuid4(), [DataType.U8, DataType.U8, DataType.U8, DataType.U8], "UPLINK", "buffer 4", None)
    # create scale, symbol, and threshold configurations for new created model
    resource.create_model_config(model_id, 0, "scale_0", "speed", "SCALE")
    resource.create_model_config(model_id, 1, "scale_1", "direction", "SCALE")
    resource.create_model_config(model_id, 0, "unit_0", "meter/second", "UNIT")
    resource.create_model_config(model_id, 1, "unit_1", "degree", "UNIT")
    model_cfg_id = resource.create_model_config(model_id, 0, "upper_threshold", 250, "THRESHOLD")

    # Create new type and link it to newly created model
    type_id = resource.create_type(uuid.uuid4(), "Speedometer Compass", None)
    resource.add_type_model(type_id, model_id)
    resource.add_type_model(type_id, model_buf_id)

    # create new devices with newly created type as its type 
    gateway_id = UUID("bfc01f2c-8b2c-47cf-912a-f95f6f41a1e6")
    device_id1 = UUID("74768a42-bc29-40eb-8934-2effcbf34f8f")
    device_id2 = UUID("150a0a77-2d9b-4672-9253-3d42fd0f0940")
    resource.create_device(device_id1, gateway_id, type_id, "TEST01", "Speedometer Compass 1", None)
    resource.create_device(device_id2, gateway_id, type_id, "TEST02", "Speedometer Compass 2", None)
    # create device configurations
    resource.create_device_config(device_id1, "coef_0", -21, "CONVERSION")
    resource.create_device_config(device_id1, "coef_1", 0.1934, "CONVERSION")
    resource.create_device_config(device_id1, "period", 60, "NETWORK")
    resource.create_device_config(device_id2, "coef_0", 44, "CONVERSION")
    resource.create_device_config(device_id2, "coef_1", 0.2192, "CONVERSION")
    device_cfg_id = resource.create_device_config(device_id2, "period", 120, "NETWORK")

    # create new group and register newly created models as its member
    group_model_id = resource.create_group_model(uuid.uuid4(), "data", "APPLICATION", None)
    resource.add_group_model_member(group_model_id, model_id)
    # create new group and register newly created devices as its member
    group_device_id = resource.create_group_device(uuid.uuid4(), "sensor", "APPLICATION", None)
    resource.add_group_device_member(group_device_id, device_id1)
    resource.add_group_device_member(group_device_id, device_id2)

    # read model
    model = resource.read_model(model_id)
    models = resource.list_model_by_name("speed")
    model_ids = []
    for model in models: model_ids.append(model.id)
    assert model_id in model_ids
    assert model.name == "speed and direction"
    assert model.category == "UPLINK"
    assert model.data_type == [DataType.F64, DataType.F64]
    # read model configurations
    model_configs = resource.list_model_config_by_model(model_id)
    config_vec =[]
    for cfg_vec in model.configs:
        for cfg in cfg_vec:
            config_vec.append(cfg)
    assert model_configs == config_vec

    # read device
    device1 = resource.read_device(device_id1)
    devices = resource.list_device_by_gateway(gateway_id)
    device_ids = []
    for device in devices: device_ids.append(device.id)
    assert device_id1 in device_ids # device_id1 > device_id2, so device1 in second (last) order
    assert device1.serial_number == "TEST01"
    assert device1.name == "Speedometer Compass 1"
    # read type
    types = resource.list_type_by_name("Speedometer")
    device_type_filter = filter(lambda x: x.id == type_id, types)
    device_type = list(device_type_filter)[0]
    assert device1.type == device_type
    # read device configurations
    device_configs = resource.list_device_config_by_device(device_id1)
    print(device1.configs)
    print(device_configs)
    assert device1.configs == device_configs

    # read group model
    groups = resource.list_group_model_by_category("APPLICATION")
    group_model_filter = filter(lambda x: model_id in x.models, groups)
    group_model = list(group_model_filter)[0]
    assert group_model.name == "data"
    assert group_model.category == "APPLICATION"
    # read group device
    groups = resource.list_group_device_by_name("sensor")
    group_device_filter = filter(lambda x: device_id1 in x.devices, groups)
    group_device = list(group_device_filter)[0]
    assert group_device.devices == [device_id1, device_id2]
    assert group_device.name == "sensor"
    assert group_device.category == "APPLICATION"

    # update model
    resource.update_model(model_buf_id, [DataType.I32, DataType.I32], None, "buffer 2 integer", "Model for store 2 i32 temporary data")
    model = resource.read_model(model_buf_id)
    assert model.name == "buffer 2 integer"
    assert model.data_type == [DataType.I32, DataType.I32]
    # update model configurations
    resource.update_model_config(model_cfg_id, None, 238, None)
    config = resource.read_model_config(model_cfg_id)
    assert config.value == 238

    # update type
    resource.update_type(type_id, None, "Speedometer and compass sensor")
    type_ = resource.read_type(type_id)
    assert type_.description == "Speedometer and compass sensor"

    # update device
    resource.update_device(device_id2, None, None, None, None, "E-bike speedometer and compass sensor 2")
    device2 = resource.read_device(device_id2)
    assert device2.description == "E-bike speedometer and compass sensor 2"
    # update device config
    resource.update_device_config(device_cfg_id, None, 60, None)
    config = resource.read_device_config(device_cfg_id)
    assert config.value == 60

    # update group model
    resource.update_group_model(group_model_id, None, None, "Data models")
    group = resource.read_group_model(group_model_id)
    assert group.description == "Data models"
    # update group device
    resource.update_group_device(group_device_id, None, None, "Sensor devices")
    group = resource.read_group_device(group_device_id)
    assert group.description == "Sensor devices"

    # generate raw data and create buffers
    timestamp = datetime.strptime("2023-05-07 07:08:48.123456", "%Y-%m-%d %H:%M:%S.%f")
    raw_1 = [1231, 890]
    raw_2 = [1452, -341]
    resource.create_buffer(device_id1, model_buf_id, timestamp, raw_1, "ANALYSIS_1")
    resource.create_buffer(device_id2, model_buf_id, timestamp, raw_2, "ANALYSIS_1")

    # read buffer
    buffers = resource.list_buffer_first(100, None, None, None)
    assert buffers[0].data == raw_1
    assert buffers[1].data == raw_2

    # get model config value then convert buffer data
    def conf_val(model_configs, name):
        for config in model_configs:
            if config.name == name:
                return config.value
    def convert(raw, coef0, coef1):
        return (raw - coef0) * coef1
    coef0 = conf_val(device_configs, "coef_0")
    coef1 = conf_val(device_configs, "coef_1")
    speed = convert(raw_1[0], coef0, coef1)
    direction = convert(raw_1[1], coef0, coef1)
    # create data
    resource.create_data(device_id1, model_id, timestamp, [speed, direction])

    # read data
    datas = resource.list_data_by_number_before(device_id1, model_id, timestamp, 100)
    data_filter = filter(lambda x: x.device_id == device_id1 and x.model_id == model_id, datas)
    data = list(data_filter)[0]
    assert [speed, direction] == data.data
    assert timestamp == data.timestamp

    # delete data
    resource.delete_data(device_id1, model_id, timestamp)
    with pytest.raises(Exception):
        resource.read_data(device_id1, model_id, timestamp)

    # update buffer status
    resource.update_buffer(buffers[0].id, None, "DELETE")
    buffer = resource.read_buffer(buffers[0].id)
    assert buffers[0].data == buffer.data
    assert buffer.status == "DELETE"

    # delete buffer data
    resource.delete_buffer(buffers[0].id)
    resource.delete_buffer(buffers[1].id)
    with pytest.raises(Exception):
        resource.read_buffer(buffers[0].id)

    # create data slice
    slice_id = resource.create_slice(device_id1, model_id, timestamp, timestamp, "Speed and compass slice", None)
    # read data
    slices = resource.list_slice_by_name("slice")
    slice_filter = filter(lambda x: x.device_id == device_id1 and x.model_id == model_id, slices)
    slice = list(slice_filter)[0]
    assert slice.timestamp_begin == timestamp
    assert slice.name == "Speed and compass slice"

    # update data slice
    resource.update_slice(slice_id, None, None, None, "Speed and compass sensor 1 at '2023-05-07 07:08:48'")
    slice = resource.read_slice(slice_id)
    assert slice.description == "Speed and compass sensor 1 at '2023-05-07 07:08:48'"

    # delete data slice
    resource.delete_slice(slice_id)
    with pytest.raises(Exception):
        resource.read_slice(slice_id)

    # create system log
    resource.create_log(timestamp, device_id1, "UNKNOWN_ERROR", "testing success")
    # read log
    logs = resource.list_log_by_range_time(timestamp, datetime.now(), None, None)
    log_filter = filter(lambda x: x.device_id == device_id1 and x.timestamp == timestamp, logs)
    log = list(log_filter)[0]
    assert log.value == "testing success"

    # update system log
    resource.update_log(timestamp, device_id1, "SUCCESS", None)
    log = resource.read_log(timestamp, device_id1)
    assert log.status == "SUCCESS"

    # delete system log
    resource.delete_log(timestamp, device_id1)
    with pytest.raises(Exception):
        resource.read_log(timestamp, device_id1)

    # delete model config
    config_id = model_configs[0].id
    resource.delete_model_config(config_id)
    with pytest.raises(Exception):
        resource.read_model_config(config_id)
    # delete model
    resource.delete_model(model_id)
    with pytest.raises(Exception):
        resource.read_model(model_id)
    # check if all model config also deleted
    configs = resource.list_model_config_by_model(model_id)
    assert len(configs) == 0

    # delete device config
    config_id = device_configs[0].id
    resource.delete_device_config(config_id)
    with pytest.raises(Exception):
        resource.read_device_config(config_id)
    # delete device
    resource.delete_device(device_id1)
    with pytest.raises(Exception):
        resource.read_device(device_id1)
    # check if all device config also deleted
    configs = resource.list_device_config_by_device(device_id1)
    assert len(configs) == 0

    # delete type
    with pytest.raises(Exception):
        resource.delete_type(type_id) # error because a device associated with the type still exists
    devices = resource.list_device_by_type(type_id)
    for device in devices:
        resource.delete_device(device.id)
    resource.delete_type(type_id)

    # check number of member of the group
    group = resource.read_group_model(group_model_id)
    assert len(group.models) == 0
    group = resource.read_group_device(group_device_id)
    assert len(group.devices) == 0
    # delete group model and device
    resource.delete_group_model(group_model_id)
    resource.delete_group_device(group_device_id)
    with pytest.raises(Exception):
        resource.read_group_model(group_model_id)
    with pytest.raises(Exception):
        resource.read_group_device(group_device_id)

    # stop auth server
    utility.stop_resource_server()
