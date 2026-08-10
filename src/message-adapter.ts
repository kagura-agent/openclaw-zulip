/**
 * Zulip message adapter — canonical outbound seam for core message sends and
 * durable final reply delivery (`deliverInboundReplyWithMessageSendContext`).
 */

import {
  createMessageReceiptFromOutboundResults,
  defineChannelMessageAdapter,
} from "openclaw/plugin-sdk/channel-outbound";
import type { MessageReceiptPartKind } from "openclaw/plugin-sdk/channel-outbound";
import { sendMessageZulip } from "./send.js";
import type { SendZulipResult } from "./send.js";
import type { CoreConfig } from "./types.js";

// Result carries required messageId + target so the same send functions also
// satisfy the legacy outbound attachedResults delivery contract.
function toSendResult(result: SendZulipResult, kind: MessageReceiptPartKind) {
  const messageId = String(result.messageId);
  return {
    messageId,
    target: result.target,
    receipt: createMessageReceiptFromOutboundResults({
      results: [{ channel: "zulip", messageId, conversationId: result.target }],
      kind,
    }),
  };
}

export const zulipMessageAdapter = defineChannelMessageAdapter({
  id: "zulip",
  // replyTo stays undeclared: Zulip threads via stream#topic targets, and
  // sendMessageZulip has no per-message reply primitive to back the capability.
  durableFinal: {
    capabilities: {
      text: true,
      media: true,
    },
  },
  send: {
    text: async ({ cfg, to, text, accountId }) => {
      const result = await sendMessageZulip(to, text, {
        cfg: cfg as CoreConfig,
        accountId: accountId ?? undefined,
      });
      return toSendResult(result, "text");
    },
    media: async ({ cfg, to, text, mediaUrl, accountId }) => {
      // Zulip renders markdown links natively; URL-append delivery matches the
      // legacy outbound adapter until blob uploads are wired through sendMediaZulip.
      const message = mediaUrl ? (text ? `${text}\n${mediaUrl}` : mediaUrl) : text;
      const result = await sendMessageZulip(to, message, {
        cfg: cfg as CoreConfig,
        accountId: accountId ?? undefined,
      });
      return toSendResult(result, "media");
    },
  },
});
