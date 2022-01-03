import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableOpacityBase,
  Alert,
  Button,
} from "react-native";
import { theme } from "./colors";
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = "@toDos"
export default function App() {
  const [working, setWorking] = useState(true);
  const idea = () => setWorking(false);
  const work = () => setWorking(true);

  const [text, setText] = useState("");
  const onChangeText = (payload) => setText(payload);

  const [toDos, setToDos] = useState({});

  const saveToDos = async (toSave) => {
    try{
      const s = JSON.stringify(toSave);
      await AsyncStorage.setItem(STORAGE_KEY, s);
    }
    catch (e) {
      console.log(e);
    }
  }
  const loadToDos = async () => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    loadToDos();
  }, []);
  const addToDo = async () => {
    if (text === "") {
      return
    }
    // save to do
    //const tmp = {[Date.now()] : {text:text, nowWorkOn:working}}; // https://koonsland.tistory.com/146
    // == const newToDos = Object.assign({}, toDos,tmp);
    const newToDos = {...toDos, [Date.now()] : {text:text, nowWorkOn:working}}

    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }

  const deleteToDo = async (key) => {
    Alert.alert("삭제 버튼", "정말 삭제하시겠습니까 ?", [
      { text: "취소", onPress: () => {
        ;
      }},
      { text: "확인", onPress: async () => {
        const newToDos = {...toDos};
        console.log(newToDos);
        console.log("key :", key);
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      } },
    ]);



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

      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].nowWorkOn === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Text><Fontisto name="trash" size={20} color={theme.grey} /></Text>
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
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
    marginVertical: 20,
  },

  toDo: {
    backgroundColor : theme.toDoBg,
    marginBottom: 10,
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText: {
    color: "white",
    fontSize: 18,
  },


});
