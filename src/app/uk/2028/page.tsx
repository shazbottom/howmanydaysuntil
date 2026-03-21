import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("uk", 2028);

export default function UnitedKingdom2028HubPage() {
  return renderCountryHub("uk", 2028);
}
