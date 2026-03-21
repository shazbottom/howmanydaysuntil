import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("au", 2027);

export default function Australia2027HubPage() {
  return renderCountryHub("au", 2027);
}
