#[cfg(test)]
mod tests {
    use chrono::{DateTime, Utc};
    use uuid::Uuid;
    use argon2::{Argon2, PasswordHash, PasswordVerifier};
    use rmcs_api_client::resource::{ModelConfigSchema, DeviceConfigSchema};
    use rmcs_api_client::resource::{DataType::*, DataValue::{*, self}};
    use rmcs_api_client::resource::SetMember;
    use rmcs_api_client::resource::tag;
    use rmcs_api_client::{Auth, Resource};
    use rmcs_api_client::auth::utility::generate_access_key;
    use rmcs_api_client::auth::ProfileMode::*;
    use rmcs_api_server::utility::test::{TestServerKind, TestServer};

    #[tokio::test]
    async fn test_auth()
    {
        unsafe { std::env::set_var("RUST_BACKTRACE", "1"); }

        // start auth server
        let auth_server = TestServer::new(TestServerKind::Auth);
        auth_server.truncate_tables().await.unwrap();
        auth_server.start_server();

        let auth = Auth::new(&auth_server.address).await;

        // create new resource API
        let password_api = "Ap1_P4s5w0rd";
        let access_key = generate_access_key();
        let api_id1 = auth.create_api(Uuid::new_v4(), "Resource1", "localhost:9001", "RESOURCE", "", password_api, &access_key).await.unwrap();
        let api_id2 = auth.create_api(Uuid::new_v4(), "Resource_2", "localhost:9002", "RESOURCE", "",  password_api, &access_key).await.unwrap();

        // create new procedure for newly created resource API
        let proc_id1 = auth.create_procedure(Uuid::new_v4(), api_id1, "ReadResourceData", "").await.unwrap();
        let proc_id2 = auth.create_procedure(Uuid::new_v4(), api_id1, "CreateData", "").await.unwrap();
        let proc_id3 = auth.create_procedure(Uuid::new_v4(), api_id1, "DeleteData", "").await.unwrap();
        let proc_id4 = auth.create_procedure(Uuid::new_v4(), api_id2, "ReadConfig", "").await.unwrap();

        // get newly created resource at the first of resource API list
        let apis = auth.list_api_by_category("RESOURCE").await.unwrap();
        let api_ids: Vec<Uuid> = apis.iter().map(|e| e.id).collect();
        let api = auth.read_api(api_id1).await.unwrap();
        let api_proc_ids: Vec<Uuid> = api.procedures.iter().map(|e| e.id).collect();

        // get newly created procedure at the first of procedure list
        let procedures = auth.list_procedure_by_api(api_id1).await.unwrap();
        let proc_ids: Vec<Uuid> = procedures.iter().map(|e| e.id).collect();

        assert_eq!(api.name, "Resource1");
        assert_eq!(api.address, "localhost:9001");
        assert!(api_ids.contains(&api_id1));
        assert!(proc_ids.contains(&proc_id1));
        assert_eq!(api_proc_ids, proc_ids);

        let hash = api.password;
        let parsed_hash = PasswordHash::new(hash.as_str()).unwrap();
        assert!(Argon2::default().verify_password(password_api.as_bytes(), &parsed_hash).is_ok());

        // create new role and add access to the procedure
        let role_id1 = auth.create_role(Uuid::new_v4(), api_id1, "administrator", false, false, 900, 28800).await.unwrap();
        auth.add_role_access(role_id1, proc_id1).await.unwrap();
        auth.add_role_access(role_id1, proc_id2).await.unwrap();
        auth.add_role_access(role_id1, proc_id3).await.unwrap();
        let role_id2 = auth.create_role(Uuid::new_v4(), api_id1, "user", true, false, 900, 604800).await.unwrap();
        auth.add_role_access(role_id2, proc_id1).await.unwrap();
        let role_id3 = auth.create_role(Uuid::new_v4(), api_id2, "user", true, false, 900, 604800).await.unwrap();
        auth.add_role_access(role_id3, proc_id4).await.unwrap();

        // get role data
        let roles = auth.list_role_by_api(api_id1).await.unwrap();
        let role_ids: Vec<Uuid> = roles.iter().map(|e| e.id).collect();
        let role = auth.read_role(role_id1).await.unwrap();

        assert!(role_ids.contains(&role_id1));
        assert_eq!(role.name, "administrator");
        assert_eq!(role.multi, false);
        assert_eq!(role.ip_lock, false);
        assert!(role.procedures.contains(&proc_id1));
        assert!(role.procedures.contains(&proc_id2));
        assert!(role.procedures.contains(&proc_id3));

        let access_key = role.access_key;
        assert_eq!(access_key.len(), 32);

        // update a resource API and its procedure and role
        let api_name = "Resource_1";
        let proc_name = "ReadData";
        let role_name = "admin";
        let access_key_new = generate_access_key();
        auth.update_api(api_id1, Some(api_name), None, None, Some("New resource api"), None, Some(&access_key_new)).await.unwrap();
        auth.update_procedure(proc_id1, Some(proc_name), Some("Read resource data")).await.unwrap();
        auth.update_role(role_id1, Some(role_name), None, Some(true), None, None).await.unwrap();

        // get updated resource API schema
        let api = auth.read_api_by_name(api_name).await.unwrap();
        let procedure = auth.read_procedure_by_name(api_id1, proc_name).await.unwrap();
        let role = auth.read_role_by_name(api_id1, role_name).await.unwrap();

        assert_eq!(api.name, api_name);
        assert_eq!(api.description, "New resource api");
        assert_eq!(procedure.name, proc_name);
        assert_eq!(procedure.description, "Read resource data");
        assert_eq!(role.name, role_name);
        assert_eq!(role.ip_lock, true);
        assert_ne!(role.access_key, access_key);

        // create new user and add associated roles
        let password_admin = "Adm1n_P4s5w0rd";
        let password_user = "Us3r_P4s5w0rd";
        let user_id1 = auth.create_user(Uuid::new_v4(), "administrator", "admin@mail.co", "+6281234567890", password_admin).await.unwrap();
        auth.add_user_role(user_id1, role_id1).await.unwrap();
        auth.add_user_role(user_id1, role_id3).await.unwrap();
        let user_id2 = auth.create_user(Uuid::new_v4(), "username", "user@mail.co", "+6281234567890", password_user).await.unwrap();
        auth.add_user_role(user_id2, role_id2).await.unwrap();
        auth.add_user_role(user_id2, role_id3).await.unwrap();

        // get user data
        let users = auth.list_user_by_role(role_id3).await.unwrap();
        let user_ids: Vec<Uuid> = users.iter().map(|e| e.id).collect();
        let user = auth.read_user(user_id1).await.unwrap();

        assert!(user_ids.contains(&user_id1));
        assert_eq!(user.name, "administrator");
        assert_eq!(user.email, "admin@mail.co");
        assert_eq!(user.phone, "+6281234567890");

        let hash = user.password;
        let parsed_hash = PasswordHash::new(hash.as_str()).unwrap();
        assert!(Argon2::default().verify_password(password_admin.as_bytes(), &parsed_hash).is_ok());

        // update user
        let password_new = "N3w_P4s5w0rd";
        auth.update_user(user_id2, None, None, None, Some(password_new)).await.unwrap();

        // get updated user
        let user = auth.read_user_by_name("username").await.unwrap();

        assert_ne!(user.password, hash);

        // create role and user profile
        let profile_role_id1 = auth.create_role_profile(role_id1, "name", StringT, SingleRequired).await.unwrap();
        let profile_role_id2 = auth.create_role_profile(role_id1, "age", U16T, SingleOptional).await.unwrap();
        let profile_user_id1 = auth.create_user_profile(user_id1, "name", String("john doe".to_owned())).await.unwrap();
        let profile_user_id2 = auth.create_user_profile(user_id1, "age", U16(20)).await.unwrap();

        // read role and user profile
        let profile_role1 = auth.read_role_profile(profile_role_id1).await.unwrap();
        let profile_role2 = auth.read_role_profile(profile_role_id2).await.unwrap();
        let profile_user1 = auth.read_user_profile(profile_user_id1).await.unwrap();
        let profile_users = auth.list_user_profile_by_user(user_id1).await.unwrap();

        assert_eq!(profile_role1.name, "name");
        assert_eq!(profile_role2.mode, SingleOptional);
        assert_eq!(profile_user1.value, String("john doe".to_owned()));
        assert!(profile_users.contains(&profile_user1));

        // update user profile
        auth.update_user_profile(profile_user_id2, None, Some(U16(21))).await.unwrap();
        let profile_user2 = auth.read_user_profile(profile_user_id2).await.unwrap();

        assert_eq!(profile_user2.value, U16(21));

        // create new access token and refresh token
        let expire1 = DateTime::parse_from_str("2023-01-01 00:00:00 +0000", "%Y-%m-%d %H:%M:%S %z").unwrap().into();
        let expire2 = DateTime::parse_from_str("2023-01-01 12:00:00 +0000", "%Y-%m-%d %H:%M:%S %z").unwrap().into();
        let auth_token = "rGKrHrDuWXt2CDbjmrt1SHbmea86wIQb";
        let (access_id1, _, auth_token1) = auth.create_access_token(user_id1, auth_token, expire1, &[192, 168, 0, 1]).await.unwrap();
        let access_id2 = access_id1 + 1;
        auth.create_auth_token(user_id1, expire2, &[192, 168, 0, 1], 1).await.unwrap();
        auth.create_access_token(user_id1, auth_token, expire1, &[]).await.unwrap();

        // get token data
        let access_token = auth.read_access_token(access_id2).await.unwrap();
        let auth_tokens = auth.list_auth_token(&auth_token1).await.unwrap();
        let auth_token = auth_tokens.iter().filter(|x| x.auth_token == auth_token1).next().unwrap();
        let user_tokens = auth.list_token_by_user(user_id1).await.unwrap();

        assert_eq!(auth_token.user_id, user_id1);
        assert_eq!(auth_token.expire, expire1);
        assert_eq!(auth_token.ip, [192, 168, 0, 1]);
        assert_eq!(access_token.expire, expire2);
        assert_eq!(user_tokens.len(), 3);

        // update token
        let expire3 = DateTime::parse_from_str("2023-01-01 18:00:00 +0000", "%Y-%m-%d %H:%M:%S %z").unwrap().into();
        auth.update_access_token(access_id2, Some(expire3), None).await.unwrap();
        auth.update_auth_token(&auth_token1, Some(expire3), Some(&[192, 168, 0, 100])).await.unwrap();

        // get updated token
        let new_access_token = auth.read_access_token(access_id2).await.unwrap();
        let new_auth_tokens = auth.list_auth_token(&auth_token1).await.unwrap();
        let new_auth_token = new_auth_tokens.iter().filter(|x| x.auth_token == auth_token1).next().unwrap();

        assert_ne!(new_access_token.refresh_token, access_token.refresh_token);
        assert_eq!(new_access_token.expire, expire3);
        assert_eq!(new_auth_token.expire, expire3);
        assert_eq!(new_auth_token.ip, [192, 168, 0, 100]);

        // delete role and user profile
        auth.delete_user_profile(profile_user_id1).await.unwrap();
        auth.delete_role_profile(profile_role_id1).await.unwrap();

        // check if role and user profile already deleted
        let result_profile_user = auth.read_user_profile(profile_user_id1).await;
        let result_profile_role = auth.read_role_profile(profile_role_id1).await;

        assert!(result_profile_user.is_err());
        assert!(result_profile_role.is_err());

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

        auth_server.stop_server();
    }

