import { UserRole } from "./user-role"

export interface User {
    name: string;
    lastName: string;
    email: string;
    token: string;
    role: UserRole;
}