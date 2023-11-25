interface IStore {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    isString?: boolean;
    isBoolean?: boolean;
    isNumber?: boolean;
    regex?: RegExp;
    max?: number;
    min?: number;
    confirm?: string;
    integer?: boolean;
}
interface IValidate {
    [name: string]: IStore;
}
interface IValidateError {
    message: string;
}
interface IValidateResult {
    isError: boolean;
    errors: IValidateError[];
}
interface IAttributeName {
    [name: string]: string;
}
export declare function setAttribute(attr: IAttributeName): void;
export default function app(data: object, validate: IValidate, attr?: IAttributeName): IValidateResult;
export {};
