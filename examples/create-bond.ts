/**
 * Example: Create AI Partnership & Accountability Bonds on Polygon PoS
 *
 * AI Partnership Bonds and AI Accountability Bonds are the stars of the
 * Vaultfire Protocol. They establish formalized, stake-backed commitments
 * between AI agents and their counterparts.
 *
 * Collateral is locked in POL (formerly MATIC, rebranded Q3 2024):
 *   Bronze:   0.01 POL
 *   Silver:   0.05 POL
 *   Gold:     0.10 POL
 *   Platinum: 0.50 POL
 *
 * NOTE: Contracts are DEPLOY_PENDING. This example shows the intended usage.
 * Follow https://github.com/Ghostkey316/vaultfire-polygon for deployment updates.
 *
 * Usage:
 *   PRIVATE_KEY=0x... COUNTERPARTY=0x... tsx examples/create-bond.ts
 */

import {
  VaultfirePolygonClient,
  BondTier,
  PartnershipType,
  BOND_TIER_POL,
  POLYGON_CONFIG,
} from '../src/index.js';

async function main() {
  // ─── Setup ─────────────────────────────────────────────────────────────

  const privateKey = process.env['PRIVATE_KEY'] as `0x${string}` | undefined;
  const counterparty = process.env['COUNTERPARTY'] as `0x${string}` | undefined;

  if (!privateKey || !counterparty) {
    console.error('Error: PRIVATE_KEY and COUNTERPARTY environment variables are required');
    console.error('Usage: PRIVATE_KEY=0x... COUNTERPARTY=0x... tsx examples/create-bond.ts');
    process.exit(1);
  }

  console.log('Vaultfire Protocol — Create Bonds on Polygon PoS');
  console.log(`Chain: ${POLYGON_CONFIG.chain} (ID: ${POLYGON_CONFIG.chainId})`);
  console.log(`Native token: ${POLYGON_CONFIG.nativeToken} (formerly MATIC)`);
  console.log('');

  // ─── Bond Tier Overview ─────────────────────────────────────────────────

  console.log('Available Bond Tiers:');
  for (const tier of Object.values(BondTier)) {
    console.log(`  ${tier}: ${BOND_TIER_POL[tier]} POL collateral`);
  }
  console.log('');

  console.log('Available Partnership Types:');
  for (const type of Object.values(PartnershipType)) {
    console.log(`  - ${type}`);
  }
  console.log('');

  // ─── Client ────────────────────────────────────────────────────────────

  const client = new VaultfirePolygonClient({ privateKey });

  // Show deployment status
  const status = client.getDeploymentStatus();
  const partnershipDeployed = status['AIPartnershipBondsV2']?.deployed;
  const accountabilityDeployed = status['AIAccountabilityBondsV2']?.deployed;

  if (!partnershipDeployed) {
    console.warn('⏳ AIPartnershipBondsV2 is DEPLOY_PENDING on Polygon PoS');
    console.warn('   Bond creation will be available after deployment.');
    console.warn('   Follow: https://github.com/Ghostkey316/vaultfire-polygon');
    console.log('');
    console.log('Here is what the bond creation calls will look like once deployed:');
    console.log('');
  }

  // ─── Partnership Bond (example / preview) ──────────────────────────────

  console.log('── Partnership Bond Example ──');
  console.log('Creates a Gold-tier collaboration bond (0.1 POL collateral)');
  console.log('');
  console.log('  await client.createPartnershipBond({');
  console.log(`    counterparty: '${counterparty}',`);
  console.log(`    tier: BondTier.Gold,`);
  console.log(`    partnershipType: PartnershipType.OracleConsumer,`);
  console.log(`    termsUri: 'ipfs://QmTermsHashHere',`);
  console.log('  });');
  console.log('');

  if (partnershipDeployed) {
    try {
      const bond = await client.createPartnershipBond({
        counterparty,
        tier: BondTier.Gold,
        partnershipType: PartnershipType.OracleConsumer,
        termsUri: 'ipfs://QmExampleTerms',
      });
      console.log('✓ Partnership bond created!');
      console.log(`  Bond ID:  ${bond.bondId}`);
      console.log(`  Tx Hash:  ${bond.txHash}`);
      console.log(`  POL Locked: ${BOND_TIER_POL[BondTier.Gold]} POL`);
      console.log(`  View: ${client.getTxUrl(bond.txHash)}`);
    } catch (error) {
      console.error(`Error creating partnership bond: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log('');

  // ─── Accountability Bond (example / preview) ────────────────────────────

  console.log('── Accountability Bond Example ──');
  console.log('Creates a Platinum-tier accountability bond (0.5 POL at stake)');
  console.log('');
  console.log('  await client.createAccountabilityBond({');
  console.log(`    beneficiary: '${counterparty}',`);
  console.log(`    tier: BondTier.Platinum,`);
  console.log(`    commitment: 'Deliver accurate MATIC/USD price feeds daily for 30 days',`);
  console.log(`    proofUri: 'ipfs://QmProofHashHere',`);
  console.log('  });');
  console.log('');

  if (accountabilityDeployed) {
    try {
      const bond = await client.createAccountabilityBond({
        beneficiary: counterparty,
        tier: BondTier.Platinum,
        commitment: 'Deliver accurate MATIC/USD price feeds daily for 30 days',
        proofUri: 'ipfs://QmExampleProof',
      });
      console.log('✓ Accountability bond created!');
      console.log(`  Bond ID:    ${bond.bondId}`);
      console.log(`  Tx Hash:    ${bond.txHash}`);
      console.log(`  POL at stake: ${BOND_TIER_POL[BondTier.Platinum]} POL`);
      console.log(`  View: ${client.getTxUrl(bond.txHash)}`);
    } catch (error) {
      console.error(`Error creating accountability bond: ${error instanceof Error ? error.message : error}`);
    }
  }
}

main();
