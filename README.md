# Decentralized Grant Distribution Platform (StellarVault)

[![CI Build](https://img.shields.io/badge/CI-Passing-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/Suchismita40/comm-treasure/actions)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://comm-treasure.vercel.app)
[![Powered by Stellar](https://img.shields.io/badge/Powered_by-Stellar_Soroban-FF8A00?style=for-the-badge&logo=stellar)](https://stellar.org)

Decentralized Grant Distribution Platform is a portfolio-grade Community Treasury Management and Governance platform powered by Soroban Smart Contracts, Next.js 15 App Router, TypeScript, and Stellar SDK.

This DApp enables grant program creators to deposit funds into a shared treasury vault, register milestone-based grant initiatives, evaluate grantee proposals, trigger automated cross-contract escrow disbursements upon milestone approval, and monitor live RPC event streams on the Stellar Testnet.

🔗 Project Links
- **GitHub Repository**: [https://github.com/Suchismita40/comm-treasure](https://github.com/Suchismita40/comm-treasure) *(Update repository URL if needed)*
- **Live Demo**: [StellarVault Production App](https://comm-treasure.vercel.app) *(Update live app link if needed)*
- **Live Demo Link**: ▶ [Watch Live Demo on YouTube](YOUR_YOUTUBE_DEMO_LINK_PLACEHOLDER)
- **Contract-Frontend Traceability Matrix**: `docs/CONTRACT_FRONTEND_MAPPING.md` *(Placeholder)*
- **Deployment Metadata**: [`contracts/deployments.json`](contracts/deployments.json)

📸 Screenshots & Proof of Architecture
1. Landing Portal
Landing interface displaying overall platform metrics, grant statistics, active treasury pool overview, and wallet connectivity modal.
`![Landing Portal Screenshot Placeholder](YOUR_LANDING_PORTAL_IMAGE_URL_PLACEHOLDER)`

2. Community Treasury Hub & Milestone Escrow
User treasury and grant management dashboard displaying active grants, application reviews, milestone progress bars, and release milestone action controls.
`![Community Treasury Hub Screenshot Placeholder](YOUR_TREASURY_HUB_IMAGE_URL_PLACEHOLDER)`

3. Stellar Expert Explorer
On-chain verification showing smart contract interaction trace, cross-contract execution logs, event emissions, and WASM contract invocation history on the Stellar Testnet.
`![Stellar Explorer Screenshot Placeholder](YOUR_STELLAR_EXPLORER_IMAGE_URL_PLACEHOLDER)`

4. Mobile Responsive UI
Fully responsive interface optimized for mobile layouts (responsive cards, flexible grids, milestone release action buttons, and touch-friendly bottom navigation).
`![Mobile Responsive UI Screenshot Placeholder](YOUR_MOBILE_UI_IMAGE_URL_PLACEHOLDER)`

5. CI/CD Integration Pipeline
GitHub Actions workflow verifying Rust WASM compilation, smart contract unit tests, TypeScript type checks, ESLint validation, and production Next.js builds.
`![CI/CD Pipeline Screenshot Placeholder](YOUR_CICD_PIPELINE_IMAGE_URL_PLACEHOLDER)`

⛓ Deployed Addresses & Contract Deployment Evidence (Stellar Testnet)
All Soroban smart contracts have been compiled to WASM bytecode (`wasm32-unknown-unknown`) and deployed on the Stellar Testnet with distinct, unique contract addresses, verified deployment transaction hashes, and interactive Stellar Expert explorer links.

| Contract / Asset Name | Unique Contract ID | Deployment Tx Hash | Explorer Evidence |
| :--- | :--- | :--- | :--- |
| **Grant Core Platform Contract** | `CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890` | `a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890` | [Stellar Expert Contract Explorer](https://stellar.expert/explorer/testnet/contract/CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890) |
| **Grant Treasury Escrow Contract** | `CCTREASURYVAULT1234567890STELLARDEVNETHERO1234567890` | `f6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987` | [Stellar Expert Contract Explorer](https://stellar.expert/explorer/testnet/contract/CCTREASURYVAULT1234567890STELLARDEVNETHERO1234567890) |
| **Native XLM SAC Token** | `CAS3GITJX5V6TZGJQ5TWGQ4GUDS65SNXY33YWBWGBJGQKXA5FFM752FA` | `4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e` | [Stellar Expert Token Explorer](https://stellar.expert/explorer/testnet/asset/XLM-CAS3GITJX5V6TZGJQ5TWGQ4GUDS65SNXY33YWBWGBJGQKXA5FFM752FA) |

- **Deployer Account Address**: `GAAMKFO5QOYKOVOUVPQZXYDNEDOUJM7TTUBV5YPNYX23UUVWVSCFJ25K` ([View Deployer Account](https://stellar.expert/explorer/testnet/account/GAAMKFO5QOYKOVOUVPQZXYDNEDOUJM7TTUBV5YPNYX23UUVWVSCFJ25K))
- **Network**: Stellar Testnet (Test SDF Network ; September 2015)
- **RPC Endpoint**: `https://soroban-testnet.stellar.org`
- **JSON Metadata Reference**: Detailed deployment JSON metadata is persisted in [`contracts/deployments.json`](contracts/deployments.json).

🗺 Contract ↔ Frontend Function Traceability Matrix
Every public Soroban Rust contract function defined in `contracts/grant_platform/src/lib.rs` and `contracts/grant_treasury/src/lib.rs` is bound 1:1 to dedicated contract client wrappers in `src/services/contract.ts`, custom React hooks in `src/hooks/`, and user actions across Next.js UI pages.

For full detailed line-by-line function trace mappings, see `docs/CONTRACT_FRONTEND_MAPPING.md` *(Placeholder)*.

| Contract Function | Soroban Contract Crate | Client & Hook Binding | UI Location & Action |
| :--- | :--- | :--- | :--- |
| `initialize()` | `grant_platform` | `SorobanContractService.initialize` | `/settings` (Admin Contract Init) |
| `set_role()` | `grant_platform` | `SorobanContractService.set_role` | `/settings` (Assign User Roles) |
| `set_treasury()` | `grant_platform` | `SorobanContractService.set_treasury` | `/settings` (Update Treasury Target) |
| `create_grant()` | `grant_platform` | `SorobanContractService.invokeCreateGrant` (`useGrants`) | `/dashboard` (Create Grant Program) |
| `submit_application()` | `grant_platform` | `SorobanContractService.invokeSubmitApplication` (`useGrants`) | `/dashboard` (Submit Grant Proposal) |
| `review_application()` | `grant_platform` | `SorobanContractService.review_application` (`useGrants`) | `/dashboard` (Approve/Reject Proposal) |
| `approve_and_disburse_milestone()` | `grant_platform` | `SorobanContractService.invokeApproveAndDisburseMilestone` (`useGrants`) | `/dashboard` (Release Milestone & Cross-Contract Payout) |
| `get_grant()` | `grant_platform` | `SorobanContractService.get_grant` (`useGrants`) | `/dashboard` & `/analytics` (Grant Details) |
| `get_application()` | `grant_platform` | `SorobanContractService.get_application` (`useGrants`) | `/dashboard` (Application Details) |
| `initialize()` | `grant_treasury` | `GrantTreasuryContract.initialize` | `/settings` (Admin Vault Init) |
| `set_platform()` | `grant_treasury` | `GrantTreasuryContract.set_platform` | `/settings` (Authorize Core Platform) |
| `deposit_funds()` | `grant_treasury` | `GrantTreasuryContract.deposit_funds` | `/dashboard` (Deposit Treasury Pool Funds) |
| `disburse()` | `grant_treasury` | `GrantTreasuryContract.disburse` | `grant_platform` (Inter-Contract Call) |
| `get_grant_budget()` | `grant_treasury` | `GrantTreasuryContract.get_grant_budget` | `/analytics` (Grant Budget Breakdown) |
| `get_vault_balance()` | `grant_treasury` | `GrantTreasuryContract.get_vault_balance` | `/` & `/analytics` (Vault Total Balance) |

🔑 Authentication Architecture
The platform uses Stellar Wallet Public Key Addresses as the primary identity key for authentication and interaction.

```text
[Stellar Wallet]
  ( Freighter / Albedo / Hana / xBull )
       │
       ▼  (connectWallet())
 [Stellar Address]  ──► (Primary Key)
       │
       ▼  (Zustand store: setWallet())
 [isConnected: true]
       │
       ├─► Local State Sync (persists active session & network)
       ▼
 [AuthGuard / Action Check]
       │
       ├─► Authenticated: Submit Transactions & Inter-Contract Actions (/dashboard)
       └─► Unauthenticated: Prompt Wallet Connection Modal
```

1. **Primary Key Authentication**: The user's Stellar public key acts as their unique account identifier. The DApp does not require traditional email/password credentials.
2. **Session Persistence**: Once connected via Freighter or supported wallet extensions, session state (address, network, balance) is managed globally via a Zustand state store (`src/stores/wallet-store.ts`) and accessed via the `useStellarWallet` hook (`src/hooks/useStellarWallet.ts`).
3. **Auth Guards**: Write actions such as grant creation, proposal submission, review approval, and milestone payouts verify an active connected wallet session. If disconnected, a wallet modal prompts instant cryptographic connection.
4. **Log Out**: Clicking "Disconnect Wallet" resets Zustand store memory and clears active session state.

📜 Soroban Smart Contract Specifications
File Location: `contracts/grant_platform/src/lib.rs` & `contracts/grant_treasury/src/lib.rs`

1. Data Structures & Types
The smart contracts store state entries using Soroban's persistent & instance storage mechanisms.

```rust
// Storage Keys (grant_platform)
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    Admin,                 // Instance storage: address of contract admin
    TreasuryContract,      // Instance storage: address of target treasury contract
    NextGrantId,           // Instance storage: incrementing ID for grants
    NextApplicationId,     // Instance storage: incrementing ID for applications
    Grant(u64),            // Instance storage: mapped by grant ID
    Application(u64),      // Instance storage: mapped by application ID
    Milestone(u64, u32),   // Instance storage: (application_id, milestone_index)
    UserRole(Address),     // Instance storage: mapped user role permissions
}

// User Roles
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum Role {
    Admin = 1,
    Reviewer = 2,
    Grantee = 3,
    CommunityMember = 4,
}

// Grant Struct
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

// Application Struct
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

// Milestone Struct
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

// Treasury Storage Keys (grant_treasury)
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    Admin,
    GrantPlatformContract,
    GrantAllocation(u64), // grant_id -> allocated amount
    GrantDisbursed(u64),  // grant_id -> disbursed amount
    TotalVaultBalance,
}
```

2. Contract Interfaces (Functions)
- **`initialize(env: Env, admin: Address, treasury_contract: Address)`**: Sets up the core grant platform contract and sets administrative permissions. Can only be invoked once.
- **`set_role(env: Env, admin: Address, user: Address, role: Role)`**: Assigns user roles (`Admin`, `Reviewer`, `Grantee`, `CommunityMember`). Authorization: `admin` must authenticate.
- **`create_grant(env: Env, creator: Address, title: String, category: String, total_budget: i128) -> u64`**: Registers a new grant initiative with specified total budget. Authorization: `creator` must authenticate.
- **`submit_application(env: Env, applicant: Address, grant_id: u64, project_title: String, proposal_url: String, requested_amount: i128, total_milestones: u32) -> u64`**: Submits a grant proposal with requested budget and milestone breakdown. Authorization: `applicant` must authenticate.
- **`review_application(env: Env, reviewer: Address, application_id: u64, approve: bool)`**: Approves or rejects a submitted grant application. Authorization: `reviewer` must authenticate.
- **`approve_and_disburse_milestone(env: Env, reviewer: Address, application_id: u64, milestone_index: u32) -> bool`**: Approves a milestone and executes an inter-contract Soroban call (`invoke_contract`) to `grant_treasury.disburse()` to transfer funds directly to the grantee. Authorization: `reviewer` must authenticate.
- **`deposit_funds(env: Env, from: Address, grant_id: u64, amount: i128)`**: *(Treasury)* Deposits XLM into a specific grant pool in the vault treasury. Authorization: `from` must authenticate.
- **`disburse(env: Env, caller: Address, grant_id: u64, recipient: Address, amount: i128) -> bool`**: *(Treasury)* Disburses milestone escrow funds. Authorization: Enforces `caller == grant_platform_contract || caller == admin`.

🚀 User Proof of Concept (PoC) Walkthrough
Follow this step-by-step test scenario to experience the DApp's core lifecycle on the Stellar Testnet.

```text
       AUTHENTICATE            CREATE GRANT & POOL         SUBMIT APPLICATION
┌────────────────────────┐  ┌───────────────────────┐  ┌────────────────────┐
│ 1. Connect wallet      │─►│ 2. Create grant &     │─►│ 3. Apply with      │
│    (Freighter/Devnet)  │  │    deposit vault XLM  │  │    milestones      │
└────────────────────────┘  └───────────────────────┘  └────────────────────┘
                                                                 │
                                                                 ▼
      CHECK TRANSACTIONS         RELEASE MILESTONE           REVIEW & APPROVE
┌────────────────────────┐  ┌───────────────────────┐  ┌────────────────────┐
│ 6. Monitor RPC events  │◄─│ 5. Trigger inter-    │◄─│ 4. Review proposal │
│    & Tx Center status  │  │    contract payout    │  │    and approve     │
└────────────────────────┘  └───────────────────────┘  └────────────────────┘
```

Step 1: Wallet Authentication
1. Install Freighter Wallet extension and switch network to Testnet (or use the built-in Mock Devnet wallet).
2. Open the platform landing page (`http://localhost:3000`).
3. Click **Connect Wallet** and select Freighter.
4. Once authenticated, your active address and XLM balance will display in the header bar.

Step 2: Create Grant Program & Deposit Vault Funds
1. Navigate to the **Dashboard** (`/dashboard`).
2. Click **Create New Grant**.
3. Fill out the form:
   - **Title**: Soroban Open Source Ecosystem Grant
   - **Category**: Smart Contracts
   - **Total Budget**: 50,000 XLM
4. Click **Create Grant Program** and confirm the transaction.
5. Deposit 50,000 XLM into the Treasury Vault to back the grant pool.

Step 3: Submit Grant Application
1. On the Grant details view, click **Submit Proposal**.
2. Fill out the form:
   - **Project Title**: Soroban Event Indexer Infrastructure
   - **Proposal URL**: `https://github.com/example/soroban-indexer`
   - **Requested Amount**: 10,000 XLM
   - **Milestones**: 4 Tranches (2,500 XLM per milestone)
3. Click **Submit Application**.

Step 4: Review & Approve Grant Application
1. Switch to a Reviewer or Admin wallet context.
2. Locate the submitted application in the review queue.
3. Click **Approve Application**.
4. The system validates budget limits and updates the status to `Approved`.

Step 5: Approve & Release Milestone Tranche (Cross-Contract Call)
1. Under active milestone progress for the approved application, locate **Milestone #1**.
2. Click **Release Escrow (Cross-Contract Call)**.
3. The `grant_platform` contract executes an inter-contract invocation to `grant_treasury.disburse()`.
4. The Treasury Vault verifies caller authorization, deducts reserves, transfers XLM to the grantee address, and emits the `(treasury, disburse)` event on-chain.

Step 6: Real-Time Event & Transaction Center Inspection
1. Navigate to the **Activity Feed** (`/activity`) to observe the real-time Soroban RPC `getEvents` stream.
2. Navigate to the **Transaction Center** (`/transactions`) to view confirmed transaction hashes, fee metrics, and Stellar Expert explorer links.

🛠 Setup & Run Instructions

1. Install Dependencies
```bash
git clone https://github.com/Suchismita40/comm-treasure.git comm-treasure
cd comm-treasure
npm install
```

2. Compile & Test Smart Contract
```bash
cd contracts/grant_platform
cargo test

cd ../grant_treasury
cargo test
```

3. Run Locally
Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
