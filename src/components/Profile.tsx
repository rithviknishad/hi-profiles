import ProfileProvider from "../contexts/ProfileContext";
import Composition from "./Composition";

export interface IProps {
  bundle: fhir4.Bundle;
  downloadable?: boolean;
}

export default function Profile({ bundle, downloadable }: IProps) {
  return (
    <ProfileProvider bundle={bundle} downloadable={downloadable}>
      <Composition />
    </ProfileProvider>
  );
}
