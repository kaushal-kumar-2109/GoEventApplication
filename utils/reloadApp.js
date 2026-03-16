import { DevSettings } from 'react-native';

const RELOADAPP = async () => {
  console.log('h1');
  try{
    await DevSettings.reload();
    console.log('h2');
  }catch(err){
    console.log('reload Error => ',err);
  }

}

export {RELOADAPP};
