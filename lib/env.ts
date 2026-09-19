type AppEnv = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  SPA_STAFF_TOKEN?: string;
  PUBLIC_SITE_URL?: string;
  ORDER_ACCESS_SECRET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  CRON_SECRET?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
  DATABASE_URL?: string;
};

export function env(): AppEnv {
  return process.env as AppEnv;
}
