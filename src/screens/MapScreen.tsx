import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import MapView, {Marker, Callout, UrlTile} from 'react-native-maps';
import {getUsers, addFavorite, updateUserLocation} from '../api/users';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../services/types';
import * as Permissions from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {Avatar, Button} from '@rneui/themed';
import {User} from '../services/types';
import {haversineDistance} from '../services/funcs';
import LinearGradient from 'react-native-linear-gradient';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

type Props = {
  navigation: MapScreenNavigationProp;
};

export default function MapScreen({navigation}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const permission = await Permissions.request(
          Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        if (permission !== Permissions.RESULTS.GRANTED) {
          Alert.alert('Permissão negada para acessar localização.');
          return;
        }

        Geolocation.getCurrentPosition(
          async position => {
            const {latitude, longitude} = position.coords;
            await updateUserLocation(latitude, longitude);
            setMyLocation({latitude, longitude});
          },
          error => {
            console.log(error);
            Alert.alert('Erro ao pegar localização:');
          },
          {enableHighAccuracy: true},
        );

        const usersArray = await getUsers();
        setUsers(usersArray);
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
          {myLocation && users.length > 0 ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation={true}
              loadingEnabled={true}
              mapType="standard"
              customMapStyle={[]}>
              <UrlTile
                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />

              {users.map(user => {
                let distanceStr = '';
                if (myLocation && user.location) {
                  const distance = haversineDistance(
                    myLocation.latitude,
                    myLocation.longitude,
                    user.location.latitude,
                    user.location.longitude,
                  );
                  distanceStr = `${distance.toFixed(2)} km de distância`;
                }

                return (
                  <Marker
                    key={user.uid}
                    coordinate={{
                      latitude: user.location.latitude,
                      longitude: user.location.longitude,
                    }}>
                    <Callout>
                      <View style={styles.callout}>
                        <Avatar
                          source={
                            user.photoURL
                              ? {uri: user.photoURL}
                              : require('../assets/avatar.jpeg')
                          }
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
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>
                Você ainda não tem amigos...
              </Text>
            </View>
          )}
          <Button
            title="Voltar para Home"
            type="outline"
            onPress={() => navigation.navigate('Home')}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
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
  text: {
    maxHeight: 100,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
