import {
    Cat,
    Hash,
    Images,
    LayoutPanelLeft,
    MicVocal,
    Play,
    Tags,
    Users,
    type LucideIcon,
} from "lucide-react";

interface SidebarRoute {
    title: string;
    path: string;
    icon: LucideIcon;
}

interface RouteGroup {
    title: string;
    routes: SidebarRoute[];
}

export const sidebarRoutes: RouteGroup[] = [
    {
        title: "Основні",
        routes: [
            {
                title: "Дашборд",
                path: "/dashboard",
                icon: LayoutPanelLeft,
            },
            {
                title: "Аніме",
                path: "/animes",
                icon: Cat,
            },
            {
                title: "Користувачі",
                path: "/users",
                icon: Users,
            },
        ],
    },
    {
        title: "Додатково",
        routes: [
            {
                title: "Зображення",
                path: "/images",
                icon: Images,
            },
            {
                title: "Жанри",
                path: "/genres",
                icon: Tags,
            },
            {
                title: "Коди",
                path: "/codes",
                icon: Hash,
            },
            {
                title: "Плеєри",
                path: "/players",
                icon: Play,
            },
            {
                title: "Команди озвучення",
                path: "/releaseteams",
                icon: MicVocal,
            },
        ],
    },
];
