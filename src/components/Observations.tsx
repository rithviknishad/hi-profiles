import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function Observations({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const observations = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.Observation
    )
    .filter((resource) => resource && resource?.resourceType === "Observation")
    .map((resource) => [
      resource.effectiveDateTime
        ? formatDate(resource.effectiveDateTime, true)
        : null,
      profile!.getConceptDisplay(resource.code),
      <p>
        {profile!.getObservationValue(resource)}
        <p className="flex flex-col gap-1">
          {resource.component?.map((component) => (
            <span>
              {profile!.getConceptDisplay(component.code)} :{" "}
              {profile!.getObservationValue(component)}
            </span>
          ))}
        </p>
      </p>,
      [resource.status, resource.interpretation?.[0].text]
        .filter(Boolean)
        .join(" - "),
    ]);

  return (
    <Table
      heads={["Date", "Observation", "Value", "Status & Interpretation"]}
      rows={observations}
    />
  );
}
