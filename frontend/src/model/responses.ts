import { ZodIssue } from "zod"

export type RegisterResponseError = {
    type: "validation",
    info: ZodIssue[]
} | {
    type: "invalid-data"
} | {
    type: "internal",
    message: string
};

export type RegisterResponse = {
    ok: true
} | {
    ok: false,
    error: RegisterResponseError
};

export type FetchAllClientsResponse = {
    name: string,
    code: number
}[];

export type FetchAllProductsResponse = {
    name: string,
    code: number,
    price: number,
    amountAvailable: number
}[];