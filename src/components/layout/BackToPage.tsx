import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackToPageProps {
    title: string;
}

export default function BackToPage({ title }: BackToPageProps) {
    const router = useRouter();
    return (
        <div className="flex px-4 items-center mb-4  mt-6 text-accent dark:text-white">
                <ArrowLeft
                  className="cursor-pointer mr-2"
                  onClick={() => router.back()}
                />
              <h1 className="text-xl font-semibold">{title}</h1>
        </div>
    )
}