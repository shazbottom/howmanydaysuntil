import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("nz", 2028);

export default function NewZealand2028HubPage() {
  return renderCountryHub("nz", 2028);
}
