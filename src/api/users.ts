import {auth, firestore, uploadPhoto} from './firebase';

export async function register(
  email: string,
  password: string,
  name: string,
  photoURL: string,
  latitude?: number,
  longitude?: number,
) {
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  const downloadURL = await uploadPhoto(photoURL);

  try {
    await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .set({
        name: name,
        photoURL: downloadURL,
        email: email,
        uid: userCredential.user.uid,
        ...(typeof latitude === 'number' && typeof longitude === 'number'
          ? {location: {latitude, longitude}}
          : {}),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Erro ao criar usuário no Firestore:', error);
    throw error;
  }

  return userCredential.user;
}

export async function updateUserLocation(latitude: number, longitude: number) {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('Usuário não está autenticado.');
  }

  if (
    latitude === 0 ||
    longitude === 0 ||
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new Error('Latitude e longitude inválidas.');
  }

  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set(
        {
          location: {
            latitude,
            longitude,
          },
        },
        { merge: true }
      );
  } catch (error) {
    console.error('Erro ao atualizar localização:', error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  const userCredential = await auth().signInWithEmailAndPassword(
    email,
    password,
  );
  return userCredential.user;
}

export function authCheck() {
  return new Promise(resolve => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function logout() {
  await auth().signOut();
}

export async function getUsers() {
  const user = auth().currentUser;
  const snapshot = await firestore().collection('users').get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      uid: doc.id,
      location: data.location || null,
      email: data.email || '',
      photoURL: data.photoURL || '',
      name: data.name || '',
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
    };
  }).filter(userData => userData.uid !== user?.uid);
}

export function CurrentUser() {
  return auth().currentUser;
}

export async function CurrentUserUuid(uid: string) {
  return await firestore().collection('users').doc(uid).get();
}

export async function addFavorite(uidToAdd: string) {
  const user = auth().currentUser;
  if (!user) {
    return;
  }

  try {
    await firestore()
      .collection('favorites')
      .doc(user.uid)
      .set(
        {
          favorites: firestore.FieldValue.arrayUnion(uidToAdd),
        },
        {merge: true},
      );
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao adicionar favorito.');
  }
}

export async function favoritesUsers() {
  const user = auth().currentUser;
  if (!user) {
    return;
  }
  return await firestore().collection('favorites').doc(user.uid).get();
}

export async function removeFavoriteUser(uidToRemove: string) {
  const user = auth().currentUser;
  if (!user) {
    return;
  }
  firestore()
    .collection('favorites')
    .doc(user.uid)
    .update({
      favorites: firestore.FieldValue.arrayRemove(uidToRemove),
    });
}
