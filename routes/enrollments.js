const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Enroll Student
router.post("/", async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({ error: "student_id and course_id are required" });
    }

    // Check if already enrolled
    const { data: existingData, error: selectError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", student_id)
      .eq("course_id", course_id)
      .limit(1);

    if (selectError) {
      console.error("Supabase select error:", selectError);
      return res.status(500).json({ error: "Failed to check existing enrollment" });
    }

    if (existingData && existingData.length > 0) {
      return res.status(400).json({ error: "Student is already enrolled in this course" });
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert([{ student_id, course_id }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Enroll route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel Enrollment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("enrollments").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Enrollment cancelled successfully" });
});

module.exports = router;
