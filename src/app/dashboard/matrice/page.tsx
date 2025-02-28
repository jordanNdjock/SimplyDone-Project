import MatrixLayout from '../../../components/forms/matrix/Matrix';
import FloatingActionButton from '../../../components/layout/FloatingActionButton';
export default function Matrix() {
  return (
    <div className="h-full w-full p-1 my-3">
      <MatrixLayout />
      <FloatingActionButton/>
    </div>
  )
}