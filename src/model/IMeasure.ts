import { MeasureType } from './../../node_modules/.prisma/client/index.d';

export interface IMeasure {
    measure_uuid: string,
    image_url: string,
    measure_value: number,
    measure_datetime: Date,
    measure_type: MeasureType,
    confirmed_value: number | null
    customer_code: string | null,
    has_confirmed: boolean
}