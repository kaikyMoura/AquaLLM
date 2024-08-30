export interface IMeasureList {
    customer_code: string,
    measures: Array<{
        measure_uuid: String,
        measure_datetime: Date,
        measure_type: String,
        has_confirmed: boolean,
        image_url: String
    }>
}