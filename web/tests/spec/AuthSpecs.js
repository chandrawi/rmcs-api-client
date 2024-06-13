import { auth, utility } from '../../build/bundle.js';

let server = { address: "http://localhost:9001" };

describe("RMCS Auth test", function() {

    const api_id_1 = utility.uuid_v4_hex();
    const api_id_2 = utility.uuid_v4_hex();
    const api_password = "Ap1_P4s5w0rd";
    const proc_id_1 = utility.uuid_v4_hex();
    const proc_id_2 = utility.uuid_v4_hex();
    const proc_id_3 = utility.uuid_v4_hex();
    const proc_id_4 = utility.uuid_v4_hex();
    const role_admin_id = utility.uuid_v4_hex();
    const role_user_1_id = utility.uuid_v4_hex();
    const role_user_2_id = utility.uuid_v4_hex();
    const api_name = "Resource_1";
    const proc_name = "ReadData";
    const role_name = "admin";
    const admin_id = utility.uuid_v4_hex();
    const user_id = utility.uuid_v4_hex();
    const admin_password = "Adm1n_P4s5w0rd";
    const user_password = "Us3r_P4s5w0rd";
    let admin_hash = "";
    let userToken = {};

    it("should create API 1", function(done) {
        auth.create_api(server, {
            id: api_id_1,
            name: "Resource1",
            address: "localhost:9001",
            category: "RESOURCE",
            description: "",
            password: api_password,
            access_key: utility.random_base64(43)
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create API 2", function(done) {
        auth.create_api(server, {
            id: api_id_2,
            name: "Resource_2",
            address: "localhost:9002",
            category: "RESOURCE",
            description: "",
            password: api_password,
            access_key: utility.random_base64(43)
        }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should create procedures on API 1", function(done) {
        auth.create_procedure(server, { id: proc_id_1, api_id: api_id_1, name: "ReadResourceData" }, (e, r) => {
            expect(e).toBeNull(e);
            auth.create_procedure(server, { id: proc_id_2, api_id: api_id_1, name: "CreateData" }, (e, r) => {
                expect(e).toBeNull(e);
                auth.create_procedure(server, { id: proc_id_3, api_id: api_id_1, name: "DeleteData" }, (e, r) => {
                    expect(e).toBeNull(e);
                    done();
                });
            });
        });
    });

    it("should create procedures on API 2", function(done) {
        auth.create_procedure(server, { id: proc_id_4, api_id: api_id_2, name: "ReadConfig" }, (e, r) => {
            expect(e).toBeNull(e);
            done();
        });
    });

    it("should read multiple API", function(done) {
        auth.list_api_by_category(server, { category: "RESOURCE" }, (e, r) => {
            expect(e).toBeNull(e);
            const api_ids = [];
            let api;
            for (const apiSchema of r) {
                api_ids.push(apiSchema.id);
                if (apiSchema.id == api_id_1) {
                    api = apiSchema;
                }
            }
            expect(api_ids).toContain(api_id_2);
            expect(api.name).toEqual("Resource1");
            expect(api.address).toEqual("localhost:9001");
            done();
        });
    });

    it("should read procedures", function(done) {
        auth.list_procedure_by_api(server, { id: api_id_1 }, (e, r) => {
            expect(e).toBeNull(e);
            const proc_ids = [];
            for (const procSchema of r) {
                proc_ids.push(procSchema.id);
            }
            expect(proc_ids).toContain(proc_id_1);
            done();
        });
    });

    it("should create administrator role and access for API 1", function(done) {
        auth.create_role(server, {
            id: role_admin_id,
            api_id: api_id_1,
            name: "administrator",
            multi: false,
            ip_lock: false,
            access_duration: 900,
            refresh_duration: 28800
        }, (e, r) => {
            expect(e).toBeNull(e);
            auth.add_role_access(server, { id: role_admin_id, procedure_id: proc_id_1 }, (e, r) => {
                expect(e).toBeNull(e);
                auth.add_role_access(server, { id: role_admin_id, procedure_id: proc_id_2 }, (e, r) => {
                    expect(e).toBeNull(e);
                    auth.add_role_access(server, { id: role_admin_id, procedure_id: proc_id_3 }, (e, r) => {
                        expect(e).toBeNull(e);
                        done();
                    });
                });
            });
        });
    });

    it("should create user role and access for API 1", function(done) {
        auth.create_role(server, {
            id: role_user_1_id,
            api_id: api_id_1,
            name: "user",
            multi: true,
            ip_lock: false,
            access_duration: 900,
            refresh_duration: 604800
        }, (e, r) => {
            expect(e).toBeNull(e);
            auth.add_role_access(server, { id: role_user_1_id, procedure_id: proc_id_1 }, (e, r) => {
                expect(e).toBeNull(e);
                done();
            });
        });
    });

    it("should create user role and access for API 2", function(done) {
        auth.create_role(server, {
            id: role_user_2_id,
            api_id: api_id_2,
            name: "user",
            multi: true,
            ip_lock: false,
            access_duration: 900,
            refresh_duration: 604800
        }, (e, r) => {
            expect(e).toBeNull(e);
            auth.add_role_access(server, { id: role_user_2_id, procedure_id: proc_id_4 }, (e, r) => {
                expect(e).toBeNull(e);
                done();
            });
        });
    });

    it("should read roles on API 1", function(done) {
        auth.list_role_by_api(server, { id: api_id_1 }, (e, r) => {
            expect(e).toBeNull(e);
            const role_ids = [];
            let role;
            for (const roleSchema of r) {
                role_ids.push(roleSchema.id);
                if (roleSchema.id == role_admin_id) {
                    role = roleSchema;
                }
            }
            expect(role_ids).toContain(role_user_1_id);
            expect(role.name).toEqual("administrator");
            expect(role.multi).toEqual(false);
            expect(role.procedures).toContain(proc_id_1);
            expect(role.procedures).toContain(proc_id_2);
            expect(role.procedures).toContain(proc_id_3);
            done();
        });
    });

    it("should update API 1", function(done) {
        auth.update_api(server, { id: api_id_1, name: api_name, description: "New resource api" }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_api(server, { id: api_id_1 }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.name).toEqual(api_name);
                expect(r.description).toEqual("New resource api");
            });
            done();
        });
    });

    it("should update API 1", function(done) {
        auth.update_api(server, { id: api_id_1, name: api_name, description: "New resource api" }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_api_by_name(server, { name: api_name }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.id).toEqual(api_id_1);
                expect(r.description).toEqual("New resource api");
                done();
            });
        });
    });

    it("should update a procedure", function(done) {
        auth.update_procedure(server, { id: proc_id_1, name: proc_name, description: "Read resource data" }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_procedure_by_name(server, { api_id: api_id_1, name: proc_name }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.description).toEqual("Read resource data");
                done();
            });
        });
    });

    it("should update administrator role", function(done) {
        auth.update_role(server, { id: role_admin_id, name: role_name, ip_lock: true }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_role_by_name(server, { api_id: api_id_1, name: role_name }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.ip_lock).toEqual(true);
                done();
            });
        });
    });

    it("should create administrator user and add associated roles", function(done) {
        auth.create_user(server, {
            id: admin_id,
            name: "administrator",
            email: "admin@mail.co",
            phone: "+6281234567890",
            password: admin_password
        }, (e, r) => {
            expect(e).toBeNull(e);
            auth.add_user_role(server, { user_id: admin_id, role_id: role_admin_id }, (e, r) => {
                expect(e).toBeNull(e);
                auth.add_user_role(server, { user_id: admin_id, role_id: role_user_2_id }, (e, r) => {
                    expect(e).toBeNull(e);
                    done();
                });
            });
        });
    });

    it("should create regular user and add associated roles", function(done) {
        auth.create_user(server, {
            id: user_id,
            name: "username",
            email: "user@mail.co",
            phone: "+6281234567890",
            password: user_password
        }, (e, r) => {
            expect(e).toBeNull(e);
            auth.add_user_role(server, { user_id: user_id, role_id: role_user_1_id }, (e, r) => {
                expect(e).toBeNull(e);
                auth.add_user_role(server, { user_id: user_id, role_id: role_user_2_id }, (e, r) => {
                    expect(e).toBeNull(e);
                    done();
                });
            });
        });
    });

    it("should read users of user 2 role", function(done) {
        auth.list_user_by_role(server, { id: role_user_2_id }, (e, r) => {
            expect(e).toBeNull(e);
            const user_ids = [];
            let user;
            for (const userSchema of r) {
                user_ids.push(userSchema.id);
                if (userSchema.id == admin_id) {
                    user = userSchema;
                }
            }
            expect(user_ids).toContain(user_id);
            expect(user.name).toEqual("administrator");
            expect(user.email).toEqual("admin@mail.co");
            admin_hash = user.password;
            done();
        });
    });

    it("should update administrator user", function(done) {
        auth.update_user(server, { id: admin_id, password: "N3w_P4s5w0rd" }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_user_by_name(server, { name: "administrator" }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.password).not.toEqual(admin_hash);
                done();
            });
        });
    });

    const expire_1 = new Date(2023, 0, 1, 0, 0, 0);
    const expire_2 = new Date(2023, 0, 1, 12, 0, 0);
    const expire_3 = new Date(2023, 0, 1, 18, 0, 0);
    const auth_token = "rGKrHrDuWXt2CDbjmrt1SHbmea86wIQb";
    const ip = [192, 168, 0, 1];
    let access_id_1;
    let access_id_2;
    let access_id_3;

    it("should create access tokens", function(done) {
        auth.create_access_token(server, { user_id: admin_id, auth_token: auth_token, expire: expire_1, ip: ip }, (e, r) => {
            expect(e).toBeNull(e);
            access_id_1 = r.access_id;
            expect(r.auth_token).toEqual(auth_token);
            auth.create_access_token(server, { user_id: admin_id, auth_token: auth_token, expire: expire_1, ip: "" }, (e, r) => {
                expect(e).toBeNull(e);
                access_id_2 = r.access_id;
                expect(r.access_id).toEqual(access_id_1 + 1);
                done();
            });
        });
    });

    it("should create an auth token", function(done) {
        auth.create_auth_token(server, { user_id: admin_id, expire: expire_2, ip: ip, number: 1 }, (e, r) => {
            expect(e).toBeNull(e);
            access_id_3 = r[0].access_id;
            expect(r[0].access_id).toEqual(access_id_2 + 1);
            done();
        });
    });

    it("should read an access token", function(done) {
        auth.read_access_token(server, { access_id: access_id_2 }, (e, r) => {
            expect(e).toBeNull(e);
            expect(r.expire).toEqual(expire_1);
            done();
        });
    });

    it("should read auth tokens", function(done) {
        auth.list_auth_token(server, { auth_token: auth_token }, (e, r) => {
            expect(e).toBeNull(e);
            let token;
            for (const tokenSchema of r) {
                if (tokenSchema.access_id == access_id_1) {
                    token = tokenSchema;
                }
            }
            expect(token.user_id).toEqual(admin_id);
            expect(token.expire).toEqual(expire_1);
            expect(token.ip).toEqual(ip);
            done();
        });
    });

    it("should read tokens associated with user", function(done) {
        auth.list_token_by_user(server, { id: admin_id }, (e, r) => {
            expect(e).toBeNull(e);
            expect(r.length).toEqual(3);
            done();
        });
    });

    it("should update an access token", function(done) {
        auth.update_access_token(server, { access_id: access_id_2, expire: expire_3 }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_access_token(server, { access_id: access_id_2 }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.expire).toEqual(expire_3);
                done();
            });
        });
    });

    it("should update auth tokens", function(done) {
        auth.update_auth_token(server, { auth_token: auth_token, expire: expire_3, ip: [192, 168, 0, 100] }, (e, r) => {
            expect(e).toBeNull(e);
            auth.list_auth_token(server, { auth_token: auth_token }, (e, r) => {
                expect(r[0].expire).toEqual(expire_3);
                expect(r[0].ip).toEqual([192, 168, 0, 100]);
                done();
            });
        });
    });

    it("should login a user", function(done) {
        auth.user_login(server, {
            username: "username",
            password: user_password
        }, (e, r) => {
            expect(e).toBeNull(e);
            expect(r.user_id).toEqual(user_id);
            let api_ids = [];
            for (const tokenMap of r.access_tokens) {
                api_ids.push(tokenMap.api_id);
                if (tokenMap.api_id == api_id_1) {
                    userToken = {
                        api_id: tokenMap.api_id,
                        access_token: tokenMap.access_token,
                        refresh_token: tokenMap.refresh_token,
                        auth_token: r.auth_token,
                        user_id: r.user_id
                    };
                }
            }
            expect(api_ids).toContain(api_id_1);
            expect(api_ids).toContain(api_id_2);
            auth.list_token_by_user(server, { id: user_id }, (e, r) => {
                expect(r.length).toEqual(2);
                done();
            });
        });
    });

    it("should refresh a user", function(done) {
        setTimeout(function() {
            auth.user_refresh(server, {
                api_id: userToken.api_id,
                access_token: userToken.access_token,
                refresh_token: userToken.refresh_token
            }, (e, r) => {
                expect(e).toBeNull(e);
                expect(r.access_token).not.toEqual(userToken.access_token);
                expect(r.refresh_token).not.toEqual(userToken.refresh_token);
                done();
            });
        }, 1000); // make sure refresh requested at least 1 second later after login
    });

    it("should logout a user", function(done) {
        auth.user_logout(server, {
            user_id: userToken.user_id,
            auth_token: userToken.auth_token
        }, (e, r) => {
            expect(e).toBeNull(e);
            auth.list_token_by_user(server, { id: user_id }, (e, r) => {
                expect(r.length).toEqual(0);
                done();
            });
        });
    });

    it("should failed to delete a role", function(done) {
        auth.delete_role(server, { id: role_user_2_id }, (e, r) => {
            expect(e).not.toBeNull(e);
            done();
        });
    });

    it("should failed to delete an API", function(done) {
        auth.delete_api(server, { id: api_id_2 }, (e, r) => {
            expect(e).not.toBeNull(e);
            done();
        });
    });

    it("should failed to delete a user", function(done) {
        auth.delete_user(server, { id: user_id }, (e, r) => {
            expect(e).not.toBeNull(e);
            done();
        });
    });

    it("should delete tokens", function(done) {
        auth.delete_token_by_user(server, { id: admin_id }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_access_token(server, { access_id: access_id_1 }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should delete regular user", function(done) {
        auth.remove_user_role(server, { user_id: user_id, role_id: role_user_1_id }, (e, r) => {
            expect(e).toBeNull(e);
            auth.remove_user_role(server, { user_id: user_id, role_id: role_user_2_id }, (e, r) => {
                expect(e).toBeNull(e);
                auth.delete_user(server, { id: user_id }, (e, r) => {
                    expect(e).toBeNull(e);
                    auth.read_user(server, { id: user_id }, (e, r) => {
                        expect(e).not.toBeNull(e);
                        done();
                    });
                });
            });
        });
    });

    it("should delete user role", function(done) {
        auth.remove_user_role(server, { user_id: admin_id, role_id: role_user_2_id }, (e, r) => {
            expect(e).toBeNull(e);
            auth.remove_role_access(server, { id: role_user_2_id, procedure_id: proc_id_4 }, (e, r) => {
                expect(e).toBeNull(e);
                auth.delete_role(server, { id: role_user_2_id }, (e, r) => {
                    expect(e).toBeNull(e);
                    auth.read_role(server, { id: role_user_2_id }, (e, r) => {
                        expect(e).not.toBeNull(e);
                        done();
                    });
                });
            });
        });
    });

    it("should delete a procedure", function(done) {
        auth.delete_procedure(server, { id: proc_id_4 }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_procedure(server, { id: proc_id_4 }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

    it("should delete API 2", function(done) {
        auth.delete_api(server, { id: api_id_2 }, (e, r) => {
            expect(e).toBeNull(e);
            auth.read_api(server, { id: api_id_2 }, (e, r) => {
                expect(e).not.toBeNull(e);
                done();
            });
        });
    });

});
