use tonic::{Request, Status, transport::Channel};
use rmcs_resource_db::schema::value::{DataIndexing, DataType, ConfigValue};
use rmcs_resource_api::common;
use rmcs_resource_api::model::model_service_client::ModelServiceClient;
use rmcs_resource_api::model::{
    ModelSchema, ModelId, ModelName, ModelCategory, ModelNameCategory, ModelUpdate, ModelTypes,
    ConfigSchema, ConfigId, ConfigUpdate
};

const MODEL_NOT_FOUND: &str = "requested model not found";
const CONF_NOT_FOUND: &str = "requested config not found";

pub(crate) async fn read_model(channel: &Channel, id: u32)
    -> Result<ModelSchema, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelId {
        id
    });
    let response = client.read_model(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(MODEL_NOT_FOUND))?)
}

pub(crate) async fn list_model_by_name(channel: &Channel, name: &str)
    -> Result<Vec<ModelSchema>, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelName {
        name: name.to_owned()
    });
    let response = client.list_model_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_model_by_category(channel: &Channel, category: &str)
    -> Result<Vec<ModelSchema>, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelCategory {
        category: category.to_owned()
    });
    let response = client.list_model_by_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_model_by_name_category(channel: &Channel, name: &str, category: &str)
    -> Result<Vec<ModelSchema>, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelNameCategory {
        name: name.to_owned(),
        category: category.to_owned()
    });
    let response = client.list_model_by_name_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_model(channel: &Channel, indexing: DataIndexing, category: &str, name: &str, description: Option<&str>)
    -> Result<u32, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelSchema {
        id: 0,
        indexing: Into::<common::DataIndexing>::into(indexing).into(),
        category: category.to_owned(),
        name: name.to_owned(),
        description: description.unwrap_or("").to_owned(),
        types: Vec::new(),
        configs: Vec::new()
    });
    let response = client.create_model(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_model(channel: &Channel, id: u32, indexing: Option<DataIndexing>, category: Option<&str>, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelUpdate {
        id,
        indexing: indexing.map(|s| Into::<common::DataIndexing>::into(s).into()),
        category: category.map(|s| s.to_owned()),
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_model(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_model(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelId {
        id
    });
    client.delete_model(request)
        .await?;
    Ok(())
}

pub(crate) async fn add_model_type(channel: &Channel, id: u32, types: &[DataType])
    -> Result<(), Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelTypes {
        id,
        types: types.into_iter()
            .map(|s| Into::<common::DataType>::into(s.clone()).into())
            .collect()
    });
    client.add_model_type(request)
        .await?;
    Ok(())
}

pub(crate) async fn remove_model_type(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelId {
        id
    });
    client.remove_model_type(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_model_config(channel: &Channel, id: u32)
    -> Result<ConfigSchema, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigId {
        id
    });
    let response = client.read_model_config(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(CONF_NOT_FOUND))?)
}

pub(crate) async fn list_model_config_by_model(channel: &Channel, model_id: u32)
    -> Result<Vec<ConfigSchema>, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ModelId {
        id: model_id
    });
    let response = client.list_model_config(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_model_config(channel: &Channel, model_id: u32, index: u32, name: &str, value: ConfigValue, category: &str)
    -> Result<u32, Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigSchema {
        id: 0,
        model_id,
        index,
        name: name.to_owned(),
        config_bytes: value.to_bytes(),
        config_type: Into::<common::ConfigType>::into(value.get_type()).into(),
        category: category.to_owned(),
    });
    let response = client.create_model_config(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_model_config(channel: &Channel, id: u32, name: Option<&str>, value: Option<ConfigValue>, category: Option<&str>)
    -> Result<(), Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        config_bytes: value.clone().map(|s| s.to_bytes()),
        config_type: value.map(|s| Into::<common::ConfigType>::into(s.get_type()).into()),
        category: category.map(|s| s.to_owned())
    });
    client.update_model_config(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_model_config(channel: &Channel, id: u32)
    -> Result<(), Status>
{
    let mut client = ModelServiceClient::new(channel.to_owned());
    let request = Request::new(ConfigId {
        id
    });
    client.read_model_config(request)
        .await?;
    Ok(())
}
