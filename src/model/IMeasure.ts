import { MeasureType } from "../enums/MeasureType";

export interface IMeasure {
    measure_uuid: String,
    image_url: String,
    measure_value?: Number,
    measure_datetime: Date,
    measure_type: MeasureType,
    customer_code?: string,
    has_confirmed: boolean
}