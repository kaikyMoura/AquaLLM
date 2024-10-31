import { MeasureType } from "../enums/MeasureType";

export interface IResponse {
    image_url: string,
    measure_value: number,
    measure_uuid?: string,
    measure_type?: MeasureType,
}