import { StatusBar } from "expo-status-bar";
import { useEffect, useState, createRef } from "react";
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
import Modal from "react-native-modal";
import { color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const STORAGE_KEY = "@toDos"
export default function App() {
  
  const [working, setWorking] = useState(true);
  const idea = () => setWorking(false);
  const work = () => setWorking(true);

  const [text, setText] = useState("");
  const onChangeText = (payload) => setText(payload);
  const onChangeReWirteText = (payload) => setReWriteText(payload);


  const [toDos, setToDos] = useState({});

  const [textInputModalVisible, setTextInputModalVisible] = useState(false);
  const [reWriteText, setReWriteText] = useState("");
  const [reWriteKey, setReWriteKey] = useState("");
  let inputRef = createRef(null);

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
  const reWriteToDo = async () => {
    if (reWriteText === "") {
      return
    }

    const newToDos = {...toDos}; // toDos가 수정되면 안되기 때문에 얉은 복사
    
    newToDos[reWriteKey].text = reWriteText;
    setToDos(newToDos);
    await saveToDos(newToDos);
    setTextInputModalVisible(false);
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

  const reWrite = (key) => {
    setReWriteKey(key);
    setReWriteText(toDos[key].text);
    setTextInputModalVisible(true);
  }

  const afterModal = () => {
    
    const timeout = setTimeout(() => {
      console.log(reWriteText);
      inputRef.current?.blur();
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
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
              <TouchableOpacity onPress={() => reWrite(key)}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Text>
                  <Fontisto name="trash" size={20} color={theme.grey} />
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>

      <View>
        <Modal
          animationInTiming={300}
          animationOutTiming={500}
          hideModalContentWhileAnimating={true}
          isVisible={textInputModalVisible}
          onBackdropPress={() => setTextInputModalVisible(false)}
          backdropTransitionOutTiming={500}
          useNativeDriver={true}
          onModalShow={() => afterModal()}
        >
          <View style={styles.modal}>
            <TextInput
              value={reWriteText}
              returnKeyType="done"
              onSubmitEditing={() => reWriteToDo(reWriteKey)}
              onChangeText={onChangeReWirteText}
              style={styles.input}
              ref={inputRef}
            />
          </View>
        </Modal>
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

  modal: {
  },
  modalText: {
    fontSize: 30,
    margin: 0,
  },
});
