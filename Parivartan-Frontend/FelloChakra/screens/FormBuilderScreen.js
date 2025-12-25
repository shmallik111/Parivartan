import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Picker,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formsService } from "../services/formsService";

export default function FormBuilderScreen({ navigation, route }) {
  const { formId } = route.params || {};
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [questionOptions, setQuestionOptions] = useState("");

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await formsService.getFormById(formId);
      if (response.success) {
        setForm(response.form);
        setQuestions(response.form.questions || []);
      } else {
        Alert.alert("Error", response.error || "Failed to load form");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load form");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert("Error", "Please enter question text");
      return;
    }
    try {
      setSubmitting(true);
      const options =
        questionType === "choice" || questionType === "checkbox"
          ? questionOptions.split(",").map((o) => o.trim())
          : null;
      const response = await formsService.addQuestion(formId, {
        text: questionText,
        type: questionType,
        options,
      });
      if (response.success) {
        Alert.alert("Success", "Question added!");
        setQuestionText("");
        setQuestionOptions("");
        setModalVisible(false);
        loadForm();
      } else {
        Alert.alert("Error", response.error || "Failed to add question");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add question");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#7E1B43" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>{form?.title}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Question</Text>
        </TouchableOpacity>
        {questions.map((q, i) => (
          <View key={q.id} style={styles.card}>
            <Text style={styles.qNum}>Q{i + 1}</Text>
            <Text style={styles.qText}>{q.text}</Text>
            <Text style={styles.type}>{q.type}</Text>
          </View>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <TextInput
            style={styles.input}
            placeholder="Question"
            value={questionText}
            onChangeText={setQuestionText}
          />
          <Picker selectedValue={questionType} onValueChange={setQuestionType}>
            <Picker.Item label="Text" value="text" />
            <Picker.Item label="Choice" value="choice" />
          </Picker>
          <TouchableOpacity style={styles.btn} onPress={handleAddQuestion}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF2F6" },
  content: { padding: 16 },
  backBtn: { marginBottom: 16 },
  backText: { color: "#7E1B43", fontWeight: "600" },
  header: { backgroundColor: "#7E1B43", padding: 16, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  addBtn: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 8, marginBottom: 16 },
  addBtnText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  card: { backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginBottom: 12 },
  qNum: { fontSize: 12, color: "#7E1B43", fontWeight: "bold" },
  qText: { fontSize: 14, fontWeight: "600", color: "#333", marginVertical: 6 },
  type: { fontSize: 11, color: "#999" },
  modal: { flex: 1, padding: 16, backgroundColor: "#FDF2F6", justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#DDD", padding: 12, borderRadius: 8, marginBottom: 16, backgroundColor: "#FFF" },
  btn: { backgroundColor: "#7E1B43", padding: 12, borderRadius: 8, marginBottom: 12 },
  btnText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  closeBtn: { borderWidth: 2, borderColor: "#7E1B43", padding: 12, borderRadius: 8 },
  closeBtnText: { color: "#7E1B43", fontWeight: "bold", textAlign: "center" },
});
