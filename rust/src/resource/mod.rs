pub mod model;
pub mod device;
pub mod types;
pub mod group;
pub mod set;
pub mod data;
pub mod buffer;
pub mod slice;
pub mod log;

use tonic::{Status, transport::Channel};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use rmcs_resource_db::schema::value::{DataType, DataValue};
use rmcs_resource_db::schema::model::{ModelSchema, ModelConfigSchema};
use rmcs_resource_db::schema::device::{DeviceSchema, DeviceConfigSchema, GatewaySchema, GatewayConfigSchema, TypeSchema};
use rmcs_resource_db::schema::group::{GroupModelSchema, GroupDeviceSchema, GroupGatewaySchema};
use rmcs_resource_db::schema::set::{SetSchema, SetTemplateSchema};
use rmcs_resource_db::schema::data::{DataSchema, DataSetSchema};
use rmcs_resource_db::schema::buffer::{BufferSchema, BufferStatus};
use rmcs_resource_db::schema::slice::{SliceSchema, SliceSetSchema};
use rmcs_resource_db::schema::log::{LogSchema, LogStatus};

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

    pub async fn list_model_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_model_by_type(&self, type_id: Uuid)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_by_type(&self, type_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn list_model_option(&self, type_id: Option<Uuid>, name: Option<&str>, category: Option<&str>)
        -> Result<Vec<ModelSchema>, Status>
    {
        model::list_model_option(&self, type_id, name, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_model(&self, id: Uuid, data_type: &[DataType], category: &str, name: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        model::create_model(&self, id, data_type, category, name, description)
        .await
    }

    pub async fn update_model(&self, id: Uuid, data_type: Option<&[DataType]>, category: Option<&str>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        model::update_model(&self, id, data_type, category, name, description)
        .await
    }

    pub async fn delete_model(&self, id: Uuid)
        -> Result<(), Status>
    {
        model::delete_model(&self, id)
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

    pub async fn create_model_config(&self, model_id: Uuid, index: i32, name: &str, value: DataValue, category: &str)
        -> Result<i32, Status>
    {
        model::create_model_config(&self, model_id, index, name, value, category)
        .await
    }

    pub async fn update_model_config(&self, id: i32, name: Option<&str>, value: Option<DataValue>, category: Option<&str>)
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

    pub async fn list_device_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn list_device_option(&self, gateway_id: Option<Uuid>, type_id: Option<Uuid>, name: Option<&str>)
        -> Result<Vec<DeviceSchema>, Status>
    {
        device::list_device_option(&self, gateway_id, type_id, name)
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

    pub async fn list_gateway_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<GatewaySchema>, Status>
    {
        device::list_gateway_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn list_gateway_option(&self, type_id: Option<Uuid>, name: Option<&str>)
        -> Result<Vec<GatewaySchema>, Status>
    {
        device::list_gateway_option(&self, type_id, name)
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

    pub async fn create_device_config(&self, device_id: Uuid, name: &str, value: DataValue, category: &str)
        -> Result<i32, Status>
    {
        device::create_device_config(&self, device_id, name, value, category)
        .await
    }

    pub async fn update_device_config(&self, id: i32, name: Option<&str>, value: Option<DataValue>, category: Option<&str>)
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

    pub async fn create_gateway_config(&self, gateway_id: Uuid, name: &str, value: DataValue, category: &str)
        -> Result<i32, Status>
    {
        device::create_gateway_config(&self, gateway_id, name, value, category)
        .await
    }

    pub async fn update_gateway_config(&self, id: i32, name: Option<&str>, value: Option<DataValue>, category: Option<&str>)
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

    pub async fn list_type_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<TypeSchema>, Status>
    {
        types::list_type_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_type_by_name(&self, name: &str)
        -> Result<Vec<TypeSchema>, Status>
    {
        types::list_type_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_type_option(&self, name: Option<&str>)
        -> Result<Vec<TypeSchema>, Status>
    {
        types::list_type_option(&self, name)
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

    pub async fn list_group_model_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn list_group_model_option(&self, name: Option<&str>, category: Option<&str>)
        -> Result<Vec<GroupModelSchema>, Status>
    {
        group::list_group_model_option(&self, name, category)
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

    pub async fn list_group_device_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn list_group_device_option(&self, name: Option<&str>, category: Option<&str>)
        -> Result<Vec<GroupDeviceSchema>, Status>
    {
        group::list_group_device_option(&self, name, category)
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

    pub async fn list_group_gateway_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn list_group_gateway_option(&self, name: Option<&str>, category: Option<&str>)
        -> Result<Vec<GroupGatewaySchema>, Status>
    {
        group::list_group_gateway_option(&self, name, category)
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

    pub async fn read_set(&self, id: Uuid)
        -> Result<SetSchema, Status>
    {
        set::read_set(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_set_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<SetSchema>, Status>
    {
        set::list_set_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_set_by_template(&self, template_id: Uuid)
        -> Result<Vec<SetSchema>, Status>
    {
        set::list_set_by_template(&self, template_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_set_by_name(&self, name: &str)
        -> Result<Vec<SetSchema>, Status>
    {
        set::list_set_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_set_option(&self, template_id: Option<Uuid>, name: Option<&str>)
        -> Result<Vec<SetSchema>, Status>
    {
        set::list_set_option(&self, template_id, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_set(&self, id: Uuid, template_id: Uuid, name: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        set::create_set(&self, id, template_id, name, description)
        .await
    }

    pub async fn update_set(&self, id: Uuid, template_id: Option<Uuid>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        set::update_set(&self, id, template_id, name, description)
        .await
    }

    pub async fn delete_set(&self, id: Uuid)
        -> Result<(), Status>
    {
        set::delete_set(&self, id)
        .await
    }

    pub async fn add_set_member(&self, id: Uuid, device_id: Uuid, model_id: Uuid, data_index: &[u8])
        -> Result<(), Status>
    {
        set::add_set_member(&self, id, device_id, model_id, data_index)
        .await
    }

    pub async fn remove_set_member(&self, id: Uuid, device_id: Uuid, model_id: Uuid)
        -> Result<(), Status>
    {
        set::remove_set_member(&self, id, device_id, model_id)
        .await
    }

    pub async fn swap_set_member(&self, id: Uuid, device_id_1: Uuid, model_id_1: Uuid, device_id_2: Uuid, model_id_2: Uuid)
        -> Result<(), Status>
    {
        set::swap_set_member(&self, id, device_id_1, model_id_1, device_id_2, model_id_2)
        .await
    }

    pub async fn read_set_template(&self, id: Uuid)
        -> Result<SetTemplateSchema, Status>
    {
        set::read_set_template(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_set_template_by_ids(&self, ids: &[Uuid])
        -> Result<Vec<SetTemplateSchema>, Status>
    {
        set::list_set_template_by_ids(&self, ids)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_set_template_by_name(&self, name: &str)
        -> Result<Vec<SetTemplateSchema>, Status>
    {
        set::list_set_template_by_name(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_set_template_option(&self, name: Option<&str>)
        -> Result<Vec<SetTemplateSchema>, Status>
    {
        set::list_set_template_option(&self, name)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_set_template(&self, id: Uuid, name: &str, description: Option<&str>)
        -> Result<Uuid, Status>
    {
        set::create_set_template(&self, id, name, description)
        .await
    }

    pub async fn update_set_template(&self, id: Uuid, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        set::update_set_template(&self, id, name, description)
        .await
    }

    pub async fn delete_set_template(&self, id: Uuid)
        -> Result<(), Status>
    {
        set::delete_set_template(&self, id)
        .await
    }

    pub async fn add_set_template_member(&self, id: Uuid, type_id: Uuid, model_id: Uuid, data_index: &[u8])
        -> Result<(), Status>
    {
        set::add_set_template_member(&self, id, type_id, model_id, data_index)
        .await
    }

    pub async fn remove_set_template_member(&self, id: Uuid, index: usize)
        -> Result<(), Status>
    {
        set::remove_set_template_member(&self, id, index)
        .await
    }

    pub async fn swap_set_template_member(&self, id: Uuid, index_1: usize, index_2: usize)
        -> Result<(), Status>
    {
        set::swap_set_template_member(&self, id, index_1, index_2)
        .await
    }

    pub async fn read_data(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<DataSchema, Status>
    {
        data::read_data(&self, device_id, model_id, timestamp)
        .await
        .map(|s| s.into())
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

    pub async fn list_data_by_number_before(&self, device_id: Uuid, model_id: Uuid, before: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_number_before(&self, device_id, model_id, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_number_after(&self, device_id: Uuid, model_id: Uuid, after: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_number_after(&self, device_id, model_id, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_ids_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, timestamp: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_ids_time(&self, device_ids, model_ids, timestamp)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_ids_last_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, last: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_ids_last_time(&self, device_ids, model_ids, last)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_ids_range_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_ids_range_time(&self, device_ids, model_ids, begin, end)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_ids_number_before(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, before: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_ids_number_before(&self, device_ids, model_ids, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_ids_number_after(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, after: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_ids_number_after(&self, device_ids, model_ids, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_set_time(&self, set_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_set_time(&self, set_id, timestamp)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_set_last_time(&self, set_id: Uuid, last: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_set_last_time(&self, set_id, last)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_set_range_time(&self, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_set_range_time(&self, set_id, begin, end)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_set_number_before(&self, set_id: Uuid, before: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_set_number_before(&self, set_id, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_by_set_number_after(&self, set_id: Uuid, after: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSchema>, Status>
    {
        data::list_data_by_set_number_after(&self, set_id, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn read_data_set(&self, set_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<DataSetSchema, Status>
    {
        data::read_data_set(&self, set_id, timestamp)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_set_by_last_time(&self, set_id: Uuid, last: DateTime<Utc>)
        -> Result<Vec<DataSetSchema>, Status>
    {
        data::list_data_set_by_last_time(&self, set_id, last)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_set_by_range_time(&self, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DataSetSchema>, Status>
    {
        data::list_data_set_by_range_time(&self, set_id, begin, end)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_set_by_number_before(&self, set_id: Uuid, before: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSetSchema>, Status>
    {
        data::list_data_set_by_number_before(&self, set_id, before, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_data_set_by_number_after(&self, set_id: Uuid, after: DateTime<Utc>, number: usize)
        -> Result<Vec<DataSetSchema>, Status>
    {
        data::list_data_set_by_number_after(&self, set_id, after, number)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_data(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, data: Vec<DataValue>)
        -> Result<(), Status>
    {
        data::create_data(&self, device_id, model_id, timestamp, data)
        .await
    }

    pub async fn delete_data(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<(), Status>
    {
        data::delete_data(&self, device_id, model_id, timestamp)
        .await
    }

    pub async fn read_data_timestamp(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<DateTime<Utc>, Status>
    {
        data::read_data_timestamp(&self, device_id, model_id, timestamp)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_timestamp_by_last_time(&self, device_id: Uuid, model_id: Uuid, last: DateTime<Utc>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        data::list_data_timestamp_by_last_time(&self, device_id, model_id, last)
        .await
    }

    pub async fn list_data_timestamp_by_range_time(&self, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        data::list_data_timestamp_by_range_time(&self, device_id, model_id, begin, end)
        .await
    }

    pub async fn read_data_timestamp_by_ids(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, timestamp: DateTime<Utc>)
        -> Result<DateTime<Utc>, Status>
    {
        data::read_data_timestamp_by_ids(&self, device_ids, model_ids, timestamp)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_timestamp_by_ids_last_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, last: DateTime<Utc>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        data::list_data_timestamp_by_ids_last_time(&self, device_ids, model_ids, last)
        .await
    }

    pub async fn list_data_timestamp_by_ids_range_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        data::list_data_timestamp_by_ids_range_time(&self, device_ids, model_ids, begin, end)
        .await
    }

    pub async fn read_data_timestamp_by_set(&self, set_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<DateTime<Utc>, Status>
    {
        data::read_data_timestamp_by_set(&self, set_id, timestamp)
        .await
        .map(|s| s.into())
    }

    pub async fn list_data_timestamp_by_set_last_time(&self, set_id: Uuid, last: DateTime<Utc>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        data::list_data_timestamp_by_set_last_time(&self, set_id, last)
        .await
    }

    pub async fn list_data_timestamp_by_set_range_time(&self, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        data::list_data_timestamp_by_set_range_time(&self, set_id, begin, end)
        .await
    }

    pub async fn count_data(&self, device_id: Uuid, model_id: Uuid)
        -> Result<usize, Status>
    {
        data::count_data(&self, device_id, model_id)
        .await
    }

    pub async fn count_data_by_last_time(&self, device_id: Uuid, model_id: Uuid, last: DateTime<Utc>)
        -> Result<usize, Status>
    {
        data::count_data_by_last_time(&self, device_id, model_id, last)
        .await
    }

    pub async fn count_data_by_range_time(&self, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<usize, Status>
    {
        data::count_data_by_range_time(&self, device_id, model_id, begin, end)
        .await
    }

    pub async fn read_buffer(&self, id: i32)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer(&self, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_buffer_by_time(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer_by_time(&self, device_id, model_id, timestamp, status.map(|s| s.into()))
        .await
        .map(|s| s.into())
    }

    pub async fn list_buffer_by_last_time(&self, device_id: Uuid, model_id: Uuid, last: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_last_time(&self, device_id, model_id, last, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_range_time(&self, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_range_time(&self, device_id, model_id, begin, end, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_number_before(&self, device_id: Uuid, model_id: Uuid, before: DateTime<Utc>, number: usize, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_number_before(&self, device_id, model_id, before, number, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_number_after(&self, device_id: Uuid, model_id: Uuid, after: DateTime<Utc>, number: usize, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_number_after(&self, device_id, model_id, after, number, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn read_buffer_first(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer_first(&self, device_id, model_id, status.map(|s| s.into()))
        .await
        .map(|s| s.into())
    }

    pub async fn read_buffer_last(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<BufferSchema, Status>
    {
        buffer::read_buffer_last(&self, device_id, model_id, status.map(|s| s.into()))
        .await
        .map(|s| s.into())
    }

    pub async fn list_buffer_first(&self, number: usize, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first(&self, number, device_id, model_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_first_offset(&self, number: usize, offset: usize, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first_offset(&self, number, offset, device_id, model_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last(&self, number: usize, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last(&self, number, device_id, model_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last_offset(&self, number: usize, offset: usize, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last_offset(&self, number, offset, device_id, model_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_ids_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, timestamp: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_ids_time(&self, device_ids, model_ids, timestamp, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_ids_last_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, last: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_ids_last_time(&self, device_ids, model_ids, last, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_ids_range_time(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, begin: DateTime<Utc>, end: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_ids_range_time(&self, device_ids, model_ids, begin, end, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_ids_number_before(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, before: DateTime<Utc>, number: usize, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_ids_number_before(&self, device_ids, model_ids, before, number, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_ids_number_after(&self, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, after: DateTime<Utc>, number: usize, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_ids_number_after(&self, device_ids, model_ids, after, number, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_first_by_ids(&self, number: usize, device_ids: Option<Vec<Uuid>>, model_ids: Option<Vec<Uuid>>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first_by_ids(&self, number, device_ids, model_ids, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_first_offset_by_ids(&self, number: usize, offset: usize, device_ids: Option<Vec<Uuid>>, model_ids: Option<Vec<Uuid>>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first_offset_by_ids(&self, number, offset, device_ids, model_ids, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last_by_ids(&self, number: usize, device_ids: Option<Vec<Uuid>>, model_ids: Option<Vec<Uuid>>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last_by_ids(&self, number, device_ids, model_ids, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last_offset_by_ids(&self, number: usize, offset: usize, device_ids: Option<Vec<Uuid>>, model_ids: Option<Vec<Uuid>>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last_offset_by_ids(&self, number, offset, device_ids, model_ids, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_set_time(&self, set_id: Uuid, timestamp: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_set_time(&self, set_id, timestamp, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_set_last_time(&self, set_id: Uuid, last: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_set_last_time(&self, set_id, last, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_set_range_time(&self, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_set_range_time(&self, set_id, begin, end, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_set_number_before(&self, set_id: Uuid, before: DateTime<Utc>, number: usize, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_set_number_before(&self, set_id, before, number, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_by_set_number_after(&self, set_id: Uuid, after: DateTime<Utc>, number: usize, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_by_set_number_after(&self, set_id, after, number, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_first_by_set(&self, number: usize, set_id: Uuid, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first_by_set(&self, number, set_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_first_offset_by_set(&self, number: usize, offset: usize, set_id: Uuid, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_first_offset_by_set(&self, number, offset, set_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last_by_set(&self, number: usize, set_id: Uuid, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last_by_set(&self, number, set_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_buffer_last_offset_by_set(&self, number: usize, offset: usize, set_id: Uuid, status: Option<BufferStatus>)
        -> Result<Vec<BufferSchema>, Status>
    {
        buffer::list_buffer_last_offset_by_set(&self, number, offset, set_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_buffer(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, data: Vec<DataValue>, status: BufferStatus)
        -> Result<i32, Status>
    {
        buffer::create_buffer(&self, device_id, model_id, timestamp, data, status.into())
        .await
    }

    pub async fn update_buffer(&self, id: i32, data: Option<Vec<DataValue>>, status: Option<BufferStatus>)
        -> Result<(), Status>
    {
        buffer::update_buffer(&self, id, data, status.map(|s| s.into()))
        .await
    }

    pub async fn delete_buffer(&self, id: i32)
        -> Result<(), Status>
    {
        buffer::delete_buffer(&self, id)
        .await
    }

    pub async fn read_buffer_timestamp_first(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<DateTime<Utc>, Status>
    {
        buffer::read_buffer_timestamp_first(&self, device_id, model_id, status.map(|s| s.into()))
        .await
    }

    pub async fn read_buffer_timestamp_last(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<DateTime<Utc>, Status>
    {
        buffer::read_buffer_timestamp_last(&self, device_id, model_id, status.map(|s| s.into()))
        .await
    }

    pub async fn list_buffer_timestamp_first(&self, number: usize, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        buffer::list_buffer_timestamp_first(&self, number, device_id, model_id, status.map(|s| s.into()))
        .await
    }

    pub async fn list_buffer_timestamp_last(&self, number: usize, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        buffer::list_buffer_timestamp_last(&self, number, device_id, model_id, status.map(|s| s.into()))
        .await
    }

    pub async fn list_buffer_timestamp_first_by_ids(&self, number: usize, device_ids: Option<Vec<Uuid>>, model_ids: Option<Vec<Uuid>>, status: Option<BufferStatus>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        buffer::list_buffer_timestamp_first_by_ids(&self, number, device_ids, model_ids, status.map(|s| s.into()))
        .await
    }

    pub async fn list_buffer_timestamp_last_by_ids(&self, number: usize, device_ids: Option<Vec<Uuid>>, model_ids: Option<Vec<Uuid>>, status: Option<BufferStatus>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        buffer::list_buffer_timestamp_last_by_ids(&self, number, device_ids, model_ids, status.map(|s| s.into()))
        .await
    }

    pub async fn list_buffer_timestamp_first_by_set(&self, number: usize, set_id: Uuid, status: Option<BufferStatus>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        buffer::list_buffer_timestamp_first_by_set(&self, number, set_id, status.map(|s| s.into()))
        .await
    }

    pub async fn list_buffer_timestamp_last_by_set(&self, number: usize, set_id: Uuid, status: Option<BufferStatus>)
        -> Result<Vec<DateTime<Utc>>, Status>
    {
        buffer::list_buffer_timestamp_last_by_set(&self, number, set_id, status.map(|s| s.into()))
        .await
    }

    pub async fn count_buffer(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<BufferStatus>)
        -> Result<usize, Status>
    {
        buffer::count_buffer(&self, device_id, model_id, status.map(|s| s.into()))
        .await
    }

    pub async fn read_slice(&self, id: i32)
        -> Result<SliceSchema, Status>
    {
        slice::read_slice(&self, id).await
        .map(|s| s.into())
    }

    pub async fn list_slice_by_time(&self, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_time(&self, device_id, model_id, timestamp).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_by_range_time(&self, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_range_time(&self, device_id, model_id, begin, end).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_by_name_time(&self, name: &str, timestamp: DateTime<Utc>)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_name_time(&self, name, timestamp).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_by_name_range_time(&self, name: &str, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_by_name_range_time(&self, name, begin, end).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_option(&self, device_id: Option<Uuid>, model_id: Option<Uuid>, name: Option<&str>, begin_or_timestamp: Option<DateTime<Utc>>, end: Option<DateTime<Utc>>)
        -> Result<Vec<SliceSchema>, Status>
    {
        slice::list_slice_option(&self, device_id, model_id, name, begin_or_timestamp, end).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_slice(&self, device_id: Uuid, model_id: Uuid, timestamp_begin: DateTime<Utc>, timestamp_end: DateTime<Utc>, name: &str, description: Option<&str>)
        -> Result<i32, Status>
    {
        slice::create_slice(&self, device_id, model_id, timestamp_begin, timestamp_end, name, description)
        .await
    }

    pub async fn update_slice(&self, id: i32, timestamp_begin: Option<DateTime<Utc>>, timestamp_end: Option<DateTime<Utc>>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        slice::update_slice(&self, id, timestamp_begin, timestamp_end, name, description)
        .await
    }

    pub async fn delete_slice(&self, id: i32)
        -> Result<(), Status>
    {
        slice::delete_slice(&self, id).await
    }

    pub async fn read_slice_set(&self, id: i32)
        -> Result<SliceSetSchema, Status>
    {
        slice::read_slice_set(&self, id).await
        .map(|s| s.into())
    }

    pub async fn list_slice_set_by_time(&self, set_id: Uuid, timestamp: DateTime<Utc>)
        -> Result<Vec<SliceSetSchema>, Status>
    {
        slice::list_slice_set_by_time(&self, set_id, timestamp).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_set_by_range_time(&self, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<SliceSetSchema>, Status>
    {
        slice::list_slice_set_by_range_time(&self, set_id, begin, end).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_set_by_name_time(&self, name: &str, timestamp: DateTime<Utc>)
        -> Result<Vec<SliceSetSchema>, Status>
    {
        slice::list_slice_set_by_name_time(&self, name, timestamp).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_set_by_name_range_time(&self, name: &str, begin: DateTime<Utc>, end: DateTime<Utc>)
        -> Result<Vec<SliceSetSchema>, Status>
    {
        slice::list_slice_set_by_name_range_time(&self, name, begin, end).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_slice_set_option(&self, set_id: Option<Uuid>, name: Option<&str>, begin_or_timestamp: Option<DateTime<Utc>>, end: Option<DateTime<Utc>>)
        -> Result<Vec<SliceSetSchema>, Status>
    {
        slice::list_slice_set_option(&self, set_id, name, begin_or_timestamp, end).await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_slice_set(&self, set_id: Uuid, timestamp_begin: DateTime<Utc>, timestamp_end: DateTime<Utc>, name: &str, description: Option<&str>)
        -> Result<i32, Status>
    {
        slice::create_slice_set(&self, set_id, timestamp_begin, timestamp_end, name, description)
        .await
    }

    pub async fn update_slice_set(&self, id: i32, timestamp_begin: Option<DateTime<Utc>>, timestamp_end: Option<DateTime<Utc>>, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        slice::update_slice_set(&self, id, timestamp_begin, timestamp_end, name, description)
        .await
    }

    pub async fn delete_slice_set(&self, id: i32)
        -> Result<(), Status>
    {
        slice::delete_slice_set(&self, id).await
    }

    pub async fn read_log(&self, timestamp: DateTime<Utc>, device_id: Uuid)
        -> Result<LogSchema, Status>
    {
        log::read_log(&self, timestamp, device_id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_log_by_time(&self, timestamp: DateTime<Utc>, device_id: Option<Uuid>, status: Option<LogStatus>)
        -> Result<Vec<LogSchema>, Status>
    {
        log::list_log_by_time(&self, timestamp, device_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_log_by_last_time(&self, last: DateTime<Utc>, device_id: Option<Uuid>, status: Option<LogStatus>)
        -> Result<Vec<LogSchema>, Status>
    {
        log::list_log_by_last_time(&self, last, device_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_log_by_range_time(&self, begin: DateTime<Utc>, end: DateTime<Utc>, device_id: Option<Uuid>, status: Option<LogStatus>)
        -> Result<Vec<LogSchema>, Status>
    {
        log::list_log_by_range_time(&self, begin, end, device_id, status.map(|s| s.into()))
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_log(&self, timestamp: DateTime<Utc>, device_id: Uuid, status: LogStatus, value: DataValue)
        -> Result<(), Status>
    {
        log::create_log(&self, timestamp, device_id, status.into(), value)
        .await
    }

    pub async fn update_log(&self, timestamp: DateTime<Utc>, device_id: Uuid, status: Option<LogStatus>, value: Option<DataValue>)
        -> Result<(), Status>
    {
        log::update_log(&self, timestamp, device_id, status.map(|s| s.into()), value)
        .await
    }

    pub async fn delete_log(&self, timestamp: DateTime<Utc>, device_id: Uuid)
        -> Result<(), Status>
    {
        log::delete_log(&self, timestamp, device_id).await
    }

}
