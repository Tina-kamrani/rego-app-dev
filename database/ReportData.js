import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import CryptoJS from 'crypto-js';
import 'react-native-get-random-values'; // Make sure this is also in App.js or index.js once

const ENCRYPTION_KEY = 'xzH4COFYItedD8Qw6ba0k1GcBShjJuUq'; // Replace with a secure key

const dataPath = `${FileSystem.documentDirectory}report_v18.json`;

// Encryption helper
const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

// Decryption helper
const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error('Decryption failed:', error);
    return { report_data: [] };
  }
};

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

// Read file with decryption
const readFile = async () => {
  console.log('dataPath:', dataPath);
  try {
    if (!(await fileExists(dataPath))) {
      const defaultData = { report_data: [] };
      await writeFile(defaultData);
      return defaultData;
    }

    const encryptedContent = await FileSystem.readAsStringAsync(dataPath);
    return decryptData(encryptedContent);
  } catch (error) {
    console.error('Failed to read file:', error);
    return { report_data: [] };
  }
};

// Write file with encryption
const writeFile = async (data) => {
  try {
    const encrypted = encryptData(data);
    if (encrypted) {
      await FileSystem.writeAsStringAsync(dataPath, encrypted);
    }
  } catch (error) {
    console.error('Failed to write file:', error);
  }
};

// Get reports
export const getReports = async () => (await readFile()).report_data;

// Save reports
export const saveReport = async (report) => {
  console.log('saving report to the file!!!');
  const data = await readFile();
  data.report_data = report;
  await writeFile(data);
};

// Add new report
export const addReport = async (newReport, send_status = 'pending') => {
  const reports = await getReports();
  const updatedReport = [
    ...reports,
    { id: reports.length + 1, ...newReport, sendStatus: send_status }
  ];
  console.log("this is updated");
  await saveReport(updatedReport);
  return updatedReport;
};

// Fetch reports
export const fetchReport = getReports;

// Delete report by ID
export const deleteReport = async (id) => {
  const reports = await getReports();
  const updatedReport = reports.filter(r => r.id !== id);
  await saveReport(updatedReport);
  return updatedReport;
};

// Clear all reports
export const deleteAllReports = async () => {
  try {
    const emptyData = { report_data: [] };
    await writeFile(emptyData);
    console.log('All reports have been deleted.');
  } catch (error) {
    console.error('Failed to delete all reports:', error);
  }
};

// Compress images using JSZip
const compressImages = async (imageUris, id) => {
  try {
    const zip = new JSZip();
    await Promise.all(imageUris.map(async (uri) => {
      const fileName = uri.split('/').pop();
      const fileContents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      zip.file(fileName, fileContents, { base64: true });
    }));

    const zipBase64 = await zip.generateAsync({ type: 'base64' });
    const zipFilePath = `${FileSystem.documentDirectory}compressedImages${id}.zip`;
    await FileSystem.writeAsStringAsync(zipFilePath, zipBase64, { encoding: FileSystem.EncodingType.Base64 });

    console.log('Compressed file saved at:', zipFilePath);
    return zipFilePath;
  } catch (error) {
    console.error('Error compressing images:', error);
  }
};
