// src/screens/CustomizeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';

export default function CustomizeScreen({ route, navigation }) {
  const { images = [], sourceUrl = '' } = route.params || {};
  
  const [collectionName, setCollectionName] = useState('');
  const [frequency, setFrequency] = useState('Every week');
  const [rotationType, setRotationType] = useState('Shuffle');
  const [location, setLocation] = useState('Home Screen');

  const frequencyOptions = ['Every day', 'Every week', 'Every month', 'Custom'];
  const rotationOptions = ['Shuffle', 'Sequential', 'Random'];
  const locationOptions = ['Home Screen', 'Lock Screen', 'Both'];

  const renderOption = (option, selectedValue, onSelect) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.optionButton,
        selectedValue === option && styles.optionButtonSelected
      ]}
      onPress={() => onSelect(option)}
      activeOpacity={0.7}
    >
      <View style={styles.optionContent}>
        {/* Checkmark for selected option */}
        {selectedValue === option && (
          <Text style={styles.checkmark}>✓</Text>
        )}
        <Text style={[
          styles.optionText,
          selectedValue === option && styles.optionTextSelected
        ]}>
          {option}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleNext = () => {
    // Use generic name if user didn't provide one
    const finalCollectionName = collectionName.trim() || 'My Collection';
    
    navigation.navigate('Preview', {
      images,
      sourceUrl,
      settings: {
        collectionName: finalCollectionName,
        frequency,
        rotationType,
        location,
      }
    });
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
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
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

              <Text style={styles.logo}>🌸</Text>
              <Text style={styles.title}>Make it yours</Text>
            </View>

            {/* Collection Name */}
            <View style={styles.section}>
              <Text style={styles.label}>Give it a name you'll recognize later</Text>
              <TextInput
                style={styles.input}
                value={collectionName}
                onChangeText={setCollectionName}
                placeholder="e.g., Travel Dreams, Daily Motivation..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
              />
            </View>

            {/* Frequency */}
            <View style={styles.section}>
              <Text style={styles.label}>How often should we change your wallpaper?</Text>
              <View style={styles.optionsContainer}>
                {frequencyOptions.map(option => 
                  renderOption(option, frequency, setFrequency)
                )}
              </View>
            </View>

            {/* Rotation Type */}
            <View style={styles.section}>
              <Text style={styles.label}>Choose how wallpapers rotate</Text>
              <View style={styles.optionsContainer}>
                {rotationOptions.map(option => 
                  renderOption(option, rotationType, setRotationType)
                )}
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.label}>Choose where this collection appears</Text>
              <View style={styles.optionsContainer}>
                {locationOptions.map(option => 
                  renderOption(option, location, setLocation)
                )}
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Fixed Bottom Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  safeArea: { 
    flex: 1,
  },
  backgroundImage: {  
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backIcon: {
    fontSize: 20,
    color: '#ffffff',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'NeueMontreal',
  },
  logo: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'Recoleta',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    fontFamily: 'NeueMontreal',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a2e',
    fontFamily: 'NeueMontreal',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionButtonSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkmark: {
    fontSize: 16,
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'NeueMontreal',
  },
  optionTextSelected: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  bottomSection: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  nextButton: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    fontFamily: 'NeueMontreal',
  },
});