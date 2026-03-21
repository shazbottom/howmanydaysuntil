import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("uk", 2027);

export default function UnitedKingdom2027HubPage() {
  return renderCountryHub("uk", 2027);
}
