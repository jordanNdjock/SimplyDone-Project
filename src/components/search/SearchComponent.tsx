export default function SearchComponent() {
    return (
        <div className="flex flex-col items-center justify-center ">
            <div className="w-full max-w-md">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                            className="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        ></svg>
                        <input
                            type="search"
                            name="search"
                            id="search" 
                            className="block w-full h-full pl-10 pr-3 py-2 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                            placeholder="Search"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}