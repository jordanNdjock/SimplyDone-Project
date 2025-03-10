import SessionLayout from "@/src/components/sessions/SessionLayout";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Sessions de travail"
}
export default function Page(){
  return (
    <SessionLayout />
  )
}