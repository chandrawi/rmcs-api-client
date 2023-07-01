use tonic::{Request, Status, transport::Channel};
use chrono::{DateTime, Utc};
use rmcs_resource_db::schema::value::{DataValue, ArrayDataValue};
use rmcs_resource_db::schema::data::DataModel;
use rmcs_resource_api::common;
use rmcs_resource_api::data::data_service_client::DataServiceClient;
use rmcs_resource_api::data::{
    DataSchema, DataId, DataTime, DataRange, DataNumber, DataModel as ApiDataModel, ModelId,
    DataIdModel, DataTimeModel, DataRangeModel, DataNumberModel, DataSchemaModel
};

const DATA_NOT_FOUND: &str = "requested data not found";

pub async fn read_data(channel: &Channel, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>)
    -> Result<DataSchema, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataId {
        device_id,
        model_id,
        timestamp: timestamp.timestamp_nanos(),
        index: index.unwrap_or(0) as u32
    });
    let response = client.read_data(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub async fn list_data_by_time(channel: &Channel, device_id: u64, model_id: u32, timestamp: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataTime {
        device_id,
        model_id,
        timestamp: timestamp.timestamp_nanos()
    });
    let response = client.list_data_by_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_by_last_time(channel: &Channel, device_id: u64, model_id: u32, last: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataTime {
        device_id,
        model_id,
        timestamp: last.timestamp_nanos()
    });
    let response = client.list_data_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_by_range_time(channel: &Channel, device_id: u64, model_id: u32, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataRange {
        device_id,
        model_id,
        begin: begin.timestamp_nanos(),
        end: end.timestamp_nanos()
    });
    let response = client.list_data_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_by_number_before(channel: &Channel, device_id: u64, model_id: u32, before: DateTime<Utc>, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataNumber {
        device_id,
        model_id,
        timestamp: before.timestamp_nanos(),
        number
    });
    let response = client.list_data_by_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_by_number_after(channel: &Channel, device_id: u64, model_id: u32, after: DateTime<Utc>, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataNumber {
        device_id,
        model_id,
        timestamp: after.timestamp_nanos(),
        number
    });
    let response = client.list_data_by_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn get_data_model(channel: &Channel, model_id: u32)
    -> Result<ApiDataModel, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(ModelId {
        id: model_id
    });
    let response = client.get_data_model(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub async fn read_data_with_model(channel: &Channel, model: DataModel, device_id: u64, timestamp: DateTime<Utc>, index: Option<u16>)
    -> Result<DataSchema, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataIdModel {
        model: Some(model.into()),
        device_id,
        timestamp: timestamp.timestamp_nanos(),
        index: index.unwrap_or(0) as u32
    });
    let response = client.read_data_with_model(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(DATA_NOT_FOUND))?)
}

pub async fn list_data_with_model_by_time(channel: &Channel, model: DataModel, device_id: u64, timestamp: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataTimeModel {
        model: Some(model.into()),
        device_id,
        timestamp: timestamp.timestamp_nanos()
    });
    let response = client.list_data_with_model_by_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_with_model_by_last_time(channel: &Channel, model: DataModel, device_id: u64, last: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataTimeModel {
        model: Some(model.into()),
        device_id,
        timestamp: last.timestamp_nanos()
    });
    let response = client.list_data_with_model_by_last_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_with_model_by_range_time(channel: &Channel, model: DataModel, device_id: u64, begin: DateTime<Utc>, end: DateTime<Utc>)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataRangeModel {
        model: Some(model.into()),
        device_id,
        begin: begin.timestamp_nanos(),
        end: end.timestamp_nanos()
    });
    let response = client.list_data_with_model_by_range_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_with_model_by_number_before(channel: &Channel, model: DataModel, device_id: u64, before: DateTime<Utc>, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataNumberModel {
        model: Some(model.into()),
        device_id,
        timestamp: before.timestamp_nanos(),
        number
    });
    let response = client.list_data_with_model_by_number_before(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn list_data_with_model_by_number_after(channel: &Channel, model: DataModel, device_id: u64, after: DateTime<Utc>, number: u32)
    -> Result<Vec<DataSchema>, Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataNumberModel {
        model: Some(model.into()),
        device_id,
        timestamp: after.timestamp_nanos(),
        number
    });
    let response = client.list_data_with_model_by_number_after(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub async fn create_data(channel: &Channel, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>, data: Vec<DataValue>)
    -> Result<(), Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataSchema {
        device_id,
        model_id,
        timestamp: timestamp.timestamp_nanos(),
        index: index.unwrap_or(0) as u32,
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect()
    });
    client.create_data(request)
        .await?;
    Ok(())
}

pub async fn create_data_with_model(channel: &Channel, model: DataModel, device_id: u64, timestamp: DateTime<Utc>, index: Option<u16>, data: Vec<DataValue>)
    -> Result<(), Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataSchemaModel {
        model: Some(model.into()),
        device_id,
        timestamp: timestamp.timestamp_nanos(),
        index: index.unwrap_or(0) as u32,
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect()
    });
    client.create_data_with_model(request)
        .await?;
    Ok(())
}

pub async fn delete_data(channel: &Channel, device_id: u64, model_id: u32, timestamp: DateTime<Utc>, index: Option<u16>)
    -> Result<(), Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataId {
        device_id,
        model_id,
        timestamp: timestamp.timestamp_nanos(),
        index: index.unwrap_or(0) as u32
    });
    client.delete_data(request)
        .await?;
    Ok(())
}

pub async fn delete_data_with_model(channel: &Channel, model: DataModel, device_id: u64, timestamp: DateTime<Utc>, index: Option<u16>)
    -> Result<(), Status>
{
    let mut client = DataServiceClient::new(channel.to_owned());
    let request = Request::new(DataIdModel {
        model: Some(model.into()),
        device_id,
        timestamp: timestamp.timestamp_nanos(),
        index: index.unwrap_or(0) as u32
    });
    client.delete_data_with_model(request)
        .await?;
    Ok(())
}
