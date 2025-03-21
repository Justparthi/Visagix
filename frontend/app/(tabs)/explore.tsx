import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/")  // Replace localhost with your actual IP if using a real device
      .then(response => {
        setMessage(response.data);
        setLoading(false);  // Stop loading after data is fetched
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setMessage("Failed to connect to backend");
        setLoading(false);  // Stop loading even if there is an error
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? <ActivityIndicator size="large" color="blue" /> : <Text>{message}</Text>}
    </View>
  );
};

export default App;
