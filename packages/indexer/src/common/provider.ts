import { StaticJsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import Arweave from "arweave";

import { logger } from "@/common/logger";
import {config, getNetworkBaseUrl, getWsNetworkBaseUrl} from "@/config/index";
import getUuidByString from "uuid-by-string";

// Use a static provider to avoid redundant `eth_chainId` calls
export const baseProvider = new StaticJsonRpcProvider(
  {
    url: config.baseNetworkHttpUrl,
    headers: {
      "x-session-hash": getUuidByString(`${config.baseNetworkHttpUrl}${config.chainId}`),
    },
  },
  config.chainId
);

// 用于存储不同 URL 对应的提供者实例的 Map
type ProviderMap = Map<string, StaticJsonRpcProvider>;

// 用于存储不同 URL 对应的提供者实例的 Map
const providerMap: ProviderMap = new Map();

// 创建并缓存不同 URL 对应的提供者实例
config.networkBaseUrlList.forEach((v) => {
  const provider = new StaticJsonRpcProvider({
    url: v.url,
    headers: { "x-session-hash": `${v.url}${config.chainId}` },
  }, config.chainId);
  providerMap.set(v.url, provider);
})

export function getBaseProvider() {
  var url = getNetworkBaseUrl()
  var provider = providerMap.get(url)
  if (provider == null) {
    return baseProvider
  }
  return provider
}

// https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-808736570
export const safeWebSocketSubscription = (
  callback: (provider: WebSocketProvider) => Promise<void>
) => {
  const webSocketProvider = new WebSocketProvider(getWsNetworkBaseUrl());
  webSocketProvider.on("error", (error) => {
    logger.error("websocket-provider", `WebSocket subscription failed: ${error}`);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webSocketProvider._websocket.on("error", (error: any) => {
    logger.error("websocket-provider", `WebSocket subscription failed: ${error}`);
  });

  let pingTimeout: NodeJS.Timeout | undefined;
  let keepAliveInterval: NodeJS.Timer | undefined;

  const EXPECTED_PONG_BACK = 15000;
  const KEEP_ALIVE_CHECK_INTERVAL = 7500;
  webSocketProvider._websocket.on("open", async () => {
    keepAliveInterval = setInterval(() => {
      webSocketProvider._websocket.ping();

      pingTimeout = setTimeout(() => {
        webSocketProvider._websocket.terminate();
      }, EXPECTED_PONG_BACK);
    }, KEEP_ALIVE_CHECK_INTERVAL);

    await callback(webSocketProvider);
  });

  webSocketProvider._websocket.on("close", () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }
    if (pingTimeout) {
      clearTimeout(pingTimeout);
    }
    safeWebSocketSubscription(callback);
  });

  webSocketProvider._websocket.on("pong", () => {
    if (pingTimeout) {
      clearInterval(pingTimeout);
    }
  });
};

export const arweaveGateway = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
