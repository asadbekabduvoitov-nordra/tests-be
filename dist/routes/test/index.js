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
const express_1 = require("express");
const supabase_1 = require("../../configs/supabase");
const router = (0, express_1.Router)();
router.get("/:quizz_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizz_id } = req.params;
    const {} = req.query;
    const { data: quiz, error: quiz_error } = yield supabase_1.supabase.from("quizzes").select("*").eq("id", quizz_id).limit(1).single();
    const { data: tests, error: tests_error } = yield supabase_1.supabase.from("tests").select("*").eq("quiz_id", quizz_id);
    if (quiz_error || tests_error) {
        return res.status(500).json({
            message: "error",
            error: (quiz_error === null || quiz_error === void 0 ? void 0 : quiz_error.message) || (tests_error === null || tests_error === void 0 ? void 0 : tests_error.message)
        });
    }
    return res.status(200).json({
        message: "success",
        data: {
            quiz,
            tests
        }
    });
}));
exports.default = router;
