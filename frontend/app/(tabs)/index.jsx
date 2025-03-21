import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  Dimensions
} from "react-native";
import { router } from 'expo-router';

import loginImage from "../../assets/images/login.jpg";

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;

  // Animate components when mounted
  React.useEffect(() => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true
      })
    ];
    
    Animated.stagger(150, animations).start();
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    
    // Add a slight delay for visual feedback before navigation
    setTimeout(() => {
      if (option === "user") {
        router.push('/user');
      } else {
        router.push('/organization');
      }
    }, 150);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideUpAnim }
            ] 
          }
        ]}
      >
        <Image
          source={loginImage}
          style={styles.image}
          resizeMode="cover"
        />
        
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please select an option to continue</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "user" && styles.selectedButton
            ]}
            onPress={() => handleSelect("user")}
            activeOpacity={0.75}
          >
            <Text style={styles.buttonText}>User</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "organization" && styles.selectedButton
            ]}
            onPress={() => handleSelect("organization")}
            activeOpacity={0.75}
          >
            <Text style={styles.buttonText}>Organization</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFAF6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  content: {
    width: "100%",
    maxWidth: width > 500 ? 500 : width - 40,
    alignItems: "center",
    backgroundColor: "#FDFAF6",
    borderRadius: 16,
    padding: 24
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 30
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 12,
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 0.2
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  button: {
    backgroundColor: "#0DC5C1",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    shadowColor: "#0DC5C1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4
  },
  selectedButton: {
    backgroundColor: "#3A4F7A"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5
  }
});

export default WelcomeScreen;