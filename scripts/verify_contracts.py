#!/usr/bin/env python3
"""
verify_contracts.py — Vaultfire Protocol on Polygon PoS
========================================================

Verifies that deployed contracts have bytecode at their addresses on Polygon PoS
(Chain ID: 137) using the Polygonscan API and public JSON-RPC.

Usage:
    python3 verify_contracts.py
    python3 verify_contracts.py --json
    python3 verify_contracts.py --address 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
    python3 verify_contracts.py --rpc https://polygon-rpc.com

DEPLOY_PENDING contracts are skipped with a clear message.

Requirements: Python 3.8+ standard library only (urllib, json, argparse, sys)
"""

import json
import sys
import argparse
import urllib.request
import urllib.parse
import urllib.error
from typing import Optional

# ─── Chain & Contract Config ─────────────────────────────────────────────────

CHAIN_ID = 137
CHAIN_NAME = "Polygon PoS"
DEFAULT_RPC = "https://polygon-rpc.com"
EXPLORER_API = "https://api.polygonscan.com/api"
EXPLORER_URL = "https://polygonscan.com"
NATIVE_TOKEN = "POL"
DEPLOYER = "0xA054f831B562e729F8D268291EBde1B2EDcFb84F"

CONTRACTS = {
    "USDC": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    "ERC8004IdentityRegistry": "DEPLOY_PENDING",
    "AIPartnershipBondsV2": "DEPLOY_PENDING",
    "AIAccountabilityBondsV2": "DEPLOY_PENDING",
    "ERC8004ReputationRegistry": "DEPLOY_PENDING",
    "ERC8004ValidationRegistry": "DEPLOY_PENDING",
    "VaultfireERC8004Adapter": "DEPLOY_PENDING",
    "VaultfireNameService": "DEPLOY_PENDING",
    "FlourishingMetricsOracle": "DEPLOY_PENDING",
    "MultisigGovernance": "DEPLOY_PENDING",
    "VaultfireTeleporterBridge": "DEPLOY_PENDING",
    "DilithiumAttestor": "DEPLOY_PENDING",
    "ProductionBeliefAttestationVerifier": "DEPLOY_PENDING",
    "BeliefAttestationVerifier": "DEPLOY_PENDING",
    "MissionEnforcement": "DEPLOY_PENDING",
    "AntiSurveillance": "DEPLOY_PENDING",
    "PrivacyGuarantees": "DEPLOY_PENDING",
}

# ─── RPC Helper ───────────────────────────────────────────────────────────────

