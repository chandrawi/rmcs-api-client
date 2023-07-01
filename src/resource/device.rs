use tonic::{Request, Status, transport::Channel};
use rmcs_resource_db::schema::value::ConfigValue;
use rmcs_resource_api::common;
use rmcs_resource_api::device::device_service_client::DeviceServiceClient;
use rmcs_resource_api::device::{
    DeviceSchema, DeviceId, DeviceName, DeviceGatewayType, DeviceGatewayName, DeviceUpdate,
    GatewaySchema, GatewayId, GatewayName, SerialNumber, GatewayUpdate,
    ConfigSchema, ConfigId, ConfigUpdate,
    TypeSchema, TypeId
};

const DEVICE_NOT_FOUND: &str = "requested device not found";
const GATEWAY_NOT_FOUND: &str = "requested gateway not found";
const CONF_NOT_FOUND: &str = "requested config not found";

pub(crate) async fn read_device(channel: &Channel, id: u64)
    -> Result<DeviceSchema, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceId {
        id
    });
    let response = client.read_device(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DEVICE_NOT_FOUND))?)
}

pub(crate) async fn read_device_by_sn(channel: &Channel, serial_number: &str)
    -> Result<DeviceSchema, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(SerialNumber {
        serial_number: serial_number.to_owned()
    });
    let response = client.read_device_by_sn(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DEVICE_NOT_FOUND))?)
}

pub(crate) async fn list_device_by_gateway(channel: &Channel, gateway_id: u64)
    -> Result<Vec<DeviceSchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(GatewayId {
        id: gateway_id
    });
    let response = client.list_device_by_gateway(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_by_type(channel: &Channel, type_id: u32)
    -> Result<Vec<DeviceSchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(TypeId {
        id: type_id
    });
    let response = client.list_device_by_type(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_by_name(channel: &Channel, name: &str)
    -> Result<Vec<DeviceSchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceName {
        name: name.to_owned()
    });
    let response = client.list_device_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_by_gateway_type(channel: &Channel, gateway_id: u64, type_id: u32)
    -> Result<Vec<DeviceSchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceGatewayType {
        gateway_id,
        type_id
    });
    let response = client.list_device_by_gateway_type(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_by_gateway_name(channel: &Channel, gateway_id: u64, name: &str)
    -> Result<Vec<DeviceSchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceGatewayName {
        gateway_id,
        name: name.to_owned()
    });
    let response = client.list_device_by_gateway_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_device(channel: &Channel, id: u64, gateway_id: u64, type_id: u32, serial_number: &str, name: &str, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceSchema {
        id,
        gateway_id,
        serial_number: serial_number.to_owned(),
        name: name.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        device_type: Some(TypeSchema {
            id: type_id,
            name: String::new(),
            description: String::new(),
            models: Vec::new()
        }),
        configs: Vec::new()
    });
    client.create_device(request)
        .await?;
    Ok(())
}

pub(crate) async fn update_device(channel: &Channel, id: u64, gateway_id: Option<u64>, type_id: Option<u32>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceUpdate {
        id,
        gateway_id,
        serial_number: serial_number.map(|s| s.to_owned()),
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned()),
        type_id
    });
    client.update_device(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_device(channel: &Channel, id: u64)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceId {
        id
    });
    client.delete_device(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_gateway(channel: &Channel, id: u64)
    -> Result<GatewaySchema, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(GatewayId {
        id
    });
    let response = client.read_gateway(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(GATEWAY_NOT_FOUND))?)
}

pub(crate) async fn read_gateway_by_sn(channel: &Channel, serial_number: &str)
    -> Result<GatewaySchema, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(SerialNumber {
        serial_number: serial_number.to_owned()
    });
    let response = client.read_gateway_by_sn(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(GATEWAY_NOT_FOUND))?)
}

pub(crate) async fn list_gateway_by_type(channel: &Channel, type_id: u32)
    -> Result<Vec<GatewaySchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(TypeId {
        id: type_id
    });
    let response = client.list_gateway_by_type(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_gateway_by_name(channel: &Channel, name: &str)
    -> Result<Vec<GatewaySchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(GatewayName {
        name: name.to_owned()
    });
    let response = client.list_gateway_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_gateway(channel: &Channel, id: u64, type_id: u32, serial_number: &str, name: &str, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(GatewaySchema {
        id,
        serial_number: serial_number.to_owned(),
        name: name.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        gateway_type: Some(TypeSchema {
            id: type_id,
            name: String::new(),
            description: String::new(),
            models: Vec::new()
        }),
        configs: Vec::new()
    });
    client.create_gateway(request)
        .await?;
    Ok(())
}

pub(crate) async fn update_gateway(channel: &Channel, id: u64, type_id: Option<u32>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(GatewayUpdate {
        id,
        serial_number: serial_number.map(|s| s.to_owned()),
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned()),
        type_id
    });
    client.update_gateway(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_gateway(channel: &Channel, id: u64)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(GatewayId {
        id
    });
    client.delete_gateway(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_device_config(channel: &Channel, id: u32)
    -> Result<ConfigSchema, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigId {
        id
    });
    let response = client.read_device_config(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(CONF_NOT_FOUND))?)
}

pub(crate) async fn list_device_config_by_device(channel: &Channel, device_id: u64)
    -> Result<Vec<ConfigSchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(DeviceId {
        id: device_id
    });
    let response = client.list_device_config(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_device_config(channel: &Channel, device_id: u64, name: &str, value: ConfigValue, category: &str)
    -> Result<u32, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigSchema {
        id: 0,
        device_id,
        name: name.to_owned(),
        config_bytes: value.to_bytes(),
        config_type: Into::<common::ConfigType>::into(value.get_type()).into(),
        category: category.to_owned()
    });
    let response = client.create_device_config(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_device_config(channel: &Channel, id: u32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        config_bytes: value.clone().map(|s| s.to_bytes()),
        config_type: value.map(|s| Into::<common::ConfigType>::into(s.get_type()).into()),
        category: category.map(|s| s.to_owned())
    });
    client.update_device_config(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_device_config(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigId {
        id
    });
    client.delete_device_config(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_gateway_config(channel: &Channel, id: u32)
    -> Result<ConfigSchema, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigId {
        id
    });
    let response = client.read_gateway_config(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(CONF_NOT_FOUND))?)
}

pub(crate) async fn list_gateway_config_by_gateway(channel: &Channel, gateway_id: u64)
    -> Result<Vec<ConfigSchema>, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(GatewayId {
        id: gateway_id
    });
    let response = client.list_gateway_config(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_gateway_config(channel: &Channel, gateway_id: u64, name: &str, value: ConfigValue, category: &str)
    -> Result<u32, Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigSchema {
        id: 0,
        device_id: gateway_id,
        name: name.to_owned(),
        config_bytes: value.to_bytes(),
        config_type: Into::<common::ConfigType>::into(value.get_type()).into(),
        category: category.to_owned()
    });
    let response = client.create_gateway_config(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_gateway_config(channel: &Channel, id: u32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        config_bytes: value.clone().map(|s| s.to_bytes()),
        config_type: value.map(|s| Into::<common::ConfigType>::into(s.get_type()).into()),
        category: category.map(|s| s.to_owned())
    });
    client.update_gateway_config(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_gateway_config(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = DeviceServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigId {
        id
    });
    client.delete_gateway_config(request)
        .await?;
    Ok(())
}