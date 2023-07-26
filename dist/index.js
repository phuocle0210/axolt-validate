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
    checkObjectValidate(name, objValidate) {
        return name in objValidate && objValidate[name];
    }
    checkRequired(value) {
        return !(!Boolean(value) || value === undefined || value === "");
    }
    checkMaxLength(objValidate, value) {
        return typeof (value) === "string" && value.length <= objValidate.maxLength;
    }
    checkMinLength(objValidate, value) {
        return typeof (value) === "string" && value.length >= objValidate.minLength;
    }
    checkNumber(value) {
        return Number(value) && !isNaN(value);
    }
    checkMax(objValidate, value) {
        return this.checkNumber(value) && Number(value) <= Number(objValidate.max);
    }
    checkMin(objValidate, value) {
        return this.checkNumber(value) && Number(value) >= Number(objValidate.min);
    }
    isString(value) {
        return typeof (value) === "string" && value !== "";
    }
    confirm(value, valueConfirm) {
        return value === valueConfirm;
    }
    regex(objValidate, value) {
        return typeof (value) === "string" && value.match(objValidate.regex) !== null;
    }
    handleMessage(message, name, value) {
        if (value !== undefined && (message.includes("[max]") || message.includes("[min]")))
            message = message.replace(message.includes("[max]") ? "[max]" : "[min]", value);
        return { message: message.replace("[attribute]", name) };
    }
    result() {
        var _a;
        const listResults = {
            isError: false,
            errors: []
        };
        for (let key of Object.keys(this.data)) {
            const objValidate = this.validate[key];
            const value = this.data[key];
            key = (_a = this.attribute[key]) !== null && _a !== void 0 ? _a : key;
            if (!objValidate)
                continue;
            if (this.checkObjectValidate("required", objValidate) && !this.checkRequired(value))
                listResults.errors.push(this.handleMessage(message_1.default.required, key));
            if (this.checkObjectValidate("maxLength", objValidate) && !this.checkMaxLength(objValidate, value))
                listResults.errors.push(this.handleMessage(message_1.default.maxLength, key, objValidate.maxLength));
            if (this.checkObjectValidate("minLength", objValidate) && !this.checkMinLength(objValidate, value))
                listResults.errors.push(this.handleMessage(message_1.default.minLength, key, objValidate.minLength));
            if (this.checkObjectValidate("isNumber", objValidate) && !this.checkNumber(value))
                listResults.errors.push(this.handleMessage(message_1.default.isNumber, key));
            if (this.checkObjectValidate("max", objValidate) && !this.checkMax(objValidate, value))
                listResults.errors.push(this.handleMessage(message_1.default.max, key, objValidate.max));
            if (this.checkObjectValidate("min", objValidate) && !this.checkMin(objValidate, value))
                listResults.errors.push(this.handleMessage(message_1.default.min, key, objValidate.min));
            if (this.checkObjectValidate("confirm", objValidate) && !this.confirm(value, this.data[objValidate.confirm]))
                listResults.errors.push(this.handleMessage(message_1.default.confirm, key));
            if (this.checkObjectValidate("regex", objValidate) && !this.regex(objValidate, value))
                listResults.errors.push(this.handleMessage(message_1.default.regex, key));
        }
        return {
            isError: (listResults.errors.length > 0),
            errors: listResults.errors
        };
    }
}
function setAttribute(attr) {
    attribute = attr;
}
exports.setAttribute = setAttribute;
function app(data, validate) {
    const validation = new Validation(data, validate, attribute);
    return validation.result();
}
exports.default = app;
// setAttribute({
//     name: "Tên người dùng",
//     email: "Email"
// })
// const data = app({
//     username: "",
//     email: "phuoc.le.van0210@gmail.com",
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
