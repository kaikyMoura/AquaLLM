import { Request, Response, Router } from "express";
import measureService from "../services/MeasureService";

class MeasureController {

    async uploadImage(req: Request, res: Response): Promise<any> {
        try {

            const response = await measureService.uploadFile(req, res)

            return response
        }
        catch (error) {
            console.error("Erro : ", error)
        }
    }

    async confirmValue(req: Request, res: Response): Promise<any> {
        try {

            const response = await measureService.confirmMeasureValue(req, res)

            return response
        }
        catch (error) {
            console.error("Erro : ", error)
        }
    }

    async deleteMeasure(req: Request, res: Response): Promise<any> {
        try {

            const response = await measureService.remove(req, res)

            return response
        }
        catch (error) {
            console.error("Erro : ", error)
        }
    }

    async listMeasures(req: Request, res: Response): Promise<any> {
        try {

            const response = await measureService.listMeasures(req, res)

            return response
        }
        catch (error) {
            console.error("Erro : ", error)
        }
    }
}

export default new MeasureController()