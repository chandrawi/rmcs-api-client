use tonic::transport::Channel;

#[derive(Debug, Clone)]
pub struct Auth {
    pub channel: Channel
}

impl Auth {
    
    pub async fn new(addr: &str) -> Auth {
        let addr: &'static str = Box::leak(addr.to_owned().into_boxed_str());
        let channel = Channel::from_static(addr)
            .connect()
            .await
            .expect(&format!("Error making channel to {}", addr));
        Auth {
            channel
        }
    }

    pub fn new_with_channel(channel: Channel) -> Auth {
        Auth {
            channel
        }
    }

}
