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

        try {

            const existingMeasure = await getMeasureForMonth(customer_code, measure_type, new Date(measure_datetime));

            const imageBuffered = Buffer.from(base64, 'base64')

            const tempFile = path.join('tempImage.jpg')

            console.log(tempFile)

            fs.writeFileSync(tempFile, imageBuffered);

            if (!this.validateBase64(base64) || typeof customer_code !== 'string') {
                return catchErrorResponse(res, 400, ErrorCode.INVALID_DATA, "Os dados fornecidos no corpo da requisição são inválidos");
            }

            if (existingMeasure) {
                return catchErrorResponse(res, 409, ErrorCode.DOUBLE_REPORT, "Leitura do mês járealizada", "Já existe uma leitura para este tipo no mês atual");
            }

            if (typeof customer_code !== 'string') {
                return catchErrorResponse(res, 400, ErrorCode.INVALID_DATA, "Os dados fornecidos no corpo da requisição são inválidos");
            }

            const uploadResponse = await fileManager.uploadFile(tempFile, {
                mimeType: 'image/jpg',
                displayName: 'Imagem'
            });

            const prompt = "Qual é a leitura númerica deste medidor da imagem ? (só retorne o valor númerico)"

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: Buffer.from(fs.readFileSync(tempFile)).toString("base64"),
                        mimeType: uploadResponse.file.mimeType
                    }
                }
            ]);

            fs.unlinkSync(tempFile);

            const value = result.response.text().replace(/\n/g, '').trim()

            const newUUID = uuidv4();

            const measure: IMeasure = {
                customer_code: customer_code,
                image_url: uploadResponse.file.uri,
                measure_value: parseInt(value, 10),
                measure_uuid: newUUID,
                measure_datetime: new Date(measure_datetime),
                measure_type: measure_type,
                has_confirmed: false
            }

            console.log(measure)

            const response: IResponse = {
                image_url: uploadResponse.file.uri,
                measure_value: value,
                measure_uuid: newUUID,
            }

            return await create(measure).then(() => {
                return res.status(200).json({
                    message: "Operação realizada com sucesso",
                    data: response
                })
            }).catch((error) => {
                console.log(error)
                return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
            })
        }
        catch (error) {
            console.log(error)
            return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
        }
    }

    async confirmMeasureValue(req: Request, res: Response): Promise<Response> {
        const { measure_uuid, confirmed_value } = req.body;

        const measure: IMeasure = await findUnique(measure_uuid)

        const existingMeasure = await getMeasureForMonth(measure.customer_code!, measure.measure_type, measure.measure_datetime);
        try {

            if (typeof measure_uuid !== 'string' || measure_uuid !== measure.measure_uuid) {
                return catchErrorResponse(res, 400, ErrorCode.INVALID_DATA, "Algum campo não foi preenchido corretamente",
                    "Os dados fornecidos no corpo da requisição são inválidos");
            }

            if (!measure) {
                return catchErrorResponse(res, 404, ErrorCode.MEASURE_NOT_FOUND, "Leitura não encontrada");
            }

            if (measure.has_confirmed === true || existingMeasure) {
                return catchErrorResponse(res, 409, ErrorCode.CONFIRMATION_DUPLICATE, "Leitura já confirmada", "Leitura do mês já realizada");
            }


            return await update(measure_uuid, confirmed_value).then(() => {
                return res.status(200).json({ status: "sucess" })
            }).catch((error) => {
                console.log(error)
                return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
            })

        }
        catch (error) {
            return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
        }
    }

    async listMeasures(req: Request, res: Response): Promise<Response> {

        try {

            const customer_code = req.params.customer_code

            const measureTypeParam = req.query.measure_type as string | undefined

            console.log(measureTypeParam)

            const measure_type = measureTypeParam?.toUpperCase()

            if (measure_type && !Object.values(MeasureType).includes(measure_type as MeasureType)) {
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
            return catchErrorResponse(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
        }
    }
}
