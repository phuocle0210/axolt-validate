"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAttribute = void 0;
/**
 * axoltvd(res.body,
 * {
 *      username: [validate.required, validate.maxLength(6)],
 *      password: [validate.required, validate.confirm(res.body?.password)]
 * })
 */
const message_1 = __importDefault(require("./message"));
let attribute;
class Validation {
    constructor(data, validate, attribute) {
        this.data = data;
        this.validate = validate;
        this.attribute = attribute;
    }
    handleRequired(value) {
        return !!value;
    }
    handleMaxLength(value, store) {
        return store.maxLength && this.handleRequired(value) && value.length <= store.maxLength;
    }
    handleMinLength(value, store) {
        return store.minLength && this.handleRequired(value) && value.length >= store.minLength;
    }
    handleIsString(value) {
        return typeof (value) === "string";
    }
    handleIsNumber(value) {
        return !isNaN(Number(value));
    }
    handleRegex(value, store) {
        if (store.required !== undefined && !store.required)
            return true;
        return typeof (value) === "string" && store.regex && value.match(store.regex) !== null;
    }
    handleMax(value, store) {
        return this.handleIsNumber(value) && store.max && Number(value) <= store.max;
    }
    handleMin(value, store) {
        return this.handleIsNumber(value) && store.min && Number(value) >= store.min;
    }
    handleConfirm(nameValueCheck, value) {
        const valueCheck = this.data[nameValueCheck];
        return valueCheck === value;
    }
    handleMessage(name) {
        var _a;
        const _name = this.attribute ? (_a = this.attribute[name]) !== null && _a !== void 0 ? _a : name : name;
        return (key, custom) => {
            let message = message_1.default[key];
            if (custom) {
                const _key = Object.keys(custom)[0];
                message = message.replace(_key, custom[_key]);
            }
            message = message.replace("[attribute]", _name);
            return message;
        };
    }
    result() {
        const result = {
            isError: false,
            errors: []
        };
        for (const key of Object.keys(this.validate)) {
            const value = this.data[key];
            const listValidate = this.validate[key];
            const message = this.handleMessage(key);
            if ("required" in listValidate && listValidate.required && !this.handleRequired(value)) {
                result.errors.push({ message: message("required") });
            }
            if ("maxLength" in listValidate && !this.handleMaxLength(value, listValidate)) {
                result.errors.push({ message: message("maxLength", { "[max]": listValidate.maxLength }) });
            }
            if ("minLength" in listValidate && !this.handleMinLength(value, listValidate)) {
                result.errors.push({ message: message("minLength", { "[min]": listValidate.minLength }) });
            }
            if ("isString" in listValidate && listValidate.isString && !this.handleIsString(value)) {
                result.errors.push({ message: message("isString") });
            }
            if ("isNumber" in listValidate && listValidate.isNumber && !this.handleIsNumber(value)) {
                result.errors.push({ message: message("isNumber") });
            }
            if ("regex" in listValidate && !this.handleRegex(value, listValidate)) {
                result.errors.push({ message: message("regex") });
            }
            if ("max" in listValidate && !this.handleMax(value, listValidate)) {
                result.errors.push({ message: message("max", { "[max]": listValidate.max }) });
            }
            if ("min" in listValidate && !this.handleMin(value, listValidate)) {
                result.errors.push({ message: message("min", { "[min]": listValidate.min }) });
            }
            if ("confirm" in listValidate && listValidate.confirm && !this.handleConfirm(listValidate.confirm, value)) {
                result.errors.push({ message: message("confirm") });
            }
        }
        result.isError = result.errors.length > 0;
        return result;
    }
}
function setAttribute(attr) {
    attribute = attr;
}
exports.setAttribute = setAttribute;
function app(data, validate, attr = {}) {
    if (Object.keys(attr).length > 0) {
        attribute = attr;
    }
    const validation = new Validation(data, validate, attribute);
    return validation.result();
}
exports.default = app;
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
