import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  View,
  ImageBackground,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Input, Button, Card, Icon} from '@rneui/themed';
import {register, CurrentUser} from '../api/users';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../services/types';
import verifyEmail from '../services/verifyEmail';
import {launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const requestGalleryPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    let permission;

    if (Platform.Version >= 33) {
      permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
    } else {
      permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    }

    const granted = await PermissionsAndroid.request(permission);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        'Permissão negada',
        'É necessário permitir acesso às fotos para selecionar a imagem.',
      );
      return false;
    }
  } catch (err) {
    console.warn(err);
    Alert.alert('Erro', 'Erro ao solicitar permissão para acessar fotos.');
    return false;
  }
};

export default function RegisterScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const granted = await requestGalleryPermission();
    if (!granted) {
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.8,
      },
      response => {
        console.log('Picker response:', JSON.stringify(response, null, 2));

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert(
            'Erro',
            response.errorMessage || 'Erro ao selecionar imagem.',
          );
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.uri) {
            setPhotoURL(asset.uri);
          } else {
            Alert.alert('Erro', 'Imagem selecionada inválida.');
          }
        } else {
          Alert.alert('Erro', 'Nenhuma imagem selecionada.');
        }
      },
    );
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const userCurrent = CurrentUser();
      if (userCurrent) {
        Alert.alert('Você já está logado. Faça logout para se registrar novamente.');
        navigation.navigate('Login');
        return;
      }
      if (!verifyEmail(email)) {
        Alert.alert('Email inválido. Por favor, verifique o formato do email.');
        return;
      }
      if (!email || password.length < 6 || !name || !photoURL) {
        Alert.alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      const user = await register(email, password, name, photoURL);
      if (user) {
        Alert.alert('Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.message);
    } finally {
      setLoading(false);
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
          <Card containerStyle={styles.card}>
            <View style={styles.header}>
              <Icon
                name="heart"
                type="font-awesome"
                color="#ff4d6d"
                size={36}
              />
              <Text style={styles.title}>Crie sua conta</Text>
            </View>

            <Card.Divider />

            <Input
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              leftIcon={{type: 'material', name: 'person', color: '#ff4d6d'}}
              inputStyle={styles.colorInput}
              placeholderTextColor="#fff"
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={{type: 'material', name: 'email', color: '#ff4d6d'}}
              inputStyle={styles.colorInput}
              placeholderTextColor="#fff"
            />
            <Input
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={{type: 'material', name: 'lock', color: '#ff4d6d'}}
              inputStyle={styles.colorInput}
              placeholderTextColor="#fff"
            />

            <Button
              title={photoURL ? 'Trocar Foto' : 'Selecionar Foto'}
              onPress={pickImage}
              icon={{
                name: 'image',
                type: 'material',
                color: 'white',
              }}
              containerStyle={styles.bottom}
              buttonStyle={styles.photoButton}
            />

            {photoURL ? (
              <View style={styles.view}>
                <Image source={{uri: photoURL}} style={styles.image} />
              </View>
            ) : null}

            <Button
              title="Cadastrar"
              onPress={handleRegister}
              loading={loading}
              containerStyle={styles.bottom}
              buttonStyle={styles.registerButton}
              icon={{
                name: 'heart',
                type: 'font-awesome',
                color: 'white',
                size: 20,
              }}
            />

            <Button
              title="Voltar para Login"
              type="outline"
              onPress={() => navigation.navigate('Login')}
              titleStyle={styles.colorButton}
              buttonStyle={styles.outlineButton}
            />
          </Card>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    borderWidth: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  bottom: {
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: '#ff4d6d',
    borderRadius: 30,
  },
  registerButton: {
    backgroundColor: '#ff4d6d',
    borderRadius: 30,
  },
  outlineButton: {
    borderColor: '#ff4d6d',
    borderRadius: 30,
  },
  view: {
    alignItems: 'center',
    marginVertical: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff4d6d',
  },
  button: {
    backgroundColor: '#ff4d6d',
    borderRadius: 30,
  },
  colorInput: {
    color: '#fff',
  },
  colorButton: {
    backgroundColor: '#ff4d6d',
  },
});
