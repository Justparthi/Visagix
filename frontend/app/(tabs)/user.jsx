// In your React Native component
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FirebaseStatusScreen() {
  const [status, setStatus] = useState('Loading...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Replace with your Go backend URL
    fetch('http://localhost:8080/api/firebase-status')
      .then(response => response.json())
      .then(data => {
        setStatus(data.message);
        setIsConnected(data.status === 'success');
      })
      .catch(error => {
        setStatus('Error connecting to backend: ' + error.message);
        setIsConnected(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.statusText, { color: isConnected ? 'green' : 'red' }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});