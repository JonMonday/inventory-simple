export declare function hashPassword(plainPassword: string): Promise<string>;
export declare function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean>;
