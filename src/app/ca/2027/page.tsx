import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("ca", 2027);

export default function Canada2027HubPage() {
  return renderCountryHub("ca", 2027);
}
