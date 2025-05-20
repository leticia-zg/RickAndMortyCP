// IntroScreen.tsx
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Root')}>
        <Text style={styles.text}>
          Conheça Rick, um velho cientista bêbado e genial (às vezes mais bêbado que genial) e seu neto Morty, o garoto que topa qualquer loucura interdimensional com cara de quem não entendeu nada. Juntos, eles enfrentam alienígenas, universos paralelos, problemas familiares e dilemas filosóficos... tudo isso entre um arroto e outro. Prepare-se para aventuras caóticas, piadas ácidas e um multiverso onde nada faz sentido — e é exatamente por isso que faz!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A18',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
