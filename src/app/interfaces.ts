export interface Response {
    errors: Error[],
    data?: ResponseData,
}

export interface ResponseData {
    success: boolean,
    won: boolean
}

export interface Error {
    code: string,
    source: string
}

export interface CodeUploadPayload {
    email: string,
    code: string,
    purchase_time: string
}

export interface NavigationRegistrationData {
    email: string,
    code: string,
    purchase_time: string
}

export interface RegistrationPayload {
    email: string,
    name: string,
}