import { Text, View, StyleSheet } from 'react-native';
import { Pam } from 'pam-react-native';

Pam.initialize({
  baseApi: 'https://stgx.pams.ai',
  trackingConsentMessageId: '2VNmHzWrxPYJj0zDiM1cQGeW2S5',
  publicDBAlias: 'ecom-public',
  loginDBAlias: 'ecom-login',
  loginKey: 'customer',
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Result:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
