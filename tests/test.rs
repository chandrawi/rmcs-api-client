#[cfg(test)]
mod tests {

    use std::str::FromStr;
    use std::process::{Command, Stdio};
    use std::time::{SystemTime, Duration};
    use chrono::{DateTime, Utc};
    use argon2::{Argon2, PasswordHash, PasswordVerifier};
    use rmcs_resource_db::{ModelConfigSchema, DeviceConfigSchema};
    use rmcs_resource_db::{ConfigValue::{*, self}, DataIndexing::*, DataType::*, DataValue::*};
    use rmcs_api_client::{Auth, Resource};

    fn start_server(server_kind: &str, port: &str)
    {
        // start server using cargo run command
        Command::new("cargo")
            .args(["run", "-p", "rmcs-api-server", "--bin", server_kind])
            .spawn()
            .expect("running auth server failed");

        // wait until server process is running
        let mut count = 0;
        let time_limit = SystemTime::now() + Duration::from_secs(30);
        while SystemTime::now() < time_limit && count == 0 {
            let ss_child = Command::new("ss")
                .arg("-tulpn")
                .stdout(Stdio::piped())
                .spawn()
                .unwrap();
            let grep_child = Command::new("grep")
                .args([port, "-c"])
                .stdin(Stdio::from(ss_child.stdout.unwrap()))
                .stdout(Stdio::piped())
                .spawn()
                .unwrap();
            let output = grep_child.wait_with_output().unwrap();
            count = String::from_utf8(output.stdout)
                .unwrap()
                .replace("\n", "")
                .parse()
                .unwrap_or(0);
            std::thread::sleep(Duration::from_millis(10));
        }
    }

    fn stop_server(server_kind: &str)
    {
        // stop server service
        Command::new("killall")
            .args([server_kind])
            .spawn()
            .expect("stopping auth server failed");
    }

