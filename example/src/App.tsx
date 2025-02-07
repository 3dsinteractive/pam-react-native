import { Pam } from 'pam-react-native';
import { Button, Text, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

export default function App() {
  const [contactID, setContactID] = useState<string | undefined>('');

  useEffect(() => {
    Pam.initialize({
      baseApi: 'https://awc-uat.pams.ai',
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

  function sendEvent() {
    Pam.track('click-btn', {});
  }

  async function allowConsent() {
    await Pam.allowAllTrackingConsent('2VNmHzWrxPYJj0zDiM1cQGeW2S5');

    const cid = Pam.shared?.contactState?.getContactId();
    setContactID(cid);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mb}>Contact ID: {contactID}</Text>
      <View style={styles.mb}>
        <Button
          onPress={allowConsent}
          title="allowConsent"
          color="#ff3300"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>

      <View style={styles.mb}>
        <Button
          onPress={sendEvent}
          title="Send Event"
          color="#669933"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>

      <View style={styles.mb}>
        <Button
          onPress={onPressLearnMore}
          title="load App Attention"
          color="#ff0066"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mb: {
    marginBottom: 10,
  },
});
