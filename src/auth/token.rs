use tonic::{Request, Status, transport::Channel};
use chrono::{DateTime, Utc};
use rmcs_auth_api::token::token_service_client::TokenServiceClient;
use rmcs_auth_api::token::{
    TokenSchema, AccessId, RefreshId, UserId, TokenUpdate
};

const TOKEN_NOT_FOUND: &str = "requested token not found";

pub async fn read_access_token(channel: &Channel, access_id: u32)
    -> Result<TokenSchema, Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(AccessId {
        access_id
    });
    let response = client.read_access_token(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or_else(|| Status::not_found(TOKEN_NOT_FOUND))?)
}

pub async fn read_refresh_token(channel: &Channel, refresh_id: &str)
    -> Result<TokenSchema, Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(RefreshId {
        refresh_id: refresh_id.to_owned()
    });
    let response = client.read_refresh_token(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or_else(|| Status::not_found(TOKEN_NOT_FOUND))?)
}

pub async fn list_token_by_user(channel: &Channel, user_id: u32)
    -> Result<Vec<TokenSchema>, Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(UserId {
        user_id
    });
    let response = client.list_token_by_user(request)
        .await?
        .into_inner();
    Ok(response.result)
}

pub async fn create_access_token(channel: &Channel, user_id: u32, expire: DateTime<Utc>, ip: &[u8])
    -> Result<(u32, String), Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(TokenSchema {
        refresh_id: String::new(),
        access_id: 0,
        user_id,
        expire: expire.timestamp_nanos(),
        ip: ip.to_vec()
    });
    let response = client.create_access_token(request)
        .await?
        .into_inner();
    Ok((response.access_id, response.refresh_id))
}

pub async fn create_refresh_token(channel: &Channel, access_id: u32, user_id: u32, expire: DateTime<Utc>, ip: &[u8])
    -> Result<(u32, String), Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(TokenSchema {
        refresh_id: String::new(),
        access_id,
        user_id,
        expire: expire.timestamp_nanos(),
        ip: ip.to_vec()
    });
    let response = client.create_refresh_token(request)
        .await?
        .into_inner();
    Ok((response.access_id, response.refresh_id))
}

pub async fn update_access_token(channel: &Channel, access_id: u32, expire: Option<DateTime<Utc>>, ip: Option<&[u8]>)
    -> Result<String, Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(TokenUpdate {
        refresh_id: None,
        access_id: Some(access_id),
        expire: expire.map(|s| s.timestamp_nanos()),
        ip: ip.map(|s| s.to_vec())
    });
    let response = client.update_access_token(request)
        .await?
        .into_inner();
    Ok(response.refresh_id)
}

pub async fn update_refresh_token(channel: &Channel, refresh_id: &str, access_id: Option<u32>, expire: Option<DateTime<Utc>>, ip: Option<&[u8]>)
    -> Result<String, Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(TokenUpdate {
        refresh_id: Some(refresh_id.to_owned()),
        access_id,
        expire: expire.map(|s| s.timestamp_nanos()),
        ip: ip.map(|s| s.to_vec())
    });
    let response = client.update_refresh_token(request)
        .await?
        .into_inner();
    Ok(response.refresh_id)
}

pub async fn delete_access_token(channel: &Channel, access_id: u32)
    -> Result<(), Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(AccessId {
        access_id
    });
    client.delete_access_token(request)
        .await?;
    Ok(())
}

pub async fn delete_refresh_token(channel: &Channel, refresh_id: &str)
    -> Result<(), Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(RefreshId {
        refresh_id: refresh_id.to_owned()
    });
    client.delete_refresh_token(request)
        .await?;
    Ok(())
}

pub async fn delete_token_by_user(channel: &Channel, user_id: u32)
    -> Result<(), Status>
{
    let mut client = TokenServiceClient::new(channel.to_owned());
    let request = Request::new(UserId {
        user_id
    });
    client.delete_token_by_user(request)
        .await?;
    Ok(())
}
