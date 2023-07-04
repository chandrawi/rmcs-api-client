use tonic::{Request, Status};
use rmcs_auth_api::api::api_service_client::ApiServiceClient;
use rmcs_auth_api::api::{
    ApiSchema, ApiId, ApiName, ApiCategory, ApiUpdate,
    ProcedureSchema, ProcedureId, ProcedureName, ProcedureUpdate
};
use crate::auth::Auth;

const API_NOT_FOUND: &str = "requested api not found";
const PROC_NOT_FOUND: &str = "requested procedure not found";

pub(crate) async fn read_api(auth: &Auth, id: u32)
    -> Result<ApiSchema, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiId {
        id
    });
    let response = client.read_api(request).await?.into_inner();
    Ok(response.result.ok_or(Status::not_found(API_NOT_FOUND))?)
}

pub(crate) async fn read_api_by_name(auth: &Auth, name: &str)
    -> Result<ApiSchema, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiName {
        name: name.to_owned()
    });
    let response = client.read_api_by_name(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(API_NOT_FOUND))?)
}

pub(crate) async fn list_api_by_category(auth: &Auth, category: &str)
    -> Result<Vec<ApiSchema>, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiCategory {
        category: category.to_owned()
    });
    let response = client.list_api_by_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_api(auth: &Auth, name: &str, address: &str, category: &str, description: &str, password: &str)
    -> Result<u32, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiSchema {
        id: 0,
        name: name.to_owned(),
        address: address.to_owned(),
        category: category.to_owned(),
        description: description.to_owned(),
        public_key: Vec::new(),
        password: password.to_owned(),
        access_key: Vec::new(),
        procedures: Vec::new()
    });
    let response = client.create_api(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_api(auth: &Auth, id: u32, name: Option<&str>, address: Option<&str>, category: Option<&str>, description: Option<&str>, password: Option<&str>, keys: Option<()>)
    -> Result<(), Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        address: address.map(|s| s.to_owned()),
        category: category.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned()),
        password: password.map(|s| s.to_owned()),
        update_key: keys.is_some()
    });
    client.update_api(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_api(auth: &Auth, id: u32)
    -> Result<(), Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiId {
        id
    });
    client.delete_api(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_procedure(auth: &Auth, id: u32)
    -> Result<ProcedureSchema, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ProcedureId {
        id
    });
    let response = client.read_procedure(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(PROC_NOT_FOUND))?)
}

pub(crate) async fn read_procedure_by_name(auth: &Auth, api_id: u32, name: &str)
    -> Result<ProcedureSchema, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ProcedureName {
        api_id,
        name: name.to_owned()
    });
    let response = client.read_procedure_by_name(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(PROC_NOT_FOUND))?)
}

pub(crate) async fn list_procedure_by_api(auth: &Auth, api_id: u32)
    -> Result<Vec<ProcedureSchema>, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiId {
        id: api_id
    });
    let response = client.list_procedure_by_api(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_procedure(auth: &Auth, api_id: u32, name: &str, description: &str)
    -> Result<u32, Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ProcedureSchema {
        id: 0,
        api_id,
        name: name.to_owned(),
        description: description.to_owned(),
        roles: Vec::new()
    });
    let response = client.create_procedure(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_procedure(auth: &Auth, id: u32, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ProcedureUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_procedure(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_procedure(auth: &Auth, id: u32)
    -> Result<(), Status>
{
    let mut client = ApiServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ProcedureId {
        id
    });
    client.delete_procedure(request)
        .await?;
    Ok(())
}
