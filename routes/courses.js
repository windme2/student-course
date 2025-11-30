const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Get All Courses
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("courses").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create Course
router.post("/", async (req, res) => {
  const { name, description, credit } = req.body;
  const { data, error } = await supabase
    .from("courses")
    .insert([{ name, description, credit }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Course
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, credit } = req.body;
  const { data, error } = await supabase
    .from("courses")
    .update({ name, description, credit })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete Course
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Course deleted successfully" });
});

// Get Course Students
router.get("/:id/students", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      enrollment_date,
      students ( id, fullname, email, major )
    `
    )
    .eq("course_id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
