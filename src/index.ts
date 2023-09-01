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

interface ICustom {
    [name: string]: unknown
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

    private handleRequired(value: string) {
        return !!value;
    }

    private handleMaxLength(value: string, store: IStore) {
        return store.maxLength && this.handleRequired(value) && value.length <= store.maxLength;  
    }

    private handleMinLength(value: string, store: IStore) {
        return store.minLength && this.handleRequired(value) && value.length >= store.minLength;  
    }

    private handleIsString(value: unknown) {
        return typeof(value) === "string";
    }

    private handleIsNumber(value: unknown) {
        return !isNaN(Number(value));
    }

    private handleRegex(value: unknown, store: IStore) {
        return typeof(value) === "string" && store.regex && value.match(store.regex) !== null;
    }

    private handleMax(value: unknown, store: IStore) {
        return this.handleIsNumber(value) && store.max && Number(value) <= store.max;
    }

    private handleMin(value: unknown, store: IStore) {
        return this.handleIsNumber(value) && store.min && Number(value) >= store.min;
    }

    private handleConfirm(nameValueCheck: string, value: unknown) {
        const valueCheck = this.data[nameValueCheck as keyof typeof this.data];
        return valueCheck === value;
    }

    private handleMessage(name: string) {
        const _name: string = this.attribute[name] ?? name;

        return (key: string, custom?: ICustom) => {
            let message: string = validateMessage[key as keyof typeof validateMessage];

            if(custom) {
                const _key = Object.keys(custom)[0];
                message = message.replace(_key, custom[_key] as string);
            }
    
            message = message.replace("[attribute]", _name);
    
            return message;
        }
    }

    public result() {
        const result: IValidateResult = {
            isError: false,
            errors: []
        };

        for(const key of Object.keys(this.validate)) {
            const value = this.data[key as keyof typeof this.data];

            const listValidate = this.validate[key];
            const message = this.handleMessage(key);

            if("required" in listValidate && listValidate.required && !this.handleRequired(value)) {
                result.errors.push({ message: message("required") })
            }

            if("maxLength" in listValidate && !this.handleMaxLength(value, listValidate)) {
                result.errors.push({ message: message("maxLength", { "[max]": listValidate.maxLength }) });
            }

            if("minLength" in listValidate && !this.handleMinLength(value, listValidate)) {
                result.errors.push({ message: message("minLength", { "[min]": listValidate.minLength }) });
            }

            if("isString" in listValidate && listValidate.isString && !this.handleIsString(value)) {
                result.errors.push({ message: message("isString") });
            }

            if("isNumber" in listValidate && listValidate.isNumber && !this.handleIsNumber(value)) {
                result.errors.push({ message: message("isNumber") });
            }

            if("regex" in listValidate && !this.handleRegex(value, listValidate)) {
                result.errors.push({ message: message("regex") });
            }

            if("max" in listValidate && !this.handleMax(value, listValidate)) {
                result.errors.push({ message: message("max", { "[max]": listValidate.max }) });
            }

            if("min" in listValidate && !this.handleMin(value, listValidate)) {
                result.errors.push({ message: message("min", { "[min]": listValidate.min }) });
            }

            if("confirm" in listValidate && listValidate.confirm && !this.handleConfirm(listValidate.confirm, value)) {
                result.errors.push({ message: message("confirm") });
            }
        }

        result.isError = result.errors.length > 0;
        return result;
    }
}


export function setAttribute(attr: IAttributeName) {
    attribute = attr;
}

export default function app(data: object, validate: IValidate, attr: IAttributeName = {}) {
    if(Object.keys(attr).length > 0) {
        attribute = attr;
    }

    const validation = new Validation(data, validate, attribute);
    return validation.result();
}

// setAttribute({
//     name: "Tên người dùng",
//     email: "Email"
// })

// const data = app({
//     username: "dwqdd",
//     email: "dsasdad0@gmail.com",
//     password: "1",
//     re_password: "1",
//     vnd: "50",
//     status: "1231"
// }, {
//     username: {required: true, minLength: 5, maxLength: 20, isString: true},
//     password: {required: true, isString: true, confirm: "re_password"},
//     vnd: {required: true, isNumber: true, max: 50},
//     email: {required: true, regex: /^[^\s;]+@[^\s;]+\.[^\s;]+(?:;[^\s;]+@[^\s;]+\.[^\s;]+)*$/},
//     status: {isBoolean: true}
// }, {
//     username: "Tên đăng nhập",
//     password: "Mật khẩu",
//     re_password: "Xác minh mật khẩu"
// });

// console.log(data);