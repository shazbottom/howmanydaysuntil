import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("ca", 2028);

export default function Canada2028HubPage() {
  return renderCountryHub("ca", 2028);
}
