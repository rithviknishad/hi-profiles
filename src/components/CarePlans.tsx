import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import { Author } from "../utils/HIProfile";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function CarePlans({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const carePlans = references
    .map(
      (reference) => profile!.getResource(reference.reference) as fhir4.CarePlan
    )
    .filter((resource) => resource && resource?.resourceType === "CarePlan")
    .map((resource) => [
      (resource.period &&
        `${formatDate(resource.period.start) ?? "NA"} - ${
          formatDate(resource.period.end) ?? "NA"
        }`) ??
        "NA",
      [resource.title, resource.description, resource.text]
        .filter(Boolean)
        .join(", ") || "NA",
      profile!.getAuthorName(
        profile!.getResource(resource.author?.reference) as Author
      ) ?? "NA",
      `${resource.status} - ${resource.intent}`,
      resource.category
        ?.map((category) => profile!.getConceptDisplay(category))
        .filter(Boolean)
        .join(", ") || "NA",
      [
        resource.created && `Created On: ${formatDate(resource.created)}`,
        ...(resource.note?.map((note) => note.text) ?? []),
      ]
        .filter(Boolean)
        .join(", ") || "NA",
    ]);

  return (
    <Table
      heads={[
        "Period",
        "Care Plan",
        "Author",
        "Status - Intent",
        "Categories",
        "Additional Info",
      ]}
      rows={carePlans}
    />
  );
}
