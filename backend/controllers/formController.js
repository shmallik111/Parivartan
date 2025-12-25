const db = require("../config/database");

const createForm = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: "Form title required" });
    }

    const result = await db.query(
      "INSERT INTO forms (title, description, created_by) VALUES ($1, $2, $3) RETURNING *",
      [title, description || "", userId]
    );

    res.status(201).json({
      message: "Form created successfully",
      form: result.rows[0],
    });
  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ error: "Failed to create form" });
  }
};

const getForms = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT f.*, u.full_name as creator_name FROM forms f JOIN users u ON f.created_by = u.id ORDER BY f.created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get forms error:", error);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
};

const getFormById = async (req, res) => {
  try {
    const { formId } = req.params;

    const formResult = await db.query("SELECT * FROM forms WHERE id = $1", [formId]);

    if (formResult.rows.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    const questionsResult = await db.query(
      "SELECT * FROM questions WHERE form_id = $1 ORDER BY order_num ASC",
      [formId]
    );

    res.json({
      form: formResult.rows[0],
      questions: questionsResult.rows,
    });
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { formId } = req.params;
    const { text, type, required, options, correct_answer, is_knockout } = req.body;

    if (!text || !type) {
      return res.status(400).json({ error: "Question text and type required" });
    }

    // Get next order number
    const orderResult = await db.query(
      "SELECT MAX(order_num) as max_order FROM questions WHERE form_id = $1",
      [formId]
    );
    const nextOrder = (orderResult.rows[0].max_order || 0) + 1;

    const result = await db.query(
      "INSERT INTO questions (form_id, text, type, required, options, correct_answer, is_knockout, order_num) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [formId, text, type, required !== false, options || null, correct_answer || null, is_knockout || false, nextOrder]
    );

    res.status(201).json({
      message: "Question added successfully",
      question: result.rows[0],
    });
  } catch (error) {
    console.error("Add question error:", error);
    res.status(500).json({ error: "Failed to add question" });
  }
};

const publishForm = async (req, res) => {
  try {
    const { formId } = req.params;

    const result = await db.query(
      "UPDATE forms SET is_published = TRUE WHERE id = $1 RETURNING *",
      [formId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({
      message: "Form published successfully",
      form: result.rows[0],
    });
  } catch (error) {
    console.error("Publish form error:", error);
    res.status(500).json({ error: "Failed to publish form" });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { formId } = req.params;

    await db.query("DELETE FROM forms WHERE id = $1", [formId]);

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  addQuestion,
  publishForm,
  deleteForm,
};
