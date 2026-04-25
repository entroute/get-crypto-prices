/**
 * get-crypto-prices
 *
 * Inspect the top-ranked, fulfillment-verified x402 endpoints for token
 * prices via EntRoute. Discovery only — no wallet required.
 *
 * To pay and call automatically, pass a Base wallet to
 * client.discoverAndCall(). See https://entroute.com/docs/sdk.
 *
 * Run: pnpm start
 */

import { EntRouteClient } from '@entroute/sdk-agent-ts';

async function main() {
  const client = new EntRouteClient({
    baseUrl: process.env.ENTROUTE_BASE_URL ?? 'https://api.entroute.com',
  });

  // --- Option 1: just discover and show the options --------------------------
  const discovery = await client.discover({
    capability_id: 'defi.token_price',
    constraints: {
      max_price: 0.01, // USDC per call
      network: 'base',
      verified_only: true,
    },
    preferences: { ranking_preset: 'reliability' },
  });

  console.log(`\nResolved capability: ${discovery.resolved.capability_id}`);
  console.log(`Top ${discovery.ranked_endpoints.length} endpoints:\n`);

  for (const ep of discovery.ranked_endpoints.slice(0, 3)) {
    console.log(`  ${ep.provider_name.padEnd(20)} ${ep.url}`);
    console.log(
      `    score=${ep.score.toFixed(3)}  ` +
        `p95=${ep.observed?.p95_latency_ms ?? '?'}ms  ` +
        `$${ep.payment.price_per_call}/call  ` +
        `success=${((ep.observed?.success_rate_7d ?? 0) * 100).toFixed(1)}%`
    );
  }

  // --- Option 2: discover and call, with automatic x402 payment --------------
  //
  // Uncomment and provide a wallet to pay per-request. The SDK handles the
  // 402 → sign → retry flow for you.
  //
  // const result = await client.discoverAndCall(
  //   { capability_id: 'defi.token_price' },
  //   {
  //     buildRequest: (endpoint) => ({
  //       method: endpoint.method,
  //       headers: { 'Content-Type': 'application/json' },
  //     }),
  //     wallet: yourBaseWallet,  // viem/ethers wallet on Base
  //     maxSpend: 0.01,          // USDC budget cap
  //   }
  // );
  // console.log('\nResult:', result.data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
