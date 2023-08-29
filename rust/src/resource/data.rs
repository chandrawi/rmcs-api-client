use tonic::{Request, Status};
use chrono::NaiveDateTime;
use uuid::Uuid;
use rmcs_resource_db::schema::value::{DataValue, ArrayDataValue};
use rmcs_resource_db::schema::data::DataModel;
use rmcs_resource_api::common;
use rmcs_resource_api::data::data_service_client::DataServiceClient;
use rmcs_resource_api::data::{
    DataSchema, DataId, DataTime, DataRange, DataNumber, DataModel as ApiDataModel, ModelId,
    DataIdModel, DataTimeModel, DataRangeModel, DataNumberModel, DataSchemaModel
};
use crate::resource::Resource;
use crate::utility::TokenInterceptor;

const DATA_NOT_FOUND: &str = "requested data not found";

pub(crate) async fn read_data(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: NaiveDateTime, index: Option<i32>)
    -> Result<DataSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataId {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        index: index.unwrap_or(0) as i32
    });
    let response = client.read_data(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub(crate) async fn list_data_by_time(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: NaiveDateTime)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataTime {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.list_data_by_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_last_time(resource: &Resource, device_id: Uuid, model_id: Uuid, last: NaiveDateTime)
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

pub(crate) async fn list_data_by_range_time(resource: &Resource, device_id: Uuid, model_id: Uuid, begin: NaiveDateTime, end: NaiveDateTime)
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

pub(crate) async fn list_data_by_number_before(resource: &Resource, device_id: Uuid, model_id: Uuid, before: NaiveDateTime, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataNumber {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: before.timestamp_micros(),
        number
    });
    let response = client.list_data_by_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_by_number_after(resource: &Resource, device_id: Uuid, model_id: Uuid, after: NaiveDateTime, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataNumber {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: after.timestamp_micros(),
        number
    });
    let response = client.list_data_by_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn get_data_model(resource: &Resource, model_id: Uuid)
    -> Result<ApiDataModel, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(ModelId {
        id: model_id.as_bytes().to_vec()
    });
    let response = client.get_data_model(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub(crate) async fn read_data_with_model(resource: &Resource, model: DataModel, device_id: Uuid, timestamp: NaiveDateTime, index: Option<i32>)
    -> Result<DataSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        index: index.unwrap_or(0) as i32
    });
    let response = client.read_data_with_model(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub(crate) async fn list_data_with_model_by_time(resource: &Resource, model: DataModel, device_id: Uuid, timestamp: NaiveDateTime)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataTimeModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros()
    });
    let response = client.list_data_with_model_by_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_with_model_by_last_time(resource: &Resource, model: DataModel, device_id: Uuid, last: NaiveDateTime)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataTimeModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        timestamp: last.timestamp_micros()
    });
    let response = client.list_data_with_model_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_with_model_by_range_time(resource: &Resource, model: DataModel, device_id: Uuid, begin: NaiveDateTime, end: NaiveDateTime)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataRangeModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros()
    });
    let response = client.list_data_with_model_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_with_model_by_number_before(resource: &Resource, model: DataModel, device_id: Uuid, before: NaiveDateTime, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataNumberModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        timestamp: before.timestamp_micros(),
        number
    });
    let response = client.list_data_with_model_by_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_data_with_model_by_number_after(resource: &Resource, model: DataModel, device_id: Uuid, after: NaiveDateTime, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataNumberModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        timestamp: after.timestamp_micros(),
        number
    });
    let response = client.list_data_with_model_by_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_data(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: NaiveDateTime, index: Option<i32>, data: Vec<DataValue>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSchema {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        index: index.unwrap_or(0) as i32,
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect()
    });
    client.create_data(request)
        .await?;
    Ok(())
}

pub(crate) async fn create_data_with_model(resource: &Resource, model: DataModel, device_id: Uuid, timestamp: NaiveDateTime, index: Option<i32>, data: Vec<DataValue>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataSchemaModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        index: index.unwrap_or(0) as i32,
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect()
    });
    client.create_data_with_model(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_data(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: NaiveDateTime, index: Option<i32>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataId {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        index: index.unwrap_or(0) as i32
    });
    client.delete_data(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_data_with_model(resource: &Resource, model: DataModel, device_id: Uuid, timestamp: NaiveDateTime, index: Option<i32>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DataServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(DataIdModel {
        model: Some(model.into()),
        device_id: device_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        index: index.unwrap_or(0) as i32
    });
    client.delete_data_with_model(request)
        .await?;
    Ok(())
}