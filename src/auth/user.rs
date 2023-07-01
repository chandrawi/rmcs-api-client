use tonic::{Request, Status, transport::Channel};
use rmcs_auth_api::user::user_service_client::UserServiceClient;
use rmcs_auth_api::user::{
    UserSchema, UserId, UserName, RoleId, UserUpdate, UserRole
};

const USER_NOT_FOUND: &str = "requested user not found";

pub async fn read_user(channel: &Channel, id: u32)
    -> Result<UserSchema, Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(UserId {
        id
    });
    let response = client.read_user(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or_else(|| Status::not_found(USER_NOT_FOUND))?)
}

pub async fn read_user_by_name(channel: &Channel, name: &str)
    -> Result<UserSchema, Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(UserName {
        name: name.to_owned()
    });
    let response = client.read_user_by_name(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or_else(|| Status::not_found(USER_NOT_FOUND))?)
}

pub async fn list_user_by_role(channel: &Channel, role_id: u32)
    -> Result<Vec<UserSchema>, Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(RoleId {
        id: role_id
    });
    let response = client.list_user_by_role(request)
        .await?
        .into_inner();
    Ok(response.result)
}

pub async fn create_user(channel: &Channel, name: &str, email: &str, phone: &str, password: &str)
    -> Result<u32, Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(UserSchema {
        id: 0,
        name: name.to_owned(),
        email: email.to_owned(),
        phone: phone.to_owned(),
        password: password.to_owned(),
        public_key: Vec::new(),
        roles: Vec::new()
    });
    let response = client.create_user(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub async fn update_user(channel: &Channel, id: u32, name: Option<&str>, email: Option<&str>, phone: Option<&str>, password: Option<&str>, keys: Option<()>)
    -> Result<(), Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(UserUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        email: email.map(|s| s.to_owned()),
        phone: phone.map(|s| s.to_owned()),
        password: password.map(|s| s.to_owned()),
        update_key: keys.is_some()
    });
    client.update_user(request)
        .await?;
    Ok(())
}

pub async fn delete_user(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(UserId {
        id
    });
    client.delete_user(request)
        .await?;
    Ok(())
}

pub async fn add_user_role(channel: &Channel, id: u32, role_id: u32)
    -> Result<(), Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(UserRole {
        user_id: id,
        role_id
    });
    client.add_user_role(request)
        .await?;
    Ok(())
}

pub async fn remove_user_role(channel: &Channel, id: u32, role_id: u32)
    -> Result<(), Status>
{
    let mut client = UserServiceClient::new(channel.to_owned());
    let request = Request::new(UserRole {
        user_id: id,
        role_id
    });
    client.remove_user_role(request)
        .await?;
    Ok(())
}