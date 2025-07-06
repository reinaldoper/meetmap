import React from 'react';
import {View, StyleSheet, Alert, ImageBackground} from 'react-native';
import {Button, Card, Icon} from '@rneui/themed';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../services/types';
import {logout} from '../api/users';
import LinearGradient from 'react-native-linear-gradient';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({navigation}: Props) {
  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
      Alert.alert('Logout realizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro ao sair', error.message);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?fit=crop&w=800&q=80',
      }}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}>
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(255,77,109,0.4)']}
        style={styles.gradient}>
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
      </LinearGradient>
    </ImageBackground>
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
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
});
