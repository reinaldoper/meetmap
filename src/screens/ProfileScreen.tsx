import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert, ScrollView, ImageBackground} from 'react-native';
import {Avatar, Text, Button, Card} from '@rneui/themed';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, User} from '../services/types';
import {CurrentUser, CurrentUserUuid} from '../api/users';
import LinearGradient from 'react-native-linear-gradient';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({navigation}: Props) {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = CurrentUser();
    if (!currentUser) {
      Alert.alert('Usuário não autenticado');
      navigation.navigate('Login');
      return;
    }

    const fetchUser = async () => {
      try {
        const doc = await CurrentUserUuid(currentUser.uid);
        setUserData(doc.data() as User);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        Alert.alert('Erro ao buscar usuário');
      }
    };

    fetchUser();
  }, [navigation, userData]);

  const handleLogout = async () => {
    try {
      navigation.navigate('Home');
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.message);
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
        <ScrollView contentContainerStyle={styles.container}>
          <Card>
            <Card.Title>Meu Perfil</Card.Title>
            <Card.Divider />
            {userData ? (
              <>
                <View style={styles.center}>
                  <Avatar
                    source={{uri: userData.photoURL}}
                    rounded
                    size="xlarge"
                  />
                  <Text style={styles.name}>{userData.name}</Text>
                  <Text>{userData.email}</Text>
                </View>
              </>
            ) : (
              <Text>Carregando...</Text>
            )}
            <Button
              title="Home"
              onPress={handleLogout}
              containerStyle={styles.logoutButton}
            />
          </Card>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    marginVertical: 20,
  },
  name: {
    fontSize: 22,
    marginTop: 12,
    fontWeight: 'bold',
  },
  location: {
    marginTop: 8,
    color: 'gray',
  },
  logoutButton: {
    marginTop: 24,
  },
});
