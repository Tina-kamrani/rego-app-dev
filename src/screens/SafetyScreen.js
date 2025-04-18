import React, { useState, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SelectDropdown from 'react-native-select-dropdown';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { theme } from '../core/theme';
import { Card, RadioButton } from "react-native-paper";
import SelectedFile from '../components/SelectedFile';
import ContentHeader from '../components/ContentHeader';
import { addReport } from '@/database/ReportData';
import Toast from 'react-native-toast-message';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import ExpoIcon from '../components/ExpoIcon';
import { AuthContext } from "@/app/authContext";
import i18n from '../core/i18n';
import { sendDataToServer } from '../core/server';
// import { Camera, CameraType } from 'expo-camera/legacy';

const checkServerConnectivity = async () => {
    try {
      const response = await fetch('https://tuumaapi.qreform.com/', {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
};

const showToast = (state, message, type = 'success') => {
    Toast.show({
      type,
      position: 'top',
      text1: state,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
};

const saveData = async (reportData, send_status) => {
    try {
      if(!reportData.clientId && !reportData.entityType) {
        await addReport(reportData, send_status);
      } else {
        showToast("Error!", "All fields must be inputed.", "error");
        console.log("All fields must be inputed.");
      }
    } catch (error) {
        showToast("Error!", "An error occurred while saving the report.", 'error');
        console.log(error);
    }
};

const cities = [
    { label: 'Ahonpää' },
    { label: 'Ahvenus' },
    { label: 'Ainola' },
    { label: 'Airaksela' },
    { label: 'Aittaluoto' },
    { label: 'Ajos' },
    { label: 'Alapitkä' },
];

const incidentAreas = [
    { label: 'Matkustajaturvallisuus' }
];

const incidentTypes = [
    { label: 'Väkivaltatilanne' }
];

const venues = [
    { label: 'Fleet/vehicle' },
    { label: 'Restaurant/kiosk' },
    { label: 'Warehouse/mechanic/repair shop' },
    { label: 'Property/office/warehouse' },
    { label: 'Station/stop/berth areas' },
    { label: 'Road area' },
    { label: 'Railway area' },
    { label: 'Terminal/port/loading point' },
    { label: 'Courtyard area' },
    { label: 'Other' }
];

const accidents = [
    { label: 'First Aid' },
    { label: 'Fire' },
    { label: 'Traffic accident' },
    { label: 'Dangerous substances' },
    { label: 'oil accident' }
];

const reporter_types = [
    { label: 'Ab Sparal Oy' },
    { label: 'ABeCeDe' },
    { label: 'Adara Pakkaus Oy' },
    { label: 'AGCO International' },
    { label: 'Agco Power Oy' }
];

export default function SafetyScreen({ route, navigation }) {
    const { userdata } = useContext(AuthContext);
    const [selectedIncidentArea, setSelectedIncidentArea] = useState(incidentAreas[0]);
    const [selectedIncidentType, setSelectedIncidentType] = useState(incidentTypes[0]);
    const [incidentAddress, setIncidentAddress] = useState({ value: '', error: '' });
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [address, setAddress] = useState({ value: '', error: '' });
    const [selectedVenue, setSelectedVenue] = useState(venues[0]);
    const [selectedAccidentType, setSelectedAccidentType] = useState(accidents[0]);
    const [venueDetail, setVenueDetail] = useState({ value: '', error: '' });
    const [intoxicated, setIntoxicated] = React.useState(0);
    const [weapon, setWeapon] = React.useState(0);
    const [aid, setAid] = React.useState(0);
    const [ambulance, setAmbulance] = React.useState(0);
    const [equipType, setequipType] = React.useState({ value: '', error: '' });
    const [fleetId, setFleetId] = React.useState({ value: '', error: '' });
    const [passengerId, setPassengerId] = React.useState({ value: '', error: '' });
    const [selectedReporterType, setSelectedReporterType] = React.useState(reporter_types[0]);
    const [name, setName] = React.useState({ value: '', error: '' });
    const [company, setCompany] = React.useState({ value: '', error: '' });
    const [description, setDescription] = useState({ value: '', error: '' });
    const [reason, setReason] = useState({ value: '', error: '' });
    const [measure, setMeasure] = useState({ value: '', error: '' });
    const [files, setFiles] = useState([]);

    const { iconName, title, path } = route.params ? route.params : { iconName: '', title: '', path: 1 };
    const [reportData, setReportData] = useState({});
    const headerTitle = path == 1 ? i18n.t('safetyObservation') : path == 2 ? i18n.t('workAccident') : i18n.t('securityBreach');

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            // Request Media Library Permissions
            const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (libraryStatus.status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
    
            // Request Camera Permissions
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
              alert('Sorry, we need camera permissions to make this work!');
            }
          }
        })();
    }, []);

    const clearFields = () => {
        setSelectedIncidentArea(incidentAreas[0]);
        setSelectedIncidentType(incidentTypes[0]);
        setIncidentAddress({ value: '', error: '' });
        setSelectedCity(cities[0]);
        setAddress({ value: '', error: '' });
        setSelectedVenue(venues[0]);
        setSelectedAccidentType(accidents[0]);
        setVenueDetail({ value: '', error: '' });
        setIntoxicated(0);
        setWeapon(0);
        setAid(0);
        setAmbulance(0);
        setequipType({ value: '', error: '' });
        setFleetId({ value: '', error: '' });
        setPassengerId({ value: '', error: '' });
        setSelectedReporterType(reporter_types[0]);
        setName({ value: '', error: '' });
        setCompany({ value: '', error: '' });
        setDescription({ value: '', error: '' });
        setReason({ value: '', error: '' });
        setMeasure({ value: '', error: '' });
        setFiles([]);
    };

    // Request permissions for both CAMERA and MEDIA_LIBRARY
    const requestPermissions = async () => {
        // Request camera permission
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            Alert.alert('Camera permission denied', 'We need camera permissions to take pictures.');
            return false;
        }

        // Request media library permission (for saving the photo)
        const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaLibraryPermission.status !== 'granted') {
            Alert.alert('Media library permission denied', 'We need media library permissions to save pictures.');
            return false;
        }

        return true;
    };

    const handleUpdate = () => {
        // if (path == 1) {
            setReportData({
                title: headerTitle,
                description: description.value,
                reason: reason.value,
                proposal: measure.value,
                entityType: path,
                clientId: userdata.userId
            });
        // } else if (path == 3) {
        //     setReportData({
                // area: {
                //     incident_area: selectedIncidentArea,
                //     incident_type: selectedIncidentType
                // },
                // location: {
                //     incidentLocation: selectedCity,
                //     address: address,
                //     city: selectedCity,
                //     venue: selectedVenue,
                //     venueDetail: venueDetail
                // },
                // details: {
                //     accidentType: selectedAccidentType,
                //     intoxicated: intoxicated,
                //     weapon: weapon,
                //     aid: aid,
                //     ambulance: ambulance,
                //     equipType: equipType,
                //     fleetId: fleetId,
                //     passengerId: passengerId,
                //     reporterType: selectedReporterType,
                //     name: name,
                //     company: company
                // },
            //     title: headerTitle,
            //     description: description.value,
            //     reason: reason.value,
            //     proposal: measure.value,
            //     entityType: path,
            //     clientId: userId
            // });
        // }
    };

    const handleSelectCity = (newData) => {
        setSelectedCity(newData);
    };
    
    const handleSelectIncidentArea = (newData) => {
        setSelectedIncidentArea(newData);
    };

    const handleSelectIncidentType = (newData) => {
        setSelectedIncidentType(newData);
    };

    const handleSelectVenue = (newData) => {
        setSelectedVenue(newData);
    };

    const handleSelectAccidentType = (newData) => {
        setSelectedAccidentType(newData);
    };
    
    const handleSelectReporterType = (newData) => {
        setSelectedReporterType(newData);
    };
    

    const validateAddress = () => {
        if (!address.value) {
            setAddress({ ...address, error: i18n.t('required') });
            return false;
        }
        setAddress({ ...address, error: '' });
        return true;
    };

    const validateDescription = () => {
        if (!description.value) {
            setDescription({ ...description, error: i18n.t('required') });
            return false;
        }

        setDescription({ ...description, error: '' });
        return true;
    };

    const validateReason = () => {
        if (!reason.value) {
            setReason({ ...reason, error: i18n.t('required') });
            return false;
        }

        setReason({ ...reason, error: '' });
        return true;
    };

    const pickFileFromLibrary = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });
    
            if (result.type !== 'cancel') {
                setFiles(prevFiles => {
                    const updatedFiles = [...prevFiles, result.assets[0]];
                    return updatedFiles;
                });
            } else {
                showToast("Error!", "Document picking was canceled.", "error");
            }
        } catch (error) {
            console.error('Error picking file:', error);
            showToast("Error!", "An error occurred while selecting a file.", "error");
        }
    };

    const removeFile = (file) => {
        setFiles(prevFiles => {
          const updatedFiles = prevFiles.filter(fl => fl.uri !== file.uri);
          
          return updatedFiles;
        });
    };

    const pickImageFromLibrary = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
    
          if (!result.cancelled && result.assets && result.assets[0].uri) {
            setFiles(prevImages => {
              const updatedImages = [...prevImages, result.assets[0].uri];
              handleUpdate(updatedImages);
              return updatedImages;
            });
          }
        } catch (error) {
          console.error('Error picking image:', error);
          Alert.alert("Error", "An error occurred while selecting an image.");
        }
    };

    const takePhoto = async () => {
        // const hasPermission = await requestPermissions();
        // if (!hasPermission) return;

        // try {
        //   const result = await ImagePicker.launchCameraAsync({
        //     allowsEditing: true,
        //     aspect: [4, 3],
        //     quality: 1,
        //   });
    
        //   if (!result.cancelled && result.assets && result.assets[0].uri) {
        //     setFiles(prevImages => {
        //       const updatedFiles = [...prevImages, result.assets[0].uri];
        //       handleUpdate(updatedFiles);
        //       return updatedFiles;
        //     });
        //   }
        // } catch (error) {
        //   console.error('Error taking photo:', error);
        //   Alert.alert("Error", "An error occurred while taking a photo.");
        // }
        navigation.navigate('CameraPreview');
        // if (cameraRef) {
        //     const photo = await cameraRef.takePictureAsync();
        //     setPhotoUri(photo.uri);

        //     if (hasMediaLibraryPermission) {
        //         // Save the photo to the media library
        //         const asset = await MediaLibrary.createAssetAsync(photo.uri);
        //         await MediaLibrary.createAlbumAsync('MyPhotos', asset, false);
        //         Alert.alert('Success', 'Photo saved to gallery!');
        //     }
        // }
    };

    const handleSend = useCallback(async () => {
        const token = userdata.token_type + ' ' + userdata.access_token;
    
        let data = {
            Title: headerTitle,
            Description: description.value,
            Reason: reason.value,
            Proposal: measure.value,
            EntityType: 1,
            ClientId: userdata.userId,
            Name: userdata.username,
            Location: address.value,
            Email: userdata.email,
            DateHappened: new Date(),
            TimeHappened: new Date(),
            Date: {
                IsAdditional: true
            },
            Time: {
                IsAdditional: true
            },
            SenderType: "Reporter",
            MetaInformation: [
                {
                    Name: userdata.username,
                    Checkable: true,
                    Language: i18n.language == 'en' ? 'english' : 'finnish',
                    Description: description.value
                }
            ],
            Devicerelated: equipType.value == "" ? false : true,
            Device: equipType.value,
            DeviceId: fleetId.value,
            Coop: equipType.value == "" ? false : true,
        };
        
        // Update the reportData state
        setReportData(data);
    
        // Use the local data object for further operations
        const serverConnected = await checkServerConnectivity();
        if (serverConnected) {
            try {
                const response = await sendDataToServer(data, token);
    
                if (!response.ok) {
                    showToast("Error!", i18n.t('serverError'), "error");
                    // Save the data locally using the data object
                    saveData(data);
                }
            } catch (error) {
                showToast("Error!", i18n.t('serverError'), "error");
                // Save the data locally using the data object
                saveData(data);
            }
        } else {
            showToast("Error!", i18n.t('serverError'), "error");
            // Save the data locally using the data object
            saveData(data);
        }
    
        clearFields();
        navigation.navigate('SuccessMessageScreen');
    }, [headerTitle, description, reason, measure, userdata, navigation]);

    // function toggleCameraType() {
    //     setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    //   }

    return (
        <ParallaxScrollView>
            <ContentHeader title={ headerTitle } id="12345789" date={ new Date() } />
            { path == 3 ? 
                <Card style={styles.container}>
                    <Card.Content>
                        <ThemedText style={[styles.groupTitle, { marginBottom: 15 }]}>Area and type</ThemedText>
                        <ThemedView style={{ marginBottom: 15 }}>
                            <SelectDropdown
                                    search={true}
                                    searchPlaceHolder="Select an incident area"
                                    data={incidentAreas}
                                    onSelect={(selectedItem) => {handleSelectIncidentArea(selectedItem); }}
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {selectedItem ? selectedItem.label : selectedIncidentArea.label}
                                                </Text>
                                                {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View
                                                style={{
                                                    ...styles.dropdownItemStyle,
                                                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                                }}
                                            >
                                                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={[styles.dropdownMenuStyle]}
                            />
                        </ThemedView>
                        <ThemedView>
                            <SelectDropdown
                                search={true}
                                searchPlaceHolder="Select an incident type"
                                data={incidentTypes}
                                onSelect={(selectedItem) => {handleSelectIncidentType(selectedItem); }}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                {selectedItem ? selectedItem.label : selectedIncidentType.label}
                                            </Text>
                                            {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View
                                            style={{
                                                ...styles.dropdownItemStyle,
                                                ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                            }}
                                        >
                                            <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.dropdownMenuStyle}
                            />
                        </ThemedView>
                    </Card.Content>
                </Card> 
                : null
            }
            {
                path == 3 ? 
                    <Card style={styles.container}>
                        <Card.Content>
                            <ThemedView>
                                <ThemedText style={[styles.groupTitle, { marginBottom: 5 }]}>{i18n.t('location')}</ThemedText>
                                <SelectDropdown
                                    search={true}
                                    searchPlaceHolder="Select a location of the incident"
                                    data={cities}
                                    onSelect={(selectedItem) => {handleSelectCity(selectedItem); } }
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {selectedItem ? selectedItem.label : selectedCity.label}
                                                </Text>
                                                {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View
                                                style={{
                                                    ...styles.dropdownItemStyle,
                                                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                                }}
                                            >
                                                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />
                                <TextInput
                                    label="Address of the incident"
                                    returnKeyType="next"
                                    value={incidentAddress.value}
                                    onChangeText={(text) => { setIncidentAddress({ value: text, error: '' });  }}
                                />
                                <ThemedView style={{ marginBottom: 15 }}>
                                    <SelectDropdown
                                        search={true}
                                        searchPlaceHolder="Select a City"
                                        data={cities}
                                        onSelect={(selectedItem) => {handleSelectCity(selectedItem); }}
                                        renderButton={(selectedItem, isOpened) => {
                                            return (
                                            <View style={styles.dropdownButtonStyle}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                {selectedItem ? selectedItem.label : selectedCity.label}
                                                </Text>
                                                {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                            </View>
                                            );
                                        }}
                                        renderItem={(item, index, isSelected) => {
                                            return (
                                            <View
                                                style={{
                                                ...styles.dropdownItemStyle,
                                                ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                                }}
                                            >
                                                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                            </View>
                                            );
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        dropdownStyle={styles.dropdownMenuStyle}
                                    />
                                </ThemedView>
                                <SelectDropdown
                                    search={true}
                                    searchPlaceHolder="Select a Venue"
                                    data={venues}
                                    onSelect={(selectedItem) => {handleSelectVenue(selectedItem); }}
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                            {selectedItem ? selectedItem.label : selectedVenue.label}
                                            </Text>
                                            {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                        </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                        <View
                                            style={{
                                            ...styles.dropdownItemStyle,
                                            ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                            }}
                                        >
                                            <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                        </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />
                                <TextInput
                                    label="Details of the venue"
                                    returnKeyType="next"
                                    value={venueDetail.value}
                                    onChangeText={(text) => { setVenueDetail({ value: text, error: '' });  }}
                                />
                            </ThemedView>
                            <ThemedView>
                                <ThemedText style={[styles.groupTitle, { marginBottom: 15 }]}>Incident details</ThemedText>
                                <SelectDropdown
                                    search={true}
                                    searchPlaceHolder="Select a accident type"
                                    data={accidents}
                                    onSelect={(selectedItem) => {handleSelectAccidentType(selectedItem);; }}
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {selectedItem ? selectedItem.label : selectedAccidentType.label}
                                                </Text>
                                                {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View
                                                style={{
                                                    ...styles.dropdownItemStyle,
                                                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                                }}
                                            >
                                                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />
                                <ThemedView>
                                    <ThemedText style={styles.subGroupTitle}>Customer was intoxicated</ThemedText>
                                    <RadioButton.Group onValueChange={value => { setIntoxicated(value); }} value={intoxicated}>
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setIntoxicated(0)}>
                                            <RadioButton value={0} color={theme.colors.secondary} />
                                            <Text>No</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setIntoxicated(1)}>
                                            <RadioButton value={1} color={theme.colors.secondary} />
                                            <Text>Yes</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setIntoxicated(2)}>
                                            <RadioButton value={2} color={theme.colors.secondary} />
                                            <Text>Unable to define</Text>
                                        </TouchableOpacity>
                                    </RadioButton.Group>
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText style={styles.subGroupTitle}>Customer had weapon or weapons</ThemedText>
                                    <RadioButton.Group onValueChange={value => {setWeapon(value); }} value={weapon}>
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setWeapon(0)}>
                                            <RadioButton value={0} color={theme.colors.secondary} />
                                            <Text>No</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setWeapon(1)}>
                                            <RadioButton value={1} color={theme.colors.secondary} />
                                            <Text>Yes</Text>
                                        </TouchableOpacity>
                                    </RadioButton.Group>
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText style={styles.subGroupTitle}>Customer was given first-aid by personal</ThemedText>
                                    <RadioButton.Group onValueChange={value => {setAid(value); }} value={aid}>
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setAid(0)}>
                                            <RadioButton value={0} color={theme.colors.secondary} />
                                            <Text>No</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setAid(1)}>
                                            <RadioButton value={1} color={theme.colors.secondary} />
                                            <Text>Yes</Text>
                                        </TouchableOpacity>
                                    </RadioButton.Group>
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText style={styles.subGroupTitle}>Ambulance or police was needed</ThemedText>
                                    <RadioButton.Group onValueChange={value => {setAmbulance(value); }} value={ambulance}>
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setAmbulance(0)}>
                                            <RadioButton value={0} color={theme.colors.secondary} />
                                            <Text>No</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.radioContainer} onPress={() => setAmbulance(1)}>
                                            <RadioButton value={1} color={theme.colors.secondary} />
                                            <Text>Yes</Text>
                                        </TouchableOpacity>
                                    </RadioButton.Group>
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText style={styles.groupTitle}>Equipment details</ThemedText>
                                    <TextInput
                                        label="Type of equipment"
                                        returnKeyType="next"
                                        value={equipType.value}
                                        onChangeText={(text) => { 
                                            setequipType({ value: text, error: '' });
                                            
                                        }}
                                    />
                                    <TextInput
                                        label="Fleet identification number"
                                        returnKeyType="next"
                                        value={fleetId.value}
                                        onChangeText={(text) => { 
                                            setFleetId({ value: text, error: '' });
                                            
                                        }}
                                    />
                                    <TextInput
                                        label="Passenger train ID"
                                        returnKeyType="next"
                                        value={passengerId.value}
                                        onChangeText={(text) => { 
                                            setPassengerId({ value: text, error: '' });
                                            
                                        }}
                                    />
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText style={styles.groupTitle}>Reporter information</ThemedText>
                                    <SelectDropdown
                                    search={true}
                                    searchPlaceHolder="Select a reporter type"
                                    data={reporter_types}
                                    onSelect={(selectedItem) => handleSelectReporterType(selectedItem)}
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {selectedItem ? selectedItem.label : selectedReporterType.label}
                                                </Text>
                                                {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View
                                                style={{
                                                    ...styles.dropdownItemStyle,
                                                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                                }}
                                            >
                                                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />
                                <TextInput
                                    label="Full name"
                                    returnKeyType="next"
                                    value={name.value}
                                    onChangeText={(text) => { 
                                        setName({ value: text, error: '' });
                                        
                                    }}
                                />
                                <TextInput
                                    label="Company"
                                    returnKeyType="next"
                                    value={company.value}
                                    onChangeText={(text) => { 
                                        setCompany({ value: text, error: '' });
                                        
                                    }}
                                />
                                </ThemedView>
                            </ThemedView>
                        </Card.Content>
                    </Card> : 
                    <Card style={styles.container}>
                    <Card.Content>
                        <ThemedView>
                            <ThemedText style={[styles.groupTitle, { marginBottom: 5 }]}>{i18n.t('location')}</ThemedText>
                            {/* <SelectDropdown
                                search={true}
                                searchPlaceHolder="Select a City"
                                data={cities}
                                onSelect={(selectedItem) => {handleSelectCity(selectedItem); }}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                {selectedItem ? selectedItem.label : selectedCity.label}
                                            </Text>
                                            {isOpened ? <ExpoIcon name="chevron-up" iconSet="Entypo" color="black"/> : <ExpoIcon name="chevron-down" iconSet="Entypo" color="black"/>}
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View
                                            style={{
                                                ...styles.dropdownItemStyle,
                                                ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                            }}
                                        >
                                            <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.dropdownMenuStyle}
                            /> */}
                            <TextInput
                                label={i18n.t('address')}
                                returnKeyType="next"
                                value={address.value}
                                onChangeText={(text) => { 
                                    setAddress({ value: text, error: '' });
                                }}
                                error={!!address.error}
                                errorText={address.error}
                                onBlur={validateAddress}
                            />
                        </ThemedView>
                    </Card.Content>
                </Card>
            }
            <Card style={styles.container}>
                <Card.Content>
                    <ThemedView>
                        <ThemedText style={styles.groupTitle}>{i18n.t('otherDetail')}</ThemedText>
                        <TextInput
                            label={i18n.t("description")}
                            multiline={true}
                            value={description.value}
                            onChangeText={
                                (text) => { 
                                    setDescription({value: text, error: ''}); 
                                }
                            }
                            error={!!description.error}
                            errorText={description.error}
                            onBlur={validateDescription}
                            style={{ height: 100 }}
                        />
                        <TextInput
                            label={i18n.t('reasons')}
                            multiline={true}
                            value={reason.value}
                            onChangeText={
                                (text) => { 
                                    setReason({value: text, error: ''}); 
                                }
                            }
                            error={!!reason.error}
                            errorText={reason.error}
                            onBlur={validateReason}
                        />
                        <TextInput
                            label={i18n.t('measures')}
                            multiline={true}
                            value={measure.value}
                            onChangeText={
                                (text) => { 
                                    setMeasure({value: text, error: ''}); 
                                }
                            }
                        />
                    </ThemedView>
                    <ThemedView>
                        <ThemedText style={styles.groupTitle}>{i18n.t('attachments')}</ThemedText>
                        {/* <Button style={styles.button} onPress={pickFileFromLibrary}>
                            <ExpoIcon name="upload" iconSet="Octicons" size={24} color={theme.colors.primary} />
                            <Text style={styles.buttonText}>{i18n.t('file')}</Text>
                        </Button> */}
                        {/* <Button style={styles.button} onPress={pickImageFromLibrary}>
                            <ExpoIcon name="upload" iconSet="Octicons" size={24} color={theme.colors.primary} />
                            <Text style={styles.buttonText}> {i18n.t('file')}</Text>
                        </Button> */}
                        <Button style={styles.button} onPress={takePhoto}>
                            <ExpoIcon name="camera" iconSet="Feather" size={24} color={theme.colors.primary} />
                            <Text style={styles.buttonText}> {i18n.t('camera')}</Text>
                        </Button>
                        {files.map((file, index) => (
                            <SelectedFile key={index} filename={file.name} onDelete={() => removeFile(file)}/>
                        ))}
                    </ThemedView>
                    <ThemedView>
                        <Button style={{ backgroundColor: theme.colors.primary, color: '#FFFFFF', borderRadius: 1 }} onPress={() => handleSend()}>
                            <Text style={{ color: '#FFFFFF' }}>{i18n.t('send')}</Text>
                        </Button>
                    </ThemedView>
                </Card.Content>
            </Card>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    languageContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center', 
        paddingRight: 10, 
    },
    
    dropdownButtonStyle: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        borderWidth: 1, 
        borderColor: '#D3D3D3',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: '#151E26',
    },
    
    dropdownMenuStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D3D3D3',
    },
    
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: '#151E26',
    },
    button: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 1,
        backgroundColor: '#F6F9FE'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600'
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1E20',
    }, 
    subGroupTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1D1E20'
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: -3
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    cambutton: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});