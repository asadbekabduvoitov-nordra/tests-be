"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catch_error = void 0;
const catch_error = (err, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.error("Error occurred:", err);
    const lang = (((_a = ctx.state) === null || _a === void 0 ? void 0 : _a.language_code) || "uz");
    const apologyMessages = {
        uz: "❌ Kechirasiz, kutilmagan xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
        ru: "❌ Извините, произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
        en: "❌ Sorry, an unexpected error occurred. Please try again later.",
    };
    try {
        yield ctx.reply(apologyMessages[lang]);
    }
    catch (e) {
        console.error("Failed to send error message to user:", e);
    }
});
exports.catch_error = catch_error;
