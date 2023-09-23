import ProfileProvider from "../contexts/ProfileContext";
import Composition from "./Composition";

interface IProps {
  bundle: fhir4.Bundle;
}

export default function Profile({ bundle }: IProps) {
  return (
    <ProfileProvider bundle={bundle}>
      <Composition />
    </ProfileProvider>
  );
}
