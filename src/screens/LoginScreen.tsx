
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Input, Button, Card } from '@rneui/themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/types';
import { Alert, StyleSheet } from 'react-native';
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
      if (!email || password.length >= 6) {
        Alert.alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      if (!verifyEmail(email)) {
        Alert.alert('Email inválido. Por favor, verifique o formato do email.');
        return;
      }
      await login(email, password);
      Alert.alert('Login realizado!');
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
        <Card.Title>Login</Card.Title>
        <Card.Divider />

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          containerStyle={styles.bottom}
        />

        <Button
          title="Criar conta"
          type="outline"
          onPress={() => navigation.navigate('Register')}
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
});
