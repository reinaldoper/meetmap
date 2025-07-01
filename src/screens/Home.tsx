

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Icon } from '@rneui/themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/types';
import { logout } from '../api/users';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error: any) {
      Alert.alert('Erro ao sair', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>Bem-vindo ao MeetMap!</Card.Title>
        <Card.Divider />

        <Button
          title="Ver Mapa de Usuários"
          icon={<Icon name="map" type="material" color="white" />}
          onPress={() => navigation.navigate('Map')}
          containerStyle={styles.button}
        />

        <Button
          title="Usuários Favoritos"
          icon={<Icon name="star" type="material" color="white" />}
          onPress={() => navigation.navigate('Favorites')}
          containerStyle={styles.button}
        />

        <Button
          title="Meu Perfil"
          icon={<Icon name="person" type="material" color="white" />}
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button}
        />

        <Button
          title="Sair"
          icon={<Icon name="logout" type="material" color="white" />}
          onPress={handleLogout}
          buttonStyle={styles.bottom}
          containerStyle={styles.button}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    marginVertical: 8,
  },
  bottom: {
    backgroundColor: '#d32f2f',
  },
});
