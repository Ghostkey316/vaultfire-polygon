/**
 * @vaultfire/polygon
 *
 * Vaultfire Protocol on Polygon PoS
 * AI agent trust, accountability bonds, and belief-weighted governance.
 *
 * Chain: Polygon PoS (Chain ID: 137)
 * Native Token: POL (formerly MATIC)
 * USDC: 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 (Circle native)
 *
 * @see https://github.com/Ghostkey316/vaultfire-polygon
 * @see https://polygonscan.com
 */

// ─── Client ───────────────────────────────────────────────────────────────────
export {
  VaultfirePolygonClient,
  polygonPos,
  BondTier,
  PartnershipType,
  RatingCategory,
} from './client.js';

// ─── Config ───────────────────────────────────────────────────────────────────
export {
  POLYGON_CONFIG,
  POLYGON_ADDRESSES,
  X402_FACILITATOR,
  X402_ASSET,
  isDeployed,
  assertDeployed,
  getTxUrl,
  getAddressUrl,
  getTokenUrl,
  ERC8004_IDENTITY_REGISTRY_ABI,
  AI_PARTNERSHIP_BONDS_V2_ABI,
  AI_ACCOUNTABILITY_BONDS_V2_ABI,
  ERC8004_REPUTATION_REGISTRY_ABI,
  VAULTFIRE_NAME_SERVICE_ABI,
} from './config.js';

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  Address,
  ContractAddress,
  RegisterAgentParams,
  RegisterAgentResult,
  CreatePartnershipBondParams,
  CreateAccountabilityBondParams,
  BondResult,
  StreetCredScore,
  StreetCredRating,
  StreetCredInput,
  VNSRecord,
  RatePeerParams,
  RatePeerResult,
  VaultfirePolygonClientConfig,
  VaultfirePolygonAddresses,
  PolygonChainConfig,
} from './types.js';

export {
  BOND_TIER_AMOUNTS,
  BOND_TIER_POL,
  PARTNERSHIP_TYPE_IDS,
  RATING_CATEGORY_IDS,
  STREET_CRED_TIER_BONUS,
  computeStreetCred,
} from './types.js';

// ─── Version ──────────────────────────────────────────────────────────────────
export const VERSION = '1.0.0';
export const CHAIN_ID = 137;
export const CHAIN_NAME = 'Polygon PoS';
export const NATIVE_TOKEN = 'POL';
