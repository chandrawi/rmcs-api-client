pub mod model;
pub mod device;
pub mod types;
pub mod group;
pub mod data;
pub mod buffer;

use tonic::{Status, transport::Channel};
use chrono::{DateTime, Utc};
use rmcs_resource_db::schema::value::{DataIndexing, DataType, DataValue, ConfigValue};
use rmcs_resource_db::schema::model::{ModelSchema, ModelConfigSchema};
use rmcs_resource_db::schema::device::{DeviceSchema, DeviceConfigSchema, GatewaySchema, GatewayConfigSchema, TypeSchema};
use rmcs_resource_db::schema::group::{GroupModelSchema, GroupDeviceSchema, GroupGatewaySchema};
use rmcs_resource_db::schema::data::{DataSchema, DataModel};
use rmcs_resource_db::schema::buffer::BufferSchema;

#[derive(Debug, Clone)]
pub struct Resource {
    pub channel: Channel
}

impl Resource {
    
    pub async fn new(addr: &str) -> Resource {
        let addr: &'static str = Box::leak(addr.to_owned().into_boxed_str());
        let channel = Channel::from_static(addr)
            .connect()
            .await
            .expect(&format!("Error making channel to {}", addr));
        Resource {
            channel
        }
    }

    pub fn new_with_channel(channel: Channel) -> Resource {
        Resource {
            channel
        }
    }

