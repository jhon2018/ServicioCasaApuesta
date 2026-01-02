// src/shared/BaseResponse.ts
export class BaseResponse<T> {
    success: boolean;
    message: string;
    data?: T;

    constructor(success: boolean, message: string, data?: T) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    static success<T>(data?: T, message: string = "Operación exitosa"): BaseResponse<T> {
        return new BaseResponse(true, message, data);
    }

    static error(message: string = "Error en la operación"): BaseResponse<null> {
        return new BaseResponse(false, message, null);
    }
}

export default BaseResponse;