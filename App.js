import { StyleSheet, Text, View } from 'react-native';
import 'react-native-get-random-values';


import Collector from './src/componentCollector';
import {CSS} from './src/components/styles/basicStyle';

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
