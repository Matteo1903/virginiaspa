import Home from "./home-page";
import { structuredFaqData } from "../lib/site";

export default function Page() {
  return (
    <>
      <Home />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFaqData) }} />
    </>
  );
}
