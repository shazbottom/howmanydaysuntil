import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("us", 2027);

export default function UnitedStates2027HubPage() {
  return renderCountryHub("us", 2027);
}
