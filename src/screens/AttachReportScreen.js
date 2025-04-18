import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import IconButton from "../components/IconButton";
import ExpoIcon from '../components/ExpoIcon';

const AttachReportScreen = ({ onUpdate }) => {
  const [images, setImages] = useState([]);

  const handleUpdate = (updatedImages) => {
    onUpdate({
      images: updatedImages
    });
  };

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

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages(prevImages => {
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
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets[0].uri) {
        setImages(prevImages => {
          const updatedImages = [...prevImages, result.assets[0].uri];
          handleUpdate(updatedImages);
          return updatedImages;
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert("Error", "An error occurred while taking a photo.");
    }
  };

  const removeImage = (uri) => {
    setImages(prevImages => {
      const updatedImages = prevImages.filter(imageUri => imageUri !== uri);
      handleUpdate(updatedImages);
      return updatedImages;
    });
  };

  return (
    <Card style={styles.container}>
      <Card.Title title="Attachments" titleStyle={styles.title} />
      <Card.Content>
        <ThemedView>
          <Text> Add necessary attachments (Mandatory) </Text>
        </ThemedView>

        <View style={styles.imageGrid}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => removeImage(imageUri)}
              >
                <ExpoIcon name="times" iconSet="FontAwesome" size={10} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <ThemedView style={styles.iconAlign}>
          <IconButton
            iconName="upload"
            title="Add an attachment from library"
            onPress={pickImageFromLibrary}
            width="100%"
            borderStyle="dashed"
          />
          <IconButton
            iconName="camera"
            title="Take a photo"
            onPress={takePhoto}
            width="100%"
            borderStyle="dashed"
          />
        </ThemedView>
      </Card.Content>
    </Card>
  );
};

export default AttachReportScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    width: '30%',
    padding: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  cancelButton: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  iconAlign: {
    alignItems: 'center',
    marginTop: 10,
  },
});
