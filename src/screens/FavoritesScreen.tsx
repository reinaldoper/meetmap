import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { Card, Avatar, Button, Text } from '@rneui/themed';
import { firestore } from '../api/firebase';
import { User } from '../services/types';
import { favoritesUsers, removeFavoriteUser } from '../api/users';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<User[]>([]);

  useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const favDoc = await favoritesUsers();
      const favIds: string[] = favDoc ? favDoc.data()?.favorites || [] : [];

      if (favIds.length === 0) {
        setFavorites([]);
        return;
      }

      const userDocs = await Promise.all(
        favIds.map((id) =>
          firestore().collection('users').doc(id).get()
        )
      );

      const favUsers = userDocs
        .filter(doc => doc.exists)
        .map(doc => doc.data() as User);

      setFavorites(favUsers);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro ao buscar favoritos');
    }
  };

  fetchFavorites();
}, []);


  const removeFavorite = async (uidToRemove: string) => {
    try {
      await removeFavoriteUser(uidToRemove);
      setFavorites((prev) => prev.filter((u) => u.uid !== uidToRemove));
    } catch (e) {
      console.error(e);
      Alert.alert('Erro ao remover favorito');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={styles.title}>Meus Favoritos</Text>
      {favorites.length === 0 ? (
        <Text style={styles.empty}>Você ainda não tem favoritos.</Text>
      ) : (
        favorites.map((user) => (
          <Card key={user.uid}>
            <View style={styles.row}>
              <Avatar source={{ uri: user.photoURL }} rounded size="medium" />
              <View style={styles.info}>
                <Text style={styles.name}>{user.name}</Text>
                <Text>{user.email}</Text>
              </View>
            </View>
            <Button
              title="Remover"
              type="outline"
              onPress={() => removeFavorite(user.uid)}
              containerStyle={styles.removeButton}
            />
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: 'gray',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 10,
  },
});
