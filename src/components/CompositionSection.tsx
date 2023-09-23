import Observations from "./Observations";
import Immunizations from "./Immunizations";
import MedicationRequests from "./MedicationRequests";
import Conditions from "./Conditions";

interface IProps {
  section: fhir4.CompositionSection;
}

export default function CompositionSection({ section }: IProps) {
  const segregateSectionEntries = (section: fhir4.CompositionSection) => {
    const entries = section.entry?.reduce((acc, entry) => {
      const resource = entry?.reference?.split("/")?.[0];
      if (resource) {
        acc[resource] = acc[resource] ?? [];
        acc[resource].push(entry);
      }
      return acc;
    }, {} as { [key: string]: fhir4.Reference[] });
    return entries;
  };

  const entries = segregateSectionEntries(section);

  return (
    <div className="mt-6 rounded shadow p-4 pl-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {section.title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {section.code?.coding?.[0].display ??
              section.code?.coding?.[0].code}
          </p>
        </div>
      </div>
      <Observations references={entries?.Observation ?? []} />
      <Immunizations references={entries?.Immunization ?? []} />
      <MedicationRequests references={entries?.MedicationRequest ?? []} />
      <Conditions references={entries?.Condition ?? []} />
    </div>
  );
}
