import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function Conditions({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const conditions = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.Condition
    )
    .filter((resource) => resource && resource?.resourceType === "Condition")
    .map((resource) => [
      resource.recordedDate ? formatDate(resource.recordedDate) : "NA",
      profile!.getConceptDisplay(resource.code) ?? "NA",
      resource.category
        ?.map((category) => profile!.getConceptDisplay(category))
        .filter(Boolean)
        .join(", ") || "NA",
      profile!.getConceptDisplay(resource.severity) ?? "NA",
      [
        `Clinical Status: ${profile!.getConceptDisplay(
          resource.clinicalStatus
        )}`,
        `Verification Status: ${profile!.getConceptDisplay(
          resource.verificationStatus
        )}`,
      ].join(", "),
      [
        resource.onsetDateTime
          ? `Onset: ${formatDate(resource.onsetDateTime) ?? "NA"}`
          : "",
        resource.onsetAge
          ? `Onset: ${resource.onsetAge.value ?? "NA"} ${
              resource.onsetAge.unit
            }`
          : "",
        resource.onsetPeriod
          ? `Onset: ${formatDate(resource.onsetPeriod.start) ?? "NA"} - ${
              formatDate(resource.onsetPeriod.end) ?? "NA"
            }`
          : "",
        resource.onsetRange
          ? `Onset: ${resource.onsetRange.low?.value ?? "NA"} - ${
              resource.onsetRange.high?.value ?? "NA"
            }`
          : "",
        resource.onsetString ? `Onset: ${resource.onsetString ?? "NA"}` : "",
        ...(resource.note?.map((note) => note.text) ?? []),
      ]
        .filter(Boolean)
        .join(", ") || "NA",
    ]);

  return (
    <Table
      heads={[
        "Date",
        "Condition",
        "Category",
        "Severity",
        "Status",
        "Additional Info",
      ]}
      rows={conditions}
    />
  );
}
