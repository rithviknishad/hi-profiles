import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import { Author } from "../utils/HIProfile";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function Procedures({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const procedures = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.Procedure
    )
    .filter((resource) => resource && resource?.resourceType === "Procedure")
    .map((resource) => [
      // TODO: add a helper function to get the diplay of date
      formatDate(resource.performedDateTime) ??
        (resource.performedAge &&
          `${resource.performedAge.value ?? "NA"} ${
            resource.performedAge?.unit
          }`) ??
        (resource.performedPeriod &&
          `${formatDate(resource.performedPeriod.start) ?? "NA"} - ${
            formatDate(resource.performedPeriod.end) ?? "NA"
          }`) ??
        (resource.performedRange &&
          `${resource.performedRange.low?.value ?? "NA"} - ${
            resource.performedRange.high?.value ?? "NA"
          }`) ??
        (resource.performedString && `${resource.performedString ?? "NA"}`) ??
        "NA",
      profile!.getConceptDisplay(resource.code) ?? "NA",
      profile!.getConceptDisplay(resource.category) ?? "NA",
      [resource.status, profile!.getConceptDisplay(resource.statusReason)]
        .filter(Boolean)
        .join(" - ") || "NA",
      profile!.getConceptDisplay(resource.outcome) ?? "NA",
      [
        resource.performer &&
          ("Performer: " +
            resource.performer
              ?.map(
                (performer) =>
                  profile!.getAuthorName(
                    profile!.getResource(performer.actor.reference) as Author
                  ) +
                  (performer.function
                    ? `(${profile!.getConceptDisplay(performer.function)})`
                    : "")
              )
              .filter(Boolean)
              .join(", ") ||
            "NA"),
        resource.reasonCode &&
          ("Reason: " +
            resource.reasonCode
              ?.map((reason) => profile!.getConceptDisplay(reason))
              .filter(Boolean)
              .join(", ") ||
            "NA"),
        resource.bodySite &&
          ("Body Site: " +
            resource.bodySite
              ?.map((site) => profile!.getConceptDisplay(site))
              .filter(Boolean)
              .join(", ") ||
            "NA"),
        resource.complication &&
          ("Complication: " +
            resource.complication
              ?.map((comp) => profile!.getConceptDisplay(comp))
              .filter(Boolean)
              .join(", ") ||
            "NA"),
      ]
        .filter(Boolean)
        .join(", ") || "NA",
    ]);

  return (
    <Table
      heads={[
        "Date",
        "Procedure",
        "Category",
        "Status",
        "Outcome",
        "Additional Info",
      ]}
      rows={procedures}
    />
  );
}
