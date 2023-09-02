use tonic::{Request, Status};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use rmcs_auth_api::token::token_service_client::TokenServiceClient;
use rmcs_auth_api::token::{
    TokenSchema, AccessId, AuthToken, UserId, AuthTokenCreate, TokenUpdate
};
use crate::auth::Auth;
use rmcs_api_server::utility::interceptor::TokenInterceptor;

const TOKEN_NOT_FOUND: &str = "requested token not found";

pub(crate) async fn read_access_token(auth: &Auth, access_id: i32)
    -> Result<TokenSchema, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(AccessId {
        access_id
    });
    let response = client.read_access_token(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(TOKEN_NOT_FOUND))?)
}

pub(crate) async fn list_auth_token(auth: &Auth, auth_token: &str)
    -> Result<Vec<TokenSchema>, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(AuthToken {
        auth_token: auth_token.to_owned()
    });
    let response = client.list_auth_token(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_token_by_user(auth: &Auth, user_id: Uuid)
    -> Result<Vec<TokenSchema>, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(UserId {
        user_id: user_id.as_bytes().to_vec()
    });
    let response = client.list_token_by_user(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_access_token(auth: &Auth, user_id: Uuid, auth_token: &str, expire: DateTime<Utc>, ip: &[u8])
    -> Result<(i32, String, String), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(TokenSchema {
        access_id: 0,
        user_id: user_id.as_bytes().to_vec(),
        refresh_token: String::new(),
        auth_token: auth_token.to_owned(),
        expire: expire.timestamp_micros(),
        ip: ip.to_vec()
    });
    let response = client.create_access_token(request)
        .await?
        .into_inner();
    Ok((response.access_id, response.refresh_token, response.auth_token))
}

pub(crate) async fn create_auth_token(auth: &Auth, user_id: Uuid, expire: DateTime<Utc>, ip: &[u8], number: u32)
    -> Result<Vec<(i32, String, String)>, Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(AuthTokenCreate {
        user_id: user_id.as_bytes().to_vec(),
        number,
        expire: expire.timestamp_micros(),
        ip: ip.to_vec()
    });
    let response = client.create_auth_token(request)
        .await?
        .into_inner();
    Ok(
        response.tokens.into_iter()
            .map(|t| (t.access_id, t.refresh_token, t.auth_token))
            .collect()
    )
}

pub(crate) async fn update_access_token(auth: &Auth, access_id: i32, expire: Option<DateTime<Utc>>, ip: Option<&[u8]>)
    -> Result<(String, String), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(TokenUpdate {
        access_id: Some(access_id),
        refresh_token: None,
        auth_token: None,
        expire: expire.map(|s| s.timestamp_micros()),
        ip: ip.map(|s| s.to_vec())
    });
    let response = client.update_access_token(request)
        .await?
        .into_inner();
    Ok((response.refresh_token, response.auth_token))
}

pub(crate) async fn update_auth_token(auth: &Auth, auth_token: &str, expire: Option<DateTime<Utc>>, ip: Option<&[u8]>)
    -> Result<(String, String), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(TokenUpdate {
        access_id: None,
        refresh_token: None,
        auth_token: Some(auth_token.to_owned()),
        expire: expire.map(|s| s.timestamp_micros()),
        ip: ip.map(|s| s.to_vec())
    });
    let response = client.update_auth_token(request)
        .await?
        .into_inner();
    Ok((response.refresh_token, response.auth_token))
}

pub(crate) async fn delete_access_token(auth: &Auth, access_id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(AccessId {
        access_id
    });
    client.delete_access_token(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_auth_token(auth: &Auth, auth_token: &str)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(AuthToken {
        auth_token: auth_token.to_owned()
    });
    client.delete_auth_token(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_token_by_user(auth: &Auth, user_id: Uuid)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(auth.auth_token.clone());
    let mut client = 
        TokenServiceClient::with_interceptor(auth.channel.to_owned(), interceptor);
    let request = Request::new(UserId {
        user_id: user_id.as_bytes().to_vec()
    });
    client.delete_token_by_user(request)
        .await?;
    Ok(())
}
