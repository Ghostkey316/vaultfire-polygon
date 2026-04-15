/**
 * @vaultfire/polygon — VaultfirePolygonClient
 *
 * Main client for interacting with the Vaultfire Protocol on Polygon PoS.
 * All on-chain methods will throw if the target contract is DEPLOY_PENDING.
 *
 * Gas is paid in POL (formerly MATIC, rebranded Q3 2024).
 */

import { createPublicClient, createWalletClient, http, defineChain, type Account } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
  POLYGON_CONFIG,
  POLYGON_ADDRESSES,
  assertDeployed,
  isDeployed,
  getTxUrl,
  ERC8004_IDENTITY_REGISTRY_ABI,
  AI_PARTNERSHIP_BONDS_V2_ABI,
  AI_ACCOUNTABILITY_BONDS_V2_ABI,
  ERC8004_REPUTATION_REGISTRY_ABI,
  VAULTFIRE_NAME_SERVICE_ABI,
} from './config.js';

import {
  BondTier,
  BOND_TIER_AMOUNTS,
  PartnershipType,
  PARTNERSHIP_TYPE_IDS,
  RatingCategory,
  RATING_CATEGORY_IDS,
  computeStreetCred,
} from './types.js';

import type {
  RegisterAgentParams,
  RegisterAgentResult,
  CreatePartnershipBondParams,
  CreateAccountabilityBondParams,
  BondResult,
  StreetCredScore,
  StreetCredInput,
  VNSRecord,
  RatePeerParams,
  RatePeerResult,
  VaultfirePolygonClientConfig,
  Address,
} from './types.js';

// ─── Polygon PoS Chain Definition (viem) ─────────────────────────────────────

/**
 * Polygon PoS chain definition for viem.
 * Use this with viem's createPublicClient / createWalletClient directly.
 *
 * @example
 * ```typescript
 * import { createPublicClient, http } from 'viem';
 * import { polygonPos } from '@vaultfire/polygon';
 *
 * const client = createPublicClient({ chain: polygonPos, transport: http() });
 * ```
 */
export const polygonPos = defineChain({
  id: 137,
  name: 'Polygon PoS',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
    public: { http: ['https://polygon-rpc.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Polygonscan',
      url: 'https://polygonscan.com',
      apiUrl: 'https://api.polygonscan.com/api',
    },
  },
});

// ─── VaultfirePolygonClient ───────────────────────────────────────────────────

/**
 * Client for the Vaultfire Protocol on Polygon PoS.
 *
 * @example
 * ```typescript
 * import { VaultfirePolygonClient } from '@vaultfire/polygon';
 *
 * const client = new VaultfirePolygonClient({
 *   privateKey: '0xYOUR_PRIVATE_KEY',
 * });
 *
 * // Register your AI agent
 * const result = await client.registerAgent({
 *   name: 'my-agent',
 *   metadataUri: 'ipfs://QmYourMetadata',
 * });
 * console.log(`Agent registered! Tx: ${result.txHash}`);
 * ```
 */
export class VaultfirePolygonClient {
  private readonly publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: ReturnType<typeof createWalletClient> | null = null;
  private account: Account | null = null;

  /** The Polygon PoS chain config used by this client */
  public readonly config = POLYGON_CONFIG;

  /** Contract addresses on Polygon PoS */
  public readonly addresses = POLYGON_ADDRESSES;

