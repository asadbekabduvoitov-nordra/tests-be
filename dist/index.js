"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bot_1 = __importDefault(require("./bot"));
const routes_1 = require("./routes");
const routes_2 = require("./routes");
const routes_3 = require("./routes");
const external_api_session_middleware_1 = require("./middlewares/external_api_session.middleware");
var cors = require('cors');
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(cors({
    "origin": "*"
}));
app.use("/test", external_api_session_middleware_1.requireExternalUser, routes_1.test);
app.use("/quiz", external_api_session_middleware_1.requireExternalUser, routes_2.quiz);
app.use("/permission", external_api_session_middleware_1.requireExternalUser, routes_3.permission);
// This must match your HTTPS public URL
if (process.env.NODE_ENV === "production") {
    app.use(bot_1.default.webhookCallback("/bot"));
    bot_1.default.telegram.setWebhook(`${process.env.PUBLIC_URL}/bot`);
}
else {
    bot_1.default.launch(() => console.log("Bot is running in polling mode..."));
}
app.get("/health-check", (_, res) => {
    return res.status(200).send("OK");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
