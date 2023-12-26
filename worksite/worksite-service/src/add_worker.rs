use std::sync::Arc;

use thiserror::Error;

use crate::{
    models::{Address, Worker},
    ports::worksite_repository::WorksiteRepository,
};

#[derive(Clone)]
pub struct AddWorker {
    pub worksite_repository: Arc<dyn WorksiteRepository>,
}

#[derive(Clone, Debug)]
pub struct AddWorkerInput {
    pub worksite_id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub street_address: String,
    pub city: String,
    pub region: String,
    pub postal_code: String,
}

// Change the return type, if needed
pub type AddWorkerOutput = Result<(), AddWorkerFailure>;

impl AddWorker {
    pub async fn add_worker(&self, input: AddWorkerInput) -> AddWorkerOutput {
        let worksite = &self
            .worksite_repository
            .get_worksite(input.worksite_id)
            .await
            .map_err(|e| AddWorkerFailure::Unknown(e.to_string()))?
            .ok_or(AddWorkerFailure::NotFound)?;

        // TODO! Implement uuid generation as a port
        let worker = Worker {
            id: uuid::Uuid::new_v4().to_string(),
            first_name: input.first_name,
            last_name: input.last_name,
            assessments: Vec::new(),
            tags: Vec::new(),
            email: input.email,
            address: Some(Address {
                street_address: input.street_address,
                city: input.city,
                region: input.region,
                postal_code: input.postal_code,
            }),
        };

        let updated_worksite = worksite.add_worker(worker.clone());

        self.worksite_repository
            .save(updated_worksite)
            .await
            .map_err(|e| AddWorkerFailure::Unknown(e.to_string()))?;

        Ok(())
    }
}

#[derive(Error, Debug, PartialEq)]
pub enum AddWorkerFailure {
    #[error("Worksite does not exist")]
    NotFound,
    #[error("Something went wrong")]
    Unknown(String),
}
