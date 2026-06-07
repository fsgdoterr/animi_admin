import type { Permissions } from "~/lib/constants/permissions";

export interface UserFormType {
    email: string;
    username: string;
    password: string;
    displayName: string;
    avatarId: number;
    permissions: Permissions[];
}
