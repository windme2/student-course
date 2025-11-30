const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Enroll Student
router.post("/", async (req, res) => {
  // Check if already enrolled
  const { data: existing } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", student_id)
    .eq("course_id", course_id)
    .single();

  if (existing) {
    return res
      .status(400)
      .json({ error: "Student is already enrolled in this course" });
  }

  const { data, error } = await supabase
    .from("enrollments")
    .insert([{ student_id, course_id }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Cancel Enrollment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("enrollments").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Enrollment cancelled successfully" });
});

module.exports = router;
