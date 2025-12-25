import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AdminDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("FormBuilder")}
      >
        <Text style={styles.buttonText}>Create Application Form</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30 },
  button: {
    backgroundColor: "#7E1B43",
    padding: 16,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});