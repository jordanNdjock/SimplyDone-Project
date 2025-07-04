import ProfileComponent from '@/src/components/profile/ProfileComponent';
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Profil Utilisateur"
}
export default function Profil() {
  return(
    <>
      <ProfileComponent/>
    </>
  );
}