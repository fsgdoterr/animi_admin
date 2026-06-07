import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout('routes/layouts/main-layout.tsx', [
        index("routes/home.tsx"),
        layout("routes/layouts/page-layout.tsx", [
            route("/dashboard", "routes/dashboard.tsx"),
            route("/animes", "routes/animes/animes.tsx"),
            ...prefix("users", [
                index("routes/users/users.tsx"),
                route("create", "routes/users/create-user.tsx"),
                route(":id", "routes/users/edit-user.tsx"),
            ]),
            route("/images", "routes/images/images.tsx"),
            route("/genres", "routes/genres/genres.tsx"),
            route("/codes", "routes/codes/codes.tsx"),
            route("/players", "routes/players/players.tsx"),
            route("/releaseteams", "routes/releaseteams/releaseteams.tsx"),
        ])
    ]),
] satisfies RouteConfig;
