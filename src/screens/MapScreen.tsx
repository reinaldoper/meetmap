import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getUsers, addFavorite } from '../api/users';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/types';
import * as Permissions from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { Avatar, Button } from '@rneui/themed';
import { User } from '../services/types';
import { haversineDistance } from '../services/funcs';

type MapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Map'
>;

type Props = {
  navigation: MapScreenNavigationProp;
};

export default function MapScreen({ navigation }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const permission = await Permissions.request(
          Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );
        if (permission !== Permissions.RESULTS.GRANTED) {
          Alert.alert('Permissão negada para acessar localização.');
          return;
        }

        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMyLocation({ latitude, longitude });
          },
          (error) => {
            console.log(error);
            Alert.alert('Erro ao pegar localização:', error.message);
          },
          { enableHighAccuracy: true }
        );

        const snapshot = await getUsers();
        const usersData: User[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as User;
          if (data.location) {
            usersData.push(data);
          }
        });
        setUsers(usersData);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleFavorite = async (uid: string) => {
    try {
      await addFavorite(uid);
      Alert.alert('Favorito adicionado!');
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {myLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
        >
          {users.map((user) => {
            let distanceStr = '';
            if (myLocation && user.location) {
              const distance = haversineDistance(
                myLocation.latitude,
                myLocation.longitude,
                user.location.latitude,
                user.location.longitude
              );
              distanceStr = `${distance.toFixed(2)} km de distância`;
            }

            return (
              <Marker
                key={user.uid}
                coordinate={{
                  latitude: user.location.latitude,
                  longitude: user.location.longitude,
                }}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Avatar
                      source={{ uri: user.photoURL }}
                      rounded
                      size={60}
                      containerStyle={styles.avatar}
                    />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text>{user.email}</Text>
                    <Text>{distanceStr}</Text>
                    <Button
                      title="Favoritar"
                      onPress={() => handleFavorite(user.uid)}
                      containerStyle={styles.favoriteButton}
                      size="sm"
                    />
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <Text>Carregando mapa...</Text>
      )}
      <Button
        title="Voltar para Home"
        type="outline"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  avatar: {
    marginBottom: 8,
  },
  callout: {
    alignItems: 'center',
    width: 200,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  favoriteButton: {
    marginTop: 8,
  },
});
