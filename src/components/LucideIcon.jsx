import * as Icons from 'lucide-react-native'; // Import all icons

const LucideIcon = ({ name, color, size }) => {
  const Icon = Icons[name];

  if (!Icon) {
    console.warn(`Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return <Icon color={color} size={size} />;
};

export default LucideIcon;
