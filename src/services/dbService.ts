import prisma from "../client"
import { MeasureType } from "../enums/MeasureType"

export const create = async (measure: any): Promise<void> => {
    try {
        await prisma.tb_measures.create({ data: measure })
    } catch (e) {
        console.error("Erro : ", e)
    }
}

export const getMeasureForMonth = async (customer_code: string, measure_type: MeasureType, measure_datetime: Date): Promise<Boolean> => {
    try {
        const year = measure_datetime.getFullYear();
        const month = measure_datetime.getMonth() + 1

        const response = await prisma.tb_measures.findFirst({
            where: {
                customer_code: customer_code,
                measure_type: measure_type,
                measure_datetime: {
                    gte: new Date(year, month - 1, 1),
                    lt: new Date(year, month, 1),
                },
            }
        });

        return !!response;
    } catch (e) {
        return false
    }
}

export const findUnique = async (measure_uuid: string): Promise<any> => {
    return await prisma.tb_measures.findUnique({
        where: { measure_uuid: measure_uuid, }
    });
}

export const findMany = async (customer_code: string, measure_type: MeasureType | undefined): Promise<any[]> => {
    return await prisma.tb_measures.findMany({
        where: { customer_code: customer_code, measure_type: measure_type }
    });
}
export const update = async (measure_uuid: string, confirmed_value: number): Promise<void> => {
    await prisma.tb_measures.update({
        where: { measure_uuid: measure_uuid },
        data: {
            measure_value: confirmed_value,
            has_confirmed: true,
        },
    });
}