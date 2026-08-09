export function parsePeraCallback(url, expectedEvent, expectedCode) {
  const callback = new URL(url);
  const address = callback.searchParams.get("address");
  const network = callback.searchParams.get("network");
  if (
    callback.protocol !== "helixbox:" ||
    callback.hostname !== expectedEvent ||
    !address ||
    (network !== "Testnet" && network !== "Mainnet") ||
    (expectedCode && callback.searchParams.get("status") !== "paid") ||
    (expectedCode && callback.searchParams.get("code") !== expectedCode)
  ) throw new Error("Invalid return from Pera Wallet");
  return { address, network };
}
