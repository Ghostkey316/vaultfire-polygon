/**
 * Example: Register an AI Agent on Polygon PoS
 *
 * This example demonstrates how to register an AI agent identity using
 * the ERC-8004 Identity Registry on Polygon PoS (Chain ID: 137).
 *
 * Gas is paid in POL (formerly MATIC, rebranded Q3 2024).
 *
 * NOTE: This will throw an error until ERC8004IdentityRegistry is deployed.
 * Follow https://github.com/Ghostkey316/vaultfire-polygon for deployment updates.
 *
 * Usage:
 *   PRIVATE_KEY=0x... tsx examples/register-agent.ts
 */

import { VaultfirePolygonClient, POLYGON_CONFIG } from '../src/index.js';

async function main() {
  // ─── Setup ─────────────────────────────────────────────────────────────

  const privateKey = process.env['PRIVATE_KEY'] as `0x${string}` | undefined;

  if (!privateKey) {
    console.error('Error: PRIVATE_KEY environment variable is required');
    console.error('Usage: PRIVATE_KEY=0x... tsx examples/register-agent.ts');
    process.exit(1);
  }

  console.log('Vaultfire Protocol — Register Agent on Polygon PoS');
  console.log(`Chain: ${POLYGON_CONFIG.chain} (ID: ${POLYGON_CONFIG.chainId})`);
  console.log(`Explorer: ${POLYGON_CONFIG.explorer}`);
  console.log(`Native token: ${POLYGON_CONFIG.nativeToken}`);
  console.log('');

  // ─── Client ────────────────────────────────────────────────────────────

  const client = new VaultfirePolygonClient({
    privateKey,
    rpcUrl: POLYGON_CONFIG.rpc,
  });

  // Check deployment status before attempting
  const deploymentStatus = client.getDeploymentStatus();
  const identityRegistry = deploymentStatus['ERC8004IdentityRegistry'];

  if (!identityRegistry?.deployed) {
    console.warn('⏳ ERC8004IdentityRegistry is DEPLOY_PENDING on Polygon PoS');
    console.warn('   Registration will be available after deployment.');
    console.warn('   Follow: https://github.com/Ghostkey316/vaultfire-polygon');
    console.log('');
    console.log('Deployment status of all contracts:');
    for (const [name, status] of Object.entries(deploymentStatus)) {
      const icon = status.deployed ? '✓' : '⏳';
      console.log(`  ${icon} ${name}: ${status.address}`);
    }
    return;
  }

  // ─── Register Agent ────────────────────────────────────────────────────

  console.log('Registering agent...');

  try {
    const result = await client.registerAgent({
      name: 'my-polygon-agent',
      metadataUri: 'ipfs://QmYourMetadataHashHere',
      description: 'An AI agent operating on Polygon PoS via Vaultfire Protocol',
    });

    console.log('✓ Agent registered successfully!');
    console.log(`  Agent ID:     ${result.agentId}`);
    console.log(`  Tx Hash:      ${result.txHash}`);
    console.log(`  Block:        ${result.blockNumber}`);
    console.log(`  View on Polygonscan: ${client.getTxUrl(result.txHash)}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  }
}

main();