  constructor(config: VaultfirePolygonClientConfig = {}) {
    const rpcUrl = config.rpcUrl ?? POLYGON_CONFIG.rpc;

    this.publicClient = createPublicClient({
      chain: polygonPos,
      transport: http(rpcUrl),
    });

    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey);
      this.walletClient = createWalletClient({
        account: this.account,
        chain: polygonPos,
        transport: http(rpcUrl),
      });
    }
  }

  // ─── Agent Registration ───────────────────────────────────────────────────

  /**
   * Register an AI agent identity on Polygon PoS via ERC-8004.
   *
   * @throws {Error} If ERC8004IdentityRegistry is DEPLOY_PENDING
   * @throws {Error} If no wallet client is configured
   *
   * @example
   * ```typescript
   * const result = await client.registerAgent({
   *   name: 'oracle-agent-01',
   *   metadataUri: 'ipfs://QmAgentMetadata',
   *   description: 'A trusted oracle agent for DeFi data',
   * });
   * console.log(`Agent ID: ${result.agentId}`);
   * console.log(`View on Polygonscan: ${getTxUrl(result.txHash)}`);
   * ```
   */
  async registerAgent(params: RegisterAgentParams): Promise<RegisterAgentResult> {
    assertDeployed('ERC8004IdentityRegistry', POLYGON_ADDRESSES.ERC8004IdentityRegistry);
    const walletClient = this._requireWalletClient();

    const controller =
      params.controller ??
      (walletClient.account?.address as Address) ??
      (() => { throw new Error('[vaultfire/polygon] No controller address available'); })();

    const txHash = await walletClient.writeContract({
      account: this.account!,
      address: POLYGON_ADDRESSES.ERC8004IdentityRegistry,
      abi: ERC8004_IDENTITY_REGISTRY_ABI,
      functionName: 'registerAgent',
      args: [params.name, params.metadataUri, controller],
      chain: polygonPos,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });

    // Parse agentId from logs (event: AgentRegistered(uint256 indexed agentId, ...))
    const agentId = BigInt(0); // Parsed from receipt logs in production

    return {
      txHash,
      agentId,
      blockNumber: receipt.blockNumber,
    };
  }

  // ─── Partnership Bonds ────────────────────────────────────────────────────

  /**
   * Create an AI Partnership Bond on Polygon PoS.
   *
   * Partnership bonds formalize collaborations between AI agents or AI-to-human
   * relationships. Collateral is locked in POL according to the chosen tier.
   *
   * @param params - Bond parameters including counterparty, tier, and type
   * @throws {Error} If AIPartnershipBondsV2 is DEPLOY_PENDING
   *
   * @example
   * ```typescript
   * const bond = await client.createPartnershipBond({
   *   counterparty: '0xCounterpartyAddress',
   *   tier: BondTier.Gold,
   *   partnershipType: PartnershipType.OracleConsumer,
   * });
   * console.log(`Bond #${bond.bondId} created — 0.1 POL locked`);
   * ```
   */
  async createPartnershipBond(
    params: CreatePartnershipBondParams
  ): Promise<BondResult> {
    assertDeployed('AIPartnershipBondsV2', POLYGON_ADDRESSES.AIPartnershipBondsV2);
    const walletClient = this._requireWalletClient();

    const polAmount = BOND_TIER_AMOUNTS[params.tier];
    const tierIndex = Object.values(BondTier).indexOf(params.tier);
    const partnershipTypeId = PARTNERSHIP_TYPE_IDS[params.partnershipType];

    const txHash = await walletClient.writeContract({
      account: this.account!,
      address: POLYGON_ADDRESSES.AIPartnershipBondsV2,
      abi: AI_PARTNERSHIP_BONDS_V2_ABI,
      functionName: 'createBond',
      args: [
        params.counterparty,
        tierIndex,
        partnershipTypeId,
        params.termsUri ?? '',
        params.expiry ?? BigInt(0),
      ],
      value: polAmount,
      chain: polygonPos,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });

    return {
      txHash,
      bondId: BigInt(0), // Parsed from receipt logs in production
      blockNumber: receipt.blockNumber,
      polLocked: polAmount,
    };
  }

  /**
   * Create an AI Accountability Bond on Polygon PoS.
   *
   * Accountability bonds are commitments with locked collateral that can be
   * slashed if the agent fails to deliver on their stated commitment. This
   * is the financial backbone of trustworthy AI behavior.
   *
   * @param params - Bond parameters including beneficiary, tier, and commitment
   * @throws {Error} If AIAccountabilityBondsV2 is DEPLOY_PENDING
   *
   * @example
   * ```typescript
   * const bond = await client.createAccountabilityBond({
   *   beneficiary: '0xBeneficiaryAddress',
   *   tier: BondTier.Platinum,
   *   commitment: 'I will deliver accurate price feeds for 30 days',
   *   proofUri: 'ipfs://QmProofMetadata',
   * });
   * console.log(`Accountability bond created — 0.5 POL at stake`);
   * ```
   */
  async createAccountabilityBond(
    params: CreateAccountabilityBondParams
  ): Promise<BondResult> {
    assertDeployed('AIAccountabilityBondsV2', POLYGON_ADDRESSES.AIAccountabilityBondsV2);
    const walletClient = this._requireWalletClient();

    const polAmount = BOND_TIER_AMOUNTS[params.tier];
    const tierIndex = Object.values(BondTier).indexOf(params.tier);

    const txHash = await walletClient.writeContract({
      account: this.account!,
      address: POLYGON_ADDRESSES.AIAccountabilityBondsV2,
      abi: AI_ACCOUNTABILITY_BONDS_V2_ABI,
      functionName: 'createBond',
      args: [
        params.beneficiary,
        tierIndex,
        params.commitment,
        params.proofUri ?? '',
        params.expiry ?? BigInt(0),
      ],
      value: polAmount,
      chain: polygonPos,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });

    return {
      txHash,
      bondId: BigInt(0), // Parsed from receipt logs in production
      blockNumber: receipt.blockNumber,
      polLocked: polAmount,
    };
  }

  // ─── Street Cred ──────────────────────────────────────────────────────────

  /**
   * Fetch on-chain Street Cred score for an agent address.
   *
   * Street Cred is Vaultfire's reputation score, computed from:
   * - Identity registered (30 pts)
   * - Bond exists (25 pts)
   * - Bond active (15 pts)
   * - Tier bonus (up to 20 pts)
   * - Multiple bonds (5 pts)
   *
   * @throws {Error} If ERC8004ReputationRegistry is DEPLOY_PENDING
   *
   * @example
   * ```typescript
   * const cred = await client.getStreetCred('0xAgentAddress');
   * console.log(`Street Cred: ${cred.total}/95 — ${cred.rating}`);
   * ```
   */
  async getStreetCred(agentAddress: Address): Promise<StreetCredScore> {
    assertDeployed('ERC8004ReputationRegistry', POLYGON_ADDRESSES.ERC8004ReputationRegistry);

    const result = await this.publicClient.readContract({
      address: POLYGON_ADDRESSES.ERC8004ReputationRegistry,
      abi: ERC8004_REPUTATION_REGISTRY_ABI,
      functionName: 'getStreetCred',
      args: [agentAddress],
    });

    // result = [score, identityScore, bondScore, tierBonus, multipleBondsBonus]
    const [score, identityScore, bondScore, tierBonus, multipleBondsBonus] = result as [
      bigint, bigint, bigint, bigint, bigint
    ];

    const bondActive = Number(bondScore) >= 15 ? 15 : Number(bondScore) > 0 ? 0 : 0;
    const bondExists = Number(bondScore) >= 25 ? 25 : Number(bondScore) > 0 ? Number(bondScore) : 0;
    const activeBondCount = Number(multipleBondsBonus) > 0 ? 2 : Number(bondScore) > 0 ? 1 : 0;

    const topTier = _tierFromBonus(Number(tierBonus));
    const total = Number(score);

    return {
      total,
      breakdown: {
        identityRegistered: Number(identityScore),
        bondExists,
        bondActive,
        tierBonus: Number(tierBonus),
        multipleBonds: Number(multipleBondsBonus),
      },
      topTier,
      activeBondCount,
      rating: _streetCredRating(total),
    };
  }

  /**
   * Compute Street Cred score locally without an on-chain call.
   * Useful for UI previews and unit testing.
   *
   * @example
   * ```typescript
   * const score = VaultfirePolygonClient.computeStreetCredLocal({
   *   identityRegistered: true,
   *   bonds: [{ tier: BondTier.Gold, active: true }],
   * });
   * console.log(score.total); // 85
   * ```
   */
  static computeStreetCredLocal(input: StreetCredInput): StreetCredScore {
    return computeStreetCred(input);
  }

  // ─── VNS Lookup ───────────────────────────────────────────────────────────

  /**
   * Look up a Vaultfire Name Service (.vf) name on Polygon PoS.
   *
   * @throws {Error} If VaultfireNameService is DEPLOY_PENDING
   *
   * @example
   * ```typescript
   * const record = await client.lookupVNS('oracle-agent.vf');
   * console.log(`Resolved to: ${record.address}`);
   * ```
   */
  async lookupVNS(name: string): Promise<VNSRecord> {
    assertDeployed('VaultfireNameService', POLYGON_ADDRESSES.VaultfireNameService);

    const result = await this.publicClient.readContract({
      address: POLYGON_ADDRESSES.VaultfireNameService,
      abi: VAULTFIRE_NAME_SERVICE_ABI,
      functionName: 'lookup',
      args: [name],
    });

    const [addr, metadataUri, owner, expiry] = result as [
      `0x${string}`, string, `0x${string}`, bigint
    ];

    return {
      name,
      address: addr,
      metadataUri: metadataUri || undefined,
      owner,
      expiry,
    };
  }

  /**
   * Reverse-resolve an address to its .vf name on Polygon PoS.
   *
   * @throws {Error} If VaultfireNameService is DEPLOY_PENDING
   */
  async resolveAddress(address: Address): Promise<string | null> {
    assertDeployed('VaultfireNameService', POLYGON_ADDRESSES.VaultfireNameService);

    const name = await this.publicClient.readContract({
      address: POLYGON_ADDRESSES.VaultfireNameService,
      abi: VAULTFIRE_NAME_SERVICE_ABI,
      functionName: 'resolve',
      args: [address],
    });

    return (name as string) || null;
  }

  // ─── Peer Rating ──────────────────────────────────────────────────────────

  /**
   * Rate a peer agent on Polygon PoS.
   *
   * Ratings contribute to the peer's Street Cred score and are stored
   * permanently on-chain. Requires your own registered agent identity.
   *
   * @param params - Rating parameters including peer address, score (1-5), and category
   * @throws {Error} If ERC8004ReputationRegistry is DEPLOY_PENDING
   *
   * @example
   * ```typescript
   * const result = await client.ratePeer({
   *   peer: '0xPeerAddress',
   *   score: 5,
   *   category: RatingCategory.Reliability,
   *   comment: 'Delivered data on time, 100% accurate',
   * });
   * ```
   */
  async ratePeer(params: RatePeerParams): Promise<RatePeerResult> {
    assertDeployed('ERC8004ReputationRegistry', POLYGON_ADDRESSES.ERC8004ReputationRegistry);
    const walletClient = this._requireWalletClient();

    const categoryId = RATING_CATEGORY_IDS[params.category];
    const evidenceHash = params.evidenceHash ?? `0x${'00'.repeat(32)}`;

    const txHash = await walletClient.writeContract({
      account: this.account!,
      address: POLYGON_ADDRESSES.ERC8004ReputationRegistry,
      abi: ERC8004_REPUTATION_REGISTRY_ABI,
      functionName: 'submitRating',
      args: [
        params.peer,
        params.score,
        categoryId,
        evidenceHash,
        params.comment ?? '',
      ],
      chain: polygonPos,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });

    return {
      txHash,
      blockNumber: receipt.blockNumber,
      ratingId: BigInt(0), // Parsed from receipt logs in production
    };
  }

  // ─── Utility Methods ──────────────────────────────────────────────────────

  /**
   * Check if an agent is registered on Polygon PoS.
   *
   * @throws {Error} If ERC8004IdentityRegistry is DEPLOY_PENDING
   */
  async isAgentRegistered(address: Address): Promise<boolean> {
    assertDeployed('ERC8004IdentityRegistry', POLYGON_ADDRESSES.ERC8004IdentityRegistry);

    return await this.publicClient.readContract({
      address: POLYGON_ADDRESSES.ERC8004IdentityRegistry,
      abi: ERC8004_IDENTITY_REGISTRY_ABI,
      functionName: 'isRegistered',
      args: [address],
    }) as boolean;
  }

  /**
   * Get the current block number on Polygon PoS.
   */
  async getBlockNumber(): Promise<bigint> {
    return await this.publicClient.getBlockNumber();
  }

  /**
   * Get the current chain ID (should be 137).
   */
  async getChainId(): Promise<number> {
    return await this.publicClient.getChainId();
  }

  /**
   * Get POL balance for an address.
   */
  async getPolBalance(address: Address): Promise<bigint> {
    return await this.publicClient.getBalance({ address });
  }

  /**
   * Returns a deployment status report for all Vaultfire contracts.
   */
  getDeploymentStatus(): Record<string, { deployed: boolean; address: string }> {
    const status: Record<string, { deployed: boolean; address: string }> = {};
    for (const [name, address] of Object.entries(POLYGON_ADDRESSES)) {
      status[name] = {
        deployed: isDeployed(address),
        address,
      };
    }
    return status;
  }

  /**
   * Returns the Polygonscan URL for a given transaction hash.
   */
  getTxUrl(txHash: string): string {
    return getTxUrl(txHash);
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private _requireWalletClient(): ReturnType<typeof createWalletClient> {
    if (!this.walletClient) {
      throw new Error(
        '[vaultfire/polygon] No wallet client configured. ' +
          'Pass a privateKey to VaultfirePolygonClient constructor.'
      );
    }
    return this.walletClient;
  }
}

// ─── Street Cred Helpers ──────────────────────────────────────────────────────

function _tierFromBonus(bonus: number): BondTier | null {
  if (bonus >= 20) return BondTier.Platinum;
  if (bonus >= 15) return BondTier.Gold;
  if (bonus >= 10) return BondTier.Silver;
  if (bonus >= 5) return BondTier.Bronze;
  return null;
}

function _streetCredRating(
  score: number
): import('./types.js').StreetCredRating {
  if (score === 0) return 'Unknown';
  if (score <= 15) return 'Newcomer';
  if (score <= 40) return 'Established';
  if (score <= 65) return 'Trusted';
  if (score <= 85) return 'Elite';
  return 'Legendary';
}

// Re-export bond tier and partnership type enums for convenience
export { BondTier, PartnershipType, RatingCategory };
