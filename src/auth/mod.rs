pub mod api;
pub mod role;
pub mod user;
pub mod token;
pub mod auth;

use tonic::{Status, transport::Channel};
use chrono::{DateTime, Utc};
use rmcs_auth_db::schema::api::{ApiSchema, ProcedureSchema};
use rmcs_auth_db::schema::auth_role::RoleSchema;
use rmcs_auth_db::schema::auth_user::UserSchema;
use rmcs_auth_db::schema::auth_token::TokenSchema;
use rmcs_auth_api::auth::{ApiLoginResponse, UserLoginResponse, UserRefreshResponse, UserLogoutResponse};

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

    pub async fn api_login(&self, api_id: u32, password: &str)
        -> Result<ApiLoginResponse, Status>
    {
        auth::api_login(&self.channel, api_id, password).await
    }

    pub async fn user_login(&self, username: &str, password: &str)
        -> Result<UserLoginResponse, Status>
    {
        auth::user_login(&self.channel, username, password).await
    }

    pub async fn user_refresh(&self, api_id: u32, access_token: &str, refresh_token: &str)
        -> Result<UserRefreshResponse, Status>
    {
        auth::user_refresh(&self.channel, api_id, access_token, refresh_token).await
    }

    pub async fn user_logout(&self, refresh_token: &str)
        -> Result<UserLogoutResponse, Status>
    {
        auth::user_logout(&self.channel, refresh_token).await
    }

    pub async fn read_api(&self, id: u32)
        -> Result<ApiSchema, Status>
    {
        api::read_api(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_api_by_name(&self, name: &str)
        -> Result<ApiSchema, Status>
    {
        api::read_api_by_name(&self.channel, name)
        .await
        .map(|s| s.into())
    }

    pub async fn list_api_by_category(&self, category: &str)
        -> Result<Vec<ApiSchema>, Status>
    {
        api::list_api_by_category(&self.channel, category)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn read_procedure(&self, id: u32)
        -> Result<ProcedureSchema, Status>
    {
        api::read_procedure(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_procedure_by_name(&self, api_id: u32, name: &str)
        -> Result<ProcedureSchema, Status>
    {
        api::read_procedure_by_name(&self.channel, api_id, name)
        .await
        .map(|s| s.into())
    }

    pub async fn list_procedure_by_api(&self, api_id: u32)
        -> Result<Vec<ProcedureSchema>, Status>
    {
        api::list_procedure_by_api(&self.channel, api_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
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

    pub async fn read_role(&self, id: u32)
        -> Result<RoleSchema, Status>
    {
        role::read_role(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_role_by_name(&self, api_id: u32, name: &str)
        -> Result<RoleSchema, Status>
    {
        role::read_role_by_name(&self.channel, api_id, name)
        .await
        .map(|s| s.into())
    }

    pub async fn list_role_by_api(&self, api_id: u32)
        -> Result<Vec<RoleSchema>, Status>
    {
        role::list_role_by_api(&self.channel, api_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn list_role_by_user(&self, user_id: u32)
        -> Result<Vec<RoleSchema>, Status>
    {
        role::list_role_by_user(&self.channel, user_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_role(&self, api_id: u32, name: &str, multi: bool, ip_lock: bool, access_duration: u32, refresh_duration: u32)
        -> Result<u32, Status>
    {
        role::create_role(&self.channel, api_id, name, multi, ip_lock, access_duration, refresh_duration)
        .await
    }

    pub async fn update_role(&self, id: u32, name: Option<&str>, multi: Option<bool>, ip_lock: Option<bool>, access_duration: Option<u32>, refresh_duration: Option<u32>)
        -> Result<(), Status>
    {
        role::update_role(&self.channel, id, name, multi, ip_lock, access_duration, refresh_duration)
        .await
    }

    pub async fn delete_role(&self, id: u32)
        -> Result<(), Status>
    {
        role::delete_role(&self.channel, id)
        .await
    }

    pub async fn add_role_access(&self, id: u32, procedure_id: u32)
        -> Result<(), Status>
    {
        role::add_role_access(&self.channel, id, procedure_id)
        .await
    }

    pub async fn remove_role_access(&self, id: u32, procedure_id: u32)
        -> Result<(), Status>
    {
        role::remove_role_access(&self.channel, id, procedure_id)
        .await
    }

    pub async fn read_user(&self, id: u32)
        -> Result<UserSchema, Status>
    {
        user::read_user(&self.channel, id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_user_by_name(&self, name: &str)
        -> Result<UserSchema, Status>
    {
        user::read_user_by_name(&self.channel, name)
        .await
        .map(|s| s.into())
    }

    pub async fn list_user_by_role(&self, role_id: u32)
        -> Result<Vec<UserSchema>, Status>
    {
        user::list_user_by_role(&self.channel, role_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_user(&self, name: &str, email: &str, phone: &str, password: &str)
        -> Result<u32, Status>
    {
        user::create_user(&self.channel, name, email, phone, password)
        .await
    }

    pub async fn update_user(&self, id: u32, name: Option<&str>, email: Option<&str>, phone: Option<&str>, password: Option<&str>, keys: Option<()>)
        -> Result<(), Status>
    {
        user::update_user(&self.channel, id, name, email, phone, password, keys)
        .await
    }

    pub async fn delete_user(&self, id: u32)
        -> Result<(), Status>
    {
        user::delete_user(&self.channel, id)
        .await
    }

    pub async fn add_user_role(&self, id: u32, role_id: u32)
        -> Result<(), Status>
    {
        user::add_user_role(&self.channel, id, role_id)
        .await
    }

    pub async fn remove_user_role(&self, id: u32, role_id: u32)
        -> Result<(), Status>
    {
        user::remove_user_role(&self.channel, id, role_id)
        .await
    }

    pub async fn read_access_token(&self, access_id: u32)
        -> Result<TokenSchema, Status>
    {
        token::read_access_token(&self.channel, access_id)
        .await
        .map(|s| s.into())
    }

    pub async fn read_refresh_token(&self, refresh_id: &str)
        -> Result<TokenSchema, Status>
    {
        token::read_refresh_token(&self.channel, refresh_id)
        .await
        .map(|s| s.into())
    }

    pub async fn list_token_by_user(&self, user_id: u32)
        -> Result<Vec<TokenSchema>, Status>
    {
        token::list_token_by_user(&self.channel, user_id)
        .await
        .map(|v| v.into_iter().map(|s| s.into()).collect())
    }

    pub async fn create_access_token(&self, user_id: u32, expire: DateTime<Utc>, ip: &[u8])
        -> Result<(u32, String), Status>
    {
        token::create_access_token(&self.channel, user_id, expire, ip)
        .await
    }

    pub async fn create_refresh_token(&self, access_id: u32, user_id: u32, expire: DateTime<Utc>, ip: &[u8])
        -> Result<(u32, String), Status>
    {
        token::create_refresh_token(&self.channel, access_id, user_id, expire, ip)
        .await
    }

    pub async fn update_access_token(&self, access_id: u32, expire: Option<DateTime<Utc>>, ip: Option<&[u8]>)
        -> Result<String, Status>
    {
        token::update_access_token(&self.channel, access_id, expire, ip)
        .await
    }

    pub async fn update_refresh_token(&self, refresh_id: &str, access_id: Option<u32>, expire: Option<DateTime<Utc>>, ip: Option<&[u8]>)
        -> Result<String, Status>
    {
        token::update_refresh_token(&self.channel, refresh_id, access_id, expire, ip)
        .await
    }

    pub async fn delete_access_token(&self, access_id: u32)
        -> Result<(), Status>
    {
        token::delete_access_token(&self.channel, access_id)
        .await
    }

    pub async fn delete_refresh_token(&self, refresh_id: &str)
        -> Result<(), Status>
    {
        token::delete_refresh_token(&self.channel, refresh_id)
        .await
    }

    pub async fn delete_token_by_user(&self, user_id: u32)
        -> Result<(), Status>
    {
        token::delete_token_by_user(&self.channel, user_id)
        .await
    }

}
