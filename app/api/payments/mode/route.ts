import { stripeMode } from "../../../../lib/stripe";

export async function GET() {
  return Response.json({ mode: await stripeMode() });
}
