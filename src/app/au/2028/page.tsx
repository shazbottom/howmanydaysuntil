import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("au", 2028);

export default function Australia2028HubPage() {
  return renderCountryHub("au", 2028);
}
