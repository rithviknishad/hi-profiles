import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function Immunizations({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const immunizations = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.Immunization
    )
    .filter((resource) => resource && resource?.resourceType === "Immunization")
    .map((resource) => [
      resource.occurrenceDateTime
        ? formatDate(resource.occurrenceDateTime)
        : "NA",
      profile!.getConceptDisplay(resource.vaccineCode),
      resource.lotNumber ?? "NA",
      resource.route ? profile!.getConceptDisplay(resource.route) : "NA",
      (
        profile!.getResource(
          resource.manufacturer?.reference
        ) as fhir2.Organization
      ).name ?? "NA",
      resource.protocolApplied?.[0].doseNumberPositiveInt ??
        resource.protocolApplied?.[0].doseNumberString ??
        "NA",
      resource.reasonCode
        ?.map((code) => profile!.getConceptDisplay(code))
        .join(", ") ?? "NA",
      resource.status,
    ]);

  return (
    <Table
      heads={[
        "Date",
        "Vaccine",
        "Lot Number",
        "Route",
        "Manufacturer",
        "Dose",
        "Reason",
        "Status",
      ]}
      rows={immunizations}
    />
  );
}
