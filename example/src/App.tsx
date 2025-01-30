import { View, StyleSheet, Button } from 'react-native';
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
      <Button
        title="Load App Attention"
        onPress={async () => {
          Pam.appAttention('home');
        }}
      />
      <Button
        title="Allow Consent"
        onPress={async () => {
          await Pam.allowAllTrackingConsent('2VNmHzWrxPYJj0zDiM1cQGeW2S5');
        }}
      />
      <Button
        title="CLICK"
        onPress={async () => {
          console.log('clicked');
          try {
            console.log('CALL TRACK');
            const result = await Pam.track('click', { name: 'button' });
            console.log('RESULT', result);
          } catch (e) {
            console.log('ERROR', e);
          }
        }}
      />
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
