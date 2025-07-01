import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Avatar, Text, Button, Card } from '@rneui/themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/types';
import { User } from '../services/types';
import { CurrentUser, CurrentUserUuid, logout } from '../api/users';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
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
        if (doc) {
          setUserData(doc.data() as User);
        } else {
          Alert.alert('Usuário não encontrado no banco');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Title>Meu Perfil</Card.Title>
        <Card.Divider />
        {userData ? (
          <>
            <View style={styles.center}>
              <Avatar
                source={{ uri: userData.photoURL }}
                rounded
                size="xlarge"
              />
              <Text style={styles.name}>{userData.name}</Text>
              <Text>{userData.email}</Text>
              {userData.location && (
                <Text style={styles.location}>
                  Localização: {userData.location.latitude.toFixed(4)}, {userData.location.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text>Carregando...</Text>
        )}
        <Button
          title="Sair"
          onPress={handleLogout}
          containerStyle={styles.logoutButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
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
