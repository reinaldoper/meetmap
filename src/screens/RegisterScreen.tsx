import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, Image, View } from 'react-native';
import { Input, Button, Card, Icon } from '@rneui/themed';
import { register } from '../api/users';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/types';
import verifyEmail from '../services/verifyEmail';
import { launchImageLibrary } from 'react-native-image-picker';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Erro', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setPhotoURL(response.assets[0].uri || '');
        }
      }
    );
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      if (!verifyEmail(email)) {
        Alert.alert('Email inválido. Por favor, verifique o formato do email.');
        return;
      }
      if (!email || password.length < 6 || !name || !photoURL) {
        Alert.alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      await register(email, password, name, photoURL);
      navigation.navigate('Login');
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Title>Cadastro</Card.Title>
        <Card.Divider />

        <Input
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          leftIcon={{ type: 'material', name: 'person' }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={{ type: 'material', name: 'email' }}
        />
        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={{ type: 'material', name: 'lock' }}
        />

        <Button
          title={photoURL ? 'Trocar Foto' : 'Selecionar Foto'}
          onPress={pickImage}
          icon={<Icon name="image" type="material" color="white" />}
          containerStyle={styles.bottom}
        />

        {photoURL ? (
          <View style={styles.view}>
            <Image
              source={{ uri: photoURL }}
              style={styles.image}
            />
          </View>
        ) : null}

        <Button
          title="Cadastrar"
          onPress={handleRegister}
          loading={loading}
          containerStyle={styles.bottom}
        />

        <Button
          title="Voltar para Login"
          type="outline"
          onPress={() => navigation.navigate('Login')}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  bottom: {
    marginBottom: 12,
  },
  view: { alignItems: 'center', marginVertical: 12 },
  image: { width: 100, height: 100, borderRadius: 50 },
});
