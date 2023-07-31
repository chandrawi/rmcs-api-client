use tonic::{Request, Status};
use rmcs_auth_api::role::role_service_client::RoleServiceClient;
use rmcs_auth_api::role::{
    RoleSchema, RoleId, RoleName, ApiId, UserId, RoleUpdate, RoleAccess
};
use crate::auth::Auth;
use crate::utility::TokenInterceptor;

const ROLE_NOT_FOUND: &str = "requested role not found";

pub(crate) async fn read_role(auth: &Auth, id: i32)
    -> Result<RoleSchema, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(RoleId {
        id
    });
    let response = client.read_role(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(ROLE_NOT_FOUND))?)
}

pub(crate) async fn read_role_by_name(auth: &Auth, api_id: i32, name: &str)
    -> Result<RoleSchema, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(RoleName {
        api_id,
        name: name.to_owned()
    });
    let response = client.read_role_by_name(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(ROLE_NOT_FOUND))?)
}

pub(crate) async fn list_role_by_api(auth: &Auth, api_id: i32)
    -> Result<Vec<RoleSchema>, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(ApiId {
        api_id
    });
    let response = client.list_role_by_api(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_role_by_user(auth: &Auth, user_id: i32)
    -> Result<Vec<RoleSchema>, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(UserId {
        user_id
    });
    let response = client.list_role_by_user(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_role(auth: &Auth, api_id: i32, name: &str, multi: bool, ip_lock: bool, access_duration: i32, refresh_duration: i32)
    -> Result<i32, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
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

pub(crate) async fn update_role(auth: &Auth, id: i32, name: Option<&str>, multi: Option<bool>, ip_lock: Option<bool>, access_duration: Option<i32>, refresh_duration: Option<i32>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
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

pub(crate) async fn delete_role(auth: &Auth, id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(RoleId {
        id
    });
    let _response = client.delete_role(request)
        .await?
        .into_inner();
    Ok(())
}

pub(crate) async fn add_role_access(auth: &Auth, id: i32, procedure_id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(RoleAccess {
        id,
        procedure_id
    });
    let _response = client.add_role_access(request)
        .await?
        .into_inner();
    Ok(())
}

pub(crate) async fn remove_role_access(auth: &Auth, id: i32, procedure_id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        RoleServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(RoleAccess {
        id,
        procedure_id
    });
    let _response = client.remove_role_access(request)
        .await?
        .into_inner();
    Ok(())
}
