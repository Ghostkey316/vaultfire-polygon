/**
 * @vaultfire/polygon — Types
 * Vaultfire Protocol on Polygon PoS
 */

// ─── Address Types ───────────────────────────────────────────────────────────

/** A hex Ethereum address */
export type Address = `0x${string}`;

/** A deployed contract address or DEPLOY_PENDING sentinel */
export type ContractAddress = Address | 'DEPLOY_PENDING';

// ─── Bond Types ───────────────────────────────────────────────────────────────

/**
 * Bond tiers with their POL collateral requirements.
 * Gas is paid in POL (formerly MATIC), rebranded Q3 2024.
 */
export enum BondTier {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
}

/** POL collateral amounts per tier (in wei as bigint) */
export const BOND_TIER_AMOUNTS: Record<BondTier, bigint> = {
  [BondTier.Bronze]: BigInt('10000000000000000'),   // 0.01 POL
  [BondTier.Silver]: BigInt('50000000000000000'),   // 0.05 POL
  [BondTier.Gold]: BigInt('100000000000000000'),    // 0.1  POL
  [BondTier.Platinum]: BigInt('500000000000000000'), // 0.5  POL
};

/** Human-readable POL amounts per tier */
export const BOND_TIER_POL: Record<BondTier, string> = {
  [BondTier.Bronze]: '0.01',
  [BondTier.Silver]: '0.05',
  [BondTier.Gold]: '0.1',
  [BondTier.Platinum]: '0.5',
};

// ─── Partnership Types ────────────────────────────────────────────────────────

/** Types of AI-to-AI or AI-to-human partnership bonds */
export enum PartnershipType {
  Collaboration = 'collaboration',
  Delegation = 'delegation',
  ServiceProvider = 'service-provider',
  DataSharing = 'data-sharing',
  OracleConsumer = 'oracle-consumer',
}

/** Numeric encoding of partnership types for on-chain use */
export const PARTNERSHIP_TYPE_IDS: Record<PartnershipType, number> = {
  [PartnershipType.Collaboration]: 0,
  [PartnershipType.Delegation]: 1,
  [PartnershipType.ServiceProvider]: 2,
  [PartnershipType.DataSharing]: 3,
  [PartnershipType.OracleConsumer]: 4,
};

// ─── Agent Registration ───────────────────────────────────────────────────────

/** Parameters for registering an AI agent on Polygon PoS */
export interface RegisterAgentParams {
  /** On-chain name for the agent (also used for VNS) */
  name: string;
  /** ERC-8004 metadata URI (IPFS or HTTPS) */
  metadataUri: string;
  /** Optional human-readable description */
  description?: string;
  /** Wallet address that controls this agent identity */
  controller?: Address;
}

/** Result of agent registration */
export interface RegisterAgentResult {
  /** Transaction hash */
  txHash: `0x${string}`;
  /** Assigned agent ID */
  agentId: bigint;
  /** Block number of registration */
  blockNumber: bigint;
}

// ─── Bond Creation ────────────────────────────────────────────────────────────

/** Parameters for creating a Partnership Bond */
export interface CreatePartnershipBondParams {
  /** Counterparty agent or wallet address */
  counterparty: Address;
  /** Bond tier determining collateral and privileges */
  tier: BondTier;
  /** Type of partnership */
  partnershipType: PartnershipType;
  /** Optional human-readable terms URI */
  termsUri?: string;
  /** Optional expiry in Unix seconds (0 = no expiry) */
  expiry?: bigint;
}

/** Parameters for creating an Accountability Bond */
export interface CreateAccountabilityBondParams {
  /** Beneficiary of the accountability bond */
  beneficiary: Address;
  /** Bond tier determining collateral */
  tier: BondTier;
  /** Human-readable commitment statement */
  commitment: string;
  /** Optional metadata URI for proof-of-work */
  proofUri?: string;
  /** Optional expiry in Unix seconds (0 = no expiry) */
  expiry?: bigint;
}

/** Result of bond creation */
export interface BondResult {
  /** Transaction hash */
  txHash: `0x${string}`;
  /** Assigned bond ID */
  bondId: bigint;
  /** Block number */
  blockNumber: bigint;
  /** POL value locked */
  polLocked: bigint;
}

// ─── Street Cred ─────────────────────────────────────────────────────────────

/**
 * Street Cred scoring breakdown.
 *
 * Max score: 95 pts
 *   - Identity registered:    30 pts
 *   - Bond exists:            25 pts
 *   - Bond active (not exp):  15 pts
 *   - Tier bonus:             up to 20 pts (Bronze=5, Silver=10, Gold=15, Platinum=20)
 *   - Multiple bonds (>1):     5 pts
 */
export interface StreetCredScore {
  /** Total Street Cred score (0–95) */
  total: number;
  /** Breakdown of score components */
  breakdown: {
    identityRegistered: number;
    bondExists: number;
    bondActive: number;
    tierBonus: number;
    multipleBonds: number;
  };
  /** Highest bond tier held */
  topTier: BondTier | null;
  /** Number of active bonds */
  activeBondCount: number;
  /** Human-readable rating label */
  rating: StreetCredRating;
}

/** Qualitative rating labels for Street Cred scores */
export type StreetCredRating =
  | 'Unknown'
  | 'Newcomer'
  | 'Established'
  | 'Trusted'
  | 'Elite'
  | 'Legendary';

/** Street Cred tier bonus points by tier */
export const STREET_CRED_TIER_BONUS: Record<BondTier, number> = {
  [BondTier.Bronze]: 5,
  [BondTier.Silver]: 10,
  [BondTier.Gold]: 15,
  [BondTier.Platinum]: 20,
};

