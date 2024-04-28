import { UserRole } from "./user-role"

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    role: UserRole;
}