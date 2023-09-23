import { createContext, useContext } from "react";
import HIProfile from "../utils/HIProfile";

interface IProfileContext {
  profile: HIProfile | null;
}

const ProfileContext = createContext<IProfileContext>({
  profile: null,
});

export function useProfile() {
  if (!useContext(ProfileContext)) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return useContext(ProfileContext);
}

interface IProps {
  bundle: fhir4.Bundle;
  children: React.ReactNode;
}

export default function ProfileProvider({ bundle, children }: IProps) {
  return (
    <ProfileContext.Provider value={{ profile: new HIProfile(bundle) }}>
      {children}
    </ProfileContext.Provider>
  );
}
