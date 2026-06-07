import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout('routes/layouts/main-layout.tsx', [
        index("routes/home.tsx"),
        layout("routes/layouts/page-layout.tsx", [
            route("dashboard", "routes/dashboard.tsx"),
            route("images", "routes/images/images.tsx"),
            route("codes", "routes/codes/codes.tsx"),
            ...prefix('animes', [
                index("routes/animes/animes.tsx"),
                route("create", "routes/animes/create-anime.tsx"),
                route(":id", "routes/animes/edit-anime.tsx"),
            ]),
            ...prefix("users", [
                index("routes/users/users.tsx"),
                route("create", "routes/users/create-user.tsx"),
                route(":id", "routes/users/edit-user.tsx"),
            ]),
            ...prefix("genres", [
                index("routes/genres/genres.tsx"),
                route("create", "routes/genres/create-genre.tsx"),
                route(":id", "routes/genres/edit-genre.tsx"),
            ]),
            ...prefix('players', [
                index("routes/players/players.tsx"),
                route("create", "routes/players/create-player.tsx"),
                route(":id", "routes/players/edit-player.tsx"),
            ]),
            ...prefix('releaseteams', [
                index("routes/releaseteams/releaseteams.tsx"),
                route("create", "routes/releaseteams/create-releaseteams.tsx"),
                route(":id", "routes/releaseteams/edit-releaseteams.tsx"),
            ]),
        ])
    ]),
] satisfies RouteConfig;
