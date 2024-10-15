import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function TabOneScreen() {
  const [folderName, setFolderName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [upload,setUpload] = useState<string>('')

  // Handle folder name input change
  const handleFolderNameChange = (value: string) => {
    setFolderName(value);
  };

  // Handle file selection using expo-document-picker
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});

      if (!result.canceled) {
        setSelectedFile(result);  // Set the file if not canceled
      } else {
        setSelectedFile(null);  // Clear state if no file was selected
        console.log('File selection canceled');
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!folderName || !selectedFile || selectedFile.canceled) {
      Alert.alert('Please enter a folder name and select a file.');
      return;
    }

    // Extracting the first file in case multiple files were selected
    const file = selectedFile.assets ? selectedFile.assets[0] : null;
    if (!file) {
      Alert.alert('No valid file selected.');
      return;
    }

    // Creating FormData for file upload
    const formData = new FormData();
    formData.append('folderName', folderName);

    // Append the file details to FormData
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/octet-stream', // Default if mimeType is not available
    } as any); // 'as any' to bypass stricter typing in FormData
    setUpload("Uploading......")
    try {
      const ESP32_SERVER_URL = 'http://192.168.0.101/upload'
      
      // Send the data to ESP32 server
      const response = await axios.post(ESP32_SERVER_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUpload(`Uploaded ${file.name} SuccessFully `)
      Alert.alert(`${file.name} Uploaded successfully ✅✅`)
      setUpload("")
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File Upload</Text>
      <TextInput
        style={styles.input}
        value={folderName}
        onChangeText={handleFolderNameChange}
        placeholder="Enter folder name"
      />
      <Button title="Select File" onPress={pickFile} />
      {selectedFile && selectedFile.assets && (
        <Text style={styles.fileText}>Selected File: {selectedFile.assets[0].name}</Text>
      )}
      <Button title="Upload" onPress={handleSubmit} />

      <View>
        <Text>{upload}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    padding: 10,
  },
  fileText: {
    marginVertical: 10,
  },
});
