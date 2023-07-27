/**
 * axoltvd(res.body, 
 * { 
 *      username: [validate.required, validate.maxLength(6)],
 *      password: [validate.required, validate.confirm(res.body?.password)] 
 * })
 */
import validateMessage from "./message";

interface IStore {
    required?: boolean,
    maxLength?: number,
    minLength?: number,
    isString?: boolean,
    isBoolean?: boolean,
    isNumber?: boolean,
    regex?: RegExp,
    max?: number,
    min?: number,
    confirm?: string,
}

interface IValidate {
    [name: string]: IStore
}

interface IValidateError {
    message: string
}

interface IValidateResult {
    isError: boolean,
    errors: IValidateError[]
}

interface IAttributeName {
    [name: string]: string
}

let attribute: IAttributeName;

class Validation {
    private data: object;
    private validate: IValidate;
    private attribute: IAttributeName

    constructor(data: object, validate: IValidate, attribute: IAttributeName) {
        this.data = data;
        this.validate = validate;
        this.attribute = attribute;
    }

    private checkObjectValidate(name: string, objValidate: IStore) {
        return name in objValidate && objValidate[name as keyof typeof objValidate];
    }

    protected checkRequired(value: any) {
        return !(!Boolean(value) || value === undefined || value === "");
    }

    protected checkMaxLength(objValidate: IStore, value: any) {
        return typeof(value) === "string" && value.length <= (objValidate as any).maxLength ;
    }

    protected checkMinLength(objValidate: IStore, value: any) {
        return typeof(value) === "string" && value.length >= (objValidate as any).minLength;
    }

    protected checkNumber(value: any) {
        return Number(value) && !isNaN(value);
    }

    protected checkMax(objValidate: IStore, value: any) {
        return this.checkNumber(value) && Number(value) <= Number((objValidate as any).max);
    }

    protected checkMin(objValidate: IStore, value: any) {
        return this.checkNumber(value) && Number(value) >= Number((objValidate as any).min);
    }

    protected isString(value: any) {
        return typeof(value) === "string" && value !== "";
    }

    protected confirm(value: any, valueConfirm: any) {
        return value === valueConfirm;
    }

    protected regex(objValidate: IStore, value: any) {
        return typeof(value) === "string" && value.match(objValidate.regex as RegExp) !== null;
    }

    private handleMessage(message: string, name: string, value?: any) {
        if(value !== undefined && (message.includes("[max]") || message.includes("[min]")))
            message = message.replace(message.includes("[max]") ? "[max]" : "[min]", value as string);

        return { message: message.replace("[attribute]", name) }
    }

    public result() {
        const listResults: IValidateResult = {
            isError: false,
            errors: []
        }

        for(let key of Object.keys(this.data)) {
            const objValidate = this.validate[key];
            const value = this.data[key as keyof typeof this.data];
            key = this.attribute[key as keyof typeof this.attribute] ?? key;

            if(!objValidate) continue;

            if(this.checkObjectValidate("required", objValidate) && !this.checkRequired(value)) 
                listResults.errors.push(this.handleMessage(validateMessage.required, key));
            
            if(this.checkObjectValidate("maxLength", objValidate) && !this.checkMaxLength(objValidate, value)) 
                listResults.errors.push(this.handleMessage(validateMessage.maxLength, key, objValidate.maxLength));

            if(this.checkObjectValidate("minLength", objValidate) && !this.checkMinLength(objValidate, value))
                listResults.errors.push(this.handleMessage(validateMessage.minLength, key, objValidate.minLength));

            if(this.checkObjectValidate("isNumber", objValidate) && !this.checkNumber(value))
                listResults.errors.push(this.handleMessage(validateMessage.isNumber, key));

            if(this.checkObjectValidate("max", objValidate) && !this.checkMax(objValidate, value))
                listResults.errors.push(this.handleMessage(validateMessage.max, key, objValidate.max));

            if(this.checkObjectValidate("min", objValidate) && !this.checkMin(objValidate, value))
                listResults.errors.push(this.handleMessage(validateMessage.min, key, objValidate.min));

            if(this.checkObjectValidate("confirm", objValidate) && !this.confirm(value, this.data[objValidate.confirm as keyof typeof this.data]))
                listResults.errors.push(this.handleMessage(validateMessage.confirm, key));

            if(this.checkObjectValidate("regex", objValidate) && !this.regex(objValidate, value))
                listResults.errors.push(this.handleMessage(validateMessage.regex, key));
        }

        return {
            isError: (listResults.errors.length > 0),
            errors: listResults.errors
        }
    }

}


export function setAttribute(attr: IAttributeName) {
    attribute = attr;
}

export default function app(data: object, validate: IValidate) {
    const validation = new Validation(data, validate, attribute);
    return validation.result();
}

// setAttribute({
//     name: "Tên người dùng",
//     email: "Email"
// })

// const data = app({
//     username: "",
//     email: "dsasdad0@gmail.com",
//     password: "123231231",
//     re_password: "123231231",
//     vnd: "50",
//     status: "1231"
// }, {
//     username: {required: true, minLength: 5, maxLength: 20, isString: true},
//     password: {required: true, isString: true, confirm: "re_password"},
//     vnd: {required: true, isNumber: true, max: 50},
//     email: {required: true, regex: /^[^\s;]+@[^\s;]+\.[^\s;]+(?:;[^\s;]+@[^\s;]+\.[^\s;]+)*$/},
//     status: {isBoolean: true}
// });

// console.log(data);