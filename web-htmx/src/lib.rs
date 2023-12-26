use axum::{
    middleware,
    response::{Html, Redirect},
    routing::get,
    Router,
};
use axum_login::login_required;
use http::StatusCode;
use mongo_user_repository::MongoUserStore;
use rscx::html;
use state::WebHtmxState;

use web_client::routes as client_routes;

//##PLOP USE RESOURCE HOOK##
use components::{not_found_message::NotFoundMessage, page::PageLayout};
use context::provide_context_layer;
use resources::assessments::assessments_routes;
use resources::assigned_tags::assigned_tags_routes;
use resources::auth::login_routes;
use resources::csv_upload::csv_upload_routes;
use resources::locations::locations_routes;
use resources::selected_worksite::selected_worksite_routes;
use resources::shift_assignments::shift_assignments_routes;
use resources::shifts::shifts_routes;
use resources::support::support_routes;
use resources::tags::tags_routes;
use resources::users::users_routes;
use resources::workers::workers_routes;
use resources::worksite::worksite_routes;
use routes::{CLIENT, HOME, HOME_REDIRECT, PLAYGROUND};

pub mod components;
pub mod context;
pub mod livereload;
pub mod playground;
pub mod resources;
mod routes;
pub mod state;

pub fn routes(state: WebHtmxState) -> Router {
    Router::new()
        .with_state(state.clone())
        //##PLOP MERGE ROUTE HOOK##
        .merge(support_routes())
        .merge(selected_worksite_routes(state.clone()))
        .merge(assessments_routes(state.clone()))
        .merge(csv_upload_routes(state.clone()))
        .merge(shift_assignments_routes(state.clone()))
        .merge(shifts_routes(state.clone()))
        .merge(locations_routes(state.clone()))
        .merge(tags_routes(state.clone()))
        .merge(worksite_routes(state.clone()))
        .merge(workers_routes(state.clone()))
        .merge(assigned_tags_routes(state.clone()))
        .merge(users_routes(state.clone()))
        // Anything above this RequireAuth route will require authentication
        .route_layer(login_required!(MongoUserStore, login_url = routes::login()))
        .merge(login_routes(state.clone()))
        .route(HOME, get(Redirect::temporary(HOME_REDIRECT)))
        .nest(PLAYGROUND, playground::routes())
        .nest_service(CLIENT, client_routes())
        .fallback(fallback)
        .layer(middleware::from_fn_with_state(state, provide_context_layer))
}

async fn fallback() -> (StatusCode, Html<String>) {
    let not_found = html! {
        <PageLayout header="Oops!">
            <NotFoundMessage />
        </PageLayout>
    };

    (StatusCode::NOT_FOUND, Html(not_found))
}
