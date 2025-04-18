import React, { useContext, useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View, Alert, Button, Image } from 'react-native';
import { Text, useTheme, TextInput as Input } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Background from '@/src/components/Background';
import Logo from '@/src/components/Logo';
import Header from '@/src/components/Header';
import TextInput from '@/src/components/TextInput';
import { emailValidator } from '@/helpers/emailValidator';
import { passwordValidator } from '@/helpers/passwordValidator';
import { AuthContext } from '@/app/authContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from '@/src/core/i18n';

import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { generatePKCE } from '../utils/pkceUtils';

WebBrowser.maybeCompleteAuthSession();

// Microsoft Entra ID (Azure AD) OAuth Config
// const TENANT_ID = 'e56302f2-6c0d-43bd-bc7a-09dcfe503cf7';
const TENANT_ID = '2913ee49-8035-4f15-ac37-deb801e2436d';
const Config = {
  // CLIENT_ID: '48195ca1-022c-4c3e-a6c1-e49255494d2f',
  CLIENT_ID: '45ba805c-cd6a-4fba-b087-78486f968910',
  REDIRECT_URI: 'regodemo://index',
  SCHEME: 'regodemo',
  discovery: {
    authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
  },
};

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const { setUserdata } = useContext(AuthContext);
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState('');
  const [unitcode, setUnitcode] = useState('');

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: Config.CLIENT_ID,
      redirectUri: Config.REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    Config.discovery
  );

  useEffect(() => {
    if (response?.type === "success" && response.params.code) {
      setLoading(true);
      const exchangeCodeForToken = async () => {
        if (!request?.codeVerifier) {
            console.error("Missing code verifier for PKCE");
            setLoading(false);
            return;
        }
    
        try {
            const tokenResponse = await fetch(Config.discovery.tokenEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Origin": "http://localhost", // ✅ Required to simulate a browser request
                },
                body: new URLSearchParams({
                    client_id: Config.CLIENT_ID,
                    redirect_uri: Config.REDIRECT_URI,
                    grant_type: "authorization_code",
                    code: response.params.code,
                    code_verifier: request.codeVerifier, // PKCE verification
                    scope: "openid profile email offline_access",
                }).toString(),
            });
    
            const tokenResult = await tokenResponse.json();
    
            if (tokenResult.access_token) {
              const fetchAccessToken = async (accessToken) => {
                // console.log("access_token: ", tokenResult.access_token);
                try {
                  // const response = await fetch(`https://tuumaapi.qreform.com/api/mobileapp/oauth/48195ca1-022c-4c3e-a6c1-e49255494d2f/getregotoken`, {
                  const response = await fetch(`https://tuumaapi.qreform.com/api/mobileapp/oauth/45ba805c-cd6a-4fba-b087-78486f968910/getregotoken`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      accessToken,
                    }),
                  });

                  const result = await response.json();

                  // console.log("result: ", result);

                  if (response.ok && result && result.access_token) {
                    
                    // Fetch user data and wait for it to complete
                    const userData = await fetchUser(`Bearer ${result.access_token}`);

                    if (userData) {
                      result.userId = userData.userId;
                      result.username = userData.username;
                      result.unitcode = userData.unitcode;
                      result.email = userData.email;
                      result.clientId = userData.clientId;
                      result.alternativeUse = userData.alternativeUse;

                      // Store token and user data in AsyncStorage for future offline use
                      await AsyncStorage.setItem(
                        'userData',
                        JSON.stringify({ ...result, password: password.value })
                      );

                      // console.log('result: ', result);

                      // Store token and user data in context or AsyncStorage
                      setUserdata(result);
                      // console.log('User data:', result);

                      // Navigate to the Initial Screen or wherever required
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'InitialScreen' }], // Adjust this route as needed
                      });
                    } else {
                      Alert.alert('Login failed', 'Could not fetch user data. Please try again.');
                    }
                  }
                } catch(e) {
                  console.log(e);
                }
              }

              await fetchAccessToken(tokenResult.access_token);
            } else {
                console.error("Token Exchange Error:", tokenResult.error_description);
                Alert.alert("Login Failed", tokenResult.error_description || "Could not get access token.");
            }
        } catch (error) {
            console.error("Token Exchange Error:", error);
        } finally {
          setLoading(false);
        }
      };
         
      exchangeCodeForToken();
    }
  }, [response]);  

  const initialLogin = async () => {
    i18n.changeLanguage("fi");
    try {
      const cachedUserData = await AsyncStorage.getItem('userData');
      if (cachedUserData) {
        const parsedUserData = JSON.parse(cachedUserData);

        // console.log("parsedUserData: ", parsedUserData);

        setUserdata(parsedUserData);
        navigation.reset({
          index: 0,
          routes: [{ name: 'InitialScreen' }], // Adjust the screen name as needed
        });
      }
    } catch (error) {
      console.error('Error during initial login:', error);
    }
  }

  const fetchUser = async (token) => {
    try {
      console.log("token: ", token);
      // const response = await fetch('https://tuumaapi.qreform.com/api/MobileApp/GetCurrentUser', {
      const response = await fetch('https://tuumaapi.qreform.com/api/MobileApp/GetCurrentUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });

      if (response.ok) {
        const data = await response.json();

        console.log("user response data: ", data);

        setUserId(data.Id);
        setUsername(data.FirstName);
        setUnitcode(data.OrganizationUnit.Code);

        // Now perform actions that rely on updated userId and username
        return { clientId: data.ClientId, userId: data.Id, username: `${data.FirstName} ${data.LastName}`, email: data.Email, unitcode: data.OrganizationUnit.Code, alternativeUse: data.AlternativeUse ?? false };
        // return { clientId: data.ClientId, userId: data.Id, username: `${data.FirstName} ${data.LastName}`, email: data.Email, unitcode: data.OrganizationUnit.Code, alternativeUse: true };
      } else {
        console.error("Failed to fetch user data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const theme = useTheme();

  const handleLanguageChange = (languageCode) => {
    // Handle language change logic
    // console.log(languageCode);
  };

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);

    const data = {
      username: email.value,
      password: password.value,
      grant_type: 'password',
    };

    try {
      // const response = await fetch('https://tuumaapi.qreform.com/token', {
      const response = await fetch('https://tuumaapi.qreform.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
      });

      const result = await response.json();

      if (response.ok && result && result.access_token) {
        let token = `${result.token_type} ${result.access_token}`;

        // Fetch user data and wait for it to complete
        const userData = await fetchUser(token);

        if (userData) {
          result.userId = userData.userId;
          result.username = userData.username;
          result.unitcode = userData.unitcode;
          result.email = userData.email;
          result.clientId = userData.clientId;
          result.alternativeUse = userData.alternativeUse;

          // Store token and user data in AsyncStorage for future offline use
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify({ ...result, password: password.value })
          );

          // console.log('result: ', result);

          // Store token and user data in context or AsyncStorage
          setUserdata(result);
          // console.log('User data:', result);

          // Navigate to the Initial Screen or wherever required
          navigation.reset({
            index: 0,
            routes: [{ name: 'InitialScreen' }], // Adjust this route as needed
          });
        } else {
          Alert.alert('Login failed', 'Could not fetch user data. Please try again.');
        }
      } else {
        // Handle invalid response (API errors)
        Alert.alert('Login failed', result.error_description || 'An error occurred. Please check your credentials and try again.');
      }
    } catch (error) {
      Alert.alert('Login failed', 'An error occurred, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLogin();
  }, []);

  return (
    <>
      {/* <LanguageSelector onLanguageChange={handleLanguageChange}/> */}
      <Background>
        <Logo />
        <Header>Tuuma App</Header>
        <View style={{ width: '100%', flex: 1, gap: 10}}>
          <TextInput
            label={t('email')}
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label={t('password')}
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry={!passwordVisible}
            right={
              <Input.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />
          <Button
            onPress={onLoginPressed}
            title={t('login')}
            color={theme.colors.primary}
            disabled={loading}
          />
          <Button
            onPress={() => promptAsync({ useProxy: true })}
            title={'Kirjaudu sisään VR-tunnuksilla'}
            color={theme.colors.primary}
            disabled={loading}
          />
        </View>
      </Background>
    </>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    width: 200,
    height: 50,
  },
  icon: {
    width: '10px',
    height: '10px',
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  forgot: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
