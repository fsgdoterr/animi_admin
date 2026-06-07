import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { ReactSVG } from "react-svg";
import logoSVG from "./Animi.svg";
import LogoutButton from "~/components/logout-button";
import { sidebarRoutes } from "~/lib/constants/sidebar-routes";
import clsx from "clsx";

export default function Sidebar() {
    const { pathname } = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <aside className="sticky top-0 z-50 w-full py-3 md:h-dvh md:w-auto md:py-12 lg:py-16">
            <div className="flex w-full flex-col gap-4 rounded-xl bg-(--bg-2) p-4 shadow-xl shadow-black/10 md:h-full md:w-[287px] md:gap-5 md:p-5 md:shadow-none">
                <div className="flex items-center justify-between gap-3">
                    <Link
                        to="/dashboard"
                        className="min-w-0"
                        aria-label="На дашборд"
                    >
                        <ReactSVG
                            src={logoSVG}
                            className="transition-all duration-200 hover:translate-x-2 hover:scale-110 hover:opacity-75"
                        />
                    </Link>

                    <div className="hidden md:block">
                        <LogoutButton />
                    </div>

                    <button
                        type="button"
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-(--bg-3) transition-colors duration-200 hover:bg-(--bg-4) md:hidden"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label={
                            isMobileMenuOpen ? "Закрити меню" : "Відкрити меню"
                        }
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <div
                    className={clsx(
                        "overflow-hidden transition-all duration-200 md:max-h-none md:flex-1 md:overflow-y-auto md:opacity-100 md:no-scrollbar",
                        isMobileMenuOpen
                            ? "max-h-[calc(100dvh-92px)] opacity-100"
                            : "max-h-0 opacity-0 md:max-h-none",
                    )}
                >
                    <div className="flex max-h-[calc(100dvh-92px)] flex-col gap-4 overflow-y-auto pr-1 no-scrollbar md:max-h-none md:overflow-visible md:pr-0">
                        <nav className="flex flex-col gap-2.5">
                            {sidebarRoutes.map((routeGroup) => (
                                <div
                                    className="flex flex-col gap-2.5"
                                    key={routeGroup.title}
                                >
                                    <span className="text-sm text-(--grey-2)">
                                        {routeGroup.title}
                                    </span>

                                    <div className="flex flex-col gap-1.5 md:px-2.5">
                                        {routeGroup.routes.map(
                                            ({ path, icon: Icon, title }) => {
                                                const isActive =
                                                    pathname === path ||
                                                    pathname.startsWith(
                                                        `${path}/`,
                                                    );

                                                return (
                                                    <Link
                                                        to={path}
                                                        key={path}
                                                        className={clsx(
                                                            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-200 sm:text-base md:py-1.5",
                                                            isActive &&
                                                                "bg-(--grey-2)",
                                                            !isActive &&
                                                                "hover:bg-(--grey-2)/40",
                                                        )}
                                                    >
                                                        <Icon
                                                            size={18}
                                                            className="shrink-0"
                                                        />
                                                        <span className="min-w-0 truncate">
                                                            {title}
                                                        </span>
                                                    </Link>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        <div className="border-t border-white/10 pt-4 md:hidden">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
