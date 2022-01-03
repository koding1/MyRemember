import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { theme } from "./colors";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>

        <TouchableOpacity>s
          <Text style={styles.btnText}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.btnText}>Idea</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: 'row',
    marginTop: 50,
  },
  btnText: {
    // color: theme.grey,
    color: "white",
    fontWeight: "600",
    fontSize: 45,
  },
});
