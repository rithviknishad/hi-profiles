import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function AllergyIntollerances({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const allergyIntollerances = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.AllergyIntolerance
    )
    .filter(
      (resource) => resource && resource?.resourceType === "AllergyIntolerance"
    )
    .map((resource) => [
      resource.recordedDate ? formatDate(resource.recordedDate) : "NA",
      profile!.getConceptDisplay(resource.code) ?? "NA",
      [
        `Clinical Status: ${profile!.getConceptDisplay(
          resource.clinicalStatus
        )}`,
        `Verification Status: ${profile!.getConceptDisplay(
          resource.verificationStatus
        )}`,
      ].join(", "),
      [...(resource.note?.map((note) => note.text) ?? [])]
        .filter(Boolean)
        .join(", "),
    ]);

  return (
    <Table
      heads={["Date", "Allergy", "Status", "Additional Info"]}
      rows={allergyIntollerances}
    />
  );
}
