import MatrixLayout from '../../../components/matrix/Matrix';
import FloatingActionButton from '../../../components/layout/FloatingActionButton';
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Matrice d'Eisenhower"
}
export default function Matrix() {
  return (
    <div className="h-full w-full p-1 my-3">
      <MatrixLayout />
      <FloatingActionButton/>
    </div>
  )
}