import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/*fixed Header that hovers above even after screen scrolls down*/}
      <View style={styles.header}>
        <Text style={styles.logo}>TechLeadHers</Text>
        <View style={styles.authButtons}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/*For the content that can be scrolled */}
      {/* Note: flexGrow: 1 rakheko so that it allows the page to expand and scroll properly */}
      <ScrollView contentContainerStyle={styles.page}>
        
        {/* Hero Style used section for main Tech LeadHers Intro part */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome to TechLeadHers!</Text>
          <Text style={styles.heroSubtitle}>
            Empowering young women to lead the next generation of technology and innovation.
          </Text>
        </View>


        {/* DetailsSection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            How It All Started: The Beginning of TechLeadHers
          </Text>
          <Text style={styles.sectionText}>
            Nepal faces a severe gender gap in IT, with only 0.5% of economically active women
            working in ICT and just 7.8% of researchers being women—lower than global averages.
            Deep-rooted gender biases, limited access to STEM education, lack of mentorship,
            and societal expectations discourage women from advancing in tech careers.
          </Text>
          <Text style={styles.sectionText}>
            The Tech LeadHers Fellowship, launched by the Aaviyanta Foundation on January 2, 2024,
            focuses on empowering young women in Kathmandu through technical training,
            mentorship, and leadership development.
          </Text>
        </View>


        {/* Why TechLeadHers (Highlights) section */}
        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>Why TechLeadHers?</Text>
          <Text style={styles.highlightItem}>
            • Community Engagement — Fellows solve real problems in Kathmandu.
          </Text>
          <Text style={styles.highlightItem}>
            • Mentorship — Dedicated mentors provide guidance and feedback.
          </Text>
          <Text style={styles.highlightItem}>
            • Leadership — Focus on communication, confidence, and decision-making.
          </Text>
          <Text style={styles.highlightItem}>
            • Final Projects — Innovation-driven solutions for real challenges.
          </Text>
        </View> 

        {/* Cohorts details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TechLeadHers Cohorts</Text>
          <Text style={styles.sectionText}>
            <Text style={{fontWeight: 'bold'}}>First Cohort</Text> — Our pioneering batch that laid the foundation.
          </Text>
          <Text style={styles.sectionText}>
            <Text style={{fontWeight: 'bold'}}>Second Cohort</Text> — A dynamic group that pushed boundaries.
          </Text>
          <Text style={styles.sectionText}>
            <Text style={{fontWeight: 'bold'}}>Third Cohort</Text> — A new generation bringing fresh energy and purpose.
          </Text>
        </View>

        {/* Footer that contains basic organization information*/}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Aaviyanta Foundation</Text>
          <Text style={styles.footerText}>
            Empowering youth and women through technology, leadership, and education.
          </Text>
          <Text style={styles.footerText}>Falful Chowk, Ropeway Sadak, Kathmandu</Text>
          <Text style={styles.footerText}>Phone: +977-9846978246</Text>
          <Text style={styles.footerText}>Email: aaviyanta.foundation21@gmail.com</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/*StyleSheet */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDF2F6",
  },


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    elevation: 4, // Shadow Android ma milne
    shadowColor: "#000", // Shadow for iOS ma milne
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },


  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7E1B43",
  },


  authButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },


  loginText: {
    fontSize: 14,
    color: "#7E1B43",
    fontWeight: "600",
  },


  signupBtn: {
    backgroundColor: "#7E1B43",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 6,
  },


  signupText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  page: {
    flexGrow: 1, 
    paddingBottom: 40,
  },


  hero: {
    padding: 24,
    backgroundColor: "#7E1B43",
  },


  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },


  heroSubtitle: {
    fontSize: 16,
    color: "#FFE4ED",
    lineHeight: 22,
  },

  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
  },


  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7E1B43",
    marginBottom: 10,
  },

  sectionText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 10,
  },


  highlight: {
    margin: 16,
    padding: 20,
    backgroundColor: "#AA3C65",
    borderRadius: 12,
  },


  highlightTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  highlightItem: {
    fontSize: 15,
    color: "#FFE4ED",
    lineHeight: 22,
    marginBottom: 8,
  },


  footer: {
    margin: 16,
    padding: 20,
    backgroundColor: "#7E1B43",
    borderRadius: 12,
    marginBottom: 30,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },


  footerText: {
    fontSize: 14,
    color: "#FFE4ED",
    lineHeight: 20,
    marginBottom: 4,
  },

});