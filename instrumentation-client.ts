import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

function stripQueryAndHash(value: unknown) {
  if (typeof value !== "string") return value;
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return value;
  }
}

if (projectToken) {
  posthog.init(projectToken, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    defaults: "2026-08-30",
    autocapture: false,
    capture_pageview: "history_change",
    capture_pageleave: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_heatmaps: false,
    capture_performance: false,
    cookieless_mode: "always",
    disable_session_recording: true,
    disable_surveys: true,
    person_profiles: "never",
    before_send(event) {
      if (!event || window.location.pathname.startsWith("/staff")) return null;
      event.properties.$current_url = stripQueryAndHash(event.properties.$current_url);
      event.properties.$referrer = stripQueryAndHash(event.properties.$referrer);
      return event;
    },
  });
}
