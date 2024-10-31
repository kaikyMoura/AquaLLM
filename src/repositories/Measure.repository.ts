import { MeasureType } from "../enums/MeasureType";
import { IMeasure } from "../model/IMeasure";
import prisma from "../schemas/client";
import { Measure } from './../../node_modules/.prisma/client/index.d';

class MeasureRepository {
    create = async (data: Measure): Promise<IMeasure> => {
        try {
            const response = await prisma.measure.create({ data: data })
            return response
        } catch (e) {
            throw new Error("Erro : " + e)
        }
    }

    getMeasureForMonth = async (customer_code: string, measure_type: MeasureType, measure_datetime: Date): Promise<any> => {
        try {
            const year = measure_datetime.getFullYear();
            const month = measure_datetime.getMonth() + 1

            const response = await prisma.measure.findFirst({
                where: {
                    customer_code: customer_code,
                    measure_type: measure_type,
                    measure_datetime: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1),
                    },
                }
            });

            return response;
        } catch (e) {
            throw new Error("Erro : " + e)
        }
    }

    findUnique = async (measure_uuid: string): Promise<any> => {
        return await prisma.measure.findUnique({
            where: { measure_uuid: measure_uuid, }
        });
    }

    findMany = async (customer_code: string, measure_type: MeasureType): Promise<any[]> => {
        return await prisma.measure.findMany({
            where: { customer_code: customer_code, measure_type: measure_type }
        });
    }

    update = async (measure_uuid: string, confirmed_value: number): Promise<void> => {
        await prisma.measure.update({
            where: { measure_uuid: measure_uuid },
            data: {
                measure_value: confirmed_value,
                has_confirmed: true,
            },
        });
    }

    remove = async (measure_uuid: string): Promise<void> => {
        await prisma.measure.delete({
            where: { measure_uuid: measure_uuid },
        });
    }
}

export default new MeasureRepository()