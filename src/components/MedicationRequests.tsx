import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function MedicationRequests({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const medicationRequests = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.MedicationRequest
    )
    .filter(
      (resource) => resource && resource?.resourceType === "MedicationRequest"
    )
    .map((resource) => [
      resource.authoredOn ? formatDate(resource.authoredOn) : "NA",
      profile!.getConceptDisplay(
        (
          profile!.getResource(
            resource.medicationReference?.reference
          ) as fhir4.Medication
        )?.code
      ) ??
        profile!.getConceptDisplay(resource.medicationCodeableConcept) ??
        "NA",
      resource.dosageInstruction
        ?.map((dosage) => [
          dosage.text,
          ...(dosage.additionalInstruction?.map((instruction) =>
            profile!.getConceptDisplay(instruction)
          ) ?? []),
        ])
        .filter(Boolean)
        .join(", ") || "NA",
      [
        ...(resource.reasonReference?.map((reason) =>
          profile!.getConceptDisplay(
            (
              profile!.getResource(reason.reference) as
                | fhir4.Condition
                | fhir4.Observation
            ).code
          )
        ) ?? []),
        ...(resource.reasonCode?.map((reason) =>
          profile!.getConceptDisplay(reason)
        ) ?? []),
      ]
        .filter(Boolean)
        .join(", ") || "NA",

      resource.status,
      [
        ...(resource.note?.map((note) => note.text) ?? []),
        resource.priority && `Priority: ${resource.priority}`,
      ]
        .filter(Boolean)
        .join(", ") || "NA",
    ]);

  return (
    <Table
      heads={[
        "Date",
        "Medication",
        "Dose",
        "Reason",
        "Status",
        "Additional Info",
      ]}
      rows={medicationRequests}
    />
  );
}
