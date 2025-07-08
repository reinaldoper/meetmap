const { setIcon } = require('react-native-make');

setIcon({
  path: '../src/assets/loginMeet.png',
})
  .then(() => {
    console.log('Ícones gerados com sucesso!');
  })
  .catch((error) => {
    console.error(error);
  });
