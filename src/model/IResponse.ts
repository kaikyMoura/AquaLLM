import { IMeasure } from "./IMeasure";

export interface IResponse {
    image_url: string,
    measure_value: string | number,
    measure_uuid: string,
}