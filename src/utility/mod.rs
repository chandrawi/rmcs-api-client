use rsa::{RsaPrivateKey, Pkcs1v15Encrypt, RsaPublicKey};
use pkcs8::DecodePublicKey;
use spki::EncodePublicKey;
use rand::thread_rng;
use tonic::{Request, Status, service::Interceptor, metadata::MetadataValue};
pub use rmcs_auth_db::utility::{generate_access_key, generate_token_string};

pub(crate) fn generate_keys() -> Result<(RsaPrivateKey, RsaPublicKey), rsa::Error>
{
    let mut rng = thread_rng();
    let bits = 1024;
    let priv_key = RsaPrivateKey::new(&mut rng, bits)?;
    let pub_key = RsaPublicKey::from(&priv_key);
    Ok((priv_key, pub_key))
}

pub(crate) fn export_public_key(pub_key: RsaPublicKey) -> Result<Vec<u8>, spki::Error>
{
    let pub_der = pub_key.to_public_key_der()?.to_vec();
    Ok(pub_der)
}

pub(crate) fn import_public_key(pub_der: &[u8]) -> Result<RsaPublicKey, spki::Error>
{
    let pub_key = RsaPublicKey::from_public_key_der(pub_der)?;
    Ok(pub_key)
}

pub(crate) fn decrypt_message(ciphertext: &[u8], priv_key: RsaPrivateKey) -> Result<Vec<u8>, rsa::Error>
{
    priv_key.decrypt(Pkcs1v15Encrypt, ciphertext)
}

pub(crate) fn encrypt_message(message: &[u8], pub_key: RsaPublicKey) -> Result<Vec<u8>, rsa::Error>
{
    pub_key.encrypt(&mut thread_rng(), Pkcs1v15Encrypt, message)
}

pub(crate) struct TokenInterceptor(pub(crate) String);

impl Interceptor for TokenInterceptor {
    fn call(&mut self, mut request: Request<()>) -> Result<Request<()>, Status> {
        request.metadata_mut().insert(
            "authorization", 
            MetadataValue::try_from(String::from("Bearer ") + &self.0).unwrap()
        );
        Ok(request)
    }
}
