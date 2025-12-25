const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 number
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

const validateSignup = (req, res, next) => {
  const { email, password, full_name } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters with uppercase and number",
    });
  }

  if (!full_name || full_name.trim().length < 3) {
    return res.status(400).json({ error: "Full name required (min 3 characters)" });
  }

  next();
};

const validateFormSubmission = (req, res, next) => {
  const { form_id, answers } = req.body;

  if (!form_id || typeof form_id !== "number") {
    return res.status(400).json({ error: "Valid form_id required" });
  }

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Answers must be provided as an object" });
  }

  next();
};

const validateQuestion = (req, res, next) => {
  const { text, type, options, is_knockout, correct_answer } = req.body;

  // Validate question text
  if (!text || typeof text !== "string" || text.trim().length < 5) {
    return res.status(400).json({ 
      error: "Question text is required and must be at least 5 characters long" 
    });
  }

  // Validate question type
  const validTypes = ["text", "multiple-choice", "checkbox", "knockout"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ 
      error: `Invalid question type. Must be one of: ${validTypes.join(", ")}` 
    });
  }

  // Validate options for multiple-choice and checkbox types
  if ((type === "multiple-choice" || type === "checkbox") && !options) {
    return res.status(400).json({ 
      error: "Options are required for multiple-choice and checkbox questions" 
    });
  }

  if (options && !Array.isArray(options)) {
    return res.status(400).json({ 
      error: "Options must be an array" 
    });
  }

  if (options && options.length < 2) {
    return res.status(400).json({ 
      error: "At least 2 options are required for choice-based questions" 
    });
  }

  // Validate knockout question
  if (is_knockout) {
    if (!correct_answer) {
      return res.status(400).json({ 
        error: "Knockout questions must have a correct_answer" 
      });
    }

    // For multiple-choice, verify correct_answer is in options
    if (type === "multiple-choice" && options) {
      if (!options.includes(correct_answer)) {
        return res.status(400).json({ 
          error: "correct_answer must be one of the provided options" 
        });
      }
    }
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateSignup,
  validateFormSubmission,
  validateQuestion,
};
