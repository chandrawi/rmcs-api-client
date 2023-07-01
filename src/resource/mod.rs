pub mod model;
pub mod device;
pub mod types;

use tonic::{Status, transport::Channel};
use rmcs_resource_db::schema::value::{DataIndexing, DataType, ConfigValue};
use rmcs_resource_db::schema::model::{ModelSchema, ModelConfigSchema};
use rmcs_resource_db::schema::device::{DeviceSchema, DeviceConfigSchema, GatewaySchema, GatewayConfigSchema, TypeSchema};

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

}
