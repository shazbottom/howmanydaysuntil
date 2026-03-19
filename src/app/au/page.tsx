import { getCountryHubMetadata, renderCountryHub } from "../../lib/localizedPages";

export const metadata = getCountryHubMetadata("au");

export default function AustraliaHubPage() {
  return renderCountryHub("au");
}
