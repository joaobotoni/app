import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
<<<<<<< HEAD
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
=======
        <Text style={styles.text}>Esta tela não existe.</Text>
        <Link href="/" style={styles.link}>
          <Text>Ir para tela inicial!</Text>
>>>>>>> 9609cb93e07a4309d165eb20a6fac0fd1d79eda0
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
<<<<<<< HEAD
    fontWeight: 600,
=======
    fontWeight: '600',
>>>>>>> 9609cb93e07a4309d165eb20a6fac0fd1d79eda0
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 9609cb93e07a4309d165eb20a6fac0fd1d79eda0
