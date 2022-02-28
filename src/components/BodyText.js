import React from 'react';
import {Text, StyleSheet} from 'react-native';

function BodyText(props) {
  return (
    <Text style={[styles.BodyText, props.customStyles]}>{props.children}</Text>
  );
}
const styles = StyleSheet.create({
  BodyText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 24,
    color: '#666666',
  },
});
export default BodyText;
