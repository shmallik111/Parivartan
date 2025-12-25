const db = require("../config/database");

const submitApplication = async (req, res) => {
  const client = await db.getClient();
  try {
    const { form_id, answers } = req.body;
    const userId = req.user.id;

    if (!form_id || !answers) {
      return res.status(400).json({ error: "Form ID and answers required" });
    }

    // Start transaction
    await client.query("BEGIN");

    // Check if form exists
    const formResult = await client.query("SELECT * FROM forms WHERE id = $1", [form_id]);
    if (formResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Form not found" });
    }

    // Get all questions
    const questionsResult = await client.query(
      "SELECT * FROM questions WHERE form_id = $1",
      [form_id]
    );

    // Check knockout questions
    let is_rejected = false;
    let rejection_reason = null;
    for (const question of questionsResult.rows) {
      if (question.is_knockout && answers[question.id] !== question.correct_answer) {
        is_rejected = true;
        rejection_reason = `Failed knockout question: "${question.text}"`;
        break;
      }
    }

    // Insert application within transaction
    const result = await client.query(
      "INSERT INTO applications (form_id, user_id, answers, is_rejected, rejection_reason) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [form_id, userId, JSON.stringify(answers), is_rejected, rejection_reason]
    );

    // Commit transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Application submitted successfully",
      application: result.rows[0],
      is_rejected,
      rejection_reason,
    });
  } catch (error) {
    // Rollback on error
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    console.error("Submit application error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  } finally {
    client.release();
  }
};

const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT a.*, f.title as form_title FROM applications a JOIN forms f ON a.form_id = f.id WHERE a.user_id = $1 ORDER BY a.submitted_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get user applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

const getApplicationsByForm = async (req, res) => {
  try {
    const { formId } = req.params;

    const result = await db.query(
      "SELECT a.*, u.full_name, u.email FROM applications a JOIN users u ON a.user_id = u.id WHERE a.form_id = $1 ORDER BY a.submitted_at DESC",
      [formId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get form applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const result = await db.query(
      "SELECT a.*, f.title as form_title, u.full_name, u.email FROM applications a JOIN forms f ON a.form_id = f.id JOIN users u ON a.user_id = u.id WHERE a.id = $1",
      [applicationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
};

const getApplicationStats = async (req, res) => {
  try {
    const { formId } = req.params;

    const result = await db.query(
      `SELECT 
        COUNT(*) as total_submissions,
        SUM(CASE WHEN is_rejected = false THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN is_rejected = true THEN 1 ELSE 0 END) as rejected
      FROM applications WHERE form_id = $1`,
      [formId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

module.exports = {
  submitApplication,
  getUserApplications,
  getApplicationsByForm,
  getApplicationById,
  getApplicationStats,
};
