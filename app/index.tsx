import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

export default function Index() {

  return (
    <View style={styles.container} >
      <Text style={styles.text}>Sejá Bem-vindo</Text>
      <TextInput
        style={styles.textInput}
        placeholderTextColor={'#666666'}
        placeholder="Digite seu primeiro nome:"
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={'#666666'}
        placeholder="Digite seu sobrenome:"
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={'#666666'}
        placeholder="Digite seu email:"
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={'#666666'}
        placeholder="Digite sua senha:"
      />
    </View>
  )
}


const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'monospace'
  },
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F2F2F'
  },
  textInput: {
    height: 60,
    width: 400,
    padding: 20,
    borderRadius: 10,
    color: '#fff',
    backgroundColor: '#3C3C3C',
  },
})

