import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("ultrasound");

export default function Page() {
  return <ServicePage slug="ultrasound" />;
}
