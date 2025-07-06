
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';

async function uploadPhoto(localPath: string) {
  const filename = localPath.substring(localPath.lastIndexOf('/') + 1);
  const ref = storage().ref(`profile_photos/${filename}`);
  await ref.putFile(localPath);
  return await ref.getDownloadURL();
}


export { auth, firestore, uploadPhoto };
