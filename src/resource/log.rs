use tonic::{Request, Status, transport::Channel};
use chrono::{DateTime, Utc};
use rmcs_resource_db::schema::value::ConfigValue;
use rmcs_resource_api::common;
use rmcs_resource_api::log::log_service_client::LogServiceClient;
use rmcs_resource_api::log::{
    LogSchema, LogId, LogTime, LogRange, LogUpdate, LogStatus
};

const LOG_NOT_FOUND: &str = "requested log not found";

pub async fn read_log(channel: &Channel, timestamp: DateTime<Utc>, device_id: u64)
    -> Result<LogSchema, Status>
{
    let mut client = LogServiceClient::new(channel.to_owned());
    let request = Request::new(LogId {
        timestamp: timestamp.timestamp_nanos(),
        device_id
    });
    let response = client.read_log(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(LOG_NOT_FOUND))?)
}

pub async fn list_log_by_time(channel: &Channel, timestamp: DateTime<Utc>, device_id: Option<u64>, status: Option<&str>)
    -> Result<Vec<LogSchema>, Status>
{
    let mut client = LogServiceClient::new(channel.to_owned());
    let request = Request::new(LogTime {
        timestamp: timestamp.timestamp_nanos(),
        device_id,
        status: match status {
            Some(value) => match LogStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        }
    });
    let response = client.list_log_by_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_log_by_last_time(channel: &Channel, last: DateTime<Utc>, device_id: Option<u64>, status: Option<&str>)
    -> Result<Vec<LogSchema>, Status>
{
    let mut client = LogServiceClient::new(channel.to_owned());
    let request = Request::new(LogTime {
        timestamp: last.timestamp_nanos(),
        device_id,
        status: match status {
            Some(value) => match LogStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        }
    });
    let response = client.list_log_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_log_by_range_time(channel: &Channel, begin: DateTime<Utc>, end: DateTime<Utc>, device_id: Option<u64>, status: Option<&str>)
    -> Result<Vec<LogSchema>, Status>
{
    let mut client = LogServiceClient::new(channel.to_owned());
    let request = Request::new(LogRange {
        begin: begin.timestamp_nanos(),
        end: end.timestamp_nanos(),
        device_id,
        status: match status {
            Some(value) => match LogStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        }
    });
    let response = client.list_log_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn create_log(channel: &Channel, timestamp: DateTime<Utc>, device_id: u64, status: &str, value: ConfigValue)
    -> Result<(), Status>
{
    let mut client = LogServiceClient::new(channel.to_owned());
    let request = Request::new(LogSchema {
        timestamp: timestamp.timestamp_nanos(),
        device_id,
        status: LogStatus::from_str_name(status).unwrap_or_default().into(),
        log_bytes: value.to_bytes(),
        log_type: Into::<common::ConfigType>::into(value.get_type()).into()
    });
    client.create_log(request)
        .await?;
    Ok(())
}

pub async fn update_log(channel: &Channel, timestamp: DateTime<Utc>, device_id: u64, status: Option<&str>, value: Option<ConfigValue>)
    -> Result<(), Status>
{
    let mut client = LogServiceClient::new(channel.to_owned());
    let request = Request::new(LogUpdate {
        timestamp: timestamp.timestamp_nanos(),
        device_id,
        status: match status {
            Some(value) => match LogStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        },
        log_bytes: value.clone().map(|s| s.to_bytes()),
        log_type: value.map(|s| Into::<common::ConfigType>::into(s.get_type()).into())
    });
    client.update_log(request)
        .await?;
    Ok(())
}

pub async fn delete_log(channel: &Channel, timestamp: DateTime<Utc>, device_id: u64)
    -> Result<(), Status>
{
    let mut client = LogServiceClient::new(channel.to_owned());
    let request = Request::new(LogId {
        timestamp: timestamp.timestamp_nanos(),
        device_id
    });
    client.delete_log(request)
        .await?;
    Ok(())
}
