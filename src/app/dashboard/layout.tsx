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
          <header className="flex h-16 shrink-0 bg-gray-200 dark:bg-black items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"> 
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-gray-600 dark:bg-gray-400" />
              <DynamicBreadcrumb />
            </div>
            <div className="ml-auto mr-2"><ToggleTheme /></div>
            <div className="mr-4">
              <DynamicDropdownMenu />
            </div>
          </header>
          <div className="flex-1 p-4 pb-20">{children}</div>
        </SidebarInset>
        <BottomBar />
      </SidebarProvider>
    </ProtectedLayout>
  );
}
