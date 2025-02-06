import { Pam } from 'pam-react-native';
import { Button, Text, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    Pam.initialize({
      baseApi: 'https://stgx.pams.ai',
      trackingConsentMessageId: '2VNmHzWrxPYJj0zDiM1cQGeW2S5',
      publicDBAlias: 'ecom-public',
      loginDBAlias: 'ecom-login',
      loginKey: 'customer',
    });

    Pam.setAppAttentionStyle({
      buttonColor: '#FF0000',
      buttonLabel: 'Click Here!',
      buttonLabelColor: '#FFFFFF',
    });
  }, []);

  function onPressLearnMore() {
    Pam.appAttention('products', (banner) => {
      console.log('Click Banner', banner);
      return false;
    });
  }

  function allowConsent() {
    Pam.allowAllTrackingConsent('2VNmHzWrxPYJj0zDiM1cQGeW2S5');
  }

  return (
    <View style={styles.container}>
      <Text>Test</Text>
      <Button
        onPress={allowConsent}
        title="allowConsent"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={onPressLearnMore}
        title="load App Attention"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
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
