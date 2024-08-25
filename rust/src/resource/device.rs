use tonic::{Request, Status};
use uuid::Uuid;
use rmcs_resource_db::schema::value::DataValue;
use rmcs_resource_api::device::device_service_client::DeviceServiceClient;
use rmcs_resource_api::device::{
    DeviceSchema, DeviceId, DeviceIds, DeviceName, DeviceOption, DeviceUpdate,
    GatewaySchema, GatewayId, GatewayIds, GatewayName, SerialNumber, GatewayOption, GatewayUpdate,
    ConfigSchema, ConfigId, ConfigUpdate,
    TypeSchema, TypeId
};
use crate::resource::Resource;
use rmcs_api_server::utility::interceptor::TokenInterceptor;

const DEVICE_NOT_FOUND: &str = "requested device not found";
const GATEWAY_NOT_FOUND: &str = "requested gateway not found";
const CONF_NOT_FOUND: &str = "requested config not found";

pub(crate) async fn read_device(resource: &Resource, id: Uuid)
    -> Result<DeviceSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceId {
        id: id.as_bytes().to_vec()
    });
    let response = client.read_device(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DEVICE_NOT_FOUND))?)
}

pub(crate) async fn read_device_by_sn(resource: &Resource, serial_number: &str)
    -> Result<DeviceSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SerialNumber {
        serial_number: serial_number.to_owned()
    });
    let response = client.read_device_by_sn(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DEVICE_NOT_FOUND))?)
}

pub(crate) async fn list_device_by_ids(resource: &Resource, ids: &[Uuid])
    -> Result<Vec<DeviceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceIds {
        ids: ids.into_iter().map(|&id| id.as_bytes().to_vec()).collect()
    });
    let response = client.list_device_by_ids(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_by_gateway(resource: &Resource, gateway_id: Uuid)
    -> Result<Vec<DeviceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayId {
        id: gateway_id.as_bytes().to_vec()
    });
    let response = client.list_device_by_gateway(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_by_type(resource: &Resource, type_id: Uuid)
    -> Result<Vec<DeviceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeId {
        id: type_id.as_bytes().to_vec()
    });
    let response = client.list_device_by_type(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_by_name(resource: &Resource, name: &str)
    -> Result<Vec<DeviceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceName {
        name: name.to_owned()
    });
    let response = client.list_device_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_device_option(resource: &Resource, gateway_id: Option<Uuid>, type_id: Option<Uuid>, name: Option<&str>)
    -> Result<Vec<DeviceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceOption {
        gateway_id: gateway_id.map(|id| id.as_bytes().to_vec()),
        type_id: type_id.map(|id| id.as_bytes().to_vec()),
        name: name.map(|s| s.to_owned())
    });
    let response = client.list_device_option(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_device(resource: &Resource, id: Uuid, gateway_id: Uuid, type_id: Uuid, serial_number: &str, name: &str, description: Option<&str>)
    -> Result<Uuid, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceSchema {
        id: id.as_bytes().to_vec(),
        gateway_id: gateway_id.as_bytes().to_vec(),
        serial_number: serial_number.to_owned(),
        name: name.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        device_type: Some(TypeSchema {
            id: type_id.as_bytes().to_vec(),
            name: String::new(),
            description: String::new(),
            models: Vec::new()
        }),
        configs: Vec::new()
    });
    client.create_device(request)
        .await?;
    Ok(id)
}

pub(crate) async fn update_device(resource: &Resource, id: Uuid, gateway_id: Option<Uuid>, type_id: Option<Uuid>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceUpdate {
        id: id.as_bytes().to_vec(),
        gateway_id: gateway_id.map(|x| x.as_bytes().to_vec()),
        serial_number: serial_number.map(|s| s.to_owned()),
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned()),
        type_id: type_id.map(|x| x.as_bytes().to_vec())
    });
    client.update_device(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_device(resource: &Resource, id: Uuid)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceId {
        id: id.as_bytes().to_vec()
    });
    client.delete_device(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_gateway(resource: &Resource, id: Uuid)
    -> Result<GatewaySchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayId {
        id: id.as_bytes().to_vec()
    });
    let response = client.read_gateway(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(GATEWAY_NOT_FOUND))?)
}

pub(crate) async fn read_gateway_by_sn(resource: &Resource, serial_number: &str)
    -> Result<GatewaySchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SerialNumber {
        serial_number: serial_number.to_owned()
    });
    let response = client.read_gateway_by_sn(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(GATEWAY_NOT_FOUND))?)
}

