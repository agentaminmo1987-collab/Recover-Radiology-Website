import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("x-ray");

export default function Page() {
  return <ServicePage slug="x-ray" />;
}
