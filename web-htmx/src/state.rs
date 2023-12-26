use auth_service::service::AuthService;
use axum::extract::FromRef;
use std::sync::Arc;
use worksite_service::service::WorksiteService;

#[derive(Clone)]
pub struct WebHtmxState {
    pub flash_config: axum_flash::Config,
}

impl FromRef<WebHtmxState> for axum_flash::Config {
    fn from_ref(state: &WebHtmxState) -> axum_flash::Config {
        state.flash_config.clone()
    }
}
