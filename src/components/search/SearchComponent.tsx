"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTaskStore, selectSearchtasks, selectSearchTaskQuery } from '../../store/taskSlice';
import Image from "next/image";
import { useDebounce } from 'use-debounce';
import { TaskListItems } from '../tasks/TaskListItems';

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const {searchTasks , setSearchTaskQuery} = useTaskStore();
  const Tasks = useTaskStore(selectSearchtasks);
  const searchTaskQuery = useTaskStore(selectSearchTaskQuery);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: initialSearch },
  });

  const searchValue = watch("search");

  const [debouncedSearch] = useDebounce(searchValue, 300);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchValue?.trim() !== "" && searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`);
  }, [searchValue, router]);

  useEffect(() => {
    searchTasks((debouncedSearch?.trim() || ""));
  }, [debouncedSearch, searchTasks]);

  const clearSearch = () => {
    setValue("search", "");
  };

  const onSubmit = (data: SearchFormValues) => {
    console.log("Recherche soumise :", data);
  };
  const onSelect = (query: string) => setValue("search", query);

  const onRemove = (index: number) => {
    const newQueries = [...searchTaskQuery];
    newQueries.splice(index, 1);
    setSearchTaskQuery(newQueries);
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="relative flex items-center mt-8">
      <div className="relative w-full lg:w-2/3 justify-center items-center lg:m-auto">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search size={20} className="text-gray-500" />
        </span>

        <Input
          {...register("search")}
          placeholder="Rechercher vos tâches..."
          className="pl-10 pr-10 h-10"
        />

        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>
    </form>
    {searchTaskQuery.length > 0 && searchValue?.trim() !== "" && (
          <div className="mt-6 space-y-2 ">
            <div className="flex flex-wrap gap-2">
              {searchTaskQuery.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center bg-slate-800 text-white px-3 py-1 rounded-full cursor-pointer text-sm transition"
                  onClick={() => onSelect(query)}
                >
                  <span>{query}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    className="ml-2 text-gray-500 hover:text-red-500 text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    {(!searchValue || (searchValue && Tasks.length === 0)) && (

        <div className="flex flex-col items-center mt-16">
            <div className="flex justify-center items-center m-auto p-4">
            <Image
                src="/assets/img/search-animation.gif"
                alt="search image"
                width={120}
                height={120}
                unoptimized
            />
            </div>
            {searchValue ? (
            <>
                <h3 className="dark:text-white">Aucun résultat trouvé</h3>
                <p className="mt-4 text-xs text-gray-500 text-center">
                Désolé, aucune tâche ne correspond à votre recherche.
                </p>
            </>
            ) : (
            <>
                <h3 className="dark:text-white">Vous cherchez quoi ?</h3>
                <p className="mt-4 text-xs text-gray-500 text-center">
                    Appuyez sur la zone de saisie pour rechercher vos tâches.
                </p>
            </>
            )}
        </div>
        )}

      {Tasks.length > 0 && searchValue && (
        <div className="mt-8 space-y-2">
          <p className="text-xs text-gray-400">{Tasks.length} Tâche(s) trouvée(s)</p>
          <TaskListItems tasks={Tasks} />
        </div>
      )}
    </>
  );
}
