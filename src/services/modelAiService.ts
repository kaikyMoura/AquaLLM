import { MeasureType } from './../enums/MeasureType';
import { IMeasure } from './../model/IMeasure';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { Request, Response } from "express";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { ErrorCode } from "../enums/ErrorCode";
import { catchErrorResponse } from "../exception/CatchErrorResponse";
import { model } from "../genAi/apiKey";
import { IResponse } from "../model/IResponse";
import { create, findMany, findUnique, getMeasureForMonth, update } from "./dbService";
import path from "path";
import { IMeasureList } from '../model/IMeasureList';

export class MeasureService {

    protected validateBase64(base64: string): boolean {
        try {
            return Buffer.from(base64, 'base64').toString('base64') === base64
        }
        catch (error) {
            return false
        }
    }

    async uploadFile(req: Request, res: Response): Promise<Response> {
        const fileManager = new GoogleAIFileManager(model.apiKey);

        const { image, customer_code, measure_type, measure_datetime } = req.body

        const base64 = image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '')

        const imageBuffered = Buffer.from(base64, 'base64')

        const tempFile = path.join('tempImage.jpg')

        try {

            if (!this.validateBase64(base64) || typeof customer_code !== 'string') {
                return catchErrorResponse(res, 400, ErrorCode.INVALID_DATA, "Os dados fornecidos no corpo da requisição são inválidos");
            }

            const existingMeasure = await getMeasureForMonth(customer_code, measure_type, new Date(measure_datetime));

            if (existingMeasure) {
                return catchErrorResponse(res, 409, ErrorCode.DOUBLE_REPORT, "Leitura do mês járealizada", "Já existe uma leitura para este tipo no mês atual");
            }

            if (typeof customer_code !== 'string') {
                return catchErrorResponse(res, 400, ErrorCode.INVALID_DATA, "Os dados fornecidos no corpo da requisição são inválidos");
            }


            fs.writeFileSync(tempFile, imageBuffered);

            const uploadResponse = await fileManager.uploadFile(tempFile, {
                mimeType: 'image/jpeg',
                displayName: 'Imagem'
            });

            const result = await model.generateContent([
                "Qual é a leitura númerica deste medidor da imagem ? (só retorne o valor númerico)",
                {
                    fileData: {
                        fileUri: uploadResponse.file.uri,
                        mimeType: uploadResponse.file.mimeType
                    }
                }
            ]);

            fs.unlinkSync(tempFile);

            const value = parseInt(result.response.text().replace(/\n/g, '').trim(), 10)

            const newUUID = uuidv4();

            const measure: IMeasure = {
                customer_code: customer_code,
                image_url: uploadResponse.file.uri,
                measure_value: value,
                measure_uuid: newUUID,
                measure_datetime: new Date(measure_datetime),
                measure_type: measure_type,
                has_confirmed: false
            }

            const response: IResponse = {
                image_url: uploadResponse.file.uri,
                measure_value: value,
                measure_uuid: measure.measure_uuid as MeasureType,
            }

            await create(measure).catch(() => catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor"))

            return res.status(200).json({
                message: "Operação realizada com sucesso",
                data: response
            })
        }
        catch (error) {
            console.log(error)
            fs.unlinkSync('tempImage.jpg')
            return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
        }
    }

    async confirmMeasureValue(req: Request, res: Response): Promise<Response> {
        const { measure_uuid, confirmed_value } = req.body;

        try {

            if (typeof measure_uuid !== 'string') {
                return catchErrorResponse(res, 400, ErrorCode.INVALID_DATA, "Algum campo não foi preenchido corretamente",
                    "Os dados fornecidos no corpo da requisição são inválidos");
            }

            const measure: IMeasure = await findUnique(measure_uuid)

            if (!measure) {
                return catchErrorResponse(res, 404, ErrorCode.MEASURE_NOT_FOUND, "Leitura não encontrada");
            }

            const existingMeasure = await getMeasureForMonth(measure.customer_code!, measure.measure_type, measure.measure_datetime);

            if (measure.has_confirmed === true && existingMeasure) {
                return catchErrorResponse(res, 409, ErrorCode.CONFIRMATION_DUPLICATE, "Leitura já confirmada", "Leitura do mês já realizada");
            }


            await update(measure_uuid, confirmed_value).catch(() => catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor"))
            return res.status(200).json({ status: "sucess" })

        }
        catch (error) {
            console.log(error)
            return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
        }
    }

    async listMeasures(req: Request, res: Response): Promise<Response> {

        try {

            const customer_code = req.params.customer_code

            const measureTypeParam = req.query.measure_type as string | undefined


            const measure_type = measureTypeParam?.toUpperCase() as MeasureType | undefined

            if (measure_type && !Object.values(MeasureType).includes(measure_type)) {
                return catchErrorResponse(res, 400, ErrorCode.INVALID_TYPE, "Tipo de medição não permitida",
                    "Parâmetro measure_type diferente de WATER ou GAS");
            }

            const measures: IMeasure[] = await findMany(customer_code, measure_type as MeasureType | undefined)

            if (measures.length === 0) {
                return catchErrorResponse(res, 404, ErrorCode.MEASURE_NOT_FOUND, "Nenhuma leitura encontrada",
                    "Nenhum registro encontrado ");
            }

            const measuresList = measures.map(measure => ({
                measure_uuid: measure.measure_uuid,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.has_confirmed,
                image_url: measure.image_url
            }));

            const response: IMeasureList = {
                customer_code: customer_code,
                measures: measuresList
            }

            return res.status(200).json({
                message: "Operação realizada com sucesso",
                data: response
            })
        }
        catch (error) {
            console.log(error)
            return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
        }
    }
}