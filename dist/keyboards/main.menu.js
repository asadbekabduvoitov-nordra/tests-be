"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainMenuInlineKeyboard = exports.mainMenuKeyboard = void 0;
const telegraf_1 = require("telegraf");
exports.mainMenuKeyboard = telegraf_1.Markup.keyboard([
    ["📚 Mavjud Yo'nalishlar"],
    ["📞 Biz bilan bog'lanish"],
])
    .resize()
    .persistent();
exports.mainMenuInlineKeyboard = telegraf_1.Markup.inlineKeyboard([
    [telegraf_1.Markup.button.callback("📚 Mavjud Yo'nalishlar", "choose_directions")],
    [telegraf_1.Markup.button.callback("📞 Biz bilan bog'lanish", "contact_us")],
]);
