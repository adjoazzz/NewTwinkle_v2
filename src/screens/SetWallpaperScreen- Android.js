// src/screens/SetWallpaperScreen.js - WITH TOAST NOTIFICATIONS

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native';
import { WallpaperService } from '../services/wallpaperService';

export default function SetWallpaperScreen({ navigation, route }) {
  const { imageUri, collectionName } = route.params || {};
  const [setting, setSetting] = useState(false);

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    }
  };

  const setWallpaper = async (type) => {
    // First, ask for confirmation
    Alert.alert(
      '🌸 Set Wallpaper?',
      `This will change your ${type === 'home' ? 'Home Screen' : type === 'lock' ? 'Lock Screen' : 'Home and Lock Screen'} wallpaper. Continue?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Set Wallpaper',
          onPress: async () => {
            try {
              setSetting(true);
              
              showToast('Setting wallpaper...');

              await WallpaperService.setWallpaper(imageUri, type);

              // Success toast
              const successMessage = type === 'home' 
                ? '✅ Home Screen wallpaper updated!' 
                : type === 'lock' 
                ? '✅ Lock Screen wallpaper updated!' 
                : '✅ Wallpapers updated!';
              
              showToast(successMessage);

              // Also show an alert
              Alert.alert(
                '✅ Success!',
                `Your wallpaper has been set successfully!`,
                [
                  { 
                    text: 'Great!', 
                    onPress: () => navigation.goBack() 
                  }
                ]
              );

              setSetting(false);
            } catch (error) {
              console.error('Error setting wallpaper:', error);
              
              // Error toast
              showToast('❌ Failed to set wallpaper');
              
              Alert.alert(
                'Error', 
                `Failed to set wallpaper: ${error.message}`
              );
              setSetting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={setting}
            >
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.emoji}>🌸</Text>
            <Text style={styles.title}>Set as Wallpaper</Text>
            {collectionName && (
              <Text style={styles.collectionName}>From: {collectionName}</Text>
            )}
          </View>

          {/* Image Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.phonePreview}>
              <Image 
                source={{ uri: imageUri }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {setting && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Setting wallpaper...</Text>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, setting && styles.buttonDisabled]}
              onPress={() => setWallpaper('home')}
              disabled={setting}
            >
              <Text style={styles.primaryButtonText}>
                🏠 Set as Home Screen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, setting && styles.buttonDisabled]}
              onPress={() => setWallpaper('lock')}
              disabled={setting}
            >
              <Text style={styles.secondaryButtonText}>
                🔒 Set as Lock Screen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.tertiaryButton, setting && styles.buttonDisabled]}
              onPress={() => setWallpaper('both')}
              disabled={setting}
            >
              <Text style={styles.tertiaryButtonText}>
                📱 Set for Both Screens
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              ✨ Wallpaper will be set automatically
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'NeueMontreal',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
    fontFamily: 'Recoleta',
    marginBottom: 8,
  },
  collectionName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'NeueMontreal',
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  phonePreview: {
    width: 200,
    aspectRatio: 0.47,
    backgroundColor: '#000',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'NeueMontreal',
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 20,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'NeueMontreal',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'NeueMontreal',
  },
  tertiaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'NeueMontreal',
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: 'NeueMontreal',
  },
});