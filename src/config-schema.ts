import {
  DmPolicySchema,
  buildChannelConfigSchema,
} from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "openclaw/plugin-sdk/zod";

const ZulipConfigSchema = z
  .object({
    realm: z.string().optional(),
    email: z.string().optional(),
    streams: z.array(z.string()).optional(),
    defaultStream: z.string().optional(),
    defaultTopic: z.string().optional(),
    dmPolicy: DmPolicySchema.optional().default("pairing"),
    allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
  })
  .strict();

export const ZulipChannelConfigSchema: ReturnType<typeof buildChannelConfigSchema> =
  buildChannelConfigSchema(
    // plugin-sdk/zod and channel-config-schema ship separate structurally
    // identical zod type chunks in the openclaw dist; bridge them explicitly.
    ZulipConfigSchema as unknown as Parameters<typeof buildChannelConfigSchema>[0],
  );
