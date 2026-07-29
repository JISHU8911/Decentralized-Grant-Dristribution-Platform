#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, String, Vec};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    Admin,
    GrantPlatformContract,
    GrantAllocation(u64), // grant_id -> allocated amount
    GrantDisbursed(u64),  // grant_id -> disbursed amount
    TotalVaultBalance,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct TreasuryStats {
    pub total_vault_balance: i128,
    pub total_allocated: i128,
    pub total_disbursed: i128,
}

#[contract]
pub struct GrantTreasuryContract;

#[contractimpl]
impl GrantTreasuryContract {
    /// Initialize the treasury contract with admin and core platform contract address
    pub fn initialize(env: Env, admin: Address, grant_platform: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::GrantPlatformContract, &grant_platform);
        env.storage().instance().set(&DataKey::TotalVaultBalance, &0i128);

        env.events().publish(
            (symbol_short!("treasury"), symbol_short!("init")),
            (admin, grant_platform),
        );
    }

    /// Set authorized grant platform contract address (Admin only)
    pub fn set_platform(env: Env, grant_platform: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();

        env.storage().instance().set(&DataKey::GrantPlatformContract, &grant_platform);
    }

    /// Deposit funds into the grant treasury vault for a specific grant pool
    pub fn deposit_funds(env: Env, from: Address, grant_id: u64, amount: i128) {
        from.require_auth();

        if amount <= 0 {
            panic!("Deposit amount must be positive");
        }

        let current_allocated: i128 = env
            .storage()
            .instance()
            .get(&DataKey::GrantAllocation(grant_id))
            .unwrap_or(0i128);

        let current_total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalVaultBalance)
            .unwrap_or(0i128);

        let new_allocated = current_allocated + amount;
        let new_total = current_total + amount;

        env.storage().instance().set(&DataKey::GrantAllocation(grant_id), &new_allocated);
        env.storage().instance().set(&DataKey::TotalVaultBalance, &new_total);

        // Emit deposit event
        env.events().publish(
            (symbol_short!("treasury"), symbol_short!("deposit")),
            (from, grant_id, amount),
        );
    }

    /// Disburse funds to recipient. Callable ONLY by the authorized Grant Platform contract or Admin.
    /// Inter-contract authorization point.
    pub fn disburse(env: Env, caller: Address, grant_id: u64, recipient: Address, amount: i128) -> bool {
        caller.require_auth();

        let platform_contract: Address = env
            .storage()
            .instance()
            .get(&DataKey::GrantPlatformContract)
            .expect("Platform contract not set");
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");

        if caller != platform_contract && caller != admin {
            panic!("Unauthorized caller for treasury disbursement");
        }

        let allocated: i128 = env
            .storage()
            .instance()
            .get(&DataKey::GrantAllocation(grant_id))
            .unwrap_or(0i128);

        let disbursed: i128 = env
            .storage()
            .instance()
            .get(&DataKey::GrantDisbursed(grant_id))
            .unwrap_or(0i128);

        if amount <= 0 {
            panic!("Disbursement amount must be positive");
        }

        if (disbursed + amount) > allocated {
            panic!("Exceeds allocated grant budget");
        }

        let total_vault: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalVaultBalance)
            .unwrap_or(0i128);

        if amount > total_vault {
            panic!("Insufficient vault balance");
        }

        env.storage().instance().set(&DataKey::GrantDisbursed(grant_id), &(disbursed + amount));
        env.storage().instance().set(&DataKey::TotalVaultBalance, &(total_vault - amount));

        // Emit disbursement event
        env.events().publish(
            (symbol_short!("treasury"), symbol_short!("disburse")),
            (grant_id, recipient, amount),
        );

        true
    }

    /// Get allocation and disbursed totals for a grant ID
    pub fn get_grant_budget(env: Env, grant_id: u64) -> (i128, i128) {
        let allocated: i128 = env
            .storage()
            .instance()
            .get(&DataKey::GrantAllocation(grant_id))
            .unwrap_or(0i128);
        let disbursed: i128 = env
            .storage()
            .instance()
            .get(&DataKey::GrantDisbursed(grant_id))
            .unwrap_or(0i128);
        (allocated, disbursed)
    }

    /// Get total vault balance
    pub fn get_vault_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalVaultBalance)
            .unwrap_or(0i128)
    }
}

mod test;
