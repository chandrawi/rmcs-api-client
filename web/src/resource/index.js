export {
    read_model,
    list_model_by_name,
    list_model_by_category,
    list_model_by_name_category,
    list_model_by_type,
    create_model,
    update_model,
    delete_model,
    read_model_config,
    list_model_config_by_model,
    create_model_config,
    update_model_config,
    delete_model_config
} from './model.js';
export {
    read_device,
    read_device_by_sn,
    list_device_by_gateway,
    list_device_by_type,
    list_device_by_name,
    list_device_by_gateway_type,
    list_device_by_gateway_name,
    create_device,
    update_device,
    delete_device,
    read_gateway,
    read_gateway_by_sn,
    list_gateway_by_type,
    list_gateway_by_name,
    create_gateway,
    update_gateway,
    delete_gateway,
    read_device_config,
    list_device_config_by_device,
    create_device_config,
    update_device_config,
    delete_device_config,
    read_gateway_config,
    list_gateway_config_by_gateway,
    create_gateway_config,
    update_gateway_config,
    delete_gateway_config
} from './device.js';
export {
    read_type,
    list_type_by_name,
    create_type,
    update_type,
    delete_type,
    add_type_model,
    remove_type_model
} from './types.js';
export {
    read_group_model,
    list_group_model_by_name,
    list_group_model_by_category,
    list_group_model_by_name_category,
    create_group_model,
    update_group_model,
    delete_group_model,
    add_group_model_member,
    remove_group_model_member,
    read_group_device,
    list_group_device_by_name,
    list_group_device_by_category,
    list_group_device_by_name_category,
    create_group_device,
    update_group_device,
    delete_group_device,
    add_group_device_member,
    remove_group_device_member,
    read_group_gateway,
    list_group_gateway_by_name,
    list_group_gateway_by_category,
    list_group_gateway_by_name_category,
    create_group_gateway,
    update_group_gateway,
    delete_group_gateway,
    add_group_gateway_member,
    remove_group_gateway_member,
} from './group.js';
export {
    read_data,
    list_data_by_time,
    list_data_by_last_time,
    list_data_by_range_time,
    list_data_by_number_before,
    list_data_by_number_after,
    create_data,
    delete_data
} from './data.js';
export {
    read_buffer,
    read_buffer_by_time,
    read_buffer_first,
    read_buffer_last,
    list_buffer_first,
    list_buffer_last,
    create_buffer,
    update_buffer,
    delete_buffer
} from './buffer.js';
export {
    read_slice,
    list_slice_by_name,
    list_slice_by_device,
    list_slice_by_model,
    list_slice_by_device_model,
    create_slice,
    update_slice,
    delete_slice
} from './slice.js';
export {
    read_log,
    list_log_by_time,
    list_log_by_last_time,
    list_log_by_range_time,
    create_log,
    update_log,
    delete_log
} from './log.js';


/**
 * Resource class object
 * @class
 * @param {string} address
 * @param {string} access_token
 */
export class Resource {

    constructor(address, access_token) {
        this.address = address;
        this.access_token = access_token;
    }

}
