use tonic::transport::Channel;

#[derive(Debug, Clone)]
pub struct Resource {
    pub channel: Channel
}

impl Resource {
    
    pub async fn new(addr: &str) -> Resource {
        let addr: &'static str = Box::leak(addr.to_owned().into_boxed_str());
        let channel = Channel::from_static(addr)
            .connect()
            .await
            .expect(&format!("Error making channel to {}", addr));
        Resource {
            channel
        }
    }

    pub fn new_with_channel(channel: Channel) -> Resource {
        Resource {
            channel
        }
    }

}
