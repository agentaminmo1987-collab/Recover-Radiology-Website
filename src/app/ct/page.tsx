import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("ct");

export default function Page() {
  return <ServicePage slug="ct" />;
}
