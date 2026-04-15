/**
 * @vaultfire/polygon — Comprehensive Test Suite
 * Uses Node.js built-in test runner (node:test + node:assert)
 *
 * Run with:
 *   tsx --test tests/polygon.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  POLYGON_CONFIG,
  POLYGON_ADDRESSES,
  isDeployed,
  assertDeployed,
  getTxUrl,
  getAddressUrl,
  getTokenUrl,
  X402_FACILITATOR,
  X402_ASSET,
  ERC8004_IDENTITY_REGISTRY_ABI,
  AI_PARTNERSHIP_BONDS_V2_ABI,
  AI_ACCOUNTABILITY_BONDS_V2_ABI,
  ERC8004_REPUTATION_REGISTRY_ABI,
  VAULTFIRE_NAME_SERVICE_ABI,
} from '../src/config.js';

import {
  BondTier,
  BOND_TIER_AMOUNTS,
  BOND_TIER_POL,
  PartnershipType,
  PARTNERSHIP_TYPE_IDS,
  RatingCategory,
  RATING_CATEGORY_IDS,
  STREET_CRED_TIER_BONUS,
  computeStreetCred,
} from '../src/types.js';

import {
  VaultfirePolygonClient,
  polygonPos,
} from '../src/client.js';

import {
  VERSION,
  CHAIN_ID,
  CHAIN_NAME,
  NATIVE_TOKEN,
} from '../src/index.js';

// ─── 1. Config Validation ─────────────────────────────────────────────────────

describe('POLYGON_CONFIG', () => {
  it('has correct chain ID', () => {
    assert.equal(POLYGON_CONFIG.chainId, 137);
  });

  it('has correct chain name', () => {
    assert.equal(POLYGON_CONFIG.chain, 'polygon-pos');
  });

  it('has correct RPC URL', () => {
    assert.equal(POLYGON_CONFIG.rpc, 'https://polygon-rpc.com');
  });

  it('has correct explorer URL', () => {
    assert.equal(POLYGON_CONFIG.explorer, 'https://polygonscan.com');
  });

  it('has correct explorer API URL', () => {
    assert.equal(POLYGON_CONFIG.explorerApi, 'https://api.polygonscan.com/api');
  });

  it('has correct native token', () => {
    assert.equal(POLYGON_CONFIG.nativeToken, 'POL');
  });

  it('has correct deployer address', () => {
    assert.equal(
      POLYGON_CONFIG.deployer,
      '0xA054f831B562e729F8D268291EBde1B2EDcFb84F'
    );
  });

  it('has correct USDC address (Circle native)', () => {
    assert.equal(
      POLYGON_CONFIG.usdc,
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
    );
  });

  it('USDC address is a valid 0x address', () => {
    assert.match(POLYGON_CONFIG.usdc, /^0x[0-9a-fA-F]{40}$/);
  });

  it('deployer address is a valid 0x address', () => {
    assert.match(POLYGON_CONFIG.deployer, /^0x[0-9a-fA-F]{40}$/);
  });
});

// ─── 2. Contract Addresses ────────────────────────────────────────────────────

describe('POLYGON_ADDRESSES', () => {
  it('USDC address is real and deployed', () => {
    assert.equal(
      POLYGON_ADDRESSES.USDC,
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
    );
    assert.ok(isDeployed(POLYGON_ADDRESSES.USDC));
  });

  it('ERC8004IdentityRegistry is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.ERC8004IdentityRegistry, '0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1');
    assert.ok(isDeployed(POLYGON_ADDRESSES.ERC8004IdentityRegistry));
  });

  it('AIPartnershipBondsV2 is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.AIPartnershipBondsV2, '0x0E777878C5b5248E1b52b09Ab5cdEb2eD6e7Da58');
    assert.ok(isDeployed(POLYGON_ADDRESSES.AIPartnershipBondsV2));
  });

  it('AIAccountabilityBondsV2 is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.AIAccountabilityBondsV2, '0xfDdd2B1597c87577543176AB7f49D587876563D2');
    assert.ok(isDeployed(POLYGON_ADDRESSES.AIAccountabilityBondsV2));
  });

  it('ERC8004ReputationRegistry is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.ERC8004ReputationRegistry, '0x8aceF0Bc7e07B2dE35E9069663953f41B5422218');
    assert.ok(isDeployed(POLYGON_ADDRESSES.ERC8004ReputationRegistry));
  });

  it('ERC8004ValidationRegistry is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.ERC8004ValidationRegistry, '0x1A80F77e12f1bd04538027aed6d056f5DCcDCD3C');
    assert.ok(isDeployed(POLYGON_ADDRESSES.ERC8004ValidationRegistry));
  });

  it('VaultfireNameService is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.VaultfireNameService, '0x247F31bB2b5a0d28E68bf24865AA242965FF99cd');
    assert.ok(isDeployed(POLYGON_ADDRESSES.VaultfireNameService));
  });

  it('VaultfireERC8004Adapter is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.VaultfireERC8004Adapter, '0x613585B786af2d5ecb1c3e712CE5ffFB8f53f155');
    assert.ok(isDeployed(POLYGON_ADDRESSES.VaultfireERC8004Adapter));
  });

  it('FlourishingMetricsOracle is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.FlourishingMetricsOracle, '0x630C43F763a332793C421C788B8b1CCC5A3122E7');
    assert.ok(isDeployed(POLYGON_ADDRESSES.FlourishingMetricsOracle));
  });

  it('MultisigGovernance is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.MultisigGovernance, '0x889f5cfb142Bb6E72CB0C633800324C335eED9A4');
    assert.ok(isDeployed(POLYGON_ADDRESSES.MultisigGovernance));
  });

  it('VaultfireTeleporterBridge is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.VaultfireTeleporterBridge, '0xe2aDfe84703dd6B5e421c306861Af18F962fDA91');
    assert.ok(isDeployed(POLYGON_ADDRESSES.VaultfireTeleporterBridge));
  });

  it('DilithiumAttestor is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.DilithiumAttestor, '0xc2F789d82ef55bAbb9Df38f61E606cD34628dB38');
    assert.ok(isDeployed(POLYGON_ADDRESSES.DilithiumAttestor));
  });

  it('ProductionBeliefAttestationVerifier is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.ProductionBeliefAttestationVerifier, '0xe0B709511438D0aCfD5D2d69F40b90C4c27eC760');
    assert.ok(isDeployed(POLYGON_ADDRESSES.ProductionBeliefAttestationVerifier));
  });

  it('BeliefAttestationVerifier is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.BeliefAttestationVerifier, '0xaEBD3d62DF9bF5A5b99c289756c4cd203AC879e5');
    assert.ok(isDeployed(POLYGON_ADDRESSES.BeliefAttestationVerifier));
  });

  it('MissionEnforcement is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.MissionEnforcement, '0x690411685278548157409FA7AC8279A5B1Fb6F78');
    assert.ok(isDeployed(POLYGON_ADDRESSES.MissionEnforcement));
  });

  it('AntiSurveillance is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.AntiSurveillance, '0xcf64D815F5424B7937aB226bC733Ed35ab6CaDcB');
    assert.ok(isDeployed(POLYGON_ADDRESSES.AntiSurveillance));
  });

  it('PrivacyGuarantees is deployed with correct address', () => {
    assert.equal(POLYGON_ADDRESSES.PrivacyGuarantees, '0x281814eF92062DA8049Fe5c4743c4Aef19a17380');
    assert.ok(isDeployed(POLYGON_ADDRESSES.PrivacyGuarantees));
  });
});

// ─── 3. isDeployed / assertDeployed ───────────────────────────────────────────

describe('isDeployed', () => {
  it('returns true for a real address', () => {
    assert.ok(isDeployed('0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'));
  });

  it('returns false for DEPLOY_PENDING', () => {
    assert.ok(!isDeployed('DEPLOY_PENDING'));
  });

  it('returns false for empty string', () => {
    assert.ok(!isDeployed(''));
  });

  it('returns false for non-hex string', () => {
    assert.ok(!isDeployed('not-an-address'));
  });
});

describe('assertDeployed', () => {
  it('does not throw for a real address', () => {
    assert.doesNotThrow(() => {
      assertDeployed('USDC', '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359');
    });
  });

  it('throws for DEPLOY_PENDING with contract name in message', () => {
    assert.throws(
      () => assertDeployed('ERC8004IdentityRegistry', 'DEPLOY_PENDING'),
      (err: Error) => {
        assert.ok(err.message.includes('ERC8004IdentityRegistry'));
        assert.ok(err.message.includes('DEPLOY_PENDING'));
        assert.ok(err.message.includes('137'));
        return true;
      }
    );
  });
});

// ─── 4. Bond Tiers ────────────────────────────────────────────────────────────

describe('BondTier', () => {
  it('Bronze collateral is 0.01 POL', () => {
    assert.equal(BOND_TIER_AMOUNTS[BondTier.Bronze], BigInt('10000000000000000'));
  });

  it('Silver collateral is 0.05 POL', () => {
    assert.equal(BOND_TIER_AMOUNTS[BondTier.Silver], BigInt('50000000000000000'));
  });

  it('Gold collateral is 0.1 POL', () => {
    assert.equal(BOND_TIER_AMOUNTS[BondTier.Gold], BigInt('100000000000000000'));
  });

  it('Platinum collateral is 0.5 POL', () => {
    assert.equal(BOND_TIER_AMOUNTS[BondTier.Platinum], BigInt('500000000000000000'));
  });

  it('Bronze human-readable is 0.01', () => {
    assert.equal(BOND_TIER_POL[BondTier.Bronze], '0.01');
  });

  it('Silver human-readable is 0.05', () => {
    assert.equal(BOND_TIER_POL[BondTier.Silver], '0.05');
  });

  it('Gold human-readable is 0.1', () => {
    assert.equal(BOND_TIER_POL[BondTier.Gold], '0.1');
  });

  it('Platinum human-readable is 0.5', () => {
    assert.equal(BOND_TIER_POL[BondTier.Platinum], '0.5');
  });

  it('Platinum > Gold > Silver > Bronze in wei', () => {
    assert.ok(BOND_TIER_AMOUNTS[BondTier.Platinum] > BOND_TIER_AMOUNTS[BondTier.Gold]);
    assert.ok(BOND_TIER_AMOUNTS[BondTier.Gold] > BOND_TIER_AMOUNTS[BondTier.Silver]);
    assert.ok(BOND_TIER_AMOUNTS[BondTier.Silver] > BOND_TIER_AMOUNTS[BondTier.Bronze]);
  });
});

// ─── 5. Partnership Types ─────────────────────────────────────────────────────

describe('PartnershipType', () => {
  it('collaboration has ID 0', () => {
    assert.equal(PARTNERSHIP_TYPE_IDS[PartnershipType.Collaboration], 0);
  });

  it('delegation has ID 1', () => {
    assert.equal(PARTNERSHIP_TYPE_IDS[PartnershipType.Delegation], 1);
  });

  it('service-provider has ID 2', () => {
    assert.equal(PARTNERSHIP_TYPE_IDS[PartnershipType.ServiceProvider], 2);
  });

  it('data-sharing has ID 3', () => {
    assert.equal(PARTNERSHIP_TYPE_IDS[PartnershipType.DataSharing], 3);
  });

  it('oracle-consumer has ID 4', () => {
    assert.equal(PARTNERSHIP_TYPE_IDS[PartnershipType.OracleConsumer], 4);
  });

  it('has exactly 5 partnership types', () => {
    assert.equal(Object.values(PartnershipType).length, 5);
  });
});

// ─── 6. Street Cred Scoring ───────────────────────────────────────────────────

describe('computeStreetCred', () => {
  it('returns 0 for completely empty agent', () => {
    const score = computeStreetCred({ identityRegistered: false, bonds: [] });
    assert.equal(score.total, 0);
    assert.equal(score.rating, 'Unknown');
  });

  it('identity alone gives 30 pts', () => {
    const score = computeStreetCred({ identityRegistered: true, bonds: [] });
    assert.equal(score.breakdown.identityRegistered, 30);
    assert.equal(score.total, 30);
    assert.equal(score.rating, 'Established');
  });

  it('inactive bond gives bondExists (25) but not bondActive (0)', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [{ tier: BondTier.Bronze, active: false }],
    });
    assert.equal(score.breakdown.bondExists, 25);
    assert.equal(score.breakdown.bondActive, 0);
    assert.equal(score.breakdown.tierBonus, 0);
    assert.equal(score.total, 55); // 30 + 25
  });

  it('active Bronze bond: identity(30) + exists(25) + active(15) + tier(5) = 75', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [{ tier: BondTier.Bronze, active: true }],
    });
    assert.equal(score.breakdown.identityRegistered, 30);
    assert.equal(score.breakdown.bondExists, 25);
    assert.equal(score.breakdown.bondActive, 15);
    assert.equal(score.breakdown.tierBonus, 5);
    assert.equal(score.breakdown.multipleBonds, 0);
    assert.equal(score.total, 75);
    assert.equal(score.topTier, BondTier.Bronze);
    assert.equal(score.rating, 'Elite');
  });

  it('active Silver bond gives tierBonus of 10', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [{ tier: BondTier.Silver, active: true }],
    });
    assert.equal(score.breakdown.tierBonus, 10);
    assert.equal(score.total, 80);
  });

  it('active Gold bond gives tierBonus of 15', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [{ tier: BondTier.Gold, active: true }],
    });
    assert.equal(score.breakdown.tierBonus, 15);
    assert.equal(score.total, 85);
    assert.equal(score.rating, 'Elite');
  });

  it('active Platinum bond gives tierBonus of 20', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [{ tier: BondTier.Platinum, active: true }],
    });
    assert.equal(score.breakdown.tierBonus, 20);
    assert.equal(score.total, 90);
    assert.equal(score.topTier, BondTier.Platinum);
  });

  it('multiple active bonds gives +5 multipleBonds bonus', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [
        { tier: BondTier.Platinum, active: true },
        { tier: BondTier.Gold, active: true },
      ],
    });
    assert.equal(score.breakdown.multipleBonds, 5);
  });

  it('max score is 95 (Platinum + multiple)', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [
        { tier: BondTier.Platinum, active: true },
        { tier: BondTier.Gold, active: true },
      ],
    });
    assert.equal(score.total, 95);
    assert.equal(score.rating, 'Legendary');
  });

  it('best active tier wins for tierBonus (Platinum beats Gold)', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [
        { tier: BondTier.Gold, active: true },
        { tier: BondTier.Platinum, active: true },
      ],
    });
    assert.equal(score.topTier, BondTier.Platinum);
    assert.equal(score.breakdown.tierBonus, 20);
  });

  it('inactive bonds do not contribute to tierBonus', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [
        { tier: BondTier.Platinum, active: false },
        { tier: BondTier.Bronze, active: true },
      ],
    });
    assert.equal(score.topTier, BondTier.Bronze);
    assert.equal(score.breakdown.tierBonus, 5);
  });

  it('activeBondCount reflects only active bonds', () => {
    const score = computeStreetCred({
      identityRegistered: true,
      bonds: [
        { tier: BondTier.Gold, active: true },
        { tier: BondTier.Silver, active: false },
        { tier: BondTier.Bronze, active: true },
      ],
    });
    assert.equal(score.activeBondCount, 2);
    assert.equal(score.breakdown.multipleBonds, 5);
  });

  it('no identity, one active Platinum bond: 25+15+20=60', () => {
    const score = computeStreetCred({
      identityRegistered: false,
      bonds: [{ tier: BondTier.Platinum, active: true }],
    });
    assert.equal(score.total, 60);
    assert.equal(score.breakdown.identityRegistered, 0);
  });
});

// ─── 7. Tier Bonus Mapping ────────────────────────────────────────────────────

describe('STREET_CRED_TIER_BONUS', () => {
  it('Bronze gives 5 pts', () => {
    assert.equal(STREET_CRED_TIER_BONUS[BondTier.Bronze], 5);
  });

  it('Silver gives 10 pts', () => {
    assert.equal(STREET_CRED_TIER_BONUS[BondTier.Silver], 10);
  });

  it('Gold gives 15 pts', () => {
    assert.equal(STREET_CRED_TIER_BONUS[BondTier.Gold], 15);
  });

  it('Platinum gives 20 pts', () => {
    assert.equal(STREET_CRED_TIER_BONUS[BondTier.Platinum], 20);
  });
});

// ─── 8. Rating Categories ─────────────────────────────────────────────────────

describe('RatingCategory', () => {
  it('reliability has ID 0', () => {
    assert.equal(RATING_CATEGORY_IDS[RatingCategory.Reliability], 0);
  });

  it('accuracy has ID 1', () => {
    assert.equal(RATING_CATEGORY_IDS[RatingCategory.Accuracy], 1);
  });

  it('ethics has ID 2', () => {
    assert.equal(RATING_CATEGORY_IDS[RatingCategory.Ethics], 2);
  });

  it('communication has ID 3', () => {
    assert.equal(RATING_CATEGORY_IDS[RatingCategory.Communication], 3);
  });

  it('performance has ID 4', () => {
    assert.equal(RATING_CATEGORY_IDS[RatingCategory.Performance], 4);
  });
});

// ─── 9. Client Instantiation ──────────────────────────────────────────────────

describe('VaultfirePolygonClient', () => {
  it('instantiates without config', () => {
    const client = new VaultfirePolygonClient();
    assert.ok(client instanceof VaultfirePolygonClient);
  });

  it('instantiates with custom RPC', () => {
    const client = new VaultfirePolygonClient({
      rpcUrl: 'https://polygon-rpc.com',
    });
    assert.ok(client instanceof VaultfirePolygonClient);
  });

  it('exposes correct chain config', () => {
    const client = new VaultfirePolygonClient();
    assert.equal(client.config.chainId, 137);
    assert.equal(client.config.nativeToken, 'POL');
  });

  it('exposes correct addresses', () => {
    const client = new VaultfirePolygonClient();
    assert.equal(client.addresses.USDC, '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359');
  });

  it('getDeploymentStatus identifies USDC as deployed', () => {
    const client = new VaultfirePolygonClient();
    const status = client.getDeploymentStatus();
    assert.ok(status['USDC']?.deployed);
  });

  it('getDeploymentStatus identifies all Vaultfire contracts as deployed', () => {
    const client = new VaultfirePolygonClient();
    const status = client.getDeploymentStatus();
    assert.ok(status['ERC8004IdentityRegistry']?.deployed);
    assert.ok(status['AIPartnershipBondsV2']?.deployed);
    assert.ok(status['VaultfireNameService']?.deployed);
  });

  it('getTxUrl returns polygonscan URL', () => {
    const client = new VaultfirePolygonClient();
    const url = client.getTxUrl('0xabc123');
    assert.equal(url, 'https://polygonscan.com/tx/0xabc123');
  });

  it('registerAgent does not throw a DEPLOY_PENDING error (contracts are live)', async () => {
    const client = new VaultfirePolygonClient({
      privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    });
    // With live contracts, a network/RPC error is expected in a test environment,
    // but NOT a DEPLOY_PENDING error.
    try {
      await client.registerAgent({ name: 'test', metadataUri: 'ipfs://test' });
    } catch (err: unknown) {
      assert.ok(err instanceof Error);
      assert.ok(
        !err.message.includes('DEPLOY_PENDING'),
        `Should not throw DEPLOY_PENDING now that contracts are live. Got: ${err.message}`
      );
    }
  });

  it('createPartnershipBond does not throw a DEPLOY_PENDING error (contracts are live)', async () => {
    const client = new VaultfirePolygonClient({
      privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    });
    // With live contracts, a network/RPC error is expected in a test environment,
    // but NOT a DEPLOY_PENDING error.
    try {
      await client.createPartnershipBond({
        counterparty: '0x1234567890123456789012345678901234567890',
        tier: BondTier.Bronze,
        partnershipType: PartnershipType.Collaboration,
      });
    } catch (err: unknown) {
      assert.ok(err instanceof Error);
      assert.ok(
        !err.message.includes('DEPLOY_PENDING'),
        `Should not throw DEPLOY_PENDING now that contracts are live. Got: ${err.message}`
      );
    }
  });

  it('computeStreetCredLocal is a static method returning correct score', () => {
    const score = VaultfirePolygonClient.computeStreetCredLocal({
      identityRegistered: true,
      bonds: [{ tier: BondTier.Gold, active: true }],
    });
    assert.equal(score.total, 85);
    assert.equal(score.rating, 'Elite');
  });

  it('throws when no wallet client and registerAgent is called', async () => {
    const client = new VaultfirePolygonClient(); // no private key
    // With live contracts, throws because no wallet client is configured
    await assert.rejects(
      () => client.registerAgent({ name: 'x', metadataUri: 'ipfs://x' }),
      (err: Error) => {
        assert.ok(err instanceof Error);
        assert.ok(
          !err.message.includes('DEPLOY_PENDING'),
          'Should not throw DEPLOY_PENDING — contracts are live'
        );
        return true;
      }
    );
  });
});

// ─── 10. polygonPos Chain Definition ─────────────────────────────────────────

describe('polygonPos viem chain definition', () => {
  it('has correct chain ID', () => {
    assert.equal(polygonPos.id, 137);
  });

  it('has correct chain name', () => {
    assert.equal(polygonPos.name, 'Polygon PoS');
  });

  it('native currency is POL', () => {
    assert.equal(polygonPos.nativeCurrency.symbol, 'POL');
    assert.equal(polygonPos.nativeCurrency.decimals, 18);
  });

  it('has RPC URL', () => {
    assert.ok(polygonPos.rpcUrls.default.http[0]?.includes('polygon'));
  });

  it('block explorer is Polygonscan', () => {
    assert.ok(polygonPos.blockExplorers?.default.url.includes('polygonscan'));
  });
});

// ─── 11. URL Helpers ──────────────────────────────────────────────────────────

describe('URL helpers', () => {
  it('getTxUrl formats correctly', () => {
    const url = getTxUrl('0xabc');
    assert.equal(url, 'https://polygonscan.com/tx/0xabc');
  });

  it('getAddressUrl formats correctly', () => {
    const url = getAddressUrl('0x1234');
    assert.equal(url, 'https://polygonscan.com/address/0x1234');
  });

  it('getTokenUrl formats correctly', () => {
    const url = getTokenUrl('0x5678');
    assert.equal(url, 'https://polygonscan.com/token/0x5678');
  });
});

// ─── 12. x402 Config ─────────────────────────────────────────────────────────

describe('x402 config', () => {
  it('facilitator URL is correct', () => {
    assert.equal(X402_FACILITATOR, 'https://x402.org/facilitator');
  });

  it('x402 asset uses correct USDC address', () => {
    assert.equal(
      X402_ASSET.address,
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
    );
  });

  it('x402 asset symbol is USDC', () => {
    assert.equal(X402_ASSET.symbol, 'USDC');
  });

  it('x402 asset decimals is 6', () => {
    assert.equal(X402_ASSET.decimals, 6);
  });

  it('x402 asset chain is polygon-pos', () => {
    assert.equal(X402_ASSET.chain, 'polygon-pos');
  });

  it('x402 asset chainId is 137', () => {
    assert.equal(X402_ASSET.chainId, 137);
  });
});

// ─── 13. ABI Correctness ──────────────────────────────────────────────────────

describe('ERC8004_IDENTITY_REGISTRY_ABI', () => {
  it('has registerAgent function', () => {
    const fn = ERC8004_IDENTITY_REGISTRY_ABI.find(
      (e) => e.name === 'registerAgent' && e.type === 'function'
    );
    assert.ok(fn, 'registerAgent not found');
  });

  it('registerAgent is nonpayable', () => {
    const fn = ERC8004_IDENTITY_REGISTRY_ABI.find((e) => e.name === 'registerAgent');
    assert.ok(fn && 'stateMutability' in fn);
    assert.equal((fn as { stateMutability: string }).stateMutability, 'nonpayable');
  });

  it('has isRegistered view function', () => {
    const fn = ERC8004_IDENTITY_REGISTRY_ABI.find(
      (e) => e.name === 'isRegistered' && e.type === 'function'
    );
    assert.ok(fn);
  });

  it('has AgentRegistered event', () => {
    const ev = ERC8004_IDENTITY_REGISTRY_ABI.find(
      (e) => e.name === 'AgentRegistered' && e.type === 'event'
    );
    assert.ok(ev);
  });
});

describe('AI_PARTNERSHIP_BONDS_V2_ABI', () => {
  it('has createBond payable function', () => {
    const fn = AI_PARTNERSHIP_BONDS_V2_ABI.find(
      (e) => e.name === 'createBond' && e.type === 'function'
    );
    assert.ok(fn);
    assert.equal((fn as { stateMutability: string }).stateMutability, 'payable');
  });

  it('has getBond view function', () => {
    const fn = AI_PARTNERSHIP_BONDS_V2_ABI.find(
      (e) => e.name === 'getBond' && e.type === 'function'
    );
    assert.ok(fn);
  });

  it('has BondCreated event', () => {
    const ev = AI_PARTNERSHIP_BONDS_V2_ABI.find(
      (e) => e.name === 'BondCreated' && e.type === 'event'
    );
    assert.ok(ev);
  });
});

describe('AI_ACCOUNTABILITY_BONDS_V2_ABI', () => {
  it('has createBond payable function', () => {
    const fn = AI_ACCOUNTABILITY_BONDS_V2_ABI.find(
      (e) => e.name === 'createBond' && e.type === 'function'
    );
    assert.ok(fn);
    assert.equal((fn as { stateMutability: string }).stateMutability, 'payable');
  });

  it('has slashBond function', () => {
    const fn = AI_ACCOUNTABILITY_BONDS_V2_ABI.find(
      (e) => e.name === 'slashBond' && e.type === 'function'
    );
    assert.ok(fn);
  });

  it('has fulfillBond function', () => {
    const fn = AI_ACCOUNTABILITY_BONDS_V2_ABI.find(
      (e) => e.name === 'fulfillBond' && e.type === 'function'
    );
    assert.ok(fn);
  });
});

describe('VAULTFIRE_NAME_SERVICE_ABI', () => {
  it('has lookup view function', () => {
    const fn = VAULTFIRE_NAME_SERVICE_ABI.find(
      (e) => e.name === 'lookup' && e.type === 'function'
    );
    assert.ok(fn);
  });

  it('has resolve view function', () => {
    const fn = VAULTFIRE_NAME_SERVICE_ABI.find(
      (e) => e.name === 'resolve' && e.type === 'function'
    );
    assert.ok(fn);
  });

  it('has NameRegistered event', () => {
    const ev = VAULTFIRE_NAME_SERVICE_ABI.find(
      (e) => e.name === 'NameRegistered' && e.type === 'event'
    );
    assert.ok(ev);
  });
});

// ─── 14. Module Exports ───────────────────────────────────────────────────────

describe('index exports', () => {
  it('VERSION is defined', () => {
    assert.equal(typeof VERSION, 'string');
    assert.ok(VERSION.length > 0);
  });

  it('CHAIN_ID is 137', () => {
    assert.equal(CHAIN_ID, 137);
  });

  it('CHAIN_NAME is Polygon PoS', () => {
    assert.equal(CHAIN_NAME, 'Polygon PoS');
  });

  it('NATIVE_TOKEN is POL', () => {
    assert.equal(NATIVE_TOKEN, 'POL');
  });
});
