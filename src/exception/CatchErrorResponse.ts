import { Response } from "express";
import { IResponseError } from "../model/IResponseError";

export const catchErrorResponse = async (res: Response, statusCode: number, errorCode: string, errorDescription: string, message?: string) => {
    const errorResponse: IResponseError = {
        error_code: errorCode,
        error_description: errorDescription,
    };
    return res.status(statusCode).json({
        message: message,
        error: errorResponse
    });
};