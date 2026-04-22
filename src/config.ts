/**
 * @vaultfire/polygon — Chain Config
 * Vaultfire Protocol on Polygon PoS (Chain ID: 137)
 *
 * Native token: POL (formerly MATIC, rebranded Q3 2024)
 * USDC: Native Circle USDC on Polygon
 */

import type { PolygonChainConfig, VaultfirePolygonAddresses } from './types.js';

// ─── Contract Addresses ───────────────────────────────────────────────────────

/**
 * Vaultfire contract addresses on Polygon PoS.
 *
 * All 16 contracts are deployed and verified on Polygon PoS (Chain ID: 137).
 * Deployed: 2026-04-15T22:00:00Z
 */
export const POLYGON_ADDRESSES: VaultfirePolygonAddresses = {
  // Real, live Circle native USDC on Polygon PoS
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',

  // Vaultfire contracts — deployed on Polygon PoS
  ERC8004IdentityRegistry: '0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1',
  AIPartnershipBondsV2: '0x83dd216449B3F0574E39043ECFE275946fa492e9',
  AIAccountabilityBondsV2: '0xdB54B8925664816187646174bdBb6Ac658A55a5F',
  ERC8004ReputationRegistry: '0x8aceF0Bc7e07B2dE35E9069663953f41B5422218',
  ERC8004ValidationRegistry: '0x1A80F77e12f1bd04538027aed6d056f5DCcDCD3C',
  VaultfireERC8004Adapter: '0x613585B786af2d5ecb1c3e712CE5ffFB8f53f155',
  VaultfireNameService: '0x247F31bB2b5a0d28E68bf24865AA242965FF99cd',
  FlourishingMetricsOracle: '0x630C43F763a332793C421C788B8b1CCC5A3122E7',
  MultisigGovernance: '0x889f5cfb142Bb6E72CB0C633800324C335eED9A4',
  VaultfireTeleporterBridge: '0xe2aDfe84703dd6B5e421c306861Af18F962fDA91',
  DilithiumAttestor: '0xc2F789d82ef55bAbb9Df38f61E606cD34628dB38',
  ProductionBeliefAttestationVerifier: '0xe0B709511438D0aCfD5D2d69F40b90C4c27eC760',
  BeliefAttestationVerifier: '0xaEBD3d62DF9bF5A5b99c289756c4cd203AC879e5',
  MissionEnforcement: '0x690411685278548157409FA7AC8279A5B1Fb6F78',
  AntiSurveillance: '0xcf64D815F5424B7937aB226bC733Ed35ab6CaDcB',
  PrivacyGuarantees: '0x281814eF92062DA8049Fe5c4743c4Aef19a17380',
} as const;

// ─── Chain Configuration ──────────────────────────────────────────────────────

/**
 * Full Polygon PoS chain configuration for Vaultfire Protocol.
 *
 * @example
 * ```typescript
 * import { POLYGON_CONFIG } from '@vaultfire/polygon';
 *
 * console.log(POLYGON_CONFIG.chainId); // 137
 * console.log(POLYGON_CONFIG.nativeToken); // 'POL'
 * ```
 */
export const POLYGON_CONFIG: PolygonChainConfig = {
  chain: 'polygon-pos',
  chainId: 137,
  rpc: 'https://polygon-rpc.com',
  explorer: 'https://polygonscan.com',
  explorerApi: 'https://api.polygonscan.com/api',
  usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  nativeToken: 'POL',
  deployer: '0xfA15Ee28939B222B0448261A22156070f0A7813C',
  contracts: POLYGON_ADDRESSES,
} as const;

// ─── x402 Payment Config ──────────────────────────────────────────────────────

/** x402 facilitator endpoint for Polygon PoS */
export const X402_FACILITATOR = 'https://x402.org/facilitator';

/** x402 supported payment asset on Polygon */
export const X402_ASSET = {
  address: POLYGON_ADDRESSES.USDC,
  symbol: 'USDC',
  decimals: 6,
  chain: 'polygon-pos',
  chainId: 137,
} as const;

// ─── Helper Utilities ─────────────────────────────────────────────────────────

/**
 * Returns true if the address is a real deployed address (not DEPLOY_PENDING).
 */
export function isDeployed(address: string): address is `0x${string}` {
  return address !== 'DEPLOY_PENDING' && address.startsWith('0x');
}

/**
 * Asserts that a contract address has been deployed.
 * Throws a descriptive error if the contract is still DEPLOY_PENDING.
 */
export function assertDeployed(
  contractName: string,
  address: string
): asserts address is `0x${string}` {
  if (!isDeployed(address)) {
    throw new Error(
      `[vaultfire/polygon] Contract '${contractName}' is not yet deployed on Polygon PoS (Chain ID: 137). ` +
        `Status: DEPLOY_PENDING. Follow https://github.com/Ghostkey316/vaultfire-polygon for deployment updates.`
    );
  }
}

/**
 * Returns a Polygonscan URL for a transaction.
 */
export function getTxUrl(txHash: string): string {
  return `${POLYGON_CONFIG.explorer}/tx/${txHash}`;
}

/**
 * Returns a Polygonscan URL for an address.
 */
export function getAddressUrl(address: string): string {
  return `${POLYGON_CONFIG.explorer}/address/${address}`;
}

/**
 * Returns a Polygonscan URL for a token contract.
 */
export function getTokenUrl(address: string): string {
  return `${POLYGON_CONFIG.explorer}/token/${address}`;
}

// ─── ABI Fragments ────────────────────────────────────────────────────────────