    #[tokio::test]
    async fn test_resource()
    {
        unsafe { std::env::set_var("RUST_BACKTRACE", "1"); }

        // start resource server
        let resource_server = TestServer::new(TestServerKind::Resource);
        resource_server.truncate_tables().await.unwrap();
        resource_server.start_server();

        let resource = Resource::new(&resource_server.address).await;

        // create new data model and add data types
        let model_id = resource.create_model(Uuid::new_v4(), &[F32T,F32T], "UPLINK", "speed and direction", None).await.unwrap();
        let model_buf_id = resource.create_model(Uuid::new_v4(), &[U8T,U8T,U8T,U8T], "UPLINK", "buffer 4", None).await.unwrap();
        // create scale, symbol, and threshold configurations for new created model
        resource.create_model_config(model_id, 0, "scale_0", String("speed".to_owned()), "SCALE").await.unwrap();
        resource.create_model_config(model_id, 1, "scale_1", String("direction".to_owned()), "SCALE").await.unwrap();
        resource.create_model_config(model_id, 0, "unit_0", String("meter/second".to_owned()), "UNIT").await.unwrap();
        resource.create_model_config(model_id, 1, "unit_1", String("degree".to_owned()), "UNIT").await.unwrap();
        let model_cfg_id = resource.create_model_config(model_id, 0, "upper_threshold", I32(250), "THRESHOLD").await.unwrap();

        // Create new type and link it to newly created model
        let type_id = resource.create_type(Uuid::new_v4(), "Speedometer Compass", None).await.unwrap();
        resource.add_type_model(type_id, model_id).await.unwrap();
        resource.add_type_model(type_id, model_buf_id).await.unwrap();

        // create new devices with newly created type as its type 
        let gateway_id = Uuid::parse_str("bfc01f2c-8b2c-47cf-912a-f95f6f41a1e6").unwrap();
        let device_id1 = Uuid::parse_str("74768a42-bc29-40eb-8934-2effcbf34f8f").unwrap();
        let device_id2 = Uuid::parse_str("150a0a77-2d9b-4672-9253-3d42fd0f0940").unwrap();
        resource.create_device(device_id1, gateway_id, type_id, "TEST01", "Speedometer Compass 1", None).await.unwrap();
        resource.create_device(device_id2, gateway_id, type_id, "TEST02", "Speedometer Compass 2", None).await.unwrap();
        // create device configurations
        resource.create_device_config(device_id1, "coef_0", I32(-21), "CONVERSION").await.unwrap();
        resource.create_device_config(device_id1, "coef_1", F64(0.1934), "CONVERSION").await.unwrap();
        resource.create_device_config(device_id1, "period", I32(60), "NETWORK").await.unwrap();
        resource.create_device_config(device_id2, "coef_0", I32(44), "CONVERSION").await.unwrap();
        resource.create_device_config(device_id2, "coef_1", F64(0.2192), "CONVERSION").await.unwrap();
        let device_cfg_id = resource.create_device_config(device_id2, "period", I32(120), "NETWORK").await.unwrap();

        // create new group and register newly created models as its member
        let group_model_id = resource.create_group_model(Uuid::new_v4(), "data", "APPLICATION", None).await.unwrap();
        resource.add_group_model_member(group_model_id, model_id).await.unwrap();
        // create new group and register newly created devices as its member
        let group_device_id = resource.create_group_device(Uuid::new_v4(), "sensor", "APPLICATION", None).await.unwrap();
        resource.add_group_device_member(group_device_id, device_id1).await.unwrap();
        resource.add_group_device_member(group_device_id, device_id2).await.unwrap();

        // read model
        let model = resource.read_model(model_id).await.unwrap();
        let models = resource.list_model_by_name("speed").await.unwrap();
        let model_ids: Vec<Uuid> = models.iter().map(|u| u.id).collect();
        assert!(model_ids.contains(&model_id));
        assert_eq!(model.name, "speed and direction");
        assert_eq!(model.category, "UPLINK");
        assert_eq!(model.data_type, [F32T,F32T]);
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
        let device_ids: Vec<Uuid> = devices.iter().map(|u| u.id).collect();
        assert!(device_ids.contains(&device_id1));
        assert_eq!(device1.serial_number, "TEST01");
        assert_eq!(device1.name, "Speedometer Compass 1");
        // read type
        let types = resource.list_type_by_name("Speedometer").await.unwrap();
        let device_type = types.iter().filter(|x| x.id == type_id).next().unwrap();
        assert_eq!(device1.type_, device_type.to_owned());
        // read device configurations
        let device_configs = resource.list_device_config_by_device(device_id1).await.unwrap();
        assert_eq!(device1.configs, device_configs);

        // read group model
        let groups = resource.list_group_model_by_category("APPLICATION").await.unwrap();
        let group_model = groups.iter().filter(|x| x.model_ids.contains(&model_id)).next().unwrap();
        assert_eq!(group_model.name, "data");
        assert_eq!(group_model.category, "APPLICATION");
        // read group device
        let groups = resource.list_group_device_by_name("sensor").await.unwrap();
        let group_device = groups.iter().filter(|x| x.device_ids.contains(&device_id1)).next().unwrap();
        assert_eq!(group_device.device_ids, [device_id2, device_id1]); // device_id1 > device_id2, so device1 in second (last) order
        assert_eq!(group_device.name, "sensor");
        assert_eq!(group_device.category, "APPLICATION");

        // update model
        resource.update_model(model_buf_id, Some(&[I32T,I32T]), None, Some("buffer 2 integer"), Some("Model for store 2 i32 temporary data")).await.unwrap();
        let model = resource.read_model(model_buf_id).await.unwrap();
        assert_eq!(model.name, "buffer 2 integer");
        assert_eq!(model.data_type, [I32T,I32T]);
        // update model configurations
        resource.update_model_config(model_cfg_id, None, Some(I32(238)), None).await.unwrap();
        let config = resource.read_model_config(model_cfg_id).await.unwrap();
        assert_eq!(config.value, I32(238));

        // update type
        resource.update_type(type_id, None, Some("Speedometer and compass sensor")).await.unwrap();
        let type_ = resource.read_type(type_id).await.unwrap();
        assert_eq!(type_.description, "Speedometer and compass sensor");

        // update device
        resource.update_device(device_id2, None, None, None, None, Some("E-bike speedometer and compass sensor 2")).await.unwrap();
        let device2 = resource.read_device(device_id2).await.unwrap();
        assert_eq!(device2.description, "E-bike speedometer and compass sensor 2");
        // update device config
        resource.update_device_config(device_cfg_id, None, Some(I32(60)), None).await.unwrap();
        let config = resource.read_device_config(device_cfg_id).await.unwrap();
        assert_eq!(config.value, I32(60));

        // update group model
        resource.update_group_model(group_model_id, None, None, Some("Data models")).await.unwrap();
        let group = resource.read_group_model(group_model_id).await.unwrap();
        assert_eq!(group.description, "Data models");
        // update group device
        resource.update_group_device(group_device_id, None, None, Some("Sensor devices")).await.unwrap();
        let group = resource.read_group_device(group_device_id).await.unwrap();
        assert_eq!(group.description, "Sensor devices");

        // create set template and set
        let template_id = resource.create_set_template(Uuid::new_v4(), "multiple compass", None).await.unwrap();
        let set_id = resource.create_set(Uuid::new_v4(), template_id, "multiple compass 1", None).await.unwrap();
        // add devices value to the set template and set
        resource.add_set_template_member(template_id, type_id, model_id, &[1]).await.unwrap();
        resource.add_set_member(set_id, device_id2, model_id, &[1]).await.unwrap();
        resource.add_set_member(set_id, device_id1, model_id, &[1]).await.unwrap();

        // read sets
        let sets = resource.list_set_by_template(template_id).await.unwrap();
        let set = sets.iter().next().unwrap();
        assert_eq!(set.id, set_id);
        assert!(set.members.contains(&SetMember { device_id: device_id1, model_id, data_index: vec![1] }));
        assert!(set.members.contains(&SetMember { device_id: device_id2, model_id, data_index: vec![1] }));

        // swap set members
        resource.swap_set_member(set_id, device_id1, model_id, device_id2, model_id).await.unwrap();
        let set = resource.read_set(set_id).await.unwrap();
        assert_eq!(set.members[0], SetMember { device_id: device_id1, model_id, data_index: vec![1] });
        assert_eq!(set.members[1], SetMember { device_id: device_id2, model_id, data_index: vec![1] });

        // generate raw data and create buffers
        let timestamp_1 = DateTime::parse_from_str("2023-05-07 07:08:48.123456 +0000", "%Y-%m-%d %H:%M:%S.%6f %z").unwrap().into();
        let timestamp_2 = DateTime::parse_from_str("2025-06-11 14:49:36.123456 +0000", "%Y-%m-%d %H:%M:%S.%6f %z").unwrap().into();
        let raw_1 = vec![I32(1231),I32(890)];
        let raw_2 = vec![I32(1452),I32(-341)];
        resource.create_buffer(device_id1, model_buf_id, timestamp_1, &raw_1, Some(tag::ANALYSIS_1)).await.unwrap();
        resource.create_buffer(device_id2, model_buf_id, timestamp_1, &raw_2, Some(tag::ANALYSIS_1)).await.unwrap();
        let ids = resource.create_buffer_multiple(&[device_id1, device_id2], &[model_buf_id, model_buf_id], &[timestamp_2, timestamp_2], &[&raw_1, &raw_2], Some(&[tag::TRANSFER_LOCAL, tag::TRANSFER_LOCAL])).await.unwrap();

        // read buffer
        let buffers = resource.list_buffer_first(100, None, None, None).await.unwrap();
        assert_eq!(buffers[0].data, raw_1);
        assert_eq!(buffers[1].data, raw_2);
        assert_eq!(ids.len(), 2);

        // read buffers from a device group
        let buffers_group = resource.list_buffer_group_first(100, Some(&group_device.device_ids), None, None).await.unwrap();
        assert_eq!(buffers_group[0].data, raw_1);
        assert_eq!(buffers_group[1].data, raw_2);

        // get model config value then convert buffer data
        let conf_val = |model_configs: &[DeviceConfigSchema], name: &str| -> DataValue {
            model_configs.iter().filter(|&cfg| cfg.name == name.to_owned())
                .next().unwrap().value.clone()
        };
        let convert = |raw: i32, coef0: i32, coef1: f64| -> f64 {
            (raw as f64 - coef0 as f64) * coef1
        };
        let coef0 = conf_val(&device_configs, "coef_0").try_into().unwrap();
        let coef1 = conf_val(&device_configs, "coef_1").try_into().unwrap();
        let speed1 = convert(raw_1[0].clone().try_into().unwrap(), coef0, coef1) as f32;
        let direction1 = convert(raw_1[1].clone().try_into().unwrap(), coef0, coef1) as f32;
        let speed2 = convert(raw_2[0].clone().try_into().unwrap(), coef0, coef1) as f32;
        let direction2 = convert(raw_2[1].clone().try_into().unwrap(), coef0, coef1) as f32;
        // create data
        resource.create_data(device_id1, model_id, timestamp_1, &[F32(speed1), F32(direction1)], None).await.unwrap();
        resource.create_data(device_id2, model_id, timestamp_1, &[F32(speed2), F32(direction2)], None).await.unwrap();
        resource.create_data_multiple(&[device_id1, device_id2], &[model_id, model_id], &[timestamp_2, timestamp_2], &[&[F32(speed1), F32(direction1)], &[F32(speed2), F32(direction2)]], None).await.unwrap();

        // read data
        let datas = resource.list_data_by_number_before(device_id1, model_id, timestamp_1, 100, None).await.unwrap();
        let data = datas.iter().filter(|x| x.device_id == device_id1 && x.model_id == model_id).next().unwrap();
        assert_eq!(vec![F32(speed1), F32(direction1)], data.data);
        assert_eq!(timestamp_1, data.timestamp);
        assert_eq!(tag::DEFAULT, data.tag);

        // read data from a device group
        let data_group = resource.list_data_group_by_time(&group_device.device_ids, &[model_id], timestamp_1, None).await.unwrap();
        let data_values_vec: Vec<Vec<DataValue>> = data_group.iter().map(|d| d.data.clone()).collect();
        let data_values: Vec<DataValue> = data_values_vec.into_iter().flatten().collect();
        assert!(data_values.contains(&F32(speed1)));
        assert!(data_values.contains(&F32(speed2)));

        // read data set and data using set
        let data_set = resource.read_data_set(set_id, timestamp_1, None).await.unwrap();
        assert_eq!(data_set.data[0], F32(direction1));
        assert_eq!(data_set.data[1], F32(direction2));

        // delete data
        resource.delete_data(device_id1, model_id, timestamp_1, None).await.unwrap();
        resource.delete_data(device_id2, model_id, timestamp_1, None).await.unwrap();
        resource.delete_data(device_id1, model_id, timestamp_2, None).await.unwrap();
        resource.delete_data(device_id2, model_id, timestamp_2, None).await.unwrap();
        let result = resource.read_data(device_id1, model_id, timestamp_1,None).await;
        assert!(result.is_err());

        // update buffer tag
        resource.update_buffer(buffers[0].id, None, Some(tag::DELETE)).await.unwrap();
        let buffer = resource.read_buffer(buffers[0].id).await.unwrap();
        assert_eq!(buffers[0].data, buffer.data);
        assert_eq!(buffer.tag, tag::DELETE);

        // delete buffer data
        resource.delete_buffer(buffers[0].id).await.unwrap();
        resource.delete_buffer(buffers[1].id).await.unwrap();
        resource.delete_buffer(buffers[2].id).await.unwrap();
        resource.delete_buffer(buffers[3].id).await.unwrap();
        let result = resource.read_buffer(buffers[0].id).await;
        assert!(result.is_err());

        // create data slice
        let slice_id = resource.create_slice(device_id1, model_id, timestamp_1, timestamp_2, "Speed and compass slice", None).await.unwrap();
        // read data slice
        let slices = resource.list_slice_option(None, None, Some("slice"), None, None).await.unwrap();
        let slice = slices.iter().filter(|x| x.device_id == device_id1 && x.model_id == model_id).next().unwrap();
        assert_eq!(slice.timestamp_begin, timestamp_1);
        assert_eq!(slice.name, "Speed and compass slice");

        // update data slice
        resource.update_slice(slice_id, None, None, None, Some("Speed and compass sensor 1 at '2023-05-07 07:08:48'")).await.unwrap();
        let slice = resource.read_slice(slice_id).await.unwrap();
        assert_eq!(slice.description, "Speed and compass sensor 1 at '2023-05-07 07:08:48'");

        // delete data slice
        resource.delete_slice(slice_id).await.unwrap();
        let result = resource.read_slice(slice_id).await;
        assert!(result.is_err());

        // create system log
        let log_id = resource.create_log(timestamp_1, Some(device_id1), None, String("testing success".to_owned()), Some(tag::ERROR_UNKNOWN)).await.unwrap();
        // read log
        let logs = resource.list_log_by_range(timestamp_1, Utc::now(), None, None, None).await.unwrap();
        let log = logs.iter().filter(|x| x.device_id == Some(device_id1) && x.timestamp == timestamp_1).next().unwrap();
        assert_eq!(log.value, String("testing success".to_owned()));

        // update system log
        resource.update_log(log_id, None, Some(tag::SUCCESS)).await.unwrap();
        let log = resource.read_log(log.id).await.unwrap();
        assert_eq!(log.tag, tag::SUCCESS);

        // delete system log
        resource.delete_log(log_id).await.unwrap();
        let result = resource.read_log(log.id).await;
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
        assert_eq!(group.model_ids.len(), 0);
        let group = resource.read_group_device(group_device_id).await.unwrap();
        assert_eq!(group.device_ids.len(), 0);
        // delete group model and device
        resource.delete_group_model(group_model_id).await.unwrap();
        resource.delete_group_device(group_device_id).await.unwrap();
        let result = resource.read_group_model(group_model_id).await;
        assert!(result.is_err());
        let result = resource.read_group_device(group_device_id).await;
        assert!(result.is_err());

        // delete set template and set
        resource.delete_set_template(template_id).await.unwrap();
        resource.delete_set(set_id).await.unwrap();
        let result = resource.read_set_template(template_id).await;
        assert!(result.is_err());
        let result = resource.read_set(set_id).await;
        assert!(result.is_err());

        resource_server.stop_server();
    }

}
