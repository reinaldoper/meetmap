import React, { useState } from 'react';
import {
  ScrollView,
  Alert,
  StyleSheet,
  ImageBackground,
  View,
  Text,
} from 'react-native';
import { Input, Button, Card, Icon } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/types';
import { login } from '../api/users';
import verifyEmail from '../services/verifyEmail';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!email || password.length < 6) {
        Alert.alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      if (!verifyEmail(email)) {
        Alert.alert('Email inválido. Por favor, verifique o formato do email.');
        return;
      }
      const user = await login(email, password);
      if (user.uid) {
        Alert.alert('Login realizado com sucesso!');
        navigation.navigate('Home');
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
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(255,77,109,0.4)']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Card containerStyle={styles.card}>
            <View style={styles.header}>
              <Icon
                name="heart"
                type="font-awesome"
                color="#ff4d6d"
                size={36}
              />
              <Text style={styles.title}>Bem-vindo ao LoveMatch</Text>
            </View>

            <Card.Divider />

            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={{ type: 'material', name: 'email', color: '#ff4d6d' }}
              inputStyle={styles.colorInput}
              placeholderTextColor="#fff"
            />

            <Input
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={{ type: 'material', name: 'lock', color: '#ff4d6d' }}
              inputStyle={styles.colorInput}
              placeholderTextColor="#fff"
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              containerStyle={styles.bottom}
              buttonStyle={styles.button}
              icon={{
                name: 'heart',
                type: 'font-awesome',
                color: 'white',
                size: 20,
              }}
            />

            <Button
              title="Criar conta"
              type="outline"
              onPress={() => navigation.navigate('Register')}
              titleStyle={styles.colorButton}
              buttonStyle={styles.button}
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
