// src/screens/PreviewScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PreviewScreen({ navigation, route }) {
  const { images = [], settings = {} } = route.params || {};
  const [selectedView, setSelectedView] = useState('lock');

  // For demo purposes, using first two images or placeholders
  const lockScreenImage = images[0] || null;
  const homeScreenImage = images[1] || images[0] || null;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // Create new collection object with all the data
    const newCollection = {
      id: Date.now().toString(), // Simple ID generation
      name: settings.collectionName || 'My Collection',
      images: images,
      frequency: settings.frequency || 'Every week',
      location: settings.location || 'Home Screen',
      rotation: settings.rotationType || 'Shuffle',
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    // Navigate to CollectionsOverview and pass the new collection
    navigation.navigate('CollectionsOverview', {
      newCollection,
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
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.backIcon}>←</Text>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.emoji}>🌸</Text>
              <Text style={styles.title}>See how it looks</Text>
            </View>

            {/* Preview Cards */}
            <View style={styles.previewContainer}>
              <View style={styles.previewRow}>
                {/* Lock Screen Preview */}
                <View style={styles.previewCard}>
                  <View style={styles.phonePreview}>
                    {lockScreenImage ? (
                      <Image 
                        source={{ uri: lockScreenImage }} 
                        style={styles.previewImageFill}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderPreview}>
                        <Text style={styles.placeholderText}>No image</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.optionSelector}
                    onPress={() => setSelectedView('lock')}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.radioButton,
                      selectedView === 'lock' && styles.radioButtonSelected
                    ]}>
                      {selectedView === 'lock' && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text style={styles.optionLabel}>Lock Screen</Text>
                  </TouchableOpacity>
                </View>

                {/* Home Screen Preview */}
                <View style={styles.previewCard}>
                  <View style={styles.phonePreview}>
                    {homeScreenImage ? (
                      <Image 
                        source={{ uri: homeScreenImage }} 
                        style={styles.previewImageFill}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderPreview}>
                        <Text style={styles.placeholderText}>No image</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.optionSelector}
                    onPress={() => setSelectedView('home')}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.radioButton,
                      selectedView === 'home' && styles.radioButtonSelected
                    ]}>
                      {selectedView === 'home' && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text style={styles.optionLabel}>Home Screen</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.spacer} />

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
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
  },
  previewContainer: {
    marginTop: 20,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  previewCard: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  phonePreview: {
    width: '100%',
    aspectRatio: 0.47,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  previewImageFill: {
    width: '100%',
    height: '100%',
  },
  placeholderPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'NeueMontreal',
  },
  optionSelector: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  optionLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'NeueMontreal',
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'NeueMontreal',
  },
});