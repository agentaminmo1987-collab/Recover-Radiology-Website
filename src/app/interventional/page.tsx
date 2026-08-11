import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("interventional");

export default function Page() {
  return <ServicePage slug="interventional" />;
}
