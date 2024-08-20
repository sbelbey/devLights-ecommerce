export interface UserCreateFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}

export interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface UserLoginFields {
    email: string;
    password: string;
}
