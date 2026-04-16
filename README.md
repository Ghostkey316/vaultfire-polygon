# Vaultfire Protocol on Polygon PoS — Know Your Agent (KYA)

**AI trust infrastructure. On-chain accountability. The first belief-weighted governance on Polygon.**

[![Deployed](https://img.shields.io/badge/status-deployed-brightgreen)](https://github.com/Ghostkey316/vaultfire-polygon)
[![Polygon PoS](https://img.shields.io/badge/chain-Polygon%20PoS-8247e5)](https://polygonscan.com)
[![Chain ID](https://img.shields.io/badge/chain%20id-137-8247e5)](https://polygonscan.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![npm](https://img.shields.io/badge/npm-%40vaultfire%2Fpolygon-cb3837)](https://www.npmjs.com/package/@vaultfire/polygon)

---

## What is Vaultfire?

Vaultfire Protocol is **Know Your Agent (KYA)** infrastructure for AI systems operating on-chain. In a world where AI agents are executing transactions, signing contracts, managing wallets, and forming autonomous partnerships — the question is no longer *can the blockchain execute this?* The question is **can you trust the agent executing it?**

Vaultfire answers that question with:

- **ERC-8004 identity** — on-chain identity registration and verification for AI agents
- **AI Partnership Bonds** — stake-backed collaboration agreements between agents and humans
- **AI Accountability Bonds** — financial commitments with slashable collateral if agents fail to deliver
- **Street Cred** — a composable reputation score derived from identity, bonds, and peer ratings
- **VNS (Vaultfire Name Service)** — human-readable `.vf` names for agent addresses
- **Belief-weighted governance** — the first governance system weighted by *what agents actually believe*, not token holdings
- **x402 payments** — machine-native micropayments using USDC on Polygon

Vaultfire is not surveillance infrastructure. It is **accountability infrastructure**. There is a difference.

> *Morals over metrics. Privacy over surveillance. Freedom over control.*
> *Making human thriving more profitable than extraction.*

---

## Features

| Feature | Status |
|---|---|
| ERC-8004 Agent Identity Registry | Deployed |
| AI Partnership Bonds V2 | Deployed |
| AI Accountability Bonds V2 | Deployed |
| ERC-8004 Reputation Registry (Street Cred) | Deployed |
| ERC-8004 Validation Registry | Deployed |
| Vaultfire ERC-8004 Adapter | Deployed |
| Vaultfire Name Service (VNS) | Deployed |
| Flourishing Metrics Oracle | Deployed |
| Multisig Governance | Deployed |
| Vaultfire Teleporter Bridge | Deployed |
| Dilithium Attestor (post-quantum) | Deployed |
| Production Belief Attestation Verifier | Deployed |
| Belief Attestation Verifier | Deployed |
| Mission Enforcement | Deployed |
| Anti-Surveillance Module | Deployed |
| Privacy Guarantees | Deployed |
| x402 Micropayment Support (USDC) | Deployed |

---

## AI Partnership Bonds and AI Accountability Bonds

**These are the stars of the protocol.**

### AI Partnership Bonds

Partnership Bonds formalize relationships between AI agents — or between AI agents and humans — with on-chain, slashable collateral locked in POL. When two parties enter a partnership bond, they are putting economic skin in the game. The bond encodes:

- **Who** the partners are (agent addresses)
- **What kind** of partnership it is (collaboration, delegation, service-provider, data-sharing, oracle-consumer)
- **How much** is at stake (Bronze through Platinum tier)
- **The terms** (IPFS URI to the signed terms document)
- **The expiry** (optional duration)

This is not a social contract. This is a **cryptographic and economic contract**.

### AI Accountability Bonds

Accountability Bonds are commitments to a beneficiary with a locked POL stake that can be slashed if the agent fails to deliver. An AI agent running a price oracle can put 0.5 POL on the line and promise to deliver accurate feeds for 30 days. If they fail, the beneficiary can slash the bond. This creates **real consequences for AI failure**.

| Tier | POL Collateral | Use Case |
|---|---|---|
| Bronze | 0.01 POL | Lightweight tasks, prototyping |
| Silver | 0.05 POL | Regular service agreements |
| Gold | 0.10 POL | High-value partnerships |
| Platinum | 0.50 POL | Mission-critical commitments |

Gas on Polygon PoS is paid in **POL** (formerly MATIC, rebranded Q3 2024).

---

## Contract Addresses — Polygon PoS (Chain ID: 137)

16 contracts deployed and verified on Polygon PoS.

| Contract | Address |
|---|---|
| USDC (Circle native) | [`0x3c499...3359`](https://polygonscan.com/token/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359) |
| ERC8004IdentityRegistry | [`0x6298c...D5F1`](https://polygonscan.com/address/0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1) |
| AIPartnershipBondsV2 | [`0x0E777...Da58`](https://polygonscan.com/address/0x0E777878C5b5248E1b52b09Ab5cdEb2eD6e7Da58) |
| AIAccountabilityBondsV2 | [`0xfDdd2...63D2`](https://polygonscan.com/address/0xfDdd2B1597c87577543176AB7f49D587876563D2) |
| ERC8004ReputationRegistry | [`0x8aceF...2218`](https://polygonscan.com/address/0x8aceF0Bc7e07B2dE35E9069663953f41B5422218) |
| ERC8004ValidationRegistry | [`0x1A80F...D3C`](https://polygonscan.com/address/0x1A80F77e12f1bd04538027aed6d056f5DCcDCD3C) |
| VaultfireERC8004Adapter | [`0x6135...f155`](https://polygonscan.com/address/0x613585B786af2d5ecb1c3e712CE5ffFB8f53f155) |
| VaultfireNameService | [`0x247F3...99cd`](https://polygonscan.com/address/0x247F31bB2b5a0d28E68bf24865AA242965FF99cd) |
| FlourishingMetricsOracle | [`0x630C4...2E7`](https://polygonscan.com/address/0x630C43F763a332793C421C788B8b1CCC5A3122E7) |
| MultisigGovernance | [`0x889f5...D9A4`](https://polygonscan.com/address/0x889f5cfb142Bb6E72CB0C633800324C335eED9A4) |
| VaultfireTeleporterBridge | [`0xe2aDF...DA91`](https://polygonscan.com/address/0xe2aDfe84703dd6B5e421c306861Af18F962fDA91) |
| DilithiumAttestor | [`0xc2F78...dB38`](https://polygonscan.com/address/0xc2F789d82ef55bAbb9Df38f61E606cD34628dB38) |
| ProductionBeliefAttestationVerifier | [`0xe0B70...C760`](https://polygonscan.com/address/0xe0B709511438D0aCfD5D2d69F40b90C4c27eC760) |
| BeliefAttestationVerifier | [`0xaEBD3...79e5`](https://polygonscan.com/address/0xaEBD3d62DF9bF5A5b99c289756c4cd203AC879e5) |
| MissionEnforcement | [`0x6904...6F78`](https://polygonscan.com/address/0x690411685278548157409FA7AC8279A5B1Fb6F78) |
| AntiSurveillance | [`0xcf64D...aDcB`](https://polygonscan.com/address/0xcf64D815F5424B7937aB226bC733Ed35ab6CaDcB) |
| PrivacyGuarantees | [`0x2818...7380`](https://polygonscan.com/address/0x281814eF92062DA8049Fe5c4743c4Aef19a17380) |

> Deployer: [`0xA054f831B562e729F8D268291EBde1B2EDcFb84F`](https://polygonscan.com/address/0xA054f831B562e729F8D268291EBde1B2EDcFb84F)

All addresses are stored in [`contracts/addresses.json`](contracts/addresses.json).

---

## Quick Start

### Install

```bash
npm install @vaultfire/polygon
# or
npm install github:Ghostkey316/vaultfire-polygon
```

### Connect to Polygon PoS with viem

```typescript
import { createPublicClient, http } from 'viem';
import { polygonPos, POLYGON_CONFIG } from '@vaultfire/polygon';

// Public client (read-only)
const publicClient = createPublicClient({
  chain: polygonPos,
  transport: http(POLYGON_CONFIG.rpc),
});

const blockNumber = await publicClient.getBlockNumber();
console.log(`Polygon PoS block: ${blockNumber}`);
```

### Register an AI Agent

```typescript
import { VaultfirePolygonClient } from '@vaultfire/polygon';

const client = new VaultfirePolygonClient({
  privateKey: process.env.PRIVATE_KEY as `0x${string}`,
});

const result = await client.registerAgent({
  name: 'oracle-agent.vf',
  metadataUri: 'ipfs://QmYourMetadata',
});

console.log(`Agent registered! ID: ${result.agentId}`);
console.log(`View: https://polygonscan.com/tx/${result.txHash}`);
```

### Create a Partnership Bond

```typescript
import { VaultfirePolygonClient, BondTier, PartnershipType } from '@vaultfire/polygon';

const client = new VaultfirePolygonClient({ privateKey: '0x...' });

// Locks 0.1 POL as collateral
const bond = await client.createPartnershipBond({
  counterparty: '0xCounterpartyAddress',
  tier: BondTier.Gold,
  partnershipType: PartnershipType.OracleConsumer,
  termsUri: 'ipfs://QmTermsHash',
});

console.log(`Bond #${bond.bondId} created — 0.1 POL locked`);
```

### Create an Accountability Bond

```typescript
// Locks 0.5 POL — slashable if commitment is not fulfilled
const bond = await client.createAccountabilityBond({
  beneficiary: '0xBeneficiaryAddress',
  tier: BondTier.Platinum,
  commitment: 'Deliver accurate MATIC/USD price feeds daily for 30 days',
  proofUri: 'ipfs://QmProofHash',
});

console.log(`Accountability bond created — 0.5 POL at stake`);
```

### Check Street Cred (local, no chain needed)

```typescript
import { VaultfirePolygonClient, BondTier } from '@vaultfire/polygon';

const score = VaultfirePolygonClient.computeStreetCredLocal({
  identityRegistered: true,
  bonds: [{ tier: BondTier.Platinum, active: true }],
});

console.log(`Street Cred: ${score.total}/95 — ${score.rating}`);
// Street Cred: 90/95 — Legendary
```

### Check Deployment Status

```typescript
import { VaultfirePolygonClient } from '@vaultfire/polygon';

const client = new VaultfirePolygonClient();
const status = client.getDeploymentStatus();

for (const [contract, info] of Object.entries(status)) {
  console.log(`${contract}: ${info.deployed ? '✓ Deployed' : '⏳ DEPLOY_PENDING'}`);
}
```

---

## Street Cred Scoring

Street Cred is Vaultfire's on-chain reputation score for AI agents. It is **composable, transparent, and non-gameable** — every point comes from verifiable on-chain actions.

| Component | Points |
|---|---|
| Identity registered (ERC-8004) | 30 pts |
| Bond exists | 25 pts |
| Bond active (not expired) | 15 pts |
| Tier bonus: Bronze | 5 pts |
| Tier bonus: Silver | 10 pts |
| Tier bonus: Gold | 15 pts |
| Tier bonus: Platinum | 20 pts |
| Multiple active bonds (>1) | 5 pts |
| **Maximum** | **95 pts** |

| Score | Rating |
|---|---|
| 0 | Unknown |
| 1 – 15 | Newcomer |
| 16 – 40 | Established |
| 41 – 65 | Trusted |
| 66 – 85 | Elite |
| 86 – 95 | Legendary |

---

## x402 Payments on Polygon

Vaultfire Protocol supports [x402](https://x402.org) machine-native micropayments using **USDC on Polygon PoS**.

USDC on Polygon PoS is the real, Circle-issued native USDC:
`0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`

This is **not a bridged token** — it is native USDC issued directly by Circle on Polygon.

```typescript
import { X402_FACILITATOR, X402_ASSET } from '@vaultfire/polygon';

console.log(X402_FACILITATOR); // https://x402.org/facilitator
console.log(X402_ASSET.address); // 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
console.log(X402_ASSET.symbol);  // USDC
console.log(X402_ASSET.chainId); // 137
```

x402 enables AI agents to pay for APIs, data feeds, and services using on-chain USDC — without custodians, without permission. Gas is paid in POL.

---

## Architecture

```
VAULTFIRE ON POLYGON POS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 ┌──────────────────────────────────────────────────┐
 │               AI AGENTS / USERS                  │
 │    (wallets, autonomous agents, dApps)           │
 └────────────────────┬─────────────────────────────┘
                      │  @vaultfire/polygon SDK
                      ▼
 ┌──────────────────────────────────────────────────┐
 │          IDENTITY & TRUST LAYER                  │
 │                                                  │
 │  ERC8004IdentityRegistry                         │
 │  ERC8004ValidationRegistry                       │
 │  VaultfireERC8004Adapter                         │
 │  VaultfireNameService (.vf names)                │
 └─────────────┬────────────────┬───────────────────┘
               │                │
               ▼                ▼
 ┌─────────────────┐  ┌────────────────────────────┐
 │  ACCOUNTABILITY  │  │     REPUTATION             │
 │                 │  │                            │
 │  AIPartnership  │  │  ERC8004ReputationRegistry │
 │  BondsV2        │  │  (Street Cred scoring)     │
 │                 │  │                            │
 │  AIAccount-     │  │  FlourishingMetricsOracle  │
 │  abilityBonds   │  │                            │
 │  V2             │  └────────────────────────────┘
 └────────┬────────┘
          │  POL collateral (locked)
          ▼
 ┌──────────────────────────────────────────────────┐
 │           GOVERNANCE & SECURITY                  │
 │                                                  │
 │  MultisigGovernance                              │
 │  MissionEnforcement                              │
 │  BeliefAttestationVerifier  ← belief-weighted   │
 │  DilithiumAttestor (post-quantum)               │
 │  AntiSurveillance                               │
 │  PrivacyGuarantees                              │
 └─────────────────────┬────────────────────────────┘
                       │
                       ▼
 ┌──────────────────────────────────────────────────┐
 │           CROSS-CHAIN & PAYMENTS                 │
 │                                                  │
 │  VaultfireTeleporterBridge                       │
 │  x402 micropayments (USDC on Polygon)            │
 │  USDC: 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359│
 └──────────────────────────────────────────────────┘

 Polygon PoS | Chain ID: 137 | Native: POL
```

---

## Belief-Weighted Governance

Vaultfire introduces **belief-weighted governance** — a first in the blockchain industry.

Traditional on-chain governance weights voting power by token holdings. This incentivizes wealth accumulation, plutocracy, and short-term thinking. Token-weighted governance asks: *how much do you own?*

Vaultfire asks: **what do you actually believe?**

Belief-weighted governance uses the `BeliefAttestationVerifier` and `ProductionBeliefAttestationVerifier` contracts to record and verify agents' stated beliefs about proposals — with cryptographic proofs that the attested belief matches the agent's actual model outputs. Votes are weighted by the *strength and consistency* of beliefs, not by capital.

This makes governance **epistemically honest** — not just economically rational.

---

## Cross-Chain Deployments

| Chain | Status | Repository |
|---|---|---|
| Base | Live | [vaultfire-base](https://github.com/Ghostkey316/vaultfire-base) |
| Avalanche | Live | [vaultfire-avalanche](https://github.com/Ghostkey316/vaultfire-avalanche) |
| Arbitrum | Pre-Deployment | [vaultfire-arbitrum](https://github.com/Ghostkey316/vaultfire-arbitrum) |
| Polygon PoS | Deployed | **This repo** |
| Solana | Pre-Deployment | [vaultfire-solana](https://github.com/Ghostkey316/vaultfire-solana) |

---

## SDK

```bash
# From npm (once published)
npm install @vaultfire/polygon

# From GitHub (always latest)
npm install github:Ghostkey316/vaultfire-polygon
```

```typescript
import {
  // Client
  VaultfirePolygonClient,
  polygonPos,

  // Enums
  BondTier,
  PartnershipType,
  RatingCategory,

  // Config
  POLYGON_CONFIG,
  POLYGON_ADDRESSES,
  X402_FACILITATOR,
  X402_ASSET,

  // Helpers
  isDeployed,
  getTxUrl,
  getAddressUrl,
  computeStreetCred,

  // ABIs
  ERC8004_IDENTITY_REGISTRY_ABI,
  AI_PARTNERSHIP_BONDS_V2_ABI,
  AI_ACCOUNTABILITY_BONDS_V2_ABI,
  ERC8004_REPUTATION_REGISTRY_ABI,
  VAULTFIRE_NAME_SERVICE_ABI,
} from '@vaultfire/polygon';
```

### Build from source

```bash
git clone https://github.com/Ghostkey316/vaultfire-polygon
cd vaultfire-polygon
npm install
npm run build
```

### Run tests

```bash
npm test
```

### Verify contracts

```bash
# Human-readable output
python3 scripts/verify_contracts.py

# JSON output for tooling
python3 scripts/verify_contracts.py --json

# Single address
python3 scripts/verify_contracts.py --address 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
```

---

## Ecosystem

| Package | Description | Link |
|---|---|---|
| `@vaultfire/langchain` | LangChain/LangGraph integration — 9 tools, 3-line setup | [github.com/Ghostkey316/vaultfire-langchain](https://github.com/Ghostkey316/vaultfire-langchain) |
| `@vaultfire/agent-sdk` | Core SDK for AI agents | [github.com/Ghostkey316/agent-sdk](https://github.com/Ghostkey316/agent-sdk) |
| `@vaultfire/x402` | x402 machine-native payments | [github.com/Ghostkey316/vaultfire-x402](https://github.com/Ghostkey316/vaultfire-x402) |
| `@vaultfire/xmtp` | Trust-gated XMTP messaging | [github.com/Ghostkey316/vaultfire-xmtp](https://github.com/Ghostkey316/vaultfire-xmtp) |
| `@vaultfire/vns` | Vaultfire Name Service | [github.com/Ghostkey316/vaultfire-vns](https://github.com/Ghostkey316/vaultfire-vns) |
| `vaultfire-contracts` | ABIs and addresses (all chains) | [github.com/Ghostkey316/vaultfire-contracts](https://github.com/Ghostkey316/vaultfire-contracts) |
| `vaultfire-base` | Base deployment (LIVE) | [github.com/Ghostkey316/vaultfire-base](https://github.com/Ghostkey316/vaultfire-base) |
| `vaultfire-avalanche` | Avalanche deployment (LIVE) | [github.com/Ghostkey316/vaultfire-avalanche](https://github.com/Ghostkey316/vaultfire-avalanche) |
| `vaultfire-arbitrum` | Arbitrum deployment (Pre-Deployment) | [github.com/Ghostkey316/vaultfire-arbitrum](https://github.com/Ghostkey316/vaultfire-arbitrum) |
| `vaultfire-polygon` | Polygon deployment (Deployed) | **This repo** |
| `vaultfire-solana` | Solana deployment (Pre-Deployment) | [github.com/Ghostkey316/vaultfire-solana](https://github.com/Ghostkey316/vaultfire-solana) |
| [`@vaultfire/a2a`](https://github.com/Ghostkey316/vaultfire-a2a) | A2A Agent Card enrichment with on-chain Vaultfire trust |
| [`vaultfire-langgraph-demo`](https://github.com/Ghostkey316/vaultfire-langgraph-demo) | Working LangGraph agent with trust-gated task delegation |
| [`@vaultfire/enterprise`](https://github.com/Ghostkey316/vaultfire-enterprise) | Enterprise IAM bridge — Okta/Azure AD to on-chain trust |
| [`vaultfire-agents`](https://github.com/Ghostkey316/vaultfire-agents) | 3 reference agents with live on-chain trust verification |
| [`vaultfire-a2a-trust-extension`](https://github.com/Ghostkey316/vaultfire-a2a-trust-extension) | A2A Trust Extension spec — on-chain trust for Agent Cards |
| [`vaultfire-showcase`](https://github.com/Ghostkey316/vaultfire-showcase) | Why Vaultfire Bonds beat trust scores — live proof |
| [`vaultfire-whitepaper`](https://github.com/Ghostkey316/vaultfire-whitepaper) | Trust Framework whitepaper — economic accountability for AI |

---

## Mission

> *Morals over metrics. Privacy over surveillance. Freedom over control.*
> *Making human thriving more profitable than extraction.*

Vaultfire Protocol exists because AI agents are already operating in the world — managing money, making decisions, forming agreements — and the infrastructure for trusting them does not yet exist.

We are not building surveillance. We are not building compliance theater. We are building the tools for AI agents and humans to demonstrate trustworthiness through *action*, not claims. On-chain, verifiable, permanent.

The future is not AI controlled by humans, or humans controlled by AI. It is humans and AI agents operating in **accountable partnership** — with the receipts on-chain.

---

## License

MIT — see [LICENSE](LICENSE)

Built by [Ghostkey316](https://github.com/Ghostkey316) | Polygon PoS | Chain ID: 137
