import { DefaultTheme, MD3DarkTheme  } from 'react-native-paper';
import { Appearance } from 'react-native';

export const systemColorScheme = Appearance.getColorScheme(); 

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    placeholder: '#1E1E1E',
    border: '#1E1E1E',
    primary: '#0FB858',
    lightPrimary: '#EEEEEE',
    secondary: '#1D1E20',
    error: '#890629',
    secondaryContainer: "#0FB858",
    default: '#FFFFFF',
    timePickerTextColor: '#B0AFB0',
    errorBoundaryColor: 'darkred',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    text: '#ffffff',
    placeholder: '#C9C3CF',
    border: '#C9C3CF',
    primary: '#4BB543',
    lightPrimary: '#2F2F2F',
    secondary: '#FFFFFF',
    error: '#FFB3B3',
    secondaryContainer: "#424242",
    default: '#1E1E1E',
    timePickerTextColor: '#69686B',
    errorBoundaryColor: '#FFB3B3',
  },
};

// Define light theme styles for ProgressSteps
const lightStepThemeStyles = {
};

// Define dark theme styles for ProgressSteps
const darkStepThemeStyles = {
  activeStepNumColor: '#FFF',
  disabledStepNumColor: '#1E1E1E',
  stepIconColor: '#A7C3F1',
  stepNumColor: '#FFFFFF',
  progressStepsColor: '#A7C3F1',
  progressStepLabelColor: '#A7C3F1',
};

const lightDropDownTheme = {
};

const darkDropDownTheme = {
  style: {
    backgroundColor: '#1E1E1E',
    borderStyle: 'solid',
    borderColor: '#8D8A92',
  },
  arrowIconStyle: {
    tintColor: '#8D8A92',
  },
  labelStyle: {
    color: '#ADAAB2', 
  },
  placeholderStyle: {
    color: '#ADAAB2', 
  }
};

export const theme = systemColorScheme === 'light' ? lightTheme : darkTheme;
export const progressStepsStyle = systemColorScheme === 'light' ? lightStepThemeStyles : darkStepThemeStyles;
export const dropDownTheme = systemColorScheme === 'light' ? lightDropDownTheme : darkDropDownTheme;