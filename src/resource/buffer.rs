use tonic::{Request, Status, transport::Channel};
use chrono::{DateTime, Utc};
use rmcs_resource_db::schema::value::{DataValue, ArrayDataValue};
use rmcs_resource_api::common;
use rmcs_resource_api::buffer::buffer_service_client::BufferServiceClient;
use rmcs_resource_api::buffer::{
    BufferSchema, BufferId, BufferSelector, BuffersSelector, BufferUpdate, BufferStatus
};

const BUFFER_NOT_FOUND: &str = "requested buffer not found";

pub(crate) async fn read_buffer(channel: &Channel, id: u32)
    -> Result<BufferSchema, Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BufferId {
        id
    });
    let response = client.read_buffer(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn read_buffer_first(channel: &Channel, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
    -> Result<BufferSchema, Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BufferSelector {
        device_id,
        model_id,
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        }
    });
    let response = client.read_buffer_first(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn read_buffer_last(channel: &Channel, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
    -> Result<BufferSchema, Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BufferSelector {
        device_id,
        model_id,
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        }
    });
    let response = client.read_buffer_last(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn list_buffer_first(channel: &Channel, number: u32, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
    -> Result<Vec<BufferSchema>, Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BuffersSelector {
        device_id,
        model_id,
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        },
        number
    });
    let response = client.list_buffer_first(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_buffer_last(channel: &Channel, number: u32, device_id: Option<u64>, model_id: Option<u32>, status: Option<&str>)
    -> Result<Vec<BufferSchema>, Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BuffersSelector {
        device_id,
        model_id,
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        },
        number
    });
    let response = client.list_buffer_last(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_buffer(channel: &Channel, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>, data: Vec<DataValue>, status: &str)
    -> Result<u32, Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BufferSchema {
        id: 0,
        device_id,
        model_id,
        timestamp: timestamp.timestamp_nanos(),
        index: index.unwrap_or(0) as u32,
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect(),
        status: BufferStatus::from_str_name(status).unwrap_or_default().into()
    });
    let response = client.create_buffer(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_buffer(channel: &Channel, id: u32, data: Option<Vec<DataValue>>, status: Option<&str>)
    -> Result<(), Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BufferUpdate {
        id,
        data_bytes: data.as_deref().map(|v| ArrayDataValue::from_vec(v).to_bytes()),
        data_type: ArrayDataValue::from_vec(&data.unwrap_or_default()).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect(),
        status: status.map(|s| BufferStatus::from_str_name(s).unwrap_or_default().into())
    });
    client.update_buffer(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_buffer(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = BufferServiceClient::new(channel.to_owned());
    let request = Request::new(BufferId {
        id
    });
    client.delete_buffer(request)
        .await?;
    Ok(())
}
