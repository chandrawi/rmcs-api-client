use tonic::{Request, Status};
use rmcs_auth_api::auth::auth_service_client::AuthServiceClient;
use rmcs_auth_api::auth::{
    ApiKeyRequest, ApiLoginRequest, ApiLoginResponse,
    UserKeyRequest, UserLoginRequest, UserLoginResponse,
    UserRefreshRequest, UserRefreshResponse,
    UserLogoutRequest, UserLogoutResponse
};
use crate::auth::Auth;
use crate::utility::{import_public_key, encrypt_message, decrypt_message, generate_keys, export_public_key};

const KEY_IMPORT_ERR: &str = "key import error";
const KEY_GEN_ERR: &str = "generate key error";
const DECRYPT_ERR: &str = "decrypt key error";
const ENCRYPT_ERR: &str = "encrypt password error";

pub(crate) async fn api_login(auth: &Auth, api_id: i32, password: &str)
    -> Result<ApiLoginResponse, Status>
{
    let mut client = AuthServiceClient::new(auth.channel.to_owned());
    let request = Request::new(ApiKeyRequest {
        api_id
    });
    // get transport public key of requested API and encrypt the password
    let response = client.api_login_key(request).await?.into_inner();
    let pub_key = import_public_key(response.public_key.as_slice())
        .map_err(|_| Status::internal(KEY_IMPORT_ERR))?;
    let passhash = encrypt_message(password.as_bytes(), pub_key)
        .map_err(|_| Status::internal(ENCRYPT_ERR))?;
    // request API key and procedures access from server
    let (priv_key, pub_key) = generate_keys()
        .map_err(|_| Status::internal(KEY_GEN_ERR))?;
    let pub_der = export_public_key(pub_key)
        .map_err(|_| Status::internal(KEY_GEN_ERR))?;
    let request = Request::new(ApiLoginRequest {
        api_id,
        password: passhash,
        public_key: pub_der
    });
    let mut response = client.api_login(request).await?.into_inner();
    response.access_key = decrypt_message(&response.access_key, priv_key)
        .map_err(|_| Status::internal(DECRYPT_ERR))?;
    Ok(response)
}

pub(crate) async fn user_login(auth: &Auth, username: &str, password: &str)
    -> Result<UserLoginResponse, Status>
{
    let mut client = AuthServiceClient::new(auth.channel.to_owned());
    let request = Request::new(UserKeyRequest {
        username: username.to_owned()
    });
    // get transport public key of requested user and encrypt the password
    let response = client.user_login_key(request).await?.into_inner();
    let pub_key = import_public_key(response.public_key.as_slice())
        .map_err(|_| Status::internal(KEY_IMPORT_ERR))?;
    let passhash = encrypt_message(password.as_bytes(), pub_key)
        .map_err(|_| Status::internal(ENCRYPT_ERR))?;
    // request access and refresh tokens
    let request = Request::new(UserLoginRequest {
        username: username.to_owned(),
        password: passhash
    });
    let response = client.user_login(request).await?.into_inner();
    Ok(response)
}

pub(crate) async fn user_refresh(auth: &Auth, api_id: i32, access_token: &str, refresh_token: &str)
    -> Result<UserRefreshResponse, Status>
{
    let mut client = AuthServiceClient::new(auth.channel.to_owned());
    let request = Request::new(UserRefreshRequest {
        api_id,
        access_token: access_token.to_owned(),
        refresh_token: refresh_token.to_owned(),
    });
    let response = client.user_refresh(request).await?.into_inner();
    Ok(response)
}

pub(crate) async fn user_logout(auth: &Auth, user_id: i32, auth_token: &str)
    -> Result<UserLogoutResponse, Status>
{
    let mut client = AuthServiceClient::new(auth.channel.to_owned());
    let request = Request::new(UserLogoutRequest {
        user_id,
        auth_token: auth_token.to_owned()
    });
    let response = client.user_logout(request).await?.into_inner();
    Ok(response)
}
