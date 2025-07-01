import React, {useEffect} from 'react';
import {authCheck} from '../api/users';
import {StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../services/types';
import {View, Text, StyleSheet} from 'react-native';
import {LinearProgress} from '@rneui/themed';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

export default function SplashScreen({navigation}: Props) {
  useEffect(() => {
    authCheck().then(user => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    });
  }, [navigation]);

  return (
    <View
      style={styles.container}>
      <Text
        style={styles.title}>
        MeetMap
      </Text>
      <LinearProgress color="#2196F3" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});