/**
 * Compute a Street Cred score locally from a StreetCredInput.
 *
 * Scoring:
 *   Identity registered:  30 pts
 *   Bond exists:          25 pts
 *   Bond active:          15 pts
 *   Tier bonus:           up to 20 pts (Bronze=5, Silver=10, Gold=15, Platinum=20)
 *   Multiple bonds (>1):   5 pts
 *   Maximum:              95 pts
 */
export function computeStreetCred(input: StreetCredInput): StreetCredScore {
  let identityRegistered = 0;
  let bondExists = 0;
  let bondActive = 0;
  let tierBonus = 0;
  let multipleBonds = 0;

  if (input.identityRegistered) {
    identityRegistered = 30;
  }

  const activeBonds = input.bonds.filter((b) => b.active);
  const activeBondCount = activeBonds.length;

  if (input.bonds.length > 0) {
    bondExists = 25;
  }

  if (activeBondCount > 0) {
    bondActive = 15;
  }

  if (activeBondCount > 1) {
    multipleBonds = 5;
  }

  // Tier bonus: use the best active bond tier
  let topTier: BondTier | null = null;
  const tierOrder = [BondTier.Platinum, BondTier.Gold, BondTier.Silver, BondTier.Bronze];
  for (const tier of tierOrder) {
    if (activeBonds.some((b) => b.tier === tier)) {
      topTier = tier;
      tierBonus = STREET_CRED_TIER_BONUS[tier];
      break;
    }
  }

  const total = identityRegistered + bondExists + bondActive + tierBonus + multipleBonds;

  let rating: StreetCredRating;
  if (total === 0) rating = 'Unknown';
  else if (total <= 15) rating = 'Newcomer';
  else if (total <= 40) rating = 'Established';
  else if (total <= 65) rating = 'Trusted';
  else if (total <= 85) rating = 'Elite';
  else rating = 'Legendary';

  return {
    total,
    breakdown: {
      identityRegistered,
      bondExists,
      bondActive,
      tierBonus,
      multipleBonds,
    },
    topTier,
    activeBondCount,
    rating,
  };
}

/** Input for computing a Street Cred score locally */
export interface StreetCredInput {
  identityRegistered: boolean;
  bonds: Array<{
    tier: BondTier;
    active: boolean;
  }>;
}

// ─── VNS ─────────────────────────────────────────────────────────────────────

/** Vaultfire Name Service lookup result */
export interface VNSRecord {
  /** The .vf name */
  name: string;
  /** Resolved address */
  address: Address;
  /** Metadata URI if set */
  metadataUri?: string;
  /** Owner address */
  owner: Address;
  /** Expiry timestamp (Unix seconds) */
  expiry: bigint;
}

// ─── Peer Rating ──────────────────────────────────────────────────────────────

/** Parameters for rating a peer agent */
export interface RatePeerParams {
  /** Address of the peer to rate */
  peer: Address;
  /** Rating score: 1–5 */
  score: 1 | 2 | 3 | 4 | 5;
  /** Category of rating */
  category: RatingCategory;
  /** Optional IPFS hash of supporting evidence */
  evidenceHash?: `0x${string}`;
  /** Optional text comment */
  comment?: string;
}

/** Categories for peer ratings */
export enum RatingCategory {
  Reliability = 'reliability',
  Accuracy = 'accuracy',
  Ethics = 'ethics',
  Communication = 'communication',
  Performance = 'performance',
}

/** Numeric encoding of rating categories */
export const RATING_CATEGORY_IDS: Record<RatingCategory, number> = {
  [RatingCategory.Reliability]: 0,
  [RatingCategory.Accuracy]: 1,
  [RatingCategory.Ethics]: 2,
  [RatingCategory.Communication]: 3,
  [RatingCategory.Performance]: 4,
};

/** Result of a peer rating submission */
export interface RatePeerResult {
  txHash: `0x${string}`;
  blockNumber: bigint;
  ratingId: bigint;
}

// ─── Contract Addresses ───────────────────────────────────────────────────────

/** All Vaultfire contract addresses on Polygon PoS */
export interface VaultfirePolygonAddresses {
  USDC: Address;
  ERC8004IdentityRegistry: ContractAddress;
  AIPartnershipBondsV2: ContractAddress;
  AIAccountabilityBondsV2: ContractAddress;
  ERC8004ReputationRegistry: ContractAddress;
  ERC8004ValidationRegistry: ContractAddress;
  VaultfireERC8004Adapter: ContractAddress;
  VaultfireNameService: ContractAddress;
  FlourishingMetricsOracle: ContractAddress;
  MultisigGovernance: ContractAddress;
  VaultfireTeleporterBridge: ContractAddress;
  DilithiumAttestor: ContractAddress;
  ProductionBeliefAttestationVerifier: ContractAddress;
  BeliefAttestationVerifier: ContractAddress;
  MissionEnforcement: ContractAddress;
  AntiSurveillance: ContractAddress;
  PrivacyGuarantees: ContractAddress;
}

// ─── Client Config ────────────────────────────────────────────────────────────

/** Configuration for VaultfirePolygonClient */
export interface VaultfirePolygonClientConfig {
  /** Optional custom RPC URL (defaults to https://polygon-rpc.com) */
  rpcUrl?: string;
  /** Optional wallet private key for signing transactions */
  privateKey?: `0x${string}`;
  /** Optional wallet client injected by caller */
  walletClient?: unknown;
}

// ─── Chain Config ─────────────────────────────────────────────────────────────

/** Full Polygon PoS chain configuration */
export interface PolygonChainConfig {
  chain: string;
  chainId: number;
  rpc: string;
  explorer: string;
  explorerApi: string;
  usdc: Address;
  nativeToken: string;
  deployer: Address;
  contracts: VaultfirePolygonAddresses;
}
