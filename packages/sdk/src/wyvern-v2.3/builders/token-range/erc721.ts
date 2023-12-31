import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { BaseBuilder, BaseBuildParams, BaseOrderInfo } from "../base";
import { SingleTokenErc721BuilderV1 } from "../single-token/v1/erc721";
import * as Addresses from "../../addresses";
import { Order } from "../../order";
import * as Types from "../../types";
import { bn, getCurrentTimestamp, getRandomBytes, s } from "../../../utils";

import TokenRangeVerifierAbi from "../../abis/TokenRangeVerifier.json";
import Erc721Abi from "../../../common/abis/Erc721.json";

// Wyvern V2 calldata:
// `transferFrom(address from, address to, uint256 tokenId)`

const REPLACEMENT_PATTERN_BUY =
  // `transferFrom` 4byte selector
  "0x00000000" +
  // `from` (empty)
  "f".repeat(64) +
  // `to` (required)
  "0".repeat(64) +
  // `tokenId` (empty)
  "f".repeat(64);

interface BuildParams extends BaseBuildParams {
  contract: string;
  startTokenId: BigNumberish;
  endTokenId: BigNumberish;
}

interface OrderInfo extends BaseOrderInfo {
  startTokenId: BigNumberish;
  endTokenId: BigNumberish;
}

export class TokenRangeErc721Builder extends BaseBuilder {
  constructor(chainId: number) {
    super(chainId);
  }

  public getInfo(order: Order): OrderInfo | undefined {
    try {
      const buyResult = new Interface(TokenRangeVerifierAbi).decodeFunctionData(
        "verify",
        order.params.staticExtradata
      );

      return {
        contract: order.params.target,
        startTokenId: buyResult.startTokenId.toString(),
        endTokenId: buyResult.endTokenId.toString(),
      };
    } catch {
      return undefined;
    }
  }

  public isValid(order: Order) {
    const info = this.getInfo(order);
    if (!info) {
      return false;
    }

    try {
      const copyOrder = this.build({
        ...order.params,
        contract: info.contract,
        startTokenId: info.startTokenId,
        endTokenId: info.endTokenId,
        side: order.params.side === Types.OrderSide.BUY ? "buy" : "sell",
        price: order.params.basePrice,
        fee: 0,
      });

      if (!copyOrder) {
        return false;
      }

      copyOrder.params.taker = order.params.taker;
      copyOrder.params.makerRelayerFee = order.params.makerRelayerFee;
      copyOrder.params.takerRelayerFee = order.params.takerRelayerFee;

      if (copyOrder.hash() !== order.hash()) {
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }

  public build(params: BuildParams) {
    const saleKind = this.defaultInitialize(params);

    if (params.side === "buy") {
      return new Order(this.chainId, {
        kind: "erc721-token-range",
        exchange: Addresses.Exchange[this.chainId],
        maker: params.maker,
        taker: AddressZero,
        makerRelayerFee: 0,
        takerRelayerFee: params.fee,
        feeRecipient: params.feeRecipient,
        side: Types.OrderSide.BUY,
        saleKind,
        target: params.contract,
        howToCall: Types.OrderHowToCall.CALL,
        calldata: new Interface(Erc721Abi).encodeFunctionData("transferFrom", [
          AddressZero,
          params.recipient ?? params.maker,
          0,
        ]),
        replacementPattern: REPLACEMENT_PATTERN_BUY,
        staticTarget: Addresses.TokenRangeVerifier[this.chainId],
        staticExtradata: new Interface(TokenRangeVerifierAbi).encodeFunctionData("verify", [
          params.startTokenId,
          params.endTokenId,
        ]),
        paymentToken: params.paymentToken,
        basePrice: s(params.price),
        extra: s(params.extra),
        listingTime: params.listingTime!,
        expirationTime: params.expirationTime!,
        salt: s(params.salt),
        nonce: s(params.nonce),
        v: params.v,
        r: params.r,
        s: params.s,
      });
    } else if (params.side === "sell") {
      throw new Error("Unsupported order side");
    } else {
      throw new Error("Invalid order side");
    }
  }

  public buildMatching(order: Order, taker: string, data: { tokenId: string; nonce: string }) {
    const info = this.getInfo(order);
    if (!info) {
      throw new Error("Invalid order");
    }

    if (!(bn(info.startTokenId).lte(data.tokenId) && bn(data.tokenId).lte(info.endTokenId))) {
      throw new Error("Invalid token id");
    }

    if (order.params.side === Types.OrderSide.BUY) {
      const singleTokenBuilder = new SingleTokenErc721BuilderV1(this.chainId);
      const matchingOrder = singleTokenBuilder.build({
        maker: taker,
        contract: info.contract,
        tokenId: data.tokenId,
        side: "sell",
        price: order.getMatchingPrice(),
        paymentToken: order.params.paymentToken,
        fee: 0,
        feeRecipient: AddressZero,
        listingTime: getCurrentTimestamp(-60),
        expirationTime: 0,
        salt: getRandomBytes(),
        nonce: data.nonce,
      });
      matchingOrder.params.takerRelayerFee = order.params.takerRelayerFee;

      return matchingOrder;
    } else if (order.params.side === Types.OrderSide.SELL) {
      throw new Error("Unsupported order side");
    } else {
      throw new Error("Invalid order side");
    }
  }
}
