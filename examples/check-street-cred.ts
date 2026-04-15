/**
 * Example: Check Street Cred Score on Polygon PoS
 *
 * Street Cred is Vaultfire's agent reputation score — a composite metric
 * built from on-chain identity, bonds, and peer ratings.
 *
 * Scoring (max 95 pts):
 *   Identity registered:  30 pts
 *   Bond exists:          25 pts
 *   Bond active:          15 pts
 *   Tier bonus:           up to 20 pts (Bronze=5, Silver=10, Gold=15, Platinum=20)
 *   Multiple bonds (>1):   5 pts
 *
 * Rating bands:
 *   0:      Unknown
 *   1–15:   Newcomer
 *   16–40:  Established
 *   41–65:  Trusted
 *   66–85:  Elite
 *   86–95:  Legendary
 *
 * NOTE: On-chain scoring requires ERC8004ReputationRegistry to be deployed.
 * This example also shows local scoring which works without any deployment.
 *
 * Usage:
 *   tsx examples/check-street-cred.ts
 *   AGENT=0x... tsx examples/check-street-cred.ts
 */

import {
  VaultfirePolygonClient,
  BondTier,
  computeStreetCred,
  STREET_CRED_TIER_BONUS,
  POLYGON_CONFIG,
} from '../src/index.js';

async function main() {
  const agentAddress =
    (process.env['AGENT'] as `0x${string}` | undefined) ??
    '0xA054f831B562e729F8D268291EBde1B2EDcFb84F'; // default: deployer

  console.log('Vaultfire Protocol — Street Cred Check on Polygon PoS');
  console.log(`Chain: ${POLYGON_CONFIG.chain} (ID: ${POLYGON_CONFIG.chainId})`);
  console.log('');

  // ─── Scoring Table (no chain needed) ───────────────────────────────────

  console.log('Street Cred Scoring Breakdown:');
  console.log('  Component               | Points');
  console.log('  ─────────────────────── | ───────');
  console.log('  Identity registered     |  30 pts');
  console.log('  Bond exists             |  25 pts');
  console.log('  Bond active             |  15 pts');
  console.log('  Tier bonus (Bronze)     |   5 pts');
  console.log('  Tier bonus (Silver)     |  10 pts');
  console.log('  Tier bonus (Gold)       |  15 pts');
  console.log('  Tier bonus (Platinum)   |  20 pts');
  console.log('  Multiple bonds (>1)     |   5 pts');
  console.log('  ─────────────────────── | ───────');
  console.log('  Maximum                 |  95 pts');
  console.log('');

  // ─── Local Score Examples ───────────────────────────────────────────────

  console.log('Local Score Examples (no blockchain required):');
  console.log('');

  const scenarios = [
    {
      label: 'New agent (identity only)',
      input: { identityRegistered: true, bonds: [] },
    },
    {
      label: 'Bronze bond, not active',
      input: {
        identityRegistered: true,
        bonds: [{ tier: BondTier.Bronze, active: false }],
      },
    },
    {
      label: 'Bronze bond, active',
      input: {
        identityRegistered: true,
        bonds: [{ tier: BondTier.Bronze, active: true }],
      },
    },
    {
      label: 'Gold bond, active',
      input: {
        identityRegistered: true,
        bonds: [{ tier: BondTier.Gold, active: true }],
      },
    },
    {
      label: 'Platinum bond + multiple bonds',
      input: {
        identityRegistered: true,
        bonds: [
          { tier: BondTier.Platinum, active: true },
          { tier: BondTier.Silver, active: true },
        ],
      },
    },
    {
      label: 'Max score (Platinum + multiple)',
      input: {
        identityRegistered: true,
        bonds: [
          { tier: BondTier.Platinum, active: true },
          { tier: BondTier.Gold, active: true },
        ],
      },
    },
  ];

  for (const scenario of scenarios) {
    const score = computeStreetCred(scenario.input);
    const bar = '█'.repeat(Math.floor(score.total / 5)) + '░'.repeat(19 - Math.floor(score.total / 5));
    console.log(`  ${scenario.label}`);
    console.log(`    Score: ${score.total}/95 [${bar}] — ${score.rating}`);
    console.log(`    Breakdown: identity=${score.breakdown.identityRegistered} + bond=${score.breakdown.bondExists} + active=${score.breakdown.bondActive} + tier=${score.breakdown.tierBonus} + multi=${score.breakdown.multipleBonds}`);
    if (score.topTier) {
      console.log(`    Top tier: ${score.topTier} (${STREET_CRED_TIER_BONUS[score.topTier]} bonus pts)`);
    }
    console.log('');
  }

  // ─── On-chain Score ─────────────────────────────────────────────────────

  console.log(`On-chain score for ${agentAddress}:`);
  console.log('');

  const client = new VaultfirePolygonClient();

  const reputationStatus = client.getDeploymentStatus()['ERC8004ReputationRegistry'];
  if (!reputationStatus?.deployed) {
    console.log('  ⏳ ERC8004ReputationRegistry is DEPLOY_PENDING on Polygon PoS');
    console.log('     On-chain scoring will be available after deployment.');
    console.log('     Follow: https://github.com/Ghostkey316/vaultfire-polygon');
    return;
  }

  try {
    const score = await client.getStreetCred(agentAddress);
    console.log(`  Total Score:  ${score.total}/95`);
    console.log(`  Rating:       ${score.rating}`);
    console.log(`  Top Tier:     ${score.topTier ?? 'None'}`);
    console.log(`  Active Bonds: ${score.activeBondCount}`);
    console.log('');
    console.log('  Breakdown:');
    console.log(`    Identity:       ${score.breakdown.identityRegistered} pts`);
    console.log(`    Bond Exists:    ${score.breakdown.bondExists} pts`);
    console.log(`    Bond Active:    ${score.breakdown.bondActive} pts`);
    console.log(`    Tier Bonus:     ${score.breakdown.tierBonus} pts`);
    console.log(`    Multiple Bonds: ${score.breakdown.multipleBonds} pts`);
    console.log('');
    console.log(`  View on Polygonscan: ${POLYGON_CONFIG.explorer}/address/${agentAddress}`);
  } catch (error) {
    console.error(`  Error: ${error instanceof Error ? error.message : error}`);
  }
}

main();
