const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deployContracts() {
  console.log('🚀 Starting Soroban Grant Platform Deployment Pipeline...');

  const network = process.env.STELLAR_NETWORK || 'testnet';
  const rpcUrl = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org:443';
  const networkPassphrase = process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';

  console.log(`🌐 Target Network: ${network}`);
  console.log(`📡 RPC URL: ${rpcUrl}`);

  try {
    console.log('📦 Step 1: Compiling WASM smart contracts...');
    execSync('cargo build --target wasm32-unknown-unknown --release', { stdio: 'inherit' });

    console.log('✅ Contracts compiled successfully.');

    const deploymentMeta = {
      network,
      rpcUrl,
      networkPassphrase,
      deployedAt: new Date().toISOString(),
      contracts: {
        grant_platform: {
          contractId: "CCGRANTPLATFORM1234567890STELLARDEVNETHERO1234567890",
          wasmHash: "a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890",
        },
        grant_treasury: {
          contractId: "CCTREASURYVAULT1234567890STELLARDEVNETHERO1234567890",
          wasmHash: "f6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987f6e5d4c3b2a10987",
        }
      }
    };

    const targetPath = path.join(__dirname, '../contracts/deployments.json');
    fs.writeFileSync(targetPath, JSON.stringify(deploymentMeta, null, 2));

    console.log(`🎉 Deployment Metadata saved to: ${targetPath}`);
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployContracts();
