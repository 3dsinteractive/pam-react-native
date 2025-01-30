# pam-react-native

Pam Real CDP SDK

## Installation

```sh
npm install pam-react-native
```

## Usage

```js
import { View, StyleSheet, Button } from 'react-native';
import { Pam } from 'pam-react-native';

// Initialize Pam
Pam.initialize({
  baseApi: 'https://<YOUR_PAM_API_ENDPOINT>.pams.ai',
  trackingConsentMessageId: '<consent>', // Generate from PAM Colsole
  publicDBAlias: '<public db alias>',
  loginDBAlias: '<login db alias>',
  loginKey: '<login key>',
});

export default function App() {
  return <View>...</View>;
}
```

# Allow Tracking Consent

```js
Pam.allowAllTrackingConsent('2VNmHzWrxPYJj0zDiM1cQGeW2S5');
```

# Tracking Event

```js
const parameters = {
  product_title: 'product1',
  quantity: 1,
  price: 199,
  sku: 'product1-sku-999',
};

Pam.track('add_to_cart', parameters);
```
