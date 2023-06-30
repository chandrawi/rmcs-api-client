pub mod api;

use tonic::{Status, transport::Channel};
use rmcs_auth_api::api::{ApiSchema, ProcedureSchema};

#[derive(Debug, Clone)]
pub struct Auth {
    pub channel: Channel
}

impl Auth {
    
    pub async fn new(addr: &str) -> Auth {
        let addr: &'static str = Box::leak(addr.to_owned().into_boxed_str());
        let channel = Channel::from_static(addr)
            .connect()
            .await
            .expect(&format!("Error making channel to {}", addr));
        Auth {
            channel
        }
    }

    pub fn new_with_channel(channel: Channel) -> Auth {
        Auth {
            channel
        }
    }

    pub async fn read_api(&self, id: u32)
        -> Result<ApiSchema, Status>
    {
        api::read_api(&self.channel, id).await
    }

    pub async fn read_api_by_name(&self, name: &str)
        -> Result<ApiSchema, Status>
    {
        api::read_api_by_name(&self.channel, name).await
    }

    pub async fn read_procedure(&self, id: u32)
        -> Result<ProcedureSchema, Status>
    {
        api::read_procedure(&self.channel, id).await
    }

    pub async fn read_procedure_by_name(&self, api_id: u32, name: &str)
        -> Result<ProcedureSchema, Status>
    {
        api::read_procedure_by_name(&self.channel, api_id, name).await
    }

    pub async fn list_api_by_category(&self, category: &str)
        -> Result<Vec<ApiSchema>, Status>
    {
        api::list_api_by_category(&self.channel, category).await
    }

    pub async fn create_api(&self, name: &str, address: &str, category: &str, description: &str, password: &str)
        -> Result<u32, Status>
    {
        api::create_api(&self.channel, name, address, category, description, password)
        .await
    }

    pub async fn update_api(&self, id: u32, name: Option<&str>, address: Option<&str>, category: Option<&str>, description: Option<&str>, password: Option<&str>, keys: Option<()>)
        -> Result<(), Status>
    {
        api::update_api(&self.channel, id, name, address, category, description, password, keys)
        .await
    }

    pub async fn delete_api(&self, id: u32)
        -> Result<(), Status>
    {
        api::delete_api(&self.channel, id)
        .await
    }

    pub async fn list_procedure_by_api(&self, api_id: u32)
        -> Result<Vec<ProcedureSchema>, Status>
    {
        api::list_procedure_by_api(&self.channel, api_id)
        .await
    }

    pub async fn create_procedure(&self, api_id: u32, name: &str, description: &str)
        -> Result<u32, Status>
    {
        api::create_procedure(&self.channel, api_id, name, description)
        .await
    }

    pub async fn update_procedure(&self, id: u32, name: Option<&str>, description: Option<&str>)
        -> Result<(), Status>
    {
        api::update_procedure(&self.channel, id, name, description)
        .await
    }

    pub async fn delete_procedure(&self, id: u32)
        -> Result<(), Status>
    {
        api::delete_procedure(&self.channel, id)
        .await
    }

}
