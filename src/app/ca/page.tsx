import { getCountryHubMetadata, renderCountryHub } from "../../lib/localizedPages";

export const metadata = getCountryHubMetadata("ca");

export default function CanadaHubPage() {
  return renderCountryHub("ca");
}
