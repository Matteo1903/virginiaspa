import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRitualExperience, ritualExperiences } from "../../ritual-experiences";
import RitualExperiencePage from "../../ritual-experience-page";

export const generateStaticParams = () => ritualExperiences.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const ritual = getRitualExperience((await params).slug);
  if (!ritual) return {};
  return { title: ritual.locales.it.title, description: ritual.locales.it.intro, alternates: { canonical: `/esperienze/${ritual.slug}` } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const ritual = getRitualExperience((await params).slug);
  if (!ritual) notFound();
  return <RitualExperiencePage experience={ritual} />;
}
