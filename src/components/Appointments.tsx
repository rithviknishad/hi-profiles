import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";
import { Author } from "../utils/HIProfile";
import Table from "./common/Table";

interface IProps {
  references: fhir4.Reference[];
}

export default function Appointments({ references }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const appointments = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.Appointment
    )
    .filter((resource) => resource && resource?.resourceType === "Appointment")
    .map((resource) => [
      [formatDate(resource.start, true), formatDate(resource.end, true)]
        .filter(Boolean)
        .join(" - ") || "NA",
      [
        resource.text,
        resource.description,
        ...(resource.serviceCategory?.map((category) =>
          profile!.getConceptDisplay(category)
        ) ?? []),
        ...(resource.serviceType?.map((type) =>
          profile!.getConceptDisplay(type)
        ) ?? []),
        ...(resource.specialty?.map((spc) => profile!.getConceptDisplay(spc)) ??
          []),
        profile!.getConceptDisplay(resource.appointmentType),
        ...(resource.reasonCode?.map((reason) =>
          profile!.getConceptDisplay(reason)
        ) ?? []),
      ]
        .filter(Boolean)
        .join(", ") || "NA",
      [resource.status, profile!.getConceptDisplay(resource.cancelationReason)]
        .filter(Boolean)
        .join(" - ") || "NA",
      [
        resource.priority && `Priority: ${resource.priority}`,
        resource.created && `Created On: ${formatDate(resource.created)}`,
        resource.comment,
        resource.patientInstruction,
        "Participants: " +
          resource.participant
            ?.map(
              (participant) =>
                profile!.getAuthorName(
                  profile!.getResource(participant.actor?.reference) as Author
                ) + (participant.status ? ` (${participant.status})` : "")
            )
            .filter(Boolean)
            .join(", "),
      ]
        .filter(Boolean)
        .join(", ") || "NA",
    ]);

  return (
    <Table
      heads={["Time", "Appointment", "Status", "Additional Info"]}
      rows={appointments}
    />
  );
}
