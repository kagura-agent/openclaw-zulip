// Private runtime barrel for the bundled Zulip extension.
// Keep this barrel thin and generic-only.

export type { BaseProbeResult } from "openclaw/plugin-sdk/channel-contract";
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
// PluginRuntime must come from the same subpath family as defineChannelPluginEntry
// (plugin-sdk/core); the runtime-store copy lives in a different dist type chunk
// and is not assignment-compatible with the entry's setRuntime contract.
export type { PluginRuntime } from "openclaw/plugin-sdk/core";
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
export type {
  BlockStreamingCoalesceConfig,
  DmConfig,
  DmPolicy,
  GroupPolicy,
  GroupToolPolicyBySenderConfig,
  GroupToolPolicyConfig,
  MarkdownConfig,
} from "openclaw/plugin-sdk/config-runtime";
export type { OutboundReplyPayload } from "openclaw/plugin-sdk/reply-payload";
export { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
export { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-primitives";
export {
  PAIRING_APPROVED_MESSAGE,
  buildBaseChannelStatusSummary,
} from "openclaw/plugin-sdk/channel-status";
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
export { createAccountStatusSink } from "openclaw/plugin-sdk/channel-lifecycle";
export {
  readStoreAllowFromForDmPolicy,
  resolveEffectiveAllowFromLists,
} from "openclaw/plugin-sdk/channel-policy";
export { resolveControlCommandGate } from "openclaw/plugin-sdk/command-auth";
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
export {
  deliverFormattedTextWithAttachments,
  formatTextWithAttachmentLinks,
  resolveOutboundMediaUrls,
} from "openclaw/plugin-sdk/reply-payload";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  isDangerousNameMatchingEnabled,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "openclaw/plugin-sdk/config-runtime";
export { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
