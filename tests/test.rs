#[cfg(test)]
mod tests {

    use std::process::Command;
    use std::time::{SystemTime, Duration};
    use rmcs_api_client::Auth;

    fn start_auth_server()
    {
        // start server using cargo run command
        Command::new("cargo")
            .args(["run", "-p", "rmcs-api-server", "--bin", "auth_server"])
            .spawn()
            .expect("running auth server failed");

        // wait until server process is running
        let mut count = String::from("0\n");
        let time_limit = SystemTime::now() + Duration::from_secs(30);
        while SystemTime::now() < time_limit && count == "0\n" {
            let output = Command::new("pgrep")
                .args(["-a", "auth_server", "-c"])
                .output()
                .unwrap();
            count = String::from_utf8(output.stdout)
                .unwrap();
            std::thread::sleep(Duration::from_millis(10));
        }
    }

    fn stop_auth_server()
    {
        // stop server service
        Command::new("killall")
            .args(["auth_server"])
            .spawn()
            .expect("stopping auth server failed");
    }

    #[tokio::test]
    async fn test_auth()
    {
        start_auth_server();

        // build auth client instance with address from env file
        dotenvy::dotenv().ok();
        let addr = std::env::var("ADDRESS_AUTH").unwrap();
        let addr = String::from("http://") + &addr;

        let _auth = Auth::new(&addr).await;

        stop_auth_server();
    }

}
