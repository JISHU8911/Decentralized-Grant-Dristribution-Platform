#![cfg(test)]

use super::*;
use grant_treasury::GrantTreasuryContract;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_grant_creation_and_application_flow() {
    let env = Env::default();
    env.mock_all_auths();

    // Register Treasury Contract
    let treasury_id = env.register_contract(None, GrantTreasuryContract);
    let treasury_client = grant_treasury::GrantTreasuryContractClient::new(&env, &treasury_id);

    // Register Core Platform Contract
    let platform_id = env.register_contract(None, GrantPlatformContract);
    let platform_client = GrantPlatformContractClient::new(&env, &platform_id);

    let admin = Address::generate(&env);
    let funder = Address::generate(&env);
    let applicant = Address::generate(&env);

    // Initialize Treasury & Platform
    treasury_client.initialize(&admin, &platform_id);
    platform_client.initialize(&admin, &treasury_id);

    // Create Grant
    let grant_title = String::from_str(&env, "Stellar Developer Ecosystem Grant");
    let grant_cat = String::from_str(&env, "Infrastructure");
    let grant_id = platform_client.create_grant(&admin, &grant_title, &grant_cat, &100_000i128);

    assert_eq!(grant_id, 1u64);

    let grant = platform_client.get_grant(&grant_id);
    assert_eq!(grant.total_budget, 100_000i128);

    // Fund Treasury for Grant
    treasury_client.deposit_funds(&funder, &grant_id, &100_000i128);

    // Submit Application
    let app_title = String::from_str(&env, "Soroban Developer Tools Suite");
    let app_url = String::from_str(&env, "https://github.com/stellar/dev-tools");
    let app_id = platform_client.submit_application(
        &applicant,
        &grant_id,
        &app_title,
        &app_url,
        &40_000i128,
        &2u32,
    );

    assert_eq!(app_id, 1u64);

    let app = platform_client.get_application(&app_id);
    assert_eq!(app.requested_amount, 40_000i128);
    assert_eq!(app.total_milestones, 2u32);

    // Review & Approve Application
    platform_client.review_application(&admin, &app_id, &true);

    let reviewed_app = platform_client.get_application(&app_id);
    assert_eq!(reviewed_app.status, ApplicationStatus::Approved);

    // Approve Milestone & Trigger Inter-Contract Payout to Treasury
    let disburse_success = platform_client.approve_and_disburse_milestone(&admin, &app_id, &0u32);
    assert!(disburse_success);

    // Check Treasury balance updated via inter-contract call
    let (allocated, disbursed) = treasury_client.get_grant_budget(&grant_id);
    assert_eq!(allocated, 100_000i128);
    assert_eq!(disbursed, 20_000i128); // 40_000 / 2 milestones = 20_000 disbursed
}

#[test]
#[should_panic(expected = "Invalid requested amount or exceeds remaining budget")]
fn test_submit_application_exceeds_budget() {
    let env = Env::default();
    env.mock_all_auths();

    let treasury_id = env.register_contract(None, GrantTreasuryContract);
    let platform_id = env.register_contract(None, GrantPlatformContract);
    let platform_client = GrantPlatformContractClient::new(&env, &platform_id);

    let admin = Address::generate(&env);
    let applicant = Address::generate(&env);

    platform_client.initialize(&admin, &treasury_id);

    let grant_id = platform_client.create_grant(
        &admin,
        &String::from_str(&env, "Mini Grant"),
        &String::from_str(&env, "Tooling"),
        &5_000i128,
    );

    // Try requesting 10,000 when budget is only 5,000 -> Panics
    platform_client.submit_application(
        &applicant,
        &grant_id,
        &String::from_str(&env, "Overpriced App"),
        &String::from_str(&env, "https://example.com"),
        &10_000i128,
        &1u32,
    );
}

#[test]
#[should_panic(expected = "Already initialized")]
fn test_double_initialization_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let treasury_id = env.register_contract(None, GrantTreasuryContract);
    let platform_id = env.register_contract(None, GrantPlatformContract);
    let platform_client = GrantPlatformContractClient::new(&env, &platform_id);

    let admin = Address::generate(&env);

    platform_client.initialize(&admin, &treasury_id);
    // Second initialization must fail
    platform_client.initialize(&admin, &treasury_id);
}
