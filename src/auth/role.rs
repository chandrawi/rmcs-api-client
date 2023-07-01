use tonic::{Request, Status, transport::Channel};
use rmcs_auth_api::role::role_service_client::RoleServiceClient;
use rmcs_auth_api::role::{
    RoleSchema, RoleId, RoleName, ApiId, UserId, RoleUpdate, RoleAccess
};

const ROLE_NOT_FOUND: &str = "requested role not found";


pub(crate) async fn read_role(channel: &Channel, id: u32)
    -> Result<RoleSchema, Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(RoleId {
        id
    });
    let response = client.read_role(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(ROLE_NOT_FOUND))?)
}

pub(crate) async fn read_role_by_name(channel: &Channel, api_id: u32, name: &str)
    -> Result<RoleSchema, Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(RoleName {
        api_id,
        name: name.to_owned()
    });
    let response = client.read_role_by_name(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(ROLE_NOT_FOUND))?)
}

pub(crate) async fn list_role_by_api(channel: &Channel, api_id: u32)
    -> Result<Vec<RoleSchema>, Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(ApiId {
        api_id
    });
    let response = client.list_role_by_api(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_role_by_user(channel: &Channel, user_id: u32)
    -> Result<Vec<RoleSchema>, Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(UserId {
        user_id
    });
    let response = client.list_role_by_user(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_role(channel: &Channel, api_id: u32, name: &str, multi: bool, ip_lock: bool, access_duration: u32, refresh_duration: u32)
    -> Result<u32, Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(RoleSchema {
        id: 0,
        api_id,
        name: name.to_owned(),
        multi,
        ip_lock,
        access_duration,
        refresh_duration,
        access_key: Vec::new(),
        procedures: Vec::new()
    });
    let response = client.create_role(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_role(channel: &Channel, id: u32, name: Option<&str>, multi: Option<bool>, ip_lock: Option<bool>, access_duration: Option<u32>, refresh_duration: Option<u32>)
    -> Result<(), Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(RoleUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        multi,
        ip_lock,
        access_duration,
        refresh_duration
    });
    let _response = client.update_role(request)
        .await?
        .into_inner();
    Ok(())
}

pub(crate) async fn delete_role(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(RoleId {
        id
    });
    let _response = client.delete_role(request)
        .await?
        .into_inner();
    Ok(())
}

pub(crate) async fn add_role_access(channel: &Channel, id: u32, procedure_id: u32)
    -> Result<(), Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(RoleAccess {
        id,
        procedure_id
    });
    let _response = client.add_role_access(request)
        .await?
        .into_inner();
    Ok(())
}

pub(crate) async fn remove_role_access(channel: &Channel, id: u32, procedure_id: u32)
    -> Result<(), Status>
{
    let mut client = RoleServiceClient::new(channel.to_owned());
    let request = Request::new(RoleAccess {
        id,
        procedure_id
    });
    let _response = client.remove_role_access(request)
        .await?
        .into_inner();
    Ok(())
}
