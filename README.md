# MeetMap
## MeetMap é um app mobile em React Native (CLI) para conectar pessoas próximas via geolocalização, exibir um mapa com usuários, permitir favoritos e interação social. Aplicação usa o firebase como repositório dos dados, usuário faz inscrição com nome, email, senha e foto, a idéia é centralizar todos os usuarios em uma tela geral onde cada usuário podem ver a localização de cada m, podendo favoritar.

🚀 Tecnologias e Bibliotecas
✅ React Native CLI (TypeScript)
✅ Firebase (Auth + Firestore)
✅ react-native-maps – exibe mapa e marcadores
✅ @rneui/themed – Material UI compatível para React Native
✅ react-native-image-picker – seleção de foto local
✅ react-native-permissions – permissões de geolocalização
✅ react-native-community/geolocation – localização do dispositivo
✅ react-navigation – navegação entre telas
✅ Haversine Formula – cálculo de distância geográfica

📦 Instalação
1. Clone o repositório

```bash
git clone https://github.com/reinaldoper/meetmap.git
cd meetmap
```

2. Instale dependências

```bash
yarn install 
#ou 
npm install
```

3. Configuração do Firebase

- Crie um projeto no Firebase.
- Gere o arquivo google-services.json.
- Coloque o arquivo em:

```bash
android/app/google-services.json
```

- Habilite:
- Authentication → Email/Password
- Firestore Database → regras abertas para testes (ou configure regras seguras)

4. Permissões Android
No arquivo AndroidManifest.xml:

```bash
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

▶️ Rodando o app localmente
Android
Conecte seu celular ou emulador Android, então:

```bash
npm run start

&& 


npx react-native run-android
```

📱 Gerar APK
Gere o APK release:

```bash
cd android
./gradlew assembleRelease
```

APK estará em:

```bash
android/app/build/outputs/apk/release/app-release.apk
```

🗺 Funcionalidades
✅ Tela de Splash com redirecionamento automático se usuário estiver logado
✅ Cadastro de usuário com foto local
✅ Login/Logout via Firebase
✅ Mapa com localização do usuário + outros usuários
✅ Exibição de distância entre usuários
✅ Favoritar usuários
✅ Tela de favoritos para gerenciar favoritos
✅ UI moderna com Material UI (RNE UI Themed)
✅ Validação de email e senhas

📚 Scripts úteis
- Limpar cache do metro bundler:

```bash
npx react-native start --reset-cache
```

- Rodar apenas metro bundler:


```bash
npx react-native start
```

🙌 Créditos
Feito com ❤️ por Reinaldo Pereira.

MeetMap – conecte pessoas através do mapa. 🚀

