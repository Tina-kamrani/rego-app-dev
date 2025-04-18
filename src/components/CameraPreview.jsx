import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const MediaOptionsModal = ({ visible, onClose, launchCamera, launchGallery }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Mitä haluat tehdä?</Text>
          <Text style={styles.subtitle}>Huom! Liitettävän videon maksimipituus on 20 sekuntia.</Text>
          
          <TouchableOpacity onPress={() => { launchCamera('photo'); onClose(); }}><Text style={styles.option}>📷 Ota kuva</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { launchCamera('video'); onClose(); }}><Text style={styles.option}>🎥 Ota video</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { launchGallery('photo'); onClose(); }}><Text style={styles.option}>🖼️ Lisää kuva galleriasta</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { launchGallery('video'); onClose(); }}><Text style={styles.option}>📂 Lisää video galleriasta</Text></TouchableOpacity>
          <TouchableOpacity onPress={onClose}><Text style={[styles.option, { color: 'red' }]}>❌ Peruuta</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default function CameraPreview({ route, navigation }) {
  const path = route.params.path;
  const title = route.params.title;

  const [modalVisible, setModalVisible] = useState(false);

  const showMediaOptions = () => setModalVisible(true);


  useEffect(() => {
    showMediaOptions();
  }, []); 

  const launchCamera = async (type) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        navigation.goBack();
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes:
          type === 'video'
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true,
        videoMaxDuration: type === 'video' ? 15 : undefined, // Restrict videos to 15 seconds
      });

      handleMediaResult(result, type);
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Failed to launch camera.');
    }
  };

  const launchGallery = async (type) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery access permission is required.');
        navigation.goBack();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === 'video'
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      handleMediaResult(result, type);
    } catch (error) {
      console.error('Gallery Error:', error);
      Alert.alert('Error', 'Failed to open gallery.');
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    navigation.goBack();
  }

  const handleMediaResult = async (result, type) => {
    if (result.canceled) {
      console.log('User cancelled selection');
      navigation.goBack();
      return;
    }

    if (result.assets && result.assets[0]) {
      const media = result.assets[0];

      if (type === 'video' && media.duration && media.duration > 15000) {
        Alert.alert('Error', 'Video must be 15 seconds or less.');
        navigation.goBack();
        return;
      }

      const timestamp = new Date().getTime();
      const fileExtension = type === 'video' ? 'mp4' : 'jpg';
      const filename = `media_${timestamp}.${fileExtension}`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      try {
        await FileSystem.copyAsync({
          from: media.uri,
          to: fileUri,
        });

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          throw new Error('File save failed');
        }

        console.log('File saved successfully:', fileInfo);

        let navigationUrl = 'SafetyFindingScreen';
        if (path === 3) {
          navigationUrl = 'ReportDangerScreen';
        } else if (path === 5) {
          navigationUrl = 'SecurityBreachScreen';
        }

        navigation.replace(navigationUrl, {
          uri: fileUri,
          path: path,
          title: title,
          file: media.base64 ? `data:${media.mimeType};base64,${media.base64}` : undefined,
          filename: filename,
          timestamp: timestamp,
          fileSize: fileInfo.size,
          mimeType: media.mimeType || (type === 'video' ? 'video/mp4' : 'image/jpeg'),
          duration: type === 'video' ? media.duration : undefined,
        });
      } catch (error) {
        console.error('File Save Error:', error);
        Alert.alert('Error', 'Failed to save the file.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.loadingText}>Opening...</Text>
      <MediaOptionsModal
        visible={modalVisible}
        onClose={handleClose}
        launchCamera={launchCamera}
        launchGallery={launchGallery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '85%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 15 },
  option: { paddingVertical: 10, fontSize: 16 }
});
