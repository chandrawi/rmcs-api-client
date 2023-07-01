pub mod model;

use tonic::{Status, transport::Channel};
use rmcs_resource_db::schema::value::{DataIndexing, DataType, ConfigValue};
use rmcs_resource_db::schema::model::{ModelSchema, ModelConfigSchema};

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

}
