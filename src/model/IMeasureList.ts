import { MeasureType } from "../enums/MeasureType"

export interface IMeasureList {
    customer_code: string,
    measures: Array<{
        measure_datetime: Date,
        measure_value: number
        measure_uuid: string,
        measure_type: MeasureType,
        has_confirmed: boolean,
        image_url: string
    }>
}