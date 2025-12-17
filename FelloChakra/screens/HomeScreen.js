import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to TechLeadHers!</Text>
        <Text style={styles.tagline}>
          Empowering young women to lead the next generation of technology and innovation.
        </Text>
      </View>

      {/* About Section */}
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
          mentorship, and leadership development with a long-term vision of gender-inclusive
          technology leadership.
        </Text>
      </View>

      {/* Why TechLeadHers */}
      <View style={styles.highlight}>
        <Text style={styles.highlightTitle}>Why TechLeadHers?</Text>

        <Text style={styles.highlightItem}>
          • Community Engagement — Fellows work directly in communities to solve real problems.
        </Text>

        <Text style={styles.highlightItem}>
          • Mentorship — Dedicated mentors provide guidance, feedback, and encouragement.
        </Text>

        <Text style={styles.highlightItem}>
          • Leadership — Focus on communication, confidence, and decision-making skills.
        </Text>

        <Text style={styles.highlightItem}>
          • Final Projects — Innovation-driven solutions for real challenges in Kathmandu.
        </Text>
      </View>

      {/* Cohorts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TechLeadHers Cohorts</Text>

        <Text style={styles.sectionText}>
          First Cohort — Our pioneering batch that laid the foundation for leadership and
          collaboration.
        </Text>

        <Text style={styles.sectionText}>
          Second Cohort — A dynamic group that pushed boundaries and strengthened the mission.
        </Text>

        <Text style={styles.sectionText}>
          Third Cohort — A new generation bringing fresh energy, creativity, and purpose.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Aaviyanta Foundation</Text>
        <Text style={styles.footerText}>
          Empowering youth and women through technology, leadership, and education.
        </Text>
        <Text style={styles.footerText}>
          Falful Chowk, Ropeway Sadak, Kathmandu
        </Text>
        <Text style={styles.footerText}>
          Phone: +977-9846978246
        </Text>
        <Text style={styles.footerText}>
          Email: aaviyanta.foundation21@gmail.com
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FDF2F6",
  },

  container: {
    paddingBottom: 24,
  },

  hero: {
    padding: 24,
    backgroundColor: "#7E1B43",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  tagline: {
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
    fontWeight: "600",
    color: "#7E1B43",
    marginBottom: 10,
  },

  sectionText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 8,
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
    marginBottom: 6,
  },

  footer: {
    margin: 16,
    padding: 20,
    backgroundColor: "#7E1B43",
    borderRadius: 12,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  footerText: {
    fontSize: 14,
    color: "#FFE4ED",
    lineHeight: 20,
  },
});
