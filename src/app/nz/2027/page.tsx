import { getCountryHubMetadata, renderCountryHub } from "../../../lib/localizedPages";

export const metadata = getCountryHubMetadata("nz", 2027);

export default function NewZealand2027HubPage() {
  return renderCountryHub("nz", 2027);
}