def eth_get_code(address: str, rpc_url: str) -> Optional[str]:
    """
    Call eth_getCode on the given address using JSON-RPC.
    Returns the bytecode hex string, or None on error.
    """
    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": "eth_getCode",
        "params": [address, "latest"],
        "id": 1,
    }).encode("utf-8")

    req = urllib.request.Request(
        rpc_url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("result", None)
    except (urllib.error.URLError, json.JSONDecodeError, KeyError) as exc:
        return None

def has_bytecode(code: Optional[str]) -> bool:
    """Returns True if the code is non-empty (deployed contract)."""
    return code is not None and code != "0x" and len(code) > 2

# ─── Verification Logic ───────────────────────────────────────────────────────

def verify_contract(name: str, address: str, rpc_url: str) -> dict:
    """Verify a single contract. Returns a result dict."""
    if address == "DEPLOY_PENDING":
        return {
            "name": name,
            "address": address,
            "status": "pending",
            "message": "DEPLOY_PENDING — contract not yet deployed on Polygon PoS",
            "has_bytecode": None,
            "explorer_url": None,
        }

    if not address.startswith("0x") or len(address) != 42:
        return {
            "name": name,
            "address": address,
            "status": "error",
            "message": f"Invalid address format: {address}",
            "has_bytecode": False,
            "explorer_url": None,
        }

    code = eth_get_code(address, rpc_url)
    deployed = has_bytecode(code)
    bytecode_len = (len(code) - 2) // 2 if code and code != "0x" else 0

    return {
        "name": name,
        "address": address,
        "status": "deployed" if deployed else "empty",
        "message": (
            f"Bytecode present ({bytecode_len:,} bytes)"
            if deployed
            else "No bytecode — address is an EOA or undeployed"
        ),
        "has_bytecode": deployed,
        "explorer_url": f"{EXPLORER_URL}/address/{address}",
        "bytecode_bytes": bytecode_len if deployed else 0,
    }

def run_verification(
    rpc_url: str,
    target_address: Optional[str] = None,
    as_json: bool = False,
) -> int:
    """
    Run verification for all contracts (or a single address if specified).
    Returns exit code: 0 = all deployed, 1 = some failed/pending.
    """
    results = []
    contracts_to_check = CONTRACTS.items()

    if target_address:
        # Find the contract name for this address, or use address as name
        name = next(
            (n for n, a in CONTRACTS.items() if a.lower() == target_address.lower()),
            target_address,
        )
        contracts_to_check = [(name, target_address)]

    if not as_json:
        print(f"\n{'='*60}")
        print(f"  Vaultfire Protocol — Contract Verification")
        print(f"  Chain:    {CHAIN_NAME} (ID: {CHAIN_ID})")
        print(f"  RPC:      {rpc_url}")
        print(f"  Deployer: {DEPLOYER}")
        print(f"{'='*60}\n")

    for name, address in contracts_to_check:
        result = verify_contract(name, address, rpc_url)
        results.append(result)

        if not as_json:
            status_icon = {
                "deployed": "✓",
                "pending":  "⏳",
                "empty":    "✗",
                "error":    "!",
            }.get(result["status"], "?")

            print(f"  {status_icon} {name}")
            print(f"    Address: {result['address']}")
            print(f"    Status:  {result['message']}")
            if result.get("explorer_url"):
                print(f"    Explorer: {result['explorer_url']}")
            print()

    # Summary
    deployed = [r for r in results if r["status"] == "deployed"]
    pending  = [r for r in results if r["status"] == "pending"]
    failed   = [r for r in results if r["status"] in ("empty", "error")]

    if as_json:
        output = {
            "chain": CHAIN_NAME,
            "chainId": CHAIN_ID,
            "rpc": rpc_url,
            "deployer": DEPLOYER,
            "summary": {
                "total": len(results),
                "deployed": len(deployed),
                "pending": len(pending),
                "failed": len(failed),
            },
            "contracts": results,
        }
        print(json.dumps(output, indent=2))
    else:
        print(f"{'─'*60}")
        print(f"  Summary: {len(results)} contracts checked")
        print(f"    ✓ Deployed:        {len(deployed)}")
        print(f"    ⏳ DEPLOY_PENDING: {len(pending)}")
        if failed:
            print(f"    ✗ Failed/empty:   {len(failed)}")
        print(f"{'─'*60}")

        if pending:
            print(
                f"\n  ℹ  {len(pending)} Vaultfire contract(s) are pre-deployment on Polygon PoS."
            )
            print(
                "     Follow https://github.com/Ghostkey316/vaultfire-polygon for updates.\n"
            )

        if failed:
            print(
                f"\n  ⚠  {len(failed)} address(es) returned no bytecode.\n"
            )

    # Exit 0 if all deployed or pending (expected state); 1 if something unexpected failed
    return 1 if failed else 0

# ─── CLI Entry Point ──────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Verify Vaultfire Protocol contract deployments on Polygon PoS (Chain ID: 137). "
            "DEPLOY_PENDING contracts are skipped with a clear status message."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 verify_contracts.py
  python3 verify_contracts.py --json
  python3 verify_contracts.py --address 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
  python3 verify_contracts.py --rpc https://rpc-mainnet.matic.network
        """,
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output results as JSON",
    )
    parser.add_argument(
        "--address",
        metavar="0x...",
        help="Check a single contract address",
    )
    parser.add_argument(
        "--rpc",
        default=DEFAULT_RPC,
        metavar="URL",
        help=f"JSON-RPC endpoint (default: {DEFAULT_RPC})",
    )

    args = parser.parse_args()
    return run_verification(
        rpc_url=args.rpc,
        target_address=args.address,
        as_json=args.json,
    )

if __name__ == "__main__":
    sys.exit(main())
