import posthog from "posthog-js";

export type AnalyticsProps = Record<string, string | number | boolean>;

export function track(event: string, props?: AnalyticsProps) {
  if (
    typeof window === "undefined"
    || window.location.pathname.startsWith("/staff")
    || !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  ) return;
  posthog.capture(event, props);
}
