import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { theme } from "./colors";

export default function App() {
  const [working, setWorking] = useState(true);
  const idea = () => setWorking(false);
  const work = () => setWorking(true);

  const [text, setText] = useState("");
  const onChangeText = (payload) => setText(payload);

  const [toDos, setToDos] = useState({});

  const addToDo = () => {
    if (text === "") {
      return
    }
    // save to do
    const tmp = {[Date.now()] : {text:text, WorkOn:working}}; // https://koonsland.tistory.com/146
    const newToDo = Object.assign({}, toDos,tmp);

    setText("");
    console.log(newToDo);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={idea}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Idea
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TextInput
          value={text}
          returnKeyType="done"
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          placeholder={working ? "할 일 :" : "아이디어 :"}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, // padding left and right
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 50,
  },
  btnText: {
    // color: theme.grey,
    color: "white",
    fontWeight: "600",
    fontSize: 45,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 16, // padding top and bottom
    fontSize: 18,
    borderRadius: 20,
    marginTop: 20,
  },
});
