pub mod model;
pub mod device;
pub mod types;
pub mod group;
pub mod data;
pub mod buffer;
pub mod slice;
pub mod log;

use tonic::{Status, transport::Channel};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use rmcs_resource_db::schema::value::{DataIndexing, DataType, DataValue, ConfigValue};
use rmcs_resource_db::schema::model::{ModelSchema, ModelConfigSchema};
use rmcs_resource_db::schema::device::{DeviceSchema, DeviceConfigSchema, GatewaySchema, GatewayConfigSchema, TypeSchema};
use rmcs_resource_db::schema::group::{GroupModelSchema, GroupDeviceSchema, GroupGatewaySchema};
use rmcs_resource_db::schema::data::{DataSchema, DataModel};
use rmcs_resource_db::schema::buffer::BufferSchema;
use rmcs_resource_db::schema::slice::SliceSchema;
use rmcs_resource_db::schema::log::LogSchema;

#[derive(Debug, Clone)]
pub struct Resource {
    channel: Channel,
    access_token: String,
    refresh_token: String
}

impl Resource {

    pub async fn new(addr: &str) -> Self {
        let channel = Channel::from_shared(addr.to_owned())
            .expect("Invalid address")
            .connect()
            .await
            .expect(&format!("Error making channel to {}", addr));
        Resource {
            channel,
            access_token: String::new(),
            refresh_token: String::new()
        }
    }

    pub fn new_with_channel(channel: Channel) -> Self {
        Resource {
            channel,
            access_token: String::new(),
            refresh_token: String::new()
        }
    }

    pub fn with_token(mut self, access_token: &str, refresh_token: &str) -> Self {
        self.access_token = access_token.to_owned();
        self.refresh_token = refresh_token.to_owned();
        self
    }

