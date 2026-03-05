// src/screens/WallpaperDebugScreen.js
// Add this screen to test if everything is working

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  NativeModules,
  Platform,
} from 'react-native';

export default function WallpaperDebugScreen() {
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, result, isSuccess) => {
    setTestResults(prev => [...prev, { test, result, isSuccess }]);
  };

  const runAllTests = () => {
    setTestResults([]);
    
    // Test 1: Check Platform
    addResult(
      'Platform Check',
      `Running on: ${Platform.OS}`,
      Platform.OS === 'android'
    );

    // Test 2: Check if NativeModules exists
    addResult(
      'NativeModules Available',
      NativeModules ? 'Yes' : 'No',
      !!NativeModules
    );

    // Test 3: Check if WallpaperManager exists
    const hasWallpaperManager = !!NativeModules.WallpaperManager;
    addResult(
      'WallpaperManager Module',
      hasWallpaperManager ? '✅ FOUND' : '❌ NOT FOUND',
      hasWallpaperManager
    );

    // Test 4: List all available native modules
    const moduleNames = Object.keys(NativeModules).sort();
    addResult(
      'Available Native Modules',
      `${moduleNames.length} modules found: ${moduleNames.slice(0, 5).join(', ')}...`,
      true
    );

    // Test 5: Check WallpaperManager methods
    if (NativeModules.WallpaperManager) {
      const methods = Object.keys(NativeModules.WallpaperManager);
      addResult(
        'WallpaperManager Methods',
        methods.length > 0 ? `Found: ${methods.join(', ')}` : 'No methods found',
        methods.length > 0
      );
    }
  };

  const testSetWallpaper = async () => {
    if (!NativeModules.WallpaperManager) {
      Alert.alert('Error', 'WallpaperManager module not found! Did you rebuild the app?');
      return;
    }

    try {
      // Test with a solid color image URL
      const testImageUrl = 'https://via.placeholder.com/1080x1920/FF69B4/FFFFFF?text=Test+Wallpaper';
      
      Alert.alert('Testing...', 'Attempting to set test wallpaper');

      await NativeModules.WallpaperManager.setWallpaper(testImageUrl, 'home');
      
      Alert.alert('✅ Success!', 'Test wallpaper set successfully! Check your home screen.');
    } catch (error) {
      Alert.alert('❌ Error', `Failed to set wallpaper: ${error.message}`);
      console.error('Wallpaper test error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>🔍 Wallpaper Module Debug</Text>

        <TouchableOpacity style={styles.button} onPress={runAllTests}>
          <Text style={styles.buttonText}>Run Diagnostics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testSetWallpaper}>
          <Text style={styles.buttonText}>Test Set Wallpaper</Text>
        </TouchableOpacity>

        <View style={styles.resultsContainer}>
          {testResults.map((item, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultTest}>{item.test}</Text>
              <Text style={[
                styles.resultText,
                { color: item.isSuccess ? '#4CAF50' : '#F44336' }
              ]}>
                {item.result}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📋 Checklist:</Text>
          <Text style={styles.infoText}>
            ✅ WallpaperModule.kt added{'\n'}
            ✅ WallpaperPackage.kt added{'\n'}
            ✅ MainApplication.kt updated{'\n'}
            ✅ AndroidManifest.xml updated{'\n'}
            ✅ App rebuilt with EAS Build{'\n'}
            ✅ New APK installed on device
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTest: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1976D2',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});