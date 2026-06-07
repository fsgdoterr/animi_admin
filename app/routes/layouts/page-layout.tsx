import { Outlet } from "react-router";
import Sidebar from "~/components/sidebar/sidebar";

export default function PageLayout() {
    return (
        <div className="flex min-h-dvh w-full flex-col gap-4 overflow-x-hidden px-4 sm:px-6 md:h-dvh md:flex-row md:gap-5 md:px-8 lg:px-16">
            <Sidebar />

            <main className="min-w-0 flex-1 md:overflow-y-auto md:no-scrollbar">
                <div className="flex min-h-[calc(100dvh-92px)] w-full flex-col pb-6 md:min-h-dvh md:py-12 lg:py-16">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
