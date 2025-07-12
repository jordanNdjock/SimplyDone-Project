import { Metadata } from 'next';
import SearchComponent from '../../../components/search/SearchComponent';
export const metadata : Metadata = {
  title: "Rechercher une tâche"
}
export default function Search(){
    return (
        <div className="p-2">
          <SearchComponent />
        </div>
    );
}