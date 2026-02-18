// src/screens/CollectionsOverviewScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  Image,
  Switch,
} from 'react-native';
import CreateCollectionModal from '../components/CreateCollectionModal';

export default function CollectionsOverviewScreen({ navigation, route }) {
  const { newCollection } = route.params || {};
  
  // Initialize with empty array or load from storage later
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // If a new collection was passed, add it to the list
    if (newCollection) {
      setCollections(prevCollections => {
        // Disable all previous collections (only one can be active at a time)
        const updatedPrevCollections = prevCollections.map(col => ({
          ...col,
          enabled: false  // Auto-disable old collections when new one is added
        }));
        
        // Add the new collection (enabled by default)
        return [...updatedPrevCollections, newCollection];
      });
    }
  }, [newCollection]);

  const toggleCollection = (id) => {
    setCollections(collections.map(col => 
      col.id === id ? { ...col, enabled: !col.enabled } : col
    ));
  };

  const handleAddNew = () => {
    setShowModal(true);
  };

  const formatFrequency = (frequency) => {
    // Convert "Every week" to "Weekly", etc.
    const mapping = {
      'Every day': 'Daily',
      'Every week': 'Weekly',
      'Every month': 'Monthly',
    };
    return mapping[frequency] || frequency;
  };

  const renderCollection = (collection) => (
    <View 
      key={collection.id} 
      style={[
        styles.collectionCard,
        !collection.enabled && styles.collectionCardDisabled
      ]}
    >
      {/* Image Grid */}
      <View style={styles.imageGrid}>
        {collection.images.slice(0, 4).map((imageUri, index) => (
          <View
            key={index}
            style={[
              styles.imageCell,
              index === 0 && styles.imageCellFirst,
              index === Math.min(collection.images.length, 4) - 1 && styles.imageCellLast,
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.cellImage}
              resizeMode="cover"
            />
          </View>
        ))}
        {/* If less than 4 images, fill remaining slots */}
        {collection.images.length < 4 && 
          [...Array(4 - collection.images.length)].map((_, index) => (
            <View
              key={`empty-${index}`}
              style={[
                styles.imageCell,
                styles.emptyCell,
                collection.images.length + index === 3 && styles.imageCellLast,
              ]}
            />
          ))
        }
      </View>

      {/* Collection Info */}
      <View style={styles.collectionInfo}>
        <View style={styles.collectionHeader}>
          <Text style={styles.collectionName}>{collection.name}</Text>
          <Switch
            value={collection.enabled}
            onValueChange={() => toggleCollection(collection.id)}
            trackColor={{ false: '#767577', true: '#4CD964' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#767577"
          />
        </View>

        <View style={styles.collectionMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>📅 {formatFrequency(collection.frequency)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>📱 {collection.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>🔀 {collection.rotation}</Text>
          </View>
        </View>
      </View>
    </View>
  );

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
              <Text style={styles.emoji}>🌸</Text>
              <Text style={styles.title}>Hey there!</Text>
              <Text style={styles.subtitle}>All collections</Text>
            </View>

            {/* Collections List */}
            <View style={styles.collectionsContainer}>
              {collections.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateEmoji}>📸</Text>
                  <Text style={styles.emptyStateText}>No collections yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Tap the + button to create your first wallpaper collection
                  </Text>
                </View>
              ) : (
                collections.map(collection => renderCollection(collection))
              )}
            </View>

            {/* Add spacing for FAB */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Floating Add Button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={handleAddNew}
            activeOpacity={0.8}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Create Collection Modal */}
        <CreateCollectionModal 
          visible={showModal}
          onClose={() => setShowModal(false)}
          navigation={navigation}
        />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 24,
    paddingTop: 20,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Recoleta',
    fontWeight: '400',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: 'NeueMontreal',
  },
  collectionsContainer: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'NeueMontreal',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'NeueMontreal',
  },
  collectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
  collectionCardDisabled: {
    opacity: 0.4,
  },
  imageGrid: {
    flexDirection: 'row',
    height: 160,
    gap: 4,
  },
  imageCell: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  imageCellFirst: {
    borderTopLeftRadius: 20,
  },
  imageCellLast: {
    borderTopRightRadius: 20,
  },
  cellImage: {
    width: '100%',
    height: '100%',
  },
  collectionInfo: {
    padding: 16,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectionName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'NeueMontreal',
  },
  collectionMeta: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'NeueMontreal',
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#000000',
    fontWeight: '300',
    marginTop: -2,
  },
});