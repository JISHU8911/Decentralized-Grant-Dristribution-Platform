#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_treasury_initialization_and_deposit() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GrantTreasuryContract);
    let client = GrantTreasuryContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let funder = Address::generate(&env);

    client.initialize(&admin, &platform);

    let grant_id = 1u64;
    client.deposit_funds(&funder, &grant_id, &10_000_000i128);

    let balance = client.get_vault_balance();
    assert_eq!(balance, 10_000_000i128);

    let (allocated, disbursed) = client.get_grant_budget(&grant_id);
    assert_eq!(allocated, 10_000_000i128);
    assert_eq!(disbursed, 0i128);
}

#[test]
fn test_treasury_disbursement() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GrantTreasuryContract);
    let client = GrantTreasuryContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let funder = Address::generate(&env);
    let recipient = Address::generate(&env);

    client.initialize(&admin, &platform);

    let grant_id = 101u64;
    client.deposit_funds(&funder, &grant_id, &50_000i128);

    let success = client.disburse(&platform, &grant_id, &recipient, &20_000i128);
    assert!(success);

    let (allocated, disbursed) = client.get_grant_budget(&grant_id);
    assert_eq!(allocated, 50_000i128);
    assert_eq!(disbursed, 20_000i128);

    let remaining_vault = client.get_vault_balance();
    assert_eq!(remaining_vault, 30_000i128);
}

#[test]
#[should_panic(expected = "Exceeds allocated grant budget")]
fn test_treasury_disbursement_exceeds_budget() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, GrantTreasuryContract);
    let client = GrantTreasuryContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let funder = Address::generate(&env);
    let recipient = Address::generate(&env);

    client.initialize(&admin, &platform);

    let grant_id = 102u64;
    client.deposit_funds(&funder, &grant_id, &1_000i128);

    // Should fail as 2000 > 1000
    client.disburse(&platform, &grant_id, &recipient, &2_000i128);
}
