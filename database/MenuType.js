import * as FileSystem from 'expo-file-system';

const dataPath = FileSystem.documentDirectory + 'menu_type.json';

// Check if file exists
const fileExists = async (path) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(path);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking if file exists:', error);
    return false;
  }
};

// Read file
const readFile = async () => {
  try {
    // Check if the file exists
    const exists = await fileExists(dataPath);

    if (!exists) {
      const defaultData = { menu_types: [] };
      await writeFile(defaultData);
      return defaultData;
    }

    // Read the file
    const content = await FileSystem.readAsStringAsync(dataPath);
    return JSON.parse(content);

  } catch (error) {
    console.error('Failed to read file:', error);
    return { menu_types: [], risk_types: [], event_types: [], report_data: [] };
  }
};

// Write file
const writeFile = async (data) => {
  try {
    await FileSystem.writeAsStringAsync(dataPath, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to write file:', error);
  }
};

// Functions to manipulate data
export const getMenuTypes = async () => {
  const data = await readFile();
  return data.menu_types;
};

export const saveMenuTypes = async (menuTypes) => {
  const data = await readFile();
  data.menu_types = menuTypes;
  await writeFile(data);
};

export const addMenuType = async (newMenuType) => {
  const menuTypes = await getMenuTypes();
  const updatedMenuTypes = [
    ...menuTypes,
    { 
        id: menuTypes.length + 1, 
        name: newMenuType.name, 
        icon: newMenuType.icon, 
        status: newMenuType.status, 
        order: menuTypes.length + 1 
    }
  ];

  await saveMenuTypes(updatedMenuTypes);
  return updatedMenuTypes;
};

export const fetchMenuTypes = async () => {
  return await getMenuTypes();
};

export const updateMenuType = async (id, updatedData) => {
  const menuTypes = await getMenuTypes();
  const updatedMenuTypes = menuTypes.map((type) =>
    type.id === id ? { ...type, ...updatedData } : type
  );

  await saveMenuTypes(updatedMenuTypes);
  return updatedMenuTypes;
};

export const deleteMenuType = async (id) => {
  const menuTypes = await getMenuTypes();
  const updatedMenuTypes = menuTypes.filter((type) => type.id !== id);

  await saveMenuTypes(updatedMenuTypes);
  return updatedMenuTypes;
};