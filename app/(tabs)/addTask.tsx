import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ScrollView, View } from "react-native";


export default function AddTask() {

    return (
        <ScrollView>
            <View style={{ margin: 20}}>
                <ThemedText lightColor={Colors.light.text} darkColor={Colors.dark.text}> Add Task</ThemedText>
            </View>
        </ScrollView>
    )
}