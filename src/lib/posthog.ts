import posthog from "posthog-js";

const posthogPublicKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogApiHost = import.meta.env.VITE_POSTHOG_HOST;

if (
  typeof posthogPublicKey === "string" &&
  posthogPublicKey.length > 0 &&
  typeof posthogApiHost === "string" &&
  posthogApiHost.length > 0
) {
  posthog.init(posthogPublicKey, {
    api_host: posthogApiHost,
    person_profiles: "identified_only",
  });
}

export { posthog };
