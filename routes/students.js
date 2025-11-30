const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Search Students
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q)
    return res.status(400).json({ error: "Query parameter 'q' is required" });

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .or(`fullname.ilike.%${q}%,email.ilike.%${q}%`);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get All Students
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("students").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create Student
router.post("/", async (req, res) => {
  const { fullname, email, major } = req.body;
  const { data, error } = await supabase
    .from("students")
    .insert([{ fullname, email, major }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Student
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fullname, email, major } = req.body;
  const { data, error } = await supabase
    .from("students")
    .update({ fullname, email, major })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete Student
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Student deleted successfully" });
});

// Get Student Courses
router.get("/:id/courses", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      enrollment_date,
      courses ( id, name, credit )
    `
    )
    .eq("student_id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