    pub async fn read_model(&self, id: u32)
        -> Result<ModelSchema, Status>
    {
        model::read_model(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_model_by_name(&self, name: &str)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_name(&self.channel, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_model_by_category(&self, category: &str)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_category(&self.channel, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_model_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_name_category(&self.channel, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_model(&self, indexing: DataIndexing, category: &str, name: &str, description: Option<&str>)
        -> Result<u32, Status>
    {
        model::create_model(&self.channel, indexing, category, name, description)
        .await
    }

    pub async fn update_model(&self, id: u32, indexing: Option<DataIndexing>, category: Option<&str>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        model::update_model(&self.channel, id, indexing, category, name, description)
        .await
    }

    pub async fn delete_model(&self, id: u32)
        -> Result<(), Status>
    {
        model::delete_model(&self.channel, id)
        .await
    }

    pub async fn add_model_type(&self, id: u32, types: &[DataType])
        -> Result<(), Status>
    {
        model::add_model_type(&self.channel, id, types)
        .await
    }

    pub async fn remove_model_type(&self, id: u32)
        -> Result<(), Status>
    {
        model::remove_model_type(&self.channel, id)
        .await
    }

    pub async fn read_model_config(&self, id: u32)
        -> Result<ModelConfigSchema, Status>
    {
        model::read_model_config(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_model_config_by_model(&self, model_id: u32)
        -> Result<Vec<ModelConfigSchema>, Status>
    {
        model::list_model_config_by_model(&self.channel, model_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_model_config(&self, model_id: u32, index: u32, name: &str, value: ConfigValue, category: &str)
        -> Result<u32, Status>
    {
        model::create_model_config(&self.channel, model_id, index, name, value, category)
        .await
    }

    pub async fn update_model_config(&self, id: u32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
        -> Result<(), Status>
    {
        model::update_model_config(&self.channel, id, name, value, category)
        .await
    }

    pub async fn delete_model_config(&self, id: u32)
        -> Result<(), Status>
    {
        model::delete_model_config(&self.channel, id)
        .await
    }

    pub async fn read_device(&self, id: u64)
        -> Result<DeviceSchema, Status>
    {
        device::read_device(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_device_by_sn(&self, serial_number: &str)
        -> Result<DeviceSchema, Status>
    {
        device::read_device_by_sn(&self.channel, serial_number)
        .await
        .map(|s| s.into())
    }

    pub async fn list_device_by_gateway(&self, gateway_id: u64)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_gateway(&self.channel, gateway_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_type(&self, type_id: u32)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_type(&self.channel, type_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_name(&self, name: &str)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_name(&self.channel, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_gateway_type(&self, gateway_id: u64, type_id: u32)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_gateway_type(&self.channel, gateway_id, type_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_device_by_gateway_name(&self, gateway_id: u64, name: &str)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_gateway_name(&self.channel, gateway_id, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_device(&self, id: u64, gateway_id: u64, type_id: u32, serial_number: &str, name: &str, description: Option<&str>)
        -> Result<(), Status>
    {
        device::create_device(&self.channel, id, gateway_id, type_id, serial_number, name, description)
        .await
    }

    pub async fn update_device(&self, id: u64, gateway_id: Option<u64>, type_id: Option<u32>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        device::update_device(&self.channel, id, gateway_id, type_id, serial_number, name, description)
        .await
    }

    pub async fn delete_device(&self, id: u64)
        -> Result<(), Status>
    {
        device::delete_device(&self.channel, id)
        .await
    }

    pub async fn read_gateway(&self, id: u64)
        -> Result<GatewaySchema, Status>
    {
        device::read_gateway(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_gateway_by_sn(&self, serial_number: &str)
        -> Result<GatewaySchema, Status>
    {
        device::read_gateway_by_sn(&self.channel, serial_number)
        .await
        .map(|s| s.into())
    }

    pub async fn list_gateway_by_type(&self, type_id: u32)
        -> Result<Vec<GatewaySchema>, Status>
    {
        device::list_gateway_by_type(&self.channel, type_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_gateway_by_name(&self, name: &str)
        -> Result<Vec<GatewaySchema>, Status>
    {
        device::list_gateway_by_name(&self.channel, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_gateway(&self, id: u64, type_id: u32, serial_number: &str, name: &str, description: Option<&str>)
        -> Result<(), Status>
    {
        device::create_gateway(&self.channel, id, type_id, serial_number, name, description)
        .await
    }

    pub async fn update_gateway(&self, id: u64, type_id: Option<u32>, serial_number: Option<&str>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        device::update_gateway(&self.channel, id, type_id, serial_number, name, description)
        .await
    }

    pub async fn delete_gateway(&self, id: u64)
        -> Result<(), Status>
    {
        device::delete_gateway(&self.channel, id)
        .await
    }

    pub async fn read_device_config(&self, id: u32)
        -> Result<DeviceConfigSchema, Status>
    {
        device::read_device_config(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_device_config_by_device(&self, device_id: u64)
        -> Result<Vec<DeviceConfigSchema>, Status>
    {
        device::list_device_config_by_device(&self.channel, device_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_device_config(&self, device_id: u64, name: &str, value: ConfigValue, category: &str)
        -> Result<u32, Status>
    {
        device::create_device_config(&self.channel, device_id, name, value, category)
        .await
    }

    pub async fn update_device_config(&self, id: u32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
        -> Result<(), Status>
    {
        device::update_device_config(&self.channel, id, name, value, category)
        .await
    }

    pub async fn delete_device_config(&self, id: u32)
        -> Result<(), Status>
    {
        device::delete_device_config(&self.channel, id)
        .await
    }

    pub async fn read_gateway_config(&self, id: u32)
        -> Result<GatewayConfigSchema, Status>
    {
        device::read_gateway_config(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_gateway_config_by_gateway(&self, gateway_id: u64)
        -> Result<Vec<GatewayConfigSchema>, Status>
    {
        device::list_gateway_config_by_gateway(&self.channel, gateway_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_gateway_config(&self, gateway_id: u64, name: &str, value: ConfigValue, category: &str)
        -> Result<u32, Status>
    {
        device::create_gateway_config(&self.channel, gateway_id, name, value, category)
        .await
    }

    pub async fn update_gateway_config(&self, id: u32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
        -> Result<(), Status>
    {
        device::update_gateway_config(&self.channel, id, name, value, category)
        .await
    }

    pub async fn delete_gateway_config(&self, id: u32)
        -> Result<(), Status>
    {
        device::delete_gateway_config(&self.channel, id)
        .await
    }

    pub async fn read_type(&self, id: u32)
        -> Result<TypeSchema, Status>
    {
        types::read_type(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_type_by_name(&self, name: &str)
        -> Result<Vec<TypeSchema>, Status>
    {
        types::list_type_by_name(&self.channel, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_type(&self, name: &str, description: Option<&str>)
        -> Result<u32, Status>
    {
        types::create_type(&self.channel, name, description)
        .await
    }

    pub async fn update_type(&self, id: u32, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        types::update_type(&self.channel, id, name, description)
        .await
    }

    pub async fn delete_type(&self, id: u32)
        -> Result<(), Status>
    {
        types::delete_type(&self.channel, id)
        .await
    }

    pub async fn add_type_model(&self, id: u32, model_id: u32)
        -> Result<(), Status>
    {
        types::add_type_model(&self.channel, id, model_id)
        .await
    }

    pub async fn remove_type_model(&self, id: u32, model_id: u32)
        -> Result<(), Status>
    {
        types::remove_type_model(&self.channel, id, model_id)
        .await
    }

    pub async fn read_group_model(&self, id: u32)
        -> Result<GroupModelSchema, Status>
    {
        group::read_group_model(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_group_model_by_name(&self, name: &str)
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_by_name(&self.channel, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_model_by_category(&self, category: &str)
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_by_category(&self.channel, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_model_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_by_name_category(&self.channel, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_group_model(&self, name: &str, category: &str, description: Option<&str>)
        -> Result<u32, Status>
    {
        group::create_group_model(&self.channel, name, category, description)
        .await
    }

    pub async fn update_group_model(&self, id: u32, name: Option<&str>, category: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        group::update_group_model(&self.channel, id, name, category, description)
        .await
    }

    pub async fn delete_group_model(&self, id: u32)
        -> Result<(), Status>
    {
        group::delete_group_model(&self.channel, id)
        .await
    }

    pub async fn add_group_model_member(&self, id: u32, model_id: u32)
        -> Result<(), Status>
    {
        group::add_group_model_member(&self.channel, id, model_id)
        .await
    }

    pub async fn remove_group_model_member(&self, id: u32, model_id: u32)
        -> Result<(), Status>
    {
        group::remove_group_model_member(&self.channel, id, model_id)
        .await
    }

    pub async fn read_group_device(&self, id: u32)
        -> Result<GroupDeviceSchema, Status>
    {
        group::read_group_device(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_group_device_by_name(&self, name: &str)
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_by_name(&self.channel, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_device_by_category(&self, category: &str)
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_by_category(&self.channel, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_device_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_by_name_category(&self.channel, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_group_device(&self, name: &str, category: &str, description: Option<&str>)
        -> Result<u32, Status>
    {
        group::create_group_device(&self.channel, name, category, description)
        .await
    }

    pub async fn update_group_device(&self, id: u32, name: Option<&str>, category: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        group::update_group_device(&self.channel, id, name, category, description)
        .await
    }

    pub async fn delete_group_device(&self, id: u32)
        -> Result<(), Status>
    {
        group::delete_group_device(&self.channel, id)
        .await
    }

    pub async fn add_group_device_member(&self, id: u32, device_id: u64)
        -> Result<(), Status>
    {
        group::add_group_device_member(&self.channel, id, device_id)
        .await
    }

    pub async fn remove_group_device_member(&self, id: u32, device_id: u64)
        -> Result<(), Status>
    {
        group::remove_group_device_member(&self.channel, id, device_id)
        .await
    }

    pub async fn read_group_gateway(&self, id: u32)
        -> Result<GroupGatewaySchema, Status>
    {
        group::read_group_gateway(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_group_gateway_by_name(&self, name: &str)
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_by_name(&self.channel, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_group_gateway_by_category(&self, category: &str)
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_by_category(&self.channel, category)
        .await
        .map(|v| {
            v.into_iter().map(|s| s.into()).collect()
        })
    }

    pub async fn list_group_gateway_by_name_category(&self, name: &str, category: &str)
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_by_name_category(&self.channel, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_group_gateway(&self, name: &str, category: &str, description: Option<&str>)
        -> Result<u32, Status>
    {
        group::create_group_gateway(&self.channel, name, category, description)
        .await
    }

    pub async fn update_group_gateway(&self, id: u32, name: Option<&str>, category: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        group::update_group_gateway(&self.channel, id, name, category, description)
        .await
    }

    pub async fn delete_group_gateway(&self, id: u32)
        -> Result<(), Status>
    {
        group::delete_group_gateway(&self.channel, id)
        .await
    }

    pub async fn add_group_gateway_member(&self, id: u32, gateway_id: u64)
        -> Result<(), Status>
    {
        group::add_group_gateway_member(&self.channel, id, gateway_id)
        .await
    }

    pub async fn remove_group_gateway_member(&self, id: u32, gateway_id: u64)
        -> Result<(), Status>
    {
        group::remove_group_gateway_member(&self.channel, id, gateway_id)
        .await
    }

    pub async fn read_data(&self, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>)
        -> Result<DataSchema, Status>
    {
        data::read_data(&self.channel, device_id, model_id, timestamp, index)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_by_time(&self, device_id: u64, model_id: u32, timestamp: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_time(&self.channel, device_id, model_id, timestamp)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_last_time(&self, device_id: u64, model_id: u32, last: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_last_time(&self.channel, device_id, model_id, last)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_range_time(&self, device_id: u64, model_id: u32, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_range_time(&self.channel, device_id, model_id, begin, end)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_number_before(&self, device_id: u64, model_id: u32, before: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_number_before(&self.channel, device_id, model_id, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_number_after(&self, device_id: u64, model_id: u32, after: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_number_after(&self.channel, device_id, model_id, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn get_data_model(&self, model_id: u32)
        -> Result<DataModel, Status>
    {
        data::get_data_model(&self.channel, model_id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_data_with_model(&self, model: DataModel, device_id: u64, timestamp: DateTime<Utc>, index: Option<u16>)
        -> Result<DataSchema, Status>
    {
        data::read_data_with_model(&self.channel, model, device_id, timestamp, index)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_with_model_by_time(&self, model: DataModel, device_id: u64, timestamp: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_time(&self.channel, model, device_id, timestamp)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_last_time(&self, model: DataModel, device_id: u64, last: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_last_time(&self.channel, model, device_id, last)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_range_time(&self, model: DataModel, device_id: u64, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_range_time(&self.channel, model, device_id, begin, end)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_number_before(&self, model: DataModel, device_id: u64, before: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_number_before(&self.channel, model, device_id, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_with_model_by_number_after(&self, model: DataModel, device_id: u64, after: DateTime<Utc>, number: u32)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_with_model_by_number_after(&self.channel, model, device_id, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_data(&self, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>, data: Vec<DataValue>)
        -> Result<(), Status>
    {
        data::create_data(&self.channel, device_id, model_id, timestamp, index, data)
        .await
    }

    pub async fn create_data_with_model(&self, model: DataModel, device_id: u64, timestamp: DateTime<Utc>, index: Option<u16>, data: Vec<DataValue>)
        -> Result<(), Status>
    {
        data::create_data_with_model(&self.channel, model, device_id, timestamp, index, data)
        .await
    }

    pub async fn delete_data(&self, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>)
        -> Result<(), Status>
    {
        data::delete_data(&self.channel, device_id, model_id, timestamp, index)
        .await
    }

    pub async fn delete_data_with_model(&self, model: DataModel, device_id: u64, timestamp: DateTime<Utc>, index: Option<u16>)
        -> Result<(), Status>
    {
        data::delete_data_with_model(&self.channel, model, device_id, timestamp, index)
        .await
    }

    pub async fn read_buffer(&self, id: u32)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_buffer_first(&self, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer_first(&self.channel, device_id, model_id, status)
        .await
        .map(|s| s.into())
    }

    pub async fn read_buffer_last(&self, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer_last(&self.channel, device_id, model_id, status)
        .await
        .map(|s| s.into())
    }

    pub async fn list_buffer_first(&self, number: u32, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first(&self.channel, number, device_id, model_id, status)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last(&self, number: u32, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last(&self.channel, number, device_id, model_id, status)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_buffer(&self, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>, data: Vec<DataValue>, status: &str)
        -> Result<u32, Status>
    {
        buffer::create_buffer(&self.channel, device_id, model_id, timestamp, index, data, status)
        .await
    }

    pub async fn update_buffer(&self, id: u32, data: Option<Vec<DataValue>>, status: Option<&str>)
        -> Result<(), Status>
    {
        buffer::update_buffer(&self.channel, id, data, status)
        .await
    }

    pub async fn delete_buffer(&self, id: u32)
        -> Result<(), Status>
    {
        buffer::delete_buffer(&self.channel, id)
        .await
    }

}
