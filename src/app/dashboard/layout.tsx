import "./globals.css";
import ProtectedLayout from "@/src/components/ProtectedRoute";
import { AppSidebar } from "@/src/components/sidebar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  BottomBar,
} from "@/src/components/ui/sidebar";
import { Separator } from "@/src/components/ui/separator";
import DynamicBreadcrumb from "@/src/components/layout/DynamicBreadcrumbs";
import { ToggleTheme } from "@/src/components/theme/ToggleTheme";
import DynamicDropdownMenu from '../../components/layout/DynamicDropdownMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <header className="fixed z-50 w-full md:w-4/5 md:justify-between flex h-16 shrink-0 bg-gray-200 dark:bg-black items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-gray-600 dark:bg-gray-400" />
            <DynamicBreadcrumb />
          </div>
          <div className="flex items-center mr-4 md:w-auto lg:-mr-6 space-x-2 md:space-x-4">
            <ToggleTheme />
            <DynamicDropdownMenu />
          </div>
        </header>
          <div className="flex-1 p-4 pb-20 mt-10">{children}</div>
        </SidebarInset>
        <BottomBar />
      </SidebarProvider>
    </ProtectedLayout>
  );
}
