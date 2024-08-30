import { Request, Response, Router } from "express";
import { MeasureService } from "../services/modelAiService";

export class MeasureController {
    confirmMeasureValue(arg0: string, confirmMeasureValue: any) {
        throw new Error('Method not implemented.');
    }

    async uploadImage(req: Request, res: Response): Promise<any> {
        const measureService = new MeasureService()
        try {

            const response = await measureService.uploadFile(req, res)

            return response
        }
        catch (error) {
            console.error("Erro : ", error)
        }
    }

    async confirmValue(req: Request, res: Response): Promise<any> {
        const measureService = new MeasureService()
        try {

            const response = await measureService.confirmMeasureValue(req, res)

            return response
        }
        catch (error) {
            console.error("Erro : ", error)
        }
    }

    async listMeasures(req: Request, res: Response): Promise<any> {
        const measureService = new MeasureService()
        try {

            const response = await measureService.listMeasures(req, res)

            return response
        }
        catch (error) {
            console.error("Erro : ", error)
        }
    }
}