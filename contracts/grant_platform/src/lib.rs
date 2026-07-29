#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};


#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    Admin,
    TreasuryContract,
    NextGrantId,
    NextApplicationId,
    Grant(u64),
    Application(u64),
    Milestone(u64, u32), // (application_id, milestone_index)
    UserRole(Address),
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum Role {
    Admin = 1,
    Reviewer = 2,
    Grantee = 3,
    CommunityMember = 4,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum GrantStatus {
    Draft = 0,
    Active = 1,
    Completed = 2,
    Cancelled = 3,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum ApplicationStatus {
    Submitted = 0,
    UnderReview = 1,
    Approved = 2,
    Rejected = 3,
    MilestonesCompleted = 4,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Grant {
    pub id: u64,
    pub creator: Address,
    pub title: String,
    pub category: String,
    pub total_budget: i128,
    pub remaining_budget: i128,
    pub status: GrantStatus,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Application {
    pub id: u64,
    pub grant_id: u64,
    pub applicant: Address,
    pub project_title: String,
    pub proposal_url: String,
    pub requested_amount: i128,
    pub total_milestones: u32,
    pub completed_milestones: u32,
    pub status: ApplicationStatus,
    pub submitted_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Milestone {
    pub application_id: u64,
    pub milestone_index: u32,
    pub description: String,
    pub payout_amount: i128,
    pub is_approved: bool,
    pub is_disbursed: bool,
}

#[contract]
pub struct GrantPlatformContract;

#[contractimpl]
impl GrantPlatformContract {
    /// Initialize Core Grant Platform with Admin and Treasury Contract address
    pub fn initialize(env: Env, admin: Address, treasury_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TreasuryContract, &treasury_contract);
        env.storage().instance().set(&DataKey::NextGrantId, &1u64);
        env.storage().instance().set(&DataKey::NextApplicationId, &1u64);
        env.storage().instance().set(&DataKey::UserRole(admin.clone()), &Role::Admin);

        env.events().publish(
            (symbol_short!("grant"), symbol_short!("init")),
            (admin, treasury_contract),
        );
    }

    /// Grant or update user role (Admin only)
    pub fn set_role(env: Env, admin: Address, user: Address, role: Role) {
        admin.require_auth();
        let current_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        if admin != current_admin {
            panic!("Only admin can assign roles");
        }

        env.storage().instance().set(&DataKey::UserRole(user.clone()), &role);
        
        env.events().publish(
            (symbol_short!("role"), symbol_short!("granted")),
            (user, role as u32),
        );
    }

    /// Update Treasury Contract Address (Admin only)
    pub fn set_treasury(env: Env, admin: Address, treasury_contract: Address) {
        admin.require_auth();
        let current_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        if admin != current_admin {
            panic!("Only admin can set treasury");
        }

        env.storage().instance().set(&DataKey::TreasuryContract, &treasury_contract);
    }

    /// Create a new Grant program (Admin or Reviewer)
    pub fn create_grant(
        env: Env,
        creator: Address,
        title: String,
        category: String,
        total_budget: i128,
    ) -> u64 {
        creator.require_auth();

        if total_budget <= 0 {
            panic!("Budget must be positive");
        }

        let grant_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextGrantId)
            .unwrap_or(1u64);

        let grant = Grant {
            id: grant_id,
            creator: creator.clone(),
            title: title.clone(),
            category: category.clone(),
            total_budget,
            remaining_budget: total_budget,
            status: GrantStatus::Active,
            created_at: env.ledger().timestamp(),
        };

        env.storage().instance().set(&DataKey::Grant(grant_id), &grant);
        env.storage().instance().set(&DataKey::NextGrantId, &(grant_id + 1));

        env.events().publish(
            (symbol_short!("grant"), symbol_short!("created")),
            (grant_id, creator, total_budget),
        );

        grant_id
    }

    /// Submit a Grant Application
    pub fn submit_application(
        env: Env,
        applicant: Address,
        grant_id: u64,
        project_title: String,
        proposal_url: String,
        requested_amount: i128,
        total_milestones: u32,
    ) -> u64 {
        applicant.require_auth();

        let mut grant: Grant = env
            .storage()
            .instance()
            .get(&DataKey::Grant(grant_id))
            .expect("Grant not found");

        if grant.status != GrantStatus::Active {
            panic!("Grant is not active");
        }

        if requested_amount <= 0 || requested_amount > grant.remaining_budget {
            panic!("Invalid requested amount or exceeds remaining budget");
        }

        if total_milestones == 0 {
            panic!("Must specify at least 1 milestone");
        }

        let app_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextApplicationId)
            .unwrap_or(1u64);

        let application = Application {
            id: app_id,
            grant_id,
            applicant: applicant.clone(),
            project_title: project_title.clone(),
            proposal_url: proposal_url.clone(),
            requested_amount,
            total_milestones,
            completed_milestones: 0,
            status: ApplicationStatus::Submitted,
            submitted_at: env.ledger().timestamp(),
        };

        env.storage().instance().set(&DataKey::Application(app_id), &application);
        env.storage().instance().set(&DataKey::NextApplicationId, &(app_id + 1));

        // Create default milestone placeholders
        let milestone_payout = requested_amount / (total_milestones as i128);
        for idx in 0..total_milestones {
            let milestone = Milestone {
                application_id: app_id,
                milestone_index: idx,
                description: String::from_str(&env, "Project Milestone"),
                payout_amount: milestone_payout,
                is_approved: false,
                is_disbursed: false,
            };
            env.storage().instance().set(&DataKey::Milestone(app_id, idx), &milestone);
        }

        env.events().publish(
            (symbol_short!("app"), symbol_short!("submit")),
            (app_id, grant_id, applicant, requested_amount),
        );

        app_id
    }

    /// Review & Approve/Reject an application (Admin or Reviewer)
    pub fn review_application(env: Env, reviewer: Address, application_id: u64, approve: bool) {
        reviewer.require_auth();

        let mut application: Application = env
            .storage()
            .instance()
            .get(&DataKey::Application(application_id))
            .expect("Application not found");

        if application.status != ApplicationStatus::Submitted && application.status != ApplicationStatus::UnderReview {
            panic!("Application cannot be reviewed in current state");
        }

        if approve {
            application.status = ApplicationStatus::Approved;
            
            // Deduct grant remaining budget
            let mut grant: Grant = env
                .storage()
                .instance()
                .get(&DataKey::Grant(application.grant_id))
                .expect("Grant not found");
            grant.remaining_budget -= application.requested_amount;
            env.storage().instance().set(&DataKey::Grant(grant.id), &grant);
        } else {
            application.status = ApplicationStatus::Rejected;
        }

        env.storage().instance().set(&DataKey::Application(application_id), &application);

        env.events().publish(
            (symbol_short!("app"), symbol_short!("review")),
            (application_id, reviewer, approve),
        );
    }

    /// Approve milestone and execute Inter-Contract Treasury Call to disburse funds to applicant!
    /// Demonstrates Inter-Contract Communication between Core Contract & Treasury Contract.
    pub fn approve_and_disburse_milestone(
        env: Env,
        reviewer: Address,
        application_id: u64,
        milestone_index: u32,
    ) -> bool {
        reviewer.require_auth();

        let mut app: Application = env
            .storage()
            .instance()
            .get(&DataKey::Application(application_id))
            .expect("Application not found");

        if app.status != ApplicationStatus::Approved && app.status != ApplicationStatus::UnderReview {
            panic!("Application must be approved to release milestones");
        }

        let mut milestone: Milestone = env
            .storage()
            .instance()
            .get(&DataKey::Milestone(application_id, milestone_index))
            .expect("Milestone not found");

        if milestone.is_disbursed {
            panic!("Milestone already disbursed");
        }

        milestone.is_approved = true;
        milestone.is_disbursed = true;
        app.completed_milestones += 1;

        if app.completed_milestones >= app.total_milestones {
            app.status = ApplicationStatus::MilestonesCompleted;
        }

        env.storage().instance().set(&DataKey::Milestone(application_id, milestone_index), &milestone);
        env.storage().instance().set(&DataKey::Application(application_id), &app);

        // Fetch Treasury Contract Address
        let treasury_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::TreasuryContract)
            .expect("Treasury contract not set");

        // INTER-CONTRACT CALL TO TREASURY CONTRACT
        // Invoke disburse on Treasury Contract passing self address as authorized caller
        let current_contract = env.current_contract_address();

        // Cross-Contract Call via Soroban Invoke
        let disburse_args = (
            current_contract,
            app.grant_id,
            app.applicant.clone(),
            milestone.payout_amount,
        );

        let success: bool = env.invoke_contract(
            &treasury_addr,
            &Symbol::new(&env, "disburse"),
            soroban_sdk::vec![
                &env,
                disburse_args.0.into_val(&env),
                disburse_args.1.into_val(&env),
                disburse_args.2.into_val(&env),
                disburse_args.3.into_val(&env),
            ],
        );

        env.events().publish(
            (symbol_short!("milestone"), symbol_short!("disburse")),
            (application_id, milestone_index, app.applicant, milestone.payout_amount),
        );

        success
    }

    /// Read Grant details
    pub fn get_grant(env: Env, grant_id: u64) -> Grant {
        env.storage()
            .instance()
            .get(&DataKey::Grant(grant_id))
            .expect("Grant not found")
    }

    /// Read Application details
    pub fn get_application(env: Env, app_id: u64) -> Application {
        env.storage()
            .instance()
            .get(&DataKey::Application(app_id))
            .expect("Application not found")
    }
}

mod test;
