import type { Permissions } from "~/lib/constants/permissions";
import type { Image } from "~/lib/types/entities/image-type";

export interface User {
    id: number;
    email: string;
    username: string;
    permissions: Permissions[];
    displayName: string | null;
    avatar: Image | null;
    createdAt: string;
    updatedAt: string;
}