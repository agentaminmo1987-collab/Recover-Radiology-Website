import { clinic } from "@/lib/clinic";

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-[1180px] px-6 py-24">
      <h1 className="text-5xl font-semibold tracking-tight">{clinic.name}</h1>
      <p className="mt-4 text-text-muted">{clinic.tagline}</p>
      <p className="tabular mt-8 text-accent">{clinic.phone.display}</p>
    </main>
  );
}
