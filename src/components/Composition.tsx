import { useProfile } from "../contexts/ProfileContext";
import CompositionHead from "./CompositionHead";
import Encounter from "./Encounter";

export default function Composition() {
  const { profile } = useProfile();
  const { composition } = profile!;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 rounded shadow">
      <CompositionHead />
      <Encounter className="mt-10" />
    </main>
  );
}
