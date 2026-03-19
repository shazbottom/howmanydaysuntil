import { getCountryHubMetadata, renderCountryHub } from "../../lib/localizedPages";

export const metadata = getCountryHubMetadata("nz");

export default function NewZealandHubPage() {
  return renderCountryHub("nz");
}