    #[tokio::test]
    async fn test_auth()
    {
        // std::env::set_var("RUST_BACKTRACE", "1");

        // get address from env file
        dotenvy::dotenv().ok();
        let addr = std::env::var("ADDRESS_AUTH").unwrap();
        let port = String::from(":") + addr.split(":").into_iter().last().unwrap();
        let addr = String::from("http://") + &addr;

        start_server("test_auth_server", &port);

        let auth = Auth::new(&addr).await;

        // create new resource API
        let password_api = "Ap1_P4s5w0rd";
        let api_id1 = auth.create_api("Resource1", "localhost:9001", "RESOURCE", "", password_api).await.unwrap();
        let api_id2 = auth.create_api("Resource_2", "localhost:9002", "RESOURCE", "",  password_api).await.unwrap();

        // get newly created resource at the first of resource API list
        let apis = auth.list_api_by_category("RESOURCE").await.unwrap();
        let first_api = apis.into_iter().next().unwrap();
        let api = auth.read_api(api_id1).await.unwrap();

        // create new procedure for newly created resource API
        let proc_id1 = auth.create_procedure(api_id1, "ReadResourceData", "").await.unwrap();
        let proc_id2 = auth.create_procedure(api_id1, "CreateData", "").await.unwrap();
        let proc_id3 = auth.create_procedure(api_id1, "DeleteData", "").await.unwrap();
        let proc_id4 = auth.create_procedure(api_id2, "ReadConfig", "").await.unwrap();

        // get newly created procedure at the first of procedure list
        let procedures = auth.list_procedure_by_api(api_id1).await.unwrap();
        let procedure = procedures.into_iter().next().unwrap();

        assert_eq!(first_api.id, api_id1);
        assert_eq!(api.name, "Resource1");
        assert_eq!(api.address, "localhost:9001");
        assert_eq!(procedure.api_id, api.id);
        assert_eq!(procedure.name, "ReadResourceData");

        let pub_key = api.public_key;
        assert!(pub_key.len() > 64);
        let hash = api.password;
        let parsed_hash = PasswordHash::new(hash.as_str()).unwrap();
        assert!(Argon2::default().verify_password(password_api.as_bytes(), &parsed_hash).is_ok());

        // create new role and add access to the procedure
        let role_id1 = auth.create_role(api_id1, "administrator", false, false, 900, 28800).await.unwrap();
        auth.add_role_access(role_id1, proc_id1).await.unwrap();
        auth.add_role_access(role_id1, proc_id2).await.unwrap();
        auth.add_role_access(role_id1, proc_id3).await.unwrap();
        let role_id2 = auth.create_role(api_id1, "user", true, false, 900, 604800).await.unwrap();
        auth.add_role_access(role_id2, proc_id1).await.unwrap();
        let role_id3 = auth.create_role(api_id2, "user", true, false, 900, 604800).await.unwrap();
        auth.add_role_access(role_id3, proc_id4).await.unwrap();

        // get role data
        let roles = auth.list_role_by_api(api_id1).await.unwrap();
        let first_role = roles.into_iter().next().unwrap();
        let role = auth.read_role(role_id1).await.unwrap();

        assert_eq!(first_role.id, role_id1);
        assert_eq!(role.name, "administrator");
        assert_eq!(role.multi, false);
        assert_eq!(role.ip_lock, false);
        assert_eq!(role.procedures, [proc_id1, proc_id2, proc_id3]);

        let access_key = role.access_key;
        assert_eq!(access_key.len(), 32);

        // update a resource API and its procedure and role
        let api_name = "Resource_1";
        let proc_name = "ReadData";
        let role_name = "admin";
        auth.update_api(api_id1, Some(api_name), None, None, Some("New resource api"), None, Some(())).await.unwrap();
        auth.update_procedure(proc_id1, Some(proc_name), Some("Read resource data")).await.unwrap();
        auth.update_role(role_id1, Some(role_name), None, Some(true), None, None).await.unwrap();

        // get updated resource API schema
        let api = auth.read_api_by_name(api_name).await.unwrap();
        let procedure = auth.read_procedure_by_name(api_id1, proc_name).await.unwrap();
        let role = auth.read_role_by_name(api_id1, role_name).await.unwrap();
        let api_procedure = api.procedures.into_iter().next().unwrap();

        assert_eq!(api.name, api_name);
        assert_eq!(api.description, "New resource api");
        assert_eq!(procedure.name, proc_name);
        assert_eq!(procedure.description, "Read resource data");
        assert_eq!(procedure.id, api_procedure.id);
        assert_eq!(role.name, role_name);
        assert_eq!(role.ip_lock, true);

        assert_ne!(api.public_key, pub_key);
        assert_ne!(role.access_key, access_key);

        // create new user and add associated roles
        let password_admin = "Adm1n_P4s5w0rd";
        let password_user = "Us3r_P4s5w0rd";
        let user_id1 = auth.create_user("administrator", "admin@mail.co", "+6281234567890", password_admin).await.unwrap();
        auth.add_user_role(user_id1, role_id1).await.unwrap();
        auth.add_user_role(user_id1, role_id3).await.unwrap();
        let user_id2 = auth.create_user("username", "user@mail.co", "+6281234567890", password_user).await.unwrap();
        auth.add_user_role(user_id2, role_id2).await.unwrap();
        auth.add_user_role(user_id2, role_id3).await.unwrap();

        // get user data
        let users = auth.list_user_by_role(role_id3).await.unwrap();
        let first_user = users.into_iter().next().unwrap();
        let user = auth.read_user(user_id1).await.unwrap();

        assert_eq!(first_user.id, user_id1);
        assert_eq!(user.name, "administrator");
        assert_eq!(user.email, "admin@mail.co");
        assert_eq!(user.phone, "+6281234567890");

        let pub_key = user.public_key;
        assert!(pub_key.len() > 64);
        let hash = user.password;
        let parsed_hash = PasswordHash::new(hash.as_str()).unwrap();
        assert!(Argon2::default().verify_password(password_admin.as_bytes(), &parsed_hash).is_ok());

        // update user
        let password_new = "N3w_P4s5w0rd";
        auth.update_user(user_id2, None, None, None, Some(password_new), Some(())).await.unwrap();

        // get updated user
        let user = auth.read_user_by_name("username").await.unwrap();

        assert_ne!(user.password, hash);
        assert_ne!(user.public_key, pub_key);

        // create new access token and refresh token
        let expire1 = DateTime::from_str("2023-01-01T00:00:00Z").unwrap();
        let expire2 = DateTime::from_str("2023-01-01T12:00:00Z").unwrap();
        let (access_id1, _, auth_token1) = auth.create_access_token(user_id1, " ", expire1, &[192, 168, 0, 1]).await.unwrap();
        let access_id2 = access_id1 + 1;
        auth.create_auth_token(user_id1, expire2, &[192, 168, 0, 1], 1).await.unwrap();
        auth.create_access_token(user_id1, " ", expire1, &[]).await.unwrap();

        // get token data
        let access_token = auth.read_access_token(access_id2).await.unwrap();
        let auth_token = auth.list_auth_token(&auth_token1).await.unwrap()
            .into_iter().next().unwrap();
        let user_tokens = auth.list_token_by_user(user_id1).await.unwrap();

        assert_eq!(auth_token.user_id, user_id1);
        assert_eq!(auth_token.expire, expire1);
        assert_eq!(auth_token.ip, [192, 168, 0, 1]);
        assert_eq!(access_token.expire, expire2);
        assert_eq!(user_tokens.len(), 3);

        // update token
        let expire3 = DateTime::from_str("2023-01-01T18:00:00Z").unwrap();
        auth.update_access_token(access_id2, Some(expire3), None).await.unwrap();
        auth.update_auth_token(&auth_token1, Some(expire3), Some(&[192, 168, 0, 100])).await.unwrap();

        // get updated token
        let new_access_token = auth.read_access_token(access_id2).await.unwrap();
        let new_auth_token = auth.list_auth_token(&auth_token1).await.unwrap()
            .into_iter().next().unwrap();

        assert_ne!(new_access_token.refresh_token, access_token.refresh_token);
        assert_eq!(new_access_token.expire, expire3);
        assert_eq!(new_auth_token.expire, expire3);
        assert_eq!(new_auth_token.ip, [192, 168, 0, 100]);

        // try to delete resource API, procedure role and user without removing dependent item
        let try_role = auth.delete_role(role_id3).await;
        let try_proc = auth.delete_procedure(proc_id4).await;
        let try_api = auth.delete_api(api_id2).await;
        let try_user = auth.delete_user(user_id2).await;

        assert!(try_proc.is_err());
        assert!(try_role.is_err());
        assert!(try_api.is_err());
        assert!(try_user.is_err());

        // delete user and token
        auth.remove_user_role(user_id2, role_id2).await.unwrap();
        auth.remove_user_role(user_id2, role_id3).await.unwrap();
        auth.delete_user(user_id2).await.unwrap();
        auth.delete_token_by_user(user_id1).await.unwrap();

        // check if token and user already deleted
        let result_token = auth.read_access_token(access_id1).await;
        let result_user = auth.read_user(user_id2).await;

        assert!(result_token.is_err());
        assert!(result_user.is_err());

        // delete resource API, procedure, and role
        auth.remove_user_role(user_id1, role_id3).await.unwrap();
        auth.remove_role_access(role_id3, proc_id4).await.unwrap();
        auth.delete_role(role_id3).await.unwrap();
        auth.delete_procedure(proc_id4).await.unwrap();
        auth.delete_api(api_id2).await.unwrap();

        // check if resource API, procedure, and role already deleted
        let result_role = auth.read_role(role_id3).await;
        let result_proc = auth.read_procedure(proc_id4).await;
        let result_api = auth.read_api(api_id2).await;

        assert!(result_proc.is_err());
        assert!(result_role.is_err());
        assert!(result_api.is_err());

        stop_server("test_auth_server");
    }

