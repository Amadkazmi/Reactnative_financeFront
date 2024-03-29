import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../config";
import { useDispatch } from "react-redux";
import { deleteEntry, updateEntry } from "../store/entrySlice";
import { AppDispatch } from "../store/store";

export type RootStackParamList = {
  AddEntry: undefined;
  EntryList: undefined;
  EntryEdit: { entryId: number };
  EntryDelete: { entryId: number };
};
type entry = {
  id: string;
  amount: string;
  date: string;
  currency: string;
  name: string;
  category: string;
  description: string;
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "EntryEdit">;
type DetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EntryEdit"
>;

type Props = {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
};

const EntryEdit: React.FC<Props> = ({ route, navigation }) => {
  const [currentEntry, setCurrentEntry] = useState<entry | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const id = route.params.entryId;

  const dispatch = useDispatch<AppDispatch>();

  const fetchEntry = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/entries/${id}`);
      setCurrentEntry(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, []);

  const handleDelete = () => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this entry?",
      [
        {
          text: "Cancel",
          onPress: () => navigation.navigate("EntryList"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await dispatch(deleteEntry(String(id)));
            navigation.navigate("EntryList");
          },
        },
      ],
    );
  };

  const handleUpdate = async () => {
    if (amount && name && description) {
      const updatedEntry = {
        ...currentEntry,
        amount: parseFloat(amount),
        name,
        description,
        category,
      };
      try {
        await dispatch(updateEntry({ id, entity: updatedEntry }));
        Alert.alert(
          "Updated",
          "Data updated successfully click ok to go back to the main page.",
          [{ text: "OK", onPress: () => navigation.navigate("EntryList") }],
        );
      } catch (error) {
        console.error("Error updating entry:", error);
      }
    } else {
      Alert.alert("Please fill in all fields");
    }
  };

  return (
    <SafeAreaView>
      <View>
        <TextInput
          style={styles.input}
          placeholder={currentEntry?.amount.toString()}
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder={currentEntry?.name}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={currentEntry?.category}
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder={currentEntry?.description.toString()}
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.buttons}>
          <Button onPress={handleUpdate} title="Update now" />
          <Button onPress={handleDelete} title="Delete" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EntryEdit;
const styles = StyleSheet.create({
  container: {},
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  addButton: {
    display: "flex",
    borderRadius: 20,
    backgroundColor: "#2c6979",
    margin: 10,
  },
  buttonText: {
    padding: 20,
    marginLeft: "25%",
    color: "white",
    fontSize: 30,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 20,
    margin: 10,
    justifyContent: "space-around",
  },
  updateDeleteBtn: {
    borderRadius: 10,
  },
});
