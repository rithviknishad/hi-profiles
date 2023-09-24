import { useProfile } from "../contexts/ProfileContext";
import CompositionHead from "./CompositionHead";
import CompositionSection from "./CompositionSection";
import Encounter from "./Encounter";

export default function Composition() {
  const { profile } = useProfile();
  const { composition } = profile!;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 rounded shadow border border-gray-200 w-full flex flex-col gap-4">
      <CompositionHead />
      <Encounter className="mt-6" />
      {composition.section?.map((section, i) => (
        <CompositionSection key={i} section={section} />
      ))}
    </main>
  );
}
