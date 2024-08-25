use tonic::{Request, Status};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use rmcs_resource_db::schema::value::DataValue;
use rmcs_resource_api::log::log_service_client::LogServiceClient;
use rmcs_resource_api::log::{
    LogSchema, LogId, LogTime, LogRange, LogUpdate
};
use crate::resource::Resource;
use rmcs_api_server::utility::interceptor::TokenInterceptor;

const LOG_NOT_FOUND: &str = "requested log not found";

pub(crate) async fn read_log(resource: &Resource, timestamp: DateTime<Utc>, device_id: Uuid)
    -> Result<LogSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogId {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.as_bytes().to_vec()
    });
    let response = client.read_log(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(LOG_NOT_FOUND))?)
}

pub(crate) async fn list_log_by_time(resource: &Resource, timestamp: DateTime<Utc>, device_id: Option<Uuid>, status: Option<i16>)
    -> Result<Vec<LogSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogTime {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        status: status.map(|i| i as i32)
    });
    let response = client.list_log_by_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_log_by_last_time(resource: &Resource, last: DateTime<Utc>, device_id: Option<Uuid>, status: Option<i16>)
    -> Result<Vec<LogSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogTime {
        timestamp: last.timestamp_micros(),
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        status: status.map(|i| i as i32)
    });
    let response = client.list_log_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_log_by_range_time(resource: &Resource, begin: DateTime<Utc>, end: DateTime<Utc>, device_id: Option<Uuid>, status: Option<i16>)
    -> Result<Vec<LogSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogRange {
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros(),
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        status: status.map(|i| i as i32)
    });
    let response = client.list_log_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_log(resource: &Resource, timestamp: DateTime<Utc>, device_id: Uuid, status: i16, value: DataValue)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogSchema {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.as_bytes().to_vec(),
        status: status as i32,
        log_bytes: value.to_bytes(),
        log_type: value.get_type().into()
    });
    client.create_log(request)
        .await?;
    Ok(())
}

pub(crate) async fn update_log(resource: &Resource, timestamp: DateTime<Utc>, device_id: Uuid, status: Option<i16>, value: Option<DataValue>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogUpdate {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.as_bytes().to_vec(),
        status: status.map(|i| i as i32),
        log_bytes: value.clone().map(|s| s.to_bytes()),
        log_type: value.map(|s| s.get_type().into())
    });
    client.update_log(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_log(resource: &Resource, timestamp: DateTime<Utc>, device_id: Uuid)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogId {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.as_bytes().to_vec()
    });
    client.delete_log(request)
        .await?;
    Ok(())
}
