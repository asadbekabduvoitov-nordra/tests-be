import { Router } from "express";
import { supabase } from "../../configs/supabase";

const router = Router();

router.get("/:quizz_id", async (req, res) => {
    const { quizz_id } = req.params;
    
    const { data: quiz, error: quiz_error } = await supabase.from("quizzes").select("*").eq("id", quizz_id).limit(1).single();

    const { count } = await supabase.from("tests").select("id", {count: "exact"}).eq("quiz_id", quizz_id);

    if (quiz_error) {
        return res.status(500).json({
            message: "error",
            error: quiz_error?.message
        });
    }

    return res.status(200).json({
        message: "success",
        data: {
            ...quiz,
            tests_count: count

        }
    });
});

export default router;