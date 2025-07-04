import React from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function Index() {
  const handleSubmit = () => {
    alert("Data sent successfully");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Seja Bem-vindo</Text>
      
      <TextInput
        style={styles.textInput}
        placeholderTextColor={defaultStyles.textColor}
        placeholder="Digite seu nome:"
      />
      
      <TextInput
        style={styles.textInput}
        placeholderTextColor={defaultStyles.textColor}
        placeholder="Digite seu telefone:"
        keyboardType="numeric"
        maxLength={15}
      />
      
      <TextInput
        style={styles.textInput}
        placeholderTextColor={defaultStyles.textColor}
        placeholder="Digite seu email:"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.textInput}
        placeholderTextColor={defaultStyles.textColor}
        placeholder="Digite sua senha:"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const defaultStyles = {
  background: '#2F2F2F',
  backgroundOthers: '#3C3C3C',
  textColor: '#666666',
  fontFamily: 'monospace'
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 24,
    fontFamily: defaultStyles.fontFamily
  },
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultStyles.background,
  },
  textInput: {
    height: 60,
    width: 400,
    padding: 20,
    borderRadius: 10,
    color: '#fff',
    fontFamily: defaultStyles.fontFamily,
    backgroundColor: defaultStyles.backgroundOthers,
  },
  button: {
    height: 60,
    width: 400,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: defaultStyles.fontFamily
  },
});