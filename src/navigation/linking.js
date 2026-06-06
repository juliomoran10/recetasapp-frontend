import * as Linking from 'expo-linking';

export const linking = {
  prefixes: [Linking.createURL('/'), 'recetasapp://'],
  config: {
    screens: {
      SignIn: 'sign-in',
      SignUp: 'sign-up',
      ForgotPassword: 'forgot-password',
      NewPassword: {
        path: 'reset-password',
        parse: {
          token: (value) => value,
          code: (value) => value
        }
      },
      Home: {
        screens: {
          AllRecipes: 'explorar',
          MyRecipes: 'mis-recetas',
          Groups: 'grupos',
          Profile: 'perfil'
        }
      }
    }
  }
};
