use axum::{
    error_handling::HandleErrorLayer, http::StatusCode, response::IntoResponse, routing::get,
    BoxError, Router,
};
use axum_login::{tower_sessions::SessionManagerLayer, AuthManagerLayerBuilder};
use chrono::prelude::*;
use environment::load_environment;
use std::{net::SocketAddr, sync::Arc};
use tower::ServiceBuilder;

use tower_sessions::{cookie::time::Duration, mongodb::Client, Expiry, MongoDBStore};
use web_htmx::{livereload, routes as web_routes, state::WebHtmxState};

mod environment;

#[tokio::main]
async fn main() {
    let env = load_environment();

    // Create WebHtmxState
    // This is how you can inject dependencies into the web-htmx crate
    // like a backend service
    // TODO: include an example
    let web_htmx_state = WebHtmxState {
        flash_config: axum_flash::Config::new(axum_flash::Key::generate()),
    };

    let app = Router::new()
        .merge(web_routes(web_htmx_state))
        .route("/healthcheck", get(get_health_check));

    #[cfg(debug_assertions)]
    let app = app.layer(livereload::layer());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .expect("Failed to start server");
}

async fn get_health_check() -> impl IntoResponse {
    "OK"
}
