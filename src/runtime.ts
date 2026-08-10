import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import type { PluginRuntime } from "./runtime-api.js";

const { setRuntime: setZulipRuntime } = createPluginRuntimeStore<PluginRuntime>(
  "Zulip runtime not initialized",
);
export { setZulipRuntime };
