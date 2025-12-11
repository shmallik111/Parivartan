import {view, text, StyleSheet} from "react-native";

export default function HomeScreen() {
    return (
        <view style = {styles.container}>
            <text style = {styles.title}> Starting with Tech LeadHers </text>
        </view>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7E1B43",
    },
    
    title: {
        fontSize: 24,
        fontWeight: "bold",
        backgroundColor: "#FFEBF0",
    },
});