/**
 * Message adapter + cfg-based client resolution tests.
 *
 * Regression: sends outside the gateway loop (message tool, /meta replies,
 * durable final delivery) previously depended on a runtime `.client` that was
 * never populated, so every such send threw "No ZulipClient available".
 */

import { describe, it, expect, afterEach, vi } from "vitest";
import { zulipMessageAdapter } from "./message-adapter.js";
import { sendMessageZulip } from "./send.js";
import type { CoreConfig } from "./types.js";

const cfg = {
  channels: {
    zulip: {
      realm: "https://test.zulipchat.com",
      email: "bot@test.zulipchat.com",
      apiKey: "test-api-key-1234",
    },
  },
} as CoreConfig;

function mockSendResponse(id: number) {
  return {
    status: 200,
    headers: new Headers(),
    json: async () => ({ result: "success", id }),
  } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sendMessageZulip cfg client resolution", () => {
  it("builds a client from cfg.channels.zulip", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockSendResponse(42));
    const result = await sendMessageZulip("zulip:general#ops", "hello", { cfg });
    expect(result.messageId).toBe(42);
    expect(String(fetchSpy.mock.calls[0]?.[0])).toContain("https://test.zulipchat.com");
  });

  it("throws a directive error without client, clientConfig, or cfg", async () => {
    await expect(sendMessageZulip("zulip:general#ops", "hello", {})).rejects.toThrow(
      /provide client, clientConfig, or configured cfg/,
    );
  });
});

describe("zulipMessageAdapter", () => {
  it("send.text returns messageId, target, and a receipt with the platform id", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockSendResponse(7));
    const result = await zulipMessageAdapter.send.text({
      cfg,
      to: "zulip:general#ops",
      text: "hi",
    });
    expect(result.messageId).toBe("7");
    expect(result.target).toBe("general#ops");
    expect(result.receipt.platformMessageIds).toEqual(["7"]);
  });

  it("send.media appends the media URL to the message text", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockSendResponse(8));
    const result = await zulipMessageAdapter.send.media({
      cfg,
      to: "zulip:general#ops",
      text: "caption",
      mediaUrl: "https://example.com/pic.png",
    });
    expect(result.messageId).toBe("8");
    const body = String(fetchSpy.mock.calls[0]?.[1]?.body);
    expect(body).toContain("caption");
    expect(body).toContain("https%3A%2F%2Fexample.com%2Fpic.png");
  });
});