    #[tokio::test]
    async fn test_resource()
    {
        // std::env::set_var("RUST_BACKTRACE", "full");

        // get address from env file
        dotenvy::dotenv().ok();
        let addr = std::env::var("ADDRESS_RESOURCE").unwrap();
        let port = String::from(":") + addr.split(":").into_iter().last().unwrap();
        let addr = String::from("http://") + &addr;

        start_server("test_resource_server", &port);

        let resource = Resource::new(&addr).await;

        // create new data model and add data types
        let model_id = resource.create_model(Timestamp, "UPLINK", "speed and direction", None).await.unwrap();
        let model_buf_id = resource.create_model(Timestamp, "UPLINK", "buffer 4", None).await.unwrap();
        resource.add_model_type(model_id, &[F32T,F32T]).await.unwrap();
        resource.add_model_type(model_buf_id, &[U8T,U8T,U8T,U8T]).await.unwrap();
        // create scale, symbol, and threshold configurations for new created model
        resource.create_model_config(model_id, 0, "scale_0", Str("speed".to_owned()), "SCALE").await.unwrap();
        resource.create_model_config(model_id, 1, "scale_1", Str("direction".to_owned()), "SCALE").await.unwrap();
        resource.create_model_config(model_id, 0, "unit_0", Str("meter/second".to_owned()), "UNIT").await.unwrap();
        resource.create_model_config(model_id, 1, "unit_1", Str("degree".to_owned()), "UNIT").await.unwrap();
        let model_cfg_id = resource.create_model_config(model_id, 0, "upper_threshold", Int(250), "THRESHOLD").await.unwrap();

        // Create new type and link it to newly created model
        let type_id = resource.create_type("Speedometer Compass", None).await.unwrap();
        resource.add_type_model(type_id, model_id).await.unwrap();
        resource.add_type_model(type_id, model_buf_id).await.unwrap();

        // create new devices with newly created type as its type 
        let gateway_id = 0x87AD915C32B89D09;
        let device_id1 = 0xA07C2589F301DB46;
        let device_id2 = 0x2C8B82061E8F10A2;
        resource.create_device(device_id1, gateway_id, type_id, "TEST01", "Speedometer Compass 1", None).await.unwrap();
        resource.create_device(device_id2, gateway_id, type_id, "TEST02", "Speedometer Compass 2", None).await.unwrap();
        // create device configurations
        resource.create_device_config(device_id1, "coef_0", Int(-21), "CONVERSION").await.unwrap();
        resource.create_device_config(device_id1, "coef_1", Float(0.1934), "CONVERSION").await.unwrap();
        resource.create_device_config(device_id1, "period", Int(60), "NETWORK").await.unwrap();
        resource.create_device_config(device_id2, "coef_0", Int(44), "CONVERSION").await.unwrap();
        resource.create_device_config(device_id2, "coef_1", Float(0.2192), "CONVERSION").await.unwrap();
        let device_cfg_id = resource.create_device_config(device_id2, "period", Int(120), "NETWORK").await.unwrap();

        // create new group and register newly created models as its member
        let group_model_id = resource.create_group_model("data", "APPLICATION", None).await.unwrap();
        resource.add_group_model_member(group_model_id, model_id).await.unwrap();
        // create new group and register newly created devices as its member
        let group_device_id = resource.create_group_device("sensor", "APPLICATION", None).await.unwrap();
        resource.add_group_device_member(group_device_id, device_id1).await.unwrap();
        resource.add_group_device_member(group_device_id, device_id2).await.unwrap();

        // read model
        let model = resource.read_model(model_id).await.unwrap();
        let models = resource.list_model_by_name("speed").await.unwrap();
        let last_model = models.into_iter().last().unwrap();
        assert_eq!(model, last_model);
        assert_eq!(model.name, "speed and direction");
        assert_eq!(model.indexing, Timestamp);
        assert_eq!(model.category, "UPLINK");
        assert_eq!(model.types, [F32T,F32T]);
        // read model configurations
        let model_configs = resource.list_model_config_by_model(model_id).await.unwrap();
        let mut config_vec: Vec<ModelConfigSchema> = Vec::new();
        for cfg_vec in model.configs {
            for cfg in cfg_vec {
                config_vec.push(cfg);
            }
        }
        assert_eq!(model_configs, config_vec);

        // read device
        let device1 = resource.read_device(device_id1).await.unwrap();
        let devices = resource.list_device_by_gateway(gateway_id).await.unwrap();
        let last_device = devices.into_iter().last().unwrap();
        assert_eq!(device1, last_device); // device_id1 > device_id2, so device1 in second (last) order
        assert_eq!(device1.serial_number, "TEST01");
        assert_eq!(device1.name, "Speedometer Compass 1");
        // read type
        let types = resource.list_type_by_name("Speedometer").await.unwrap();
        assert_eq!(device1.type_, types.into_iter().next().unwrap());
        // read device configurations
        let device_configs = resource.list_device_config_by_device(device_id1).await.unwrap();
        assert_eq!(device1.configs, device_configs);

        // read group model
        let groups = resource.list_group_model_by_category("APPLICATION").await.unwrap();
        let group = groups.into_iter().next().unwrap();
        assert_eq!(group.models, [model_id]);
        assert_eq!(group.name, "data");
        assert_eq!(group.category, "APPLICATION");
        // read group device
        let groups = resource.list_group_device_by_name("sensor").await.unwrap();
        let group = groups.into_iter().next().unwrap();
        assert_eq!(group.devices, [device_id2, device_id1]);
        assert_eq!(group.name, "sensor");
        assert_eq!(group.category, "APPLICATION");

        // update model
        resource.update_model(model_buf_id, None, None, Some("buffer 2 integer"), Some("Model for store 2 i32 temporary data")).await.unwrap();
        resource.remove_model_type(model_buf_id).await.unwrap();
        resource.add_model_type(model_buf_id, &[I32T,I32T]).await.unwrap();
        let model = resource.read_model(model_buf_id).await.unwrap();
        assert_eq!(model.name, "buffer 2 integer");
        assert_eq!(model.types, [I32T,I32T]);
        // update model configurations
        resource.update_model_config(model_cfg_id, None, Some(Int(238)), None).await.unwrap();
        let config = resource.read_model_config(model_cfg_id).await.unwrap();
        assert_eq!(config.value, Int(238));

        // update type
        resource.update_type(type_id, None, Some("Speedometer and compass sensor")).await.unwrap();
        let type_ = resource.read_type(type_id).await.unwrap();
        assert_eq!(type_.description, "Speedometer and compass sensor");

        // update device
        resource.update_device(device_id2, None, None, None, None, Some("E-bike speedometer and compass sensor 2")).await.unwrap();
        let device2 = resource.read_device(device_id2).await.unwrap();
        assert_eq!(device2.description, "E-bike speedometer and compass sensor 2");
        // update device config
        resource.update_device_config(device_cfg_id, None, Some(Int(60)), None).await.unwrap();
        let config = resource.read_device_config(device_cfg_id).await.unwrap();
        assert_eq!(config.value, Int(60));

        // update group model
        resource.update_group_model(group_model_id, None, None, Some("Data models")).await.unwrap();
        let group = resource.read_group_model(group_model_id).await.unwrap();
        assert_eq!(group.description, "Data models");
        // update group device
        resource.update_group_device(group_device_id, None, None, Some("Sensor devices")).await.unwrap();
        let group = resource.read_group_device(group_device_id).await.unwrap();
        assert_eq!(group.description, "Sensor devices");

        // generate raw data and create buffers
        let timestamp = DateTime::from_str("2023-05-07T07:08:48Z").unwrap();
        let raw_1 = vec![I32(1231),I32(890)];
        let raw_2 = vec![I32(1452),I32(-341)];
        resource.create_buffer(device_id1, model_buf_id, timestamp, None, raw_1.clone(), "CONVERT").await.unwrap();
        resource.create_buffer(device_id2, model_buf_id, timestamp, None, raw_2.clone(), "CONVERT").await.unwrap();

        // read buffer
        let buffers = resource.list_buffer_first(100, None, None, None).await.unwrap();
        assert_eq!(buffers[0].data, raw_1);
        assert_eq!(buffers[1].data, raw_2);

        // get model config value then convert buffer data
        let conf_val = |model_configs: Vec<DeviceConfigSchema>, name: &str| -> ConfigValue {
            model_configs.iter().filter(|&cfg| cfg.name == name.to_owned())
                .next().unwrap().value.clone()
        };
        let convert = |raw: i32, coef0: i64, coef1: f64| -> f64 {
            (raw as f64 - coef0 as f64) * coef1
        };
        let coef0 = conf_val(device_configs.clone(), "coef_0").try_into().unwrap();
        let coef1 = conf_val(device_configs.clone(), "coef_1").try_into().unwrap();
        let speed = convert(raw_1[0].clone().try_into().unwrap(), coef0, coef1) as f32;
        let direction = convert(raw_1[1].clone().try_into().unwrap(), coef0, coef1) as f32;
        // create data
        resource.create_data(device_id1, model_id, timestamp, None, vec![F32(speed), F32(direction)]).await.unwrap();

        // read data
        let datas = resource.list_data_by_number_before(device_id1, model_id, timestamp, 100).await.unwrap();
        let data = datas.into_iter().next().unwrap();
        assert_eq!(vec![F32(speed), F32(direction)], data.data);

        // delete data
        resource.delete_data(device_id1, model_id, timestamp, None).await.unwrap();
        let result = resource.read_data(device_id1, model_id, timestamp, None).await;
        assert!(result.is_err());

        // update buffer status
        resource.update_buffer(buffers[0].id, None, Some("DELETE")).await.unwrap();
        let buffer = resource.read_buffer(buffers[0].id).await.unwrap();
        assert_eq!(buffer.status, "DELETE");

        // delete buffer data
        resource.delete_buffer(buffers[0].id).await.unwrap();
        resource.delete_buffer(buffers[1].id).await.unwrap();
        let result = resource.read_buffer(buffers[0].id).await;
        assert!(result.is_err());

        // create data slice
        let slice_id = resource.create_slice(device_id1, model_id, timestamp, timestamp, Some(0), Some(0), "Speed and compass slice", None).await.unwrap();
        // read data
        let slices = resource.list_slice_by_name("slice").await.unwrap();
        let slice = slices.into_iter().next().unwrap();
        assert_eq!(slice.timestamp_begin, timestamp);
        assert_eq!(slice.name, "Speed and compass slice");

        // update data slice
        resource.update_slice(slice_id, None, None, None, None, None, Some("Speed and compass sensor 1 at '2023-05-07 07:08:48'")).await.unwrap();
        let slice = resource.read_slice(slice_id).await.unwrap();
        assert_eq!(slice.description, "Speed and compass sensor 1 at '2023-05-07 07:08:48'");

        // delete data slice
        resource.delete_slice(slice_id).await.unwrap();
        let result = resource.read_slice(slice_id).await;
        assert!(result.is_err());

        // create system log
        resource.create_log(timestamp, device_id1, "UNKNOWN_ERROR", Str("testing success".to_owned())).await.unwrap();
        // read log
        let logs = resource.list_log_by_range_time(timestamp, Utc::now(), None, None).await.unwrap();
        let log = logs.into_iter().next().unwrap();
        assert_eq!(log.value, Str("testing success".to_owned()));

        // update system log
        resource.update_log(timestamp, device_id1, Some("SUCCESS"), None).await.unwrap();
        let log = resource.read_log(timestamp, device_id1).await.unwrap();
        assert_eq!(log.status, "SUCCESS");

        // delete system log
        resource.delete_log(timestamp, device_id1).await.unwrap();
        let result = resource.read_log(timestamp, device_id1).await;
        assert!(result.is_err());

        // delete model config
        let config_id = model_configs.iter().next().map(|el| el.id).unwrap();
        resource.delete_model_config(config_id).await.unwrap();
        let result = resource.read_model_config(config_id).await;
        assert!(result.is_err());
        // delete model
        resource.delete_model(model_id).await.unwrap();
        let result = resource.read_model(model_id).await;
        assert!(result.is_err());
        // check if all model config also deleted
        let configs = resource.list_model_config_by_model(model_id).await.unwrap();
        assert_eq!(configs.len(), 0);

        // delete device config
        let config_id = device_configs.iter().next().map(|el| el.id).unwrap();
        resource.delete_device_config(config_id).await.unwrap();
        let result = resource.read_device_config(config_id).await;
        assert!(result.is_err());
        // delete device
        resource.delete_device(device_id1).await.unwrap();
        let result = resource.read_device(device_id1).await;
        assert!(result.is_err());
        // check if all device config also deleted
        let configs = resource.list_device_config_by_device(device_id1).await.unwrap();
        assert_eq!(configs.len(), 0);

        // delete type
        let result = resource.delete_type(type_id).await;
        assert!(result.is_err()); // error because a device associated with the type still exists
        let devices = resource.list_device_by_type(type_id).await.unwrap();
        for device in devices {
            resource.delete_device(device.id).await.unwrap();
        }
        resource.delete_type(type_id).await.unwrap();

        // check number of member of the group
        let group = resource.read_group_model(group_model_id).await.unwrap();
        assert_eq!(group.models.len(), 0);
        let group = resource.read_group_device(group_device_id).await.unwrap();
        assert_eq!(group.devices.len(), 0);
        // delete group model and device
        resource.delete_group_model(group_model_id).await.unwrap();
        resource.delete_group_device(group_device_id).await.unwrap();
        let result = resource.read_group_model(group_model_id).await;
        assert!(result.is_err());
        let result = resource.read_group_device(group_device_id).await;
        assert!(result.is_err());

        stop_server("test_resource_server");
    }

}
