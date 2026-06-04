export declare class AuthService {
    private client;
    verifyGoogleToken(token: string): Promise<import("google-auth-library").TokenPayload>;
}
