// src/screens/PinterestInputScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { pinterestAPI } from '../services/api';  

export default function PinterestInputScreen({ navigation }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a Pinterest URL');
      return;
    }

    if (!url.includes('pinterest.com') && !url.includes('pin.it')) {
      Alert.alert('Error', 'Please enter a valid Pinterest URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await pinterestAPI.scrapeBoard(url, 20);
      
      if (data.images && data.images.length > 0) {
        navigation.navigate('Collection', { 
          images: data.images,
          sourceUrl: url 
        });
      } else {
        Alert.alert('No Images Found', 'Could not find any images from this Pinterest board.');
      }
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message || 'Failed to fetch images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>📌</Text>
          <Text style={styles.title}>Use a Pinterest board</Text>
          <Text style={styles.subtitle}>
            Paste your Pinterest board link below
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="https://pinterest.com/..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            editable={!loading}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a2e" />
            ) : (
              <Text style={styles.submitButtonText}>Fetch Images</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Helper Text */}
        <View style={styles.helper}>
          <Text style={styles.helperTitle}>💡 How to get your board link:</Text>
          <Text style={styles.helperText}>
            1. Open Pinterest app or website{'\n'}
            2. Go to your board{'\n'}
            3. Tap the share icon{'\n'}
            4. Copy the link and paste here
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backIcon: {
    fontSize: 20,
    color: '#ffffff',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputSection: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  helper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  helperTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
  },
});