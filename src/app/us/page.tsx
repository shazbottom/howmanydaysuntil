import { getCountryHubMetadata, renderCountryHub } from "../../lib/localizedPages";

export const metadata = getCountryHubMetadata("us");

export default function UnitedStatesHubPage() {
  return renderCountryHub("us");
}
