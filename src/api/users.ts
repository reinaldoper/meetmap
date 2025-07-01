import {auth, firestore} from './firebase';

export async function register(
  email: string,
  password: string,
  name: string,
  photoURL: string,
  latitude: number = 0,
  longitude: number = 0,
) {
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );

  await firestore().collection('users').doc(userCredential.user.uid).set({
    name,
    email,
    photoURL,
    uid: userCredential.user.uid,
    location: {latitude, longitude},
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return userCredential.user;
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
  const snapshot = await firestore().collection('users').get();
  return snapshot;
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
