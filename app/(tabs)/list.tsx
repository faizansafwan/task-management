import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TaskList() {
    return (
        <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#49417d' }}
      headerImage={null}>
        <ThemedView>
            <ThemedText>Task List</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    )
}