import { StyleSheet, Text, View } from 'react-native';


import Collector from './src/componentCollector';

export default function App() {

  return (
    <View style={[styles.container]}>
      <Collector></Collector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
});
