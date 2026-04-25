# get-crypto-prices

> Real-time crypto prices via verified x402 endpoints. No API key, no signup, ~$0.001 per call in USDC.

A tiny example that fetches live token prices without signing up for CoinGecko, Moralis, or any other paid API. [EntRoute](https://entroute.com) discovers the best-ranked, fulfillment-verified price endpoint; [x402](https://x402.org) handles payment.

**Why this exists:** CoinGecko Pro is $129/month. Moralis is $49/month. Most agents need crypto prices a few times a day, not 100k times a month — pay only when you call.

---

## Quickstart — Claude Code (recommended, zero config)

```bash
claude mcp add entroute -- npx @entroute/mcp-server
```

Then ask Claude: *"What's the current price of ETH?"* — it discovers a verified endpoint, pays in USDC on Base, and returns the answer. No API keys, no wallet setup, no env vars.

[About the MCP server →](https://entroute.com/docs/mcp)

---

## Use it from your own code

```bash
npm install @entroute/sdk-agent-ts
```

Inspect the top-ranked endpoint:

```ts
import { EntRouteClient } from '@entroute/sdk-agent-ts';

const client = new EntRouteClient({ baseUrl: 'https://api.entroute.com' });
const result = await client.discover({ capability_id: 'defi.token_price' });
console.log(result.ranked_endpoints[0]);
```

To actually call it (and have the SDK handle the x402 *402 → pay → retry* dance), pass a Base wallet via `client.discoverAndCall()`. See the [SDK docs](https://entroute.com/docs/sdk).

---

## Try the demo

Discovery only — prints the top 3 endpoints with score, latency, success rate, and price. No payment, no wallet needed.

```bash
git clone https://github.com/entroute/get-crypto-prices && cd get-crypto-prices
pnpm install
pnpm start
```

Source: [`src/index.ts`](./src/index.ts).

---

## Why EntRoute

The only x402 directory that pays real USDC to verify each endpoint actually works. Probes run every 10 minutes; failed endpoints get demoted automatically.

- **Site:** https://entroute.com  •  **Docs:** https://entroute.com/docs/quickstart
- **MCP server:** [`@entroute/mcp-server`](https://www.npmjs.com/package/@entroute/mcp-server)
- **TypeScript SDK:** [`@entroute/sdk-agent-ts`](https://www.npmjs.com/package/@entroute/sdk-agent-ts)

[x402](https://x402.org) is the open pay-per-request protocol behind it (Coinbase + Linux Foundation). Server returns 402, client pays in USDC on Base, retries with payment header.

---

## Related skills

- [`fetch-tweets`](https://github.com/entroute/fetch-tweets) — Twitter data without the Twitter API
- [`web-search-agent`](https://github.com/entroute/web-search-agent) — Web search for AI agents
- [`summarize-url`](https://github.com/entroute/summarize-url) — Summarize any article URL
- [`describe-image`](https://github.com/entroute/describe-image) — Image alt-text + understanding
- [`get-weather`](https://github.com/entroute/get-weather) — Weather without sign-up
- [`place-search`](https://github.com/entroute/place-search) — Find places nearby without Google Places
- [`qr-generator`](https://github.com/entroute/qr-generator) — QR codes via x402

## License

MIT