pub(crate) async fn list_gateway_by_ids(resource: &Resource, ids: &[Uuid])
    -> Result<Vec<GatewaySchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayIds {
        ids: ids.into_iter().map(|&id| id.as_bytes().to_vec()).collect()
    });
    let response = client.list_gateway_by_ids(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_gateway_by_type(resource: &Resource, type_id: Uuid)
    -> Result<Vec<GatewaySchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeId {
        id: type_id.as_bytes().to_vec()
    });
    let response = client.list_gateway_by_type(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_gateway_by_name(resource: &Resource, name: &str)
    -> Result<Vec<GatewaySchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayName {
        name: name.to_owned()
    });
    let response = client.list_gateway_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_gateway_option(resource: &Resource, type_id: Option<Uuid>, name: Option<&str>)
    -> Result<Vec<GatewaySchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayOption {
        type_id: type_id.map(|id| id.as_bytes().to_vec()),
        name: name.map(|s| s.to_owned())
    });
    let response = client.list_gateway_option(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_gateway(resource: &Resource, id: Uuid, type_id: Uuid, serial_number: &str, name: &str, description: Option<&str>)
    -> Result<Uuid, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewaySchema {
        id: id.as_bytes().to_vec(),
        serial_number: serial_number.to_owned(),
        name: name.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        gateway_type: Some(TypeSchema {
            id: type_id.as_bytes().to_vec(),
            name: String::new(),
            description: String::new(),
            models: Vec::new()
        }),
        configs: Vec::new()
    });
    client.create_gateway(request)
        .await?;
    Ok(id)
}

pub(crate) async fn update_gateway(resource: &Resource, id: Uuid, type_id: Option<Uuid>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayUpdate {
        id: id.as_bytes().to_vec(),
        serial_number: serial_number.map(|s| s.to_owned()),
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned()),
        type_id: type_id.map(|x| x.as_bytes().to_vec())
    });
    client.update_gateway(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_gateway(resource: &Resource, id: Uuid)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayId {
        id: id.as_bytes().to_vec()
    });
    client.delete_gateway(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_device_config(resource: &Resource, id: i32)
    -> Result<ConfigSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigId {
        id
    });
    let response = client.read_device_config(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(CONF_NOT_FOUND))?)
}

pub(crate) async fn list_device_config_by_device(resource: &Resource, device_id: Uuid)
    -> Result<Vec<ConfigSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DeviceId {
        id: device_id.as_bytes().to_vec()
    });
    let response = client.list_device_config(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_device_config(resource: &Resource, device_id: Uuid, name: &str, value: DataValue, category: &str)
    -> Result<i32, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigSchema {
        id: 0,
        device_id: device_id.as_bytes().to_vec(),
        name: name.to_owned(),
        config_bytes: value.to_bytes(),
        config_type: value.get_type().into(),
        category: category.to_owned()
    });
    let response = client.create_device_config(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_device_config(resource: &Resource, id: i32, name: Option<&str>, value: Option<DataValue>, category: Option<&str>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        config_bytes: value.clone().map(|s| s.to_bytes()),
        config_type: value.map(|s| s.get_type().into()),
        category: category.map(|s| s.to_owned())
    });
    client.update_device_config(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_device_config(resource: &Resource, id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigId {
        id
    });
    client.delete_device_config(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_gateway_config(resource: &Resource, id: i32)
    -> Result<ConfigSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigId {
        id
    });
    let response = client.read_gateway_config(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(CONF_NOT_FOUND))?)
}

pub(crate) async fn list_gateway_config_by_gateway(resource: &Resource, gateway_id: Uuid)
    -> Result<Vec<ConfigSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(GatewayId {
        id: gateway_id.as_bytes().to_vec()
    });
    let response = client.list_gateway_config(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_gateway_config(resource: &Resource, gateway_id: Uuid, name: &str, value: DataValue, category: &str)
    -> Result<i32, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigSchema {
        id: 0,
        device_id: gateway_id.as_bytes().to_vec(),
        name: name.to_owned(),
        config_bytes: value.to_bytes(),
        config_type: value.get_type().into(),
        category: category.to_owned()
    });
    let response = client.create_gateway_config(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_gateway_config(resource: &Resource, id: i32, name: Option<&str>, value: Option<DataValue>, category: Option<&str>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        config_bytes: value.clone().map(|s| s.to_bytes()),
        config_type: value.map(|s| s.get_type().into()),
        category: category.map(|s| s.to_owned())
    });
    client.update_gateway_config(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_gateway_config(resource: &Resource, id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ConfigId {
        id
    });
    client.delete_gateway_config(request)
        .await?;
    Ok(())
}