/** ABI fragment: ERC-8004 Identity Registry */
export const ERC8004_IDENTITY_REGISTRY_ABI = [
  {
    name: 'registerAgent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'metadataUri', type: 'string' },
      { name: 'controller', type: 'address' },
    ],
    outputs: [{ name: 'agentId', type: 'uint256' }],
  },
  {
    name: 'getAgent',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agentId', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'metadataUri', type: 'string' },
      { name: 'controller', type: 'address' },
      { name: 'registeredAt', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
  },
  {
    name: 'getAgentByController',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'controller', type: 'address' }],
    outputs: [{ name: 'agentId', type: 'uint256' }],
  },
  {
    name: 'isRegistered',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'controller', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'AgentRegistered',
    type: 'event',
    inputs: [
      { name: 'agentId', type: 'uint256', indexed: true },
      { name: 'controller', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
    ],
  },
] as const;

/** ABI fragment: AI Partnership Bonds V2 */
export const AI_PARTNERSHIP_BONDS_V2_ABI = [
  {
    name: 'createBond',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'counterparty', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'partnershipType', type: 'uint8' },
      { name: 'termsUri', type: 'string' },
      { name: 'expiry', type: 'uint256' },
    ],
    outputs: [{ name: 'bondId', type: 'uint256' }],
  },
  {
    name: 'getBond',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'bondId', type: 'uint256' }],
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'counterparty', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'partnershipType', type: 'uint8' },
      { name: 'polLocked', type: 'uint256' },
      { name: 'termsUri', type: 'string' },
      { name: 'expiry', type: 'uint256' },
      { name: 'active', type: 'bool' },
      { name: 'createdAt', type: 'uint256' },
    ],
  },
  {
    name: 'getBondsByAgent',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agent', type: 'address' }],
    outputs: [{ name: 'bondIds', type: 'uint256[]' }],
  },
  {
    name: 'revokeBond',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'bondId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'BondCreated',
    type: 'event',
    inputs: [
      { name: 'bondId', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'counterparty', type: 'address', indexed: true },
      { name: 'tier', type: 'uint8', indexed: false },
      { name: 'partnershipType', type: 'uint8', indexed: false },
      { name: 'polLocked', type: 'uint256', indexed: false },
    ],
  },
] as const;

/** ABI fragment: AI Accountability Bonds V2 */
export const AI_ACCOUNTABILITY_BONDS_V2_ABI = [
  {
    name: 'createBond',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'beneficiary', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'commitment', type: 'string' },
      { name: 'proofUri', type: 'string' },
      { name: 'expiry', type: 'uint256' },
    ],
    outputs: [{ name: 'bondId', type: 'uint256' }],
  },
  {
    name: 'getBond',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'bondId', type: 'uint256' }],
    outputs: [
      { name: 'agent', type: 'address' },
      { name: 'beneficiary', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'commitment', type: 'string' },
      { name: 'proofUri', type: 'string' },
      { name: 'polLocked', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
      { name: 'active', type: 'bool' },
      { name: 'fulfilled', type: 'bool' },
      { name: 'createdAt', type: 'uint256' },
    ],
  },
  {
    name: 'fulfillBond',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'bondId', type: 'uint256' },
      { name: 'proofUri', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'slashBond',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'bondId', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'BondCreated',
    type: 'event',
    inputs: [
      { name: 'bondId', type: 'uint256', indexed: true },
      { name: 'agent', type: 'address', indexed: true },
      { name: 'beneficiary', type: 'address', indexed: true },
      { name: 'tier', type: 'uint8', indexed: false },
      { name: 'polLocked', type: 'uint256', indexed: false },
    ],
  },
] as const;

/** ABI fragment: ERC-8004 Reputation Registry */
export const ERC8004_REPUTATION_REGISTRY_ABI = [
  {
    name: 'getStreetCred',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agent', type: 'address' }],
    outputs: [
      { name: 'score', type: 'uint256' },
      { name: 'identityScore', type: 'uint256' },
      { name: 'bondScore', type: 'uint256' },
      { name: 'tierBonus', type: 'uint256' },
      { name: 'multipleBondsBonus', type: 'uint256' },
    ],
  },
  {
    name: 'submitRating',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'peer', type: 'address' },
      { name: 'score', type: 'uint8' },
      { name: 'category', type: 'uint8' },
      { name: 'evidenceHash', type: 'bytes32' },
      { name: 'comment', type: 'string' },
    ],
    outputs: [{ name: 'ratingId', type: 'uint256' }],
  },
  {
    name: 'getRatings',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agent', type: 'address' }],
    outputs: [
      { name: 'totalRatings', type: 'uint256' },
      { name: 'averageScore', type: 'uint256' },
      { name: 'categoryScores', type: 'uint256[]' },
    ],
  },
] as const;

/** ABI fragment: Vaultfire Name Service */
export const VAULTFIRE_NAME_SERVICE_ABI = [
  {
    name: 'lookup',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'name', type: 'string' }],
    outputs: [
      { name: 'addr', type: 'address' },
      { name: 'metadataUri', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'expiry', type: 'uint256' },
    ],
  },
  {
    name: 'resolve',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'addr', type: 'address' }],
    outputs: [{ name: 'name', type: 'string' }],
  },
  {
    name: 'register',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'addr', type: 'address' },
      { name: 'metadataUri', type: 'string' },
      { name: 'durationYears', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    name: 'NameRegistered',
    type: 'event',
    inputs: [
      { name: 'name', type: 'string', indexed: false },
      { name: 'addr', type: 'address', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'expiry', type: 'uint256', indexed: false },
    ],
  },
] as const;
