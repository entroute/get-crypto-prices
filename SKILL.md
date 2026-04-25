---
name: get-crypto-prices
description: Fetch real-time cryptocurrency or token prices via a verified x402 pay-per-request endpoint. Use when the user asks for the current price of a crypto asset (ETH, BTC, SOL, USDC, any ERC-20, etc.), token market data, historical token prices, or wants to monitor a coin without signing up for a paid API like CoinGecko or Moralis.
---

# Getting crypto prices via EntRoute

When the user asks for a crypto / token price, use this skill to fetch it from a ranked, fulfillment-verified x402 endpoint.

## Steps

1. **Resolve the capability.** The capability for token prices is `defi.token_price`. If the user's question is more specific (e.g. historical OHLC, token metadata, market cap), check the capability list first:

   ```bash
   curl -s https://api.entroute.com/capabilities | jq '.capabilities[] | select(.id | startswith("defi."))'
   ```

2. **Discover the best endpoint.** Call EntRoute's `/discover` endpoint:

   ```bash
   curl -s -X POST https://api.entroute.com/discover \
     -H "Content-Type: application/json" \
     -d '{
       "capability_id": "defi.token_price",
       "constraints": {"network": "base", "verified_only": true},
       "preferences": {"ranking_preset": "reliability"}
     }'
   ```

   Take `ranked_endpoints[0]`. The response includes `url`, `method`, `payment`, and a `sample_request` showing exactly which params the endpoint expects.

3. **Call the endpoint.** Build a request matching `sample_request`. The endpoint will respond `402 Payment Required` with an x402 quote.

4. **Pay with x402.** If the user has the MCP server (`@entroute/mcp-server`) or the SDK (`@entroute/sdk-agent-ts`) installed, call `call_paid_api` / `discoverAndCall` and it handles the 402 → sign → retry automatically. Otherwise, explain that they need an x402 client or a funded wallet on Base.

5. **Return the result.** Parse the JSON response and extract the price field. Different providers return different shapes — use `sample_response` from the discovery result to know what to expect.

## Preferred approach

If the user is running Claude Code with `@entroute/mcp-server` configured, use the MCP tools `discover_paid_api` and `call_paid_api` directly instead of calling the REST API manually. They handle discovery + payment in one step.

## Notes

- Default network is Base; pricing is USDC. Most endpoints cost $0.001–$0.01 per call.
- If no endpoints match the constraints, widen them (remove `network`, raise `max_price`, set `verified_only: false`) and retry.
- Full docs: https://entroute.com/docs/quickstart
