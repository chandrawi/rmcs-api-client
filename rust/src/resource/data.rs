use tonic::{Request, Status};
use chrono::{DateTime, Utc, TimeZone};
use uuid::Uuid;
use rmcs_resource_db::schema::value::{DataValue, ArrayDataValue};
use rmcs_resource_api::data::data_service_client::DataServiceClient;
use rmcs_resource_api::data::{
    DataSchema, DataId, DataTime, DataRange, DataNumber, DataIds, DataIdsTime, DataIdsRange, DataIdsNumber,
    DataSetSchema, DataSetId, DataSetTime, DataSetRange, DataSetNumber
};
use crate::resource::Resource;
use rmcs_api_server::utility::interceptor::TokenInterceptor;

const DATA_NOT_FOUND: &str = "requested data not found";

pub(crate) async fn read_data(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
    -> Result<DataSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataId {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.read_data(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub(crate) async fn list_data_by_last_time(resource: &Resource, device_id: Uuid, model_id: Uuid, last: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataTime {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_range_time(resource: &Resource, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataRange {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_number_before(resource: &Resource, device_id: Uuid, model_id: Uuid, before: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataNumber {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: before.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_by_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_number_after(resource: &Resource, device_id: Uuid, model_id: Uuid, after: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataNumber {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: after.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_by_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_ids_time(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, timestamp: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsTime {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.list_data_by_ids_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_ids_last_time(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, last: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsTime {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_by_ids_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_ids_range_time(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsRange {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_by_ids_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_ids_number_before(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, before: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsNumber {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: before.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_by_ids_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_ids_number_after(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, after: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsNumber {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: after.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_by_ids_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_set_time(resource: &Resource, set_id: Uuid, timestamp: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetTime {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.list_data_by_set_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_set_last_time(resource: &Resource, set_id: Uuid, last: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetTime {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_by_set_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_set_range_time(resource: &Resource, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetRange {
        set_id: set_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_by_set_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_set_number_before(resource: &Resource, set_id: Uuid, before: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetNumber {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: before.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_by_set_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_set_number_after(resource: &Resource, set_id: Uuid, after: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetNumber {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: after.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_by_set_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn read_data_set(resource: &Resource, set_id: Uuid, timestamp: DateTime<Utc>)
    -> Result<DataSetSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetId {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.read_data_set(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub(crate) async fn list_data_set_by_last_time(resource: &Resource, set_id: Uuid, last: DateTime<Utc>)
    -> Result<Vec<DataSetSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetTime {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_set_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_set_by_range_time(resource: &Resource, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DataSetSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetRange {
        set_id: set_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_set_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_set_by_number_before(resource: &Resource, set_id: Uuid, before: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSetSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetNumber {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: before.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_set_by_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_set_by_number_after(resource: &Resource, set_id: Uuid, after: DateTime<Utc>, number: usize)
    -> Result<Vec<DataSetSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetNumber {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: after.timestamp_micros(),
        number: number as u32
    });
    let response = client.list_data_set_by_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_data(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, data: Vec<DataValue>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSchema {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| el.into()).collect()
    });
    client.create_data(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_data(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataId {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    client.delete_data(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_data_timestamp(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>)
    -> Result<DateTime<Utc>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataId {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.read_data_timestamp(request)
        .await?
        .into_inner();
    Ok(Utc.timestamp_nanos(response.timestamp * 1000))
}

pub(crate) async fn list_data_timestamp_by_last_time(resource: &Resource, device_id: Uuid, model_id: Uuid, last: DateTime<Utc>)
    -> Result<Vec<DateTime<Utc>>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataTime {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_timestamp_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.timestamps.into_iter().map(|t| Utc.timestamp_nanos(t * 1000)).collect())
}

pub(crate) async fn list_data_timestamp_by_range_time(resource: &Resource, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DateTime<Utc>>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataRange {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_timestamp_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.timestamps.into_iter().map(|t| Utc.timestamp_nanos(t * 1000)).collect())
}

pub(crate) async fn read_data_timestamp_by_ids(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, timestamp: DateTime<Utc>)
    -> Result<DateTime<Utc>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIds {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.read_data_timestamp_by_ids(request)
        .await?
        .into_inner();
    Ok(Utc.timestamp_nanos(response.timestamp * 1000))
}

pub(crate) async fn list_data_timestamp_by_ids_last_time(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, last: DateTime<Utc>)
    -> Result<Vec<DateTime<Utc>>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsTime {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_timestamp_by_ids_last_time(request)
        .await?
        .into_inner();
    Ok(response.timestamps.into_iter().map(|t| Utc.timestamp_nanos(t * 1000)).collect())
}

pub(crate) async fn list_data_timestamp_by_ids_range_time(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DateTime<Utc>>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsRange {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_timestamp_by_ids_range_time(request)
        .await?
        .into_inner();
    Ok(response.timestamps.into_iter().map(|t| Utc.timestamp_nanos(t * 1000)).collect())
}

pub(crate) async fn read_data_timestamp_by_set(resource: &Resource, set_id: Uuid, timestamp: DateTime<Utc>)
    -> Result<DateTime<Utc>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetId {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.read_data_timestamp_by_set(request)
        .await?
        .into_inner();
    Ok(Utc.timestamp_nanos(response.timestamp * 1000))
}

pub(crate) async fn list_data_timestamp_by_set_last_time(resource: &Resource, set_id: Uuid, last: DateTime<Utc>)
    -> Result<Vec<DateTime<Utc>>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetTime {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_timestamp_by_set_last_time(request)
        .await?
        .into_inner();
    Ok(response.timestamps.into_iter().map(|t| Utc.timestamp_nanos(t * 1000)).collect())
}

pub(crate) async fn list_data_timestamp_by_set_range_time(resource: &Resource, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DateTime<Utc>>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetRange {
        set_id: set_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_timestamp_by_set_range_time(request)
        .await?
        .into_inner();
    Ok(response.timestamps.into_iter().map(|t| Utc.timestamp_nanos(t * 1000)).collect())
}

pub(crate) async fn count_data(resource: &Resource, device_id: Uuid, model_id: Uuid)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataTime {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: 0
    });
    let response = client.count_data(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_last_time(resource: &Resource, device_id: Uuid, model_id: Uuid, last: DateTime<Utc>)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataTime {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.count_data_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_range_time(resource: &Resource, device_id: Uuid, model_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataRange {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.count_data_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_ids(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsTime {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: 0
    });
    let response = client.count_data_by_ids(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_ids_last_time(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, last: DateTime<Utc>)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsTime {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        timestamp: last.timestamp_micros()
    });
    let response = client.count_data_by_ids_last_time(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_ids_range_time(resource: &Resource, device_ids: Vec<Uuid>, model_ids: Vec<Uuid>, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdsRange {
        device_ids: device_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        model_ids: model_ids.into_iter().map(|id| id.as_bytes().to_vec()).collect(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.count_data_by_ids_range_time(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_set(resource: &Resource, set_id: Uuid)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetTime {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: 0
    });
    let response = client.count_data_by_set(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_set_last_time(resource: &Resource, set_id: Uuid, last: DateTime<Utc>)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetTime {
        set_id: set_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.count_data_by_set_last_time(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}

pub(crate) async fn count_data_by_set_range_time(resource: &Resource, set_id: Uuid, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<usize, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSetRange {
        set_id: set_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.count_data_by_set_range_time(request)
        .await?
        .into_inner();
    Ok(response.count as usize)
}
