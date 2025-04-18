import * as FileSystem from 'expo-file-system';

const dataPath = FileSystem.documentDirectory + 'event_type.json';

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
        const defaultData = { event_types: [] };
        await writeFile(defaultData);
        return defaultData;
      }
  
      // Read the file
      const content = await FileSystem.readAsStringAsync(dataPath);
      return JSON.parse(content);
  
    } catch (error) {
      console.error('Failed to read file:', error);
      return { event_types: [] };
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

export const getEventTypes = async () => {
  const data = await readFile();
  return data.event_types;
};

export const saveEventTypes = async (eventTypes) => {
  const data = await readFile();
  data.event_types = eventTypes;
  await writeFile(data);
};

// Create
export const addEventType = async (newEventType) => {
  const eventTypes = await geteventTypes();

  const updatedEventTypes = [
    ...eventTypes,
    { 
        id: eventTypes.length + 1 ,
        name: newEventType.name,
        parentId: newEventType.parentId ? newEventType.parentId : 0,
        status: newEventType.status,
        sortId: newEventType.sortId ? newEventType.sortId : 0
    }
  ];

  await saveEventTypes(updatedEventTypes);
  return updatedEventTypes;
};

// Read
export const fetchEventTypes = async () => {
  return await getEventTypes();
};

// Update
export const updateEventType = async (id, updatedData) => {
  const eventTypes = await getEventTypes();
  const updatedeventTypes = eventTypes.map((type) =>
    type.id === id ? { ...type, ...updatedData } : type
  );

  await saveEventTypes(updatedeventTypes);
  
  return updatedeventTypes;
};

// Delete
export const deleteMenuType = async (id) => {
  const eventTypes = await getEventTypes();
  const updatedEventTypes = eventTypes.filter((type) => type.id !== id);

  await saveEventTypes(updatedEventTypes);

  return updatedEventTypes;
};