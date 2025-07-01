export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Splash: undefined;
  Home: undefined;
  Map: undefined;
  Favorites: undefined;
  Profile: undefined;
};


export type User = {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  location: {
    latitude: number;
    longitude: number;
  };
};
