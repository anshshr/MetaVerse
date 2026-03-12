export interface User {
    id: string;
    email: string;
    username: string;
}
export declare const useAuth: () => {
    user: User | null;
    loading: boolean;
    error: string | null;
    register: (email: string, password: string, username: string) => Promise<any>;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    isAuthenticated: boolean;
};
//# sourceMappingURL=useAuth.d.ts.map