    pub async fn read_model(&self, id: Uuid)
        -> Result<ModelSchema, Status>
    {
        model::read_model(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_model_by_name(&self, name: &str)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_model_by_category(&self, category: &str)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_category(&self, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_model_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_name_category(&self, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_model(&self, id: Uuid, indexing: DataIndexing, category: &str, name: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        model::create_model(&self, id, indexing, category, name, description)
        .await
    }

    pub async fn update_model(&self, id: Uuid, indexing: Option<DataIndexing>, category: Option<&str>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        model::update_model(&self, id, indexing, category, name, description)
        .await
    }

    pub async fn delete_model(&self, id: Uuid)
        -> Result<(), Status>
    {
        model::delete_model(&self, id)
        .await
    }

    pub async fn add_model_type(&self, id: Uuid, types: &[DataType])
        -> Result<(), Status>
    {
        model::add_model_type(&self, id, types)
        .await
    }

    pub async fn remove_model_type(&self, id: Uuid)
        -> Result<(), Status>
    {
        model::remove_model_type(&self, id)
        .await
    }

    pub async fn read_model_config(&self, id: i32)
        -> Result<ModelConfigSchema, Status>
    {
        model::read_model_config(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_model_config_by_model(&self, model_id: Uuid)
        -> Result<Vec<ModelConfigSchema>, Status>
    {
        model::list_model_config_by_model(&self, model_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_model_config(&self, model_id: Uuid, index: i32, name: &str, value: ConfigValue, category: &str)
        -> Result<i32, Status>
    {
        model::create_model_config(&self, model_id, index, name, value, category)
        .await
    }

    pub async fn update_model_config(&self, id: i32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
        -> Result<(), Status>
    {
        model::update_model_config(&self, id, name, value, category)
        .await
    }

    pub async fn delete_model_config(&self, id: i32)
        -> Result<(), Status>
    {
        model::delete_model_config(&self, id)
        .await
    }

    pub async fn read_device(&self, id: Uuid)
        -> Result<DeviceSchema, Status>
    {
        device::read_device(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_device_by_sn(&self, serial_number: &str)
        -> Result<DeviceSchema, Status>
    {
        device::read_device_by_sn(&self, serial_number)
        .await
        .map(|s| s.into())
    }

    pub async fn list_device_by_gateway(&self, gateway_id: Uuid)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_gateway(&self, gateway_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_type(&self, type_id: Uuid)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_type(&self, type_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_name(&self, name: &str)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_gateway_type(&self, gateway_id: Uuid, type_id: Uuid)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_gateway_type(&self, gateway_id, type_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_gateway_name(&self, gateway_id: Uuid, name: &str)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_gateway_name(&self, gateway_id, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_device(&self, id: Uuid, gateway_id: Uuid, type_id: Uuid, serial_number: &str, name: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        device::create_device(&self, id, gateway_id, type_id, serial_number, name, description)
        .await
    }

    pub async fn update_device(&self, id: Uuid, gateway_id: Option<Uuid>, type_id: Option<Uuid>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        device::update_device(&self, id, gateway_id, type_id, serial_number, name, description)
        .await
    }

    pub async fn delete_device(&self, id: Uuid)
        -> Result<(), Status>
    {
        device::delete_device(&self, id)
        .await
    }

    pub async fn read_gateway(&self, id: Uuid)
        -> Result<GatewaySchema, Status>
    {
        device::read_gateway(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_gateway_by_sn(&self, serial_number: &str)
        -> Result<GatewaySchema, Status>
    {
        device::read_gateway_by_sn(&self, serial_number)
        .await
        .map(|s| s.into())
    }

    pub async fn list_gateway_by_type(&self, type_id: Uuid)
        -> Result<Vec<GatewaySchema>, Status>
    {
        device::list_gateway_by_type(&self, type_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_gateway_by_name(&self, name: &str)
        -> Result<Vec<GatewaySchema>, Status>
    {
        device::list_gateway_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_gateway(&self, id: Uuid, type_id: Uuid, serial_number: &str, name: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        device::create_gateway(&self, id, type_id, serial_number, name, description)
        .await
    }

    pub async fn update_gateway(&self, id: Uuid, type_id: Option<Uuid>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        device::update_gateway(&self, id, type_id, serial_number, name, description)
        .await
    }

    pub async fn delete_gateway(&self, id: Uuid)
        -> Result<(), Status>
    {
        device::delete_gateway(&self, id)
        .await
    }

    pub async fn read_device_config(&self, id: i32)
        -> Result<DeviceConfigSchema, Status>
    {
        device::read_device_config(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_device_config_by_device(&self, device_id: Uuid)
        -> Result<Vec<DeviceConfigSchema>, Status>
    {
        device::list_device_config_by_device(&self, device_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_device_config(&self, device_id: Uuid, name: &str, value: ConfigValue, category: &str)
        -> Result<i32, Status>
    {
        device::create_device_config(&self, device_id, name, value, category)
        .await
    }

    pub async fn update_device_config(&self, id: i32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
        -> Result<(), Status>
    {
        device::update_device_config(&self, id, name, value, category)
        .await
    }

    pub async fn delete_device_config(&self, id: i32)
        -> Result<(), Status>
    {
        device::delete_device_config(&self, id)
        .await
    }

    pub async fn read_gateway_config(&self, id: i32)
        -> Result<GatewayConfigSchema, Status>
    {
        device::read_gateway_config(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_gateway_config_by_gateway(&self, gateway_id: Uuid)
        -> Result<Vec<GatewayConfigSchema>, Status>
    {
        device::list_gateway_config_by_gateway(&self, gateway_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_gateway_config(&self, gateway_id: Uuid, name: &str, value: ConfigValue, category: &str)
        -> Result<i32, Status>
    {
        device::create_gateway_config(&self, gateway_id, name, value, category)
        .await
    }

    pub async fn update_gateway_config(&self, id: i32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
        -> Result<(), Status>
    {
        device::update_gateway_config(&self, id, name, value, category)
        .await
    }

    pub async fn delete_gateway_config(&self, id: i32)
        -> Result<(), Status>
    {
        device::delete_gateway_config(&self, id)
        .await
    }

    pub async fn read_type(&self, id: Uuid)
        -> Result<TypeSchema, Status>
    {
        types::read_type(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_type_by_name(&self, name: &str)
        -> Result<Vec<TypeSchema>, Status>
    {
        types::list_type_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_type(&self, id: Uuid, name: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        types::create_type(&self, id, name, description)
        .await
    }

    pub async fn update_type(&self, id: Uuid, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        types::update_type(&self, id, name, description)
        .await
    }

    pub async fn delete_type(&self, id: Uuid)
        -> Result<(), Status>
    {
        types::delete_type(&self, id)
        .await
    }

    pub async fn add_type_model(&self, id: Uuid, model_id: Uuid)
        -> Result<(), Status>
    {
        types::add_type_model(&self, id, model_id)
        .await
    }

    pub async fn remove_type_model(&self, id: Uuid, model_id: Uuid)
        -> Result<(), Status>
    {
        types::remove_type_model(&self, id, model_id)
        .await
    }

    pub async fn read_group_model(&self, id: Uuid)
        -> Result<GroupModelSchema, Status>
    {
        group::read_group_model(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_group_model_by_name(&self, name: &str)
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_model_by_category(&self, category: &str)
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_by_category(&self, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_model_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_by_name_category(&self, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_group_model(&self, id: Uuid, name: &str, category: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        group::create_group_model(&self, id, name, category, description)
        .await
    }

    pub async fn update_group_model(&self, id: Uuid, name: Option<&str>, category: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        group::update_group_model(&self, id, name, category, description)
        .await
    }

    pub async fn delete_group_model(&self, id: Uuid)
        -> Result<(), Status>
    {
        group::delete_group_model(&self, id)
        .await
    }

    pub async fn add_group_model_member(&self, id: Uuid, model_id: Uuid)
        -> Result<(), Status>
    {
        group::add_group_model_member(&self, id, model_id)
        .await
    }

    pub async fn remove_group_model_member(&self, id: Uuid, model_id: Uuid)
        -> Result<(), Status>
    {
        group::remove_group_model_member(&self, id, model_id)
        .await
    }

    pub async fn read_group_device(&self, id: Uuid)
        -> Result<GroupDeviceSchema, Status>
    {
        group::read_group_device(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_group_device_by_name(&self, name: &str)
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_device_by_category(&self, category: &str)
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_by_category(&self, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_device_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_by_name_category(&self, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_group_device(&self, id: Uuid, name: &str, category: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        group::create_group_device(&self, id, name, category, description)
        .await
    }

    pub async fn update_group_device(&self, id: Uuid, name: Option<&str>, category: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        group::update_group_device(&self, id, name, category, description)
        .await
    }

    pub async fn delete_group_device(&self, id: Uuid)
        -> Result<(), Status>
    {
        group::delete_group_device(&self, id)
        .await
    }

    pub async fn add_group_device_member(&self, id: Uuid, device_id: Uuid)
        -> Result<(), Status>
    {
        group::add_group_device_member(&self, id, device_id)
        .await
    }

    pub async fn remove_group_device_member(&self, id: Uuid, device_id: Uuid)
        -> Result<(), Status>
    {
        group::remove_group_device_member(&self, id, device_id)
        .await
    }

    pub async fn read_group_gateway(&self, id: Uuid)
        -> Result<GroupGatewaySchema, Status>
    {
        group::read_group_gateway(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_group_gateway_by_name(&self, name: &str)
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_gateway_by_category(&self, category: &str)
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_by_category(&self, category)
        .await
        .map(|v| {
            v.into_iter().map(|s| s.into()).collect()
        })
    }

    pub async fn list_group_gateway_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_by_name_category(&self, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_group_gateway(&self, id: Uuid, name: &str, category: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        group::create_group_gateway(&self, id, name, category, description)
        .await
    }

    pub async fn update_group_gateway(&self, id: Uuid, name: Option<&str>, category: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        group::update_group_gateway(&self, id, name, category, description)
        .await
    }

    pub async fn delete_group_gateway(&self, id: Uuid)
        -> Result<(), Status>
    {
        group::delete_group_gateway(&self, id)
        .await
    }

    pub async fn add_group_gateway_member(&self, id: Uuid, gateway_id: Uuid)
        -> Result<(), Status>
    {
        group::add_group_gateway_member(&self, id, gateway_id)
        .await
    }

    pub async fn remove_group_gateway_member(&self, id: Uuid, gateway_id: Uuid)
        -> Result<(), Status>
    {
        group::remove_group_gateway_member(&self, id, gateway_id)
        .await
    }

    pub async fn read_data(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, index: Option<i32>)
        -> Result<DataSchema, Status>
    {
        data::read_data(&self, device_id, model_id, timestamp, index)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_by_time(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_time(&self, device_id, model_id, timestamp)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_last_time(&self, device_id: Uuid, model_id: Uuid, last: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_last_time(&self, device_id, model_id, last)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_range_time(&self, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_range_time(&self, device_id, model_id, begin, end)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_number_before(&self, device_id: Uuid, model_id: Uuid, before: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_number_before(&self, device_id, model_id, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_number_after(&self, device_id: Uuid, model_id: Uuid, after: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_number_after(&self, device_id, model_id, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn get_data_model(&self, model_id: Uuid)
        -> Result<DataModel, Status>
    {
        data::get_data_model(&self, model_id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_data_with_model(&self, model: DataModel, device_id: Uuid, timestamp: DateTime<Utc>, index: Option<i32>)
        -> Result<DataSchema, Status>
    {
        data::read_data_with_model(&self, model, device_id, timestamp, index)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_with_model_by_time(&self, model: DataModel, device_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_time(&self, model, device_id, timestamp)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_last_time(&self, model: DataModel, device_id: Uuid, last: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_last_time(&self, model, device_id, last)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_range_time(&self, model: DataModel, device_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_range_time(&self, model, device_id, begin, end)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_number_before(&self, model: DataModel, device_id: Uuid, before: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_number_before(&self, model, device_id, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_number_after(&self, model: DataModel, device_id: Uuid, after: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_number_after(&self, model, device_id, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_data(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, index: Option<i32>, data: Vec<DataValue>)
        -> Result<(), Status>
    {
        data::create_data(&self, device_id, model_id, timestamp, index, data)
        .await
    }

    pub async fn create_data_with_model(&self, model: DataModel, device_id: Uuid, timestamp: DateTime<Utc>, index: Option<i32>, data: Vec<DataValue>)
        -> Result<(), Status>
    {
        data::create_data_with_model(&self, model, device_id, timestamp, index, data)
        .await
    }

    pub async fn delete_data(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, index: Option<i32>)
        -> Result<(), Status>
    {
        data::delete_data(&self, device_id, model_id, timestamp, index)
        .await
    }

    pub async fn delete_data_with_model(&self, model: DataModel, device_id: Uuid, timestamp: DateTime<Utc>, index: Option<i32>)
        -> Result<(), Status>
    {
        data::delete_data_with_model(&self, model, device_id, timestamp, index)
        .await
    }

    pub async fn read_buffer(&self, id: i32)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_buffer_first(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer_first(&self, device_id, model_id, status)
        .await
        .map(|s| s.into())
    }

    pub async fn read_buffer_last(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer_last(&self, device_id, model_id, status)
        .await
        .map(|s| s.into())
    }

    pub async fn list_buffer_first(&self, number: u32, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first(&self, number, device_id, model_id, status)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last(&self, number: u32, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last(&self, number, device_id, model_id, status)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_buffer(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, index: Option<i32>, data: Vec<DataValue>, status: &str)
        -> Result<i32, Status>
    {
        buffer::create_buffer(&self, device_id, model_id, timestamp, index, data, status)
        .await
    }

    pub async fn update_buffer(&self, id: i32, data: Option<Vec<DataValue>>, status: Option<&str>)
        -> Result<(), Status>
    {
        buffer::update_buffer(&self, id, data, status)
        .await
    }

    pub async fn delete_buffer(&self, id: i32)
        -> Result<(), Status>
    {
        buffer::delete_buffer(&self, id)
        .await
    }

    pub async fn read_slice(&self, id: i32)
        -> Result<SliceSchema, Status>
    {
        slice::read_slice(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_slice_by_name(&self, name: &str)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_name(&self, name).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_by_device(&self, device_id: Uuid)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_device(&self, device_id).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_by_model(&self, model_id: Uuid)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_model(&self, model_id).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_by_device_model(&self, device_id: Uuid, model_id: Uuid)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_device_model(&self, device_id, model_id).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_slice(&self, device_id: Uuid, model_id: Uuid, timestamp_begin: DateTime<Utc>, timestamp_end: DateTime<Utc>, index_begin: Option<i32>, index_end: Option<i32>, name: &str, description: Option<&str>)
        -> Result<i32, Status>
    {
        slice::create_slice(&self, device_id, model_id, timestamp_begin, timestamp_end, index_begin, index_end, name, description)
        .await
    }

    pub async fn update_slice(&self, id: i32, timestamp_begin: Option<DateTime<Utc>>, timestamp_end: Option<DateTime<Utc>>, index_begin: Option<i32>, index_end: Option<i32>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        slice::update_slice(&self, id, timestamp_begin, timestamp_end, index_begin, index_end, name, description)
        .await
    }

    pub async fn delete_slice(&self, id: i32)
        -> Result<(), Status>
    {
        slice::delete_slice(&self, id).await
    }

    pub async fn read_log(&self, timestamp: DateTime<Utc>, device_id: Uuid)
        -> Result<LogSchema, Status>
    {
        log::read_log(&self, timestamp, device_id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_log_by_time(&self, timestamp: DateTime<Utc>, device_id: Option<Uuid>, status: Option<&str>)
        -> Result<Vec<LogSchema>, Status>
    {
        log::list_log_by_time(&self, timestamp, device_id, status)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_log_by_last_time(&self, last: DateTime<Utc>, device_id: Option<Uuid>, status: Option<&str>)
        -> Result<Vec<LogSchema>, Status>
    {
        log::list_log_by_last_time(&self, last, device_id, status)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_log_by_range_time(&self, begin: DateTime<Utc>, end: DateTime<Utc>, device_id: Option<Uuid>, status: Option<&str>)
        -> Result<Vec<LogSchema>, Status>
    {
        log::list_log_by_range_time(&self, begin, end, device_id, status)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_log(&self, timestamp: DateTime<Utc>, device_id: Uuid, status: &str, value: ConfigValue)
        -> Result<(), Status>
    {
        log::create_log(&self, timestamp, device_id, status, value)
        .await
    }

    pub async fn update_log(&self, timestamp: DateTime<Utc>, device_id: Uuid, status: Option<&str>, value: Option<ConfigValue>)
        -> Result<(), Status>
    {
        log::update_log(&self, timestamp, device_id, status, value)
        .await
    }

    pub async fn delete_log(&self, timestamp: DateTime<Utc>, device_id: Uuid)
        -> Result<(), Status>
    {
        log::delete_log(&self, timestamp, device_id).await
    }

}
