import React, { createContext, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  const submitApplication = (answers) => {
    let rejected = false;

    questions.forEach((q) => {
      if (q.type === "knockout") {
        if (answers[q.id] !== q.correctAnswer) {
          rejected = true;
        }
      }
    });

    setSubmissions([...submissions, { answers, rejected }]);
  };

  return (
    <FormContext.Provider
      value={{ questions, addQuestion, submitApplication }}
    >
      {children}
    </FormContext.Provider>
  );
};
