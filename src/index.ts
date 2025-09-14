import express from "express";
import dotenv from "dotenv";
import bot from "./bot";
import { test } from "./routes"
import { quiz } from "./routes";
import { permission } from "./routes";
import { requireExternalUser } from "./middlewares/external_api_session.middleware";
var cors = require('cors')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
	"origin": "*"
}))
app.use("/test", requireExternalUser, test);
app.use("/quiz", requireExternalUser, quiz);
app.use("/permission", requireExternalUser, permission);
// This must match your HTTPS public URL
if (process.env.NODE_ENV === "production") {
	app.use(bot.webhookCallback("/bot"));
	bot.telegram.setWebhook(`${process.env.PUBLIC_URL}/bot`);
} else {
	bot.launch(() => console.log("Bot is running in polling mode..."));
}

app.get("/health-check", (_, res) => {
	return res.status(200).send("OK");
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
