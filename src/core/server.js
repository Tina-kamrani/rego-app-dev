import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import Config from '@/src/config/env';

export const checkServerConnectivity = async () => {
  try {
    console.log('Checking server connectivity at:', Config.API_BASE_URL);
    const response = await fetch(Config.API_BASE_URL, {
      method: 'GET',
    });
    console.log('Server connectivity check:', { status: response.status, ok: response.ok });
    return response.ok;
  } catch(error) {
    console.error('Server connectivity error:', error);
    return false;
  }
};

export const fetchUserData = async (token) => {
    console.log('Fetching user data from:', `${Config.API_BASE_URL}Account/GetCurrentUser`);
    const response = await fetch(`${Config.API_BASE_URL}Account/GetCurrentUser`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    });
    console.log('User data response:', { status: response.status, ok: response.ok });
    return response;
};

export const sendDataToServer = async (data, token, path = 2) => {
    console.log('Sending data to:', `${Config.API_BASE_URL}Reporting/Create`);
    const response = await fetch(`${Config.API_BASE_URL}Reporting/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(data),
    });
    console.log('Data send response:', { status: response.status, ok: response.ok });
    return response;
};

export const sendFilesToServer = async (data, token) => {
  try {
    if (!data.Files || !data.Files.length) {
      throw new Error('No files to upload');
    }

    if (!data.ClientId) {
      return;
    }

    const reportId = String(data.Id);
    const clientId = String(data.ClientId);

    // Process one file at a time
    for (let i = 0; i < data.Files.length; i++) {
      const fileData = data.Files[i];
      
      try {
        if (!fileData.uri) {
          console.warn(`File ${i} has no URI, skipping...`);
          continue;
        }

        // Verify file exists
        const fileInfo = await FileSystem.getInfoAsync(fileData.uri);
        if (!fileInfo.exists) {
          console.warn(`File does not exist: ${fileData.uri}`);
          continue;
        }

        // Configure upload
        const uploadUrl = `${Config.API_BASE_URL}Reporting/CreateAttachments?Id=${reportId}&ClientId=${clientId}`;
        console.log(`Uploading file ${i + 1} to:`, uploadUrl);
        
        const maxRetries = 1;
        let attempt = 0;
        let lastError;

        while (attempt < maxRetries) {
          try {
            console.log(`Attempting to upload file ${i + 1}, attempt ${attempt + 1}`);
            
            const response = await FileSystem.uploadAsync(uploadUrl, fileData.uri, {
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: 'files',
              mimeType: fileData.type || 'image/jpeg',
              headers: {
                'Authorization': token,
                'Accept': 'application/json'
              },
              parameters: {
                'Id': reportId,
                'ClientId': clientId,
                'filename': fileData.name || `image_${Date.now()}_${i}.jpg`
              }
            });

            console.log(`Upload response for file ${i + 1}:`, response);

            if (response.status === 200) {
              console.log(`Successfully uploaded file ${i + 1}`);
              break;
            }

            lastError = new Error(`Upload failed with status: ${response.status}`);
          } catch (error) {
            console.error(`Upload attempt ${attempt + 1} failed:`, error);
            lastError = error;
          }

          attempt++;
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }

        if (attempt === maxRetries) {
          throw lastError || new Error(`Failed to upload file ${i + 1}`);
        }

      } catch (fileError) {
        console.error(`Error processing file ${i + 1}:`, fileError);
        throw fileError;
      }
    }

    return true;

  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// For local storage error
const saveData = async (reportData, send_status) => {
  try {
    // Make sure reportData exists and has required fields
    if (!reportData) {
      throw new Error('No report data provided');
    }

    // Check required fields
    if (!reportData.ClientId || !reportData.EntityType) {
      showToast("Error!", "All fields must be inputed.", "error");
      console.log("All fields must be inputed.");
      return;
    }

    await addReport(reportData, send_status);
  } catch (error) {
    showToast("Error!", "An error occurred while saving the report.", 'error');
    console.error('Save error:', error);
  }
};

// In your handleSend function
const handleSend = async () => {
  if (!reportData.hazard.value) {
    updateReportData('hazard', { 
      ...reportData.hazard, 
      error: "Pakollinen tieto puuttuu..." 
    });
    return;
  }

  const reportPayload = {
    Name: userdata.username,
    Email: userdata.userName,
    UserUnitCode: userdata.unitcode,
    ClientId: String(userdata.userId),
    Description: reportData.hazard.value,
    Location: reportData.place.value,
    IsPositive: reportData.positive,
    Reason: reportData.factor.value,
    Proposal: reportData.measure.value,
  };

  try {
    const token = userdata.token_type + ' ' + userdata.access_token;

    // First create the report
    const reportResponse = await sendDataToServer(reportPayload, token);
    if (!reportResponse.ok) {
      throw new Error('Failed to create report');
    }

    const reportResult = await reportResponse.json();

    // Then handle file uploads if any
    if (reportData.files && reportData.files.length > 0) {
      const fileUploadData = {
        Id: String(reportResult.id),
        ClientId: String(userdata.userId),
        Files: reportData.files
      };

      await sendFilesToServer(fileUploadData, token);
    }

    // showToast("Success", "Ilmoituksen lähetys onnistui");
    clearReportData();
    // navigation.navigate('SuccessMessageScreen');
    navigation.navigate('ReportScreen');

  } catch (error) {
    console.error('Error in handleSend:', error);
    showToast("Error", i18n.t('serverError'), "error");
    
    // Save locally if upload fails
    try {
      const localData = {
        ...reportPayload,
        files: reportData.files,
        timestamp: new Date().getTime(),
        status: 'pending',
        error: error.message
      };

      await saveData(localData, 'pending');
      showToast("Info", "lmoitus tallennettu ja se lähetetään kun verkkoyhteys on hyvä", "info");
    } catch (saveError) {
      console.error('Error saving locally:', saveError);
      showToast("Error", "Paikallinen tallennus epäonnistui", "error");
    }
  }
};

export const handleSSORequest = async ({
  redirectURI,
  codeVerifier,
  code
}) => {
  const ssoPayload = new URLSearchParams({
    redirect_uri: redirectURI,
    code_verifier: codeVerifier,
    code,
    SSOClientId: Config.CLIENT_ID,
  });
  const serverURI = `${Config.API_BASE_URL}mobileapp/oauth/callback?${ssoPayload}`;

  console.log('Handling SSO request at:', serverURI);
  try {
    const response = await fetch(serverURI, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log('SSO response:', { status: response.status, ok: response.ok, hasAccessToken: !!data.accessToken });

    if (response.ok && data.accessToken) {
      console.log("✅ Successfully logged in!");
      await AsyncStorage.setItem("userToken", data.accessToken);
    } else {
      console.error("❌ Authentication failed:", data);
    }
  } catch(e) {
    console.error("SSO error:", e);
  }
};