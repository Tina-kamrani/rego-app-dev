import * as FileSystem from 'expo-file-system';

const dataPath = FileSystem.documentDirectory + 'risk_type.json';

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
      const defaultData = { risk_types: [] };
      await writeFile(defaultData);
      return defaultData;
    }

    // Read the file
    const content = await FileSystem.readAsStringAsync(dataPath);
    return JSON.parse(content);

  } catch (error) {
    console.error('Failed to read file:', error);
    return { risk_types: [] };
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

// for risk types
export const getRiskTypes = async () => {
  const data = await readFile();
  return data.risk_types;
};

export const saveRiskTypes = async (riskTypes) => {
  const data = await readFile();
  data.risk_types = riskTypes;
  await writeFile(data);
};

// Create
export const addRiskType = async (newRiskType) => {
  const riskTypes = await getRiskTypes();
  const updatedRiskTypes = [
    ...riskTypes, { 
        id: riskTypes.length + 1 , 
        name: newRiskType.name, 
        status: newRiskType.status, 
        order: riskTypes.length + 1 
    }
  ];
  
  await saveRiskTypes(updatedRiskTypes);
  
  return updatedRiskTypes;
};

// Read
export const fetchRiskTypes = async () => {
  return await getRiskTypes();
};

// Update
export const updateRiskType = async (id, updatedData) => {
  const riskTypes = await getRiskTypes();
  const updatedRiskTypes = riskTypes.map((type) =>
    type.id === id ? { ...type, ...updatedData } : type
  );
  await saveRiskTypes(updatedRiskTypes);
  return updatedRiskTypes;
};

// Delete
export const deleteRiskType = async (id) => {
  const riskTypes = await getRiskTypes();
  const updatedRiskTypes = riskTypes.filter((type) => type.id !== id);
  await saveRiskTypes(updatedRiskTypes);
  return updatedRiskTypes;
};