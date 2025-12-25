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

module.exports = {
  validateEmail,
  validatePassword,
  validateSignup,
  validateFormSubmission,
};
