import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FormContext } from "../context/FormContext";

export default function ApplicationFormScreen() {
  const { questions, submitApplication } = useContext(FormContext);
  const [answers, setAnswers] = useState({});

  const handleSubmit = () => {
    submitApplication(answers);
    alert("Application Submitted");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Form</Text>

      {questions.map((q) => (
        <View key={q.id} style={styles.block}>
          <Text style={styles.label}>{q.text}</Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              setAnswers({ ...answers, [q.id]: text })
            }
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Application</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  block: { marginBottom: 16 },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#7E1B43",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
