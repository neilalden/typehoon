import React from 'react';
import {Text, StyleSheet} from 'react-native';

function TitleText(props) {
  return <Text style={styles.Title}>{props.children}</Text>;
}
const styles = StyleSheet.create({
  Title: {
    fontFamily: 'AlfaSlabOne-Regular',
    fontSize: 36,
    color: 'crimson',
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 1,
  },
});

export default TitleText;
