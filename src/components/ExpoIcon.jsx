import { 
  MaterialIcons, 
  Ionicons, 
  FontAwesome,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  AntDesign,
  SimpleLineIcons
} from '@expo/vector-icons';

const iconSets = {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  AntDesign,
  SimpleLineIcons
};

const ExpoIcon = ({ name, iconSet = "MaterialIcons", color, size }) => {
  const IconComponent = iconSets[iconSet];
  if (!IconComponent) {
    console.warn(`Icon set "${iconSet}" not found in @expo/vector-icons`);
    return null;
  }

  return <IconComponent name={name} color={color} size={size} />;
};

export default ExpoIcon;