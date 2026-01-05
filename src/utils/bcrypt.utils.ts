// src/utils/bcrypt.ts
// objetivo: Proporcionar funciones para el hash y la verificación de contraseñas utilizando bcrypt.

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10; //

export class BcryptService {
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}