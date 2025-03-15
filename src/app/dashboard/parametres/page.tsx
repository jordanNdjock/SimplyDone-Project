import SettingsComponent from "@/src/components/settings/SettingsComponent";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Paramètres"
}
export default function Settings(){
    return (
        <>
            <SettingsComponent />
        </>
    );
}