// src/components/CreateCollectionModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { pinterestAPI } from '../services/api';

export default function CreateCollectionModal({ visible, onClose, navigation }) {
  const [pinterestUrl, setPinterestUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidPinterestUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('pinterest.com') || urlObj.hostname.includes('pin.it');
    } catch {
      return false;
    }
  };

  const handlePinterestSubmit = async () => {
    if (!pinterestUrl.trim()) {
      Alert.alert('Error', 'Please enter a Pinterest board URL');
      return;
    }

    // Validate URL format
    if (!isValidPinterestUrl(pinterestUrl.trim())) {
      Alert.alert('Invalid URL', 'Please enter a valid Pinterest board URL');
      return;
    }

    setLoading(true);
    
    try {
      // Fetch images from Pinterest via backend
      const data = await pinterestAPI.scrapeBoard(pinterestUrl.trim());
      
      if (!data.images || data.images.length === 0) {
        Alert.alert('No Images Found', 'Could not find any images on this Pinterest board');
        setLoading(false);
        return;
      }

      // Close modal and navigate with fetched images
      onClose();
      setPinterestUrl(''); // Reset input
      navigation.navigate('Collection', { 
        sourceUrl: pinterestUrl.trim(),
        images: data.images
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch Pinterest board');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access photos is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUris = result.assets.map(asset => asset.uri);
      
      onClose();
      navigation.navigate('Collection', { 
        images: imageUris,
        sourceUrl: 'uploaded'
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create a new collection</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Pinterest Board Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            activeOpacity={1}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.iconEmoji}>📌</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Use a Pinterest board</Text>
              <Text style={styles.optionDescription}>
                Turn your Pinterest vision board into your daily motivation
              </Text>
              <TextInput
                style={styles.urlInput}
                placeholder="Paste your board link here"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={pinterestUrl}
                onChangeText={setPinterestUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="go"
                onSubmitEditing={handlePinterestSubmit}
                editable={!loading}
              />
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#666" />
                  <Text style={styles.loadingText}>Fetching images...</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Upload Images Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            activeOpacity={0.7}
            onPress={handleFileUpload}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.iconEmoji}>🖼️</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Upload images</Text>
              <Text style={styles.optionDescription}>
                Choose photos, art, or screenshots you want to use as wallpapers
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Recoleta',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '300',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    gap: 16,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 100, 100, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'NeueMontreal',
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'NeueMontreal',
  },
  urlInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    fontFamily: 'NeueMontreal',
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'NeueMontreal',
  },
});