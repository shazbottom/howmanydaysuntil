import { getCountryHubMetadata, renderCountryHub } from "../../lib/localizedPages";

export const metadata = getCountryHubMetadata("uk");

export default function UnitedKingdomHubPage() {
  return renderCountryHub("uk");
}
