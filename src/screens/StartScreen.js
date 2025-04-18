import React from 'react'
import Background from '@/src/components/Background';
import Logo from '@/src/components/Logo';
import Header from '@/src/components/Header';
import Button from '@/src/components/Button';
import Paragraph from '@/src/components/Paragraph';

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>REGO APP</Header>
      <Paragraph>
        You can report accidents and incidents.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Sign In
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
};
