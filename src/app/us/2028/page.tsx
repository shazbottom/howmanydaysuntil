import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("us", 2028);

export default function UnitedStates2028HubPage() {
  return renderCountryHub("us", 2028);
}
