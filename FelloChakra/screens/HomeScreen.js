import {View, Text, StyleSheet} from "react-native";

export default function HomeScreen() {
    return (
        <View style = {styles.page}>
            <View style = {styles.titleContainer}>
                <Text style = {styles.title}> Welcome to Tech LeadHers </Text>
            </View>

            <View style = {styles.subContainer}>
                <Text style = {styles.subtitle}> How It All Started: The Beginning of TechLeadHers </Text>
            <Text style = {styles.subtext}> Nepal faces a severe gender gap in IT, with only 0.5% of economically active women working in ICT and just 7.8% of researchers being women—figures that are worse than the already low global averages (28% of IT jobs and 15.9% of engineering roles held by women worldwide). This underrepresentation stems from deep-rooted gender biases, societal norms, limited STEM education access, discrimination, lack of mentorship, and insufficient family support, which collectively discourage talented women from entering or advancing in technology careers. </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7E1B43",
    },
    
    titleContainer: {
        backgroundColor: "#7E1B43",
        paddingVertical: 30,
    },

    title: { 
        fontSize: 30,
        fontWeight: "bold",
        color: "#6C153C",
        backgroundColor: "#FFEBF0",
    },

    subContainer: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#AA3C65",
    },

    subtitle: {
        fontSize: 21,
        fontWeight: "bold",
        backgroundColor: "#FFEBF0",
    },

    subtext: {
        fontSize: 18,
        fontWeight: 100,
        backgroundColor: "#AA3C65",
        color: "#FFEBF0",
    },
});