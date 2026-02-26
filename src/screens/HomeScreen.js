// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   Dimensions,
//   ImageBackground,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ActivityIndicator,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { pinterestAPI } from '../services/api';

// const { width } = Dimensions.get('window');

// export default function HomeScreen({ navigation }) {
//   console.log('HomeScreen rendered');
  
//   const [pinterestUrl, setPinterestUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   const isValidPinterestUrl = (url) => {
//     try {
//       const urlObj = new URL(url);
//       return urlObj.hostname.includes('pinterest.com') || urlObj.hostname.includes('pin.it');
//     } catch {
//       return false;
//     }
//   };

//   const handlePinterestSubmit = async () => {
//     if (!pinterestUrl.trim()) {
//       Alert.alert('Error', 'Please enter a Pinterest board URL');
//       return;
//     }

//     // Validate URL format
//     if (!isValidPinterestUrl(pinterestUrl.trim())) {
//       Alert.alert('Invalid URL', 'Please enter a valid Pinterest board URL');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Fetch images from Pinterest via backend
//       const data = await pinterestAPI.scrapeBoard(pinterestUrl.trim());
      
//       if (!data.images || data.images.length === 0) {
//         Alert.alert('No Images Found', 'Could not find any images on this Pinterest board');
//         setLoading(false);
//         return;
//       }

//       // Navigate with fetched images
//       navigation.navigate('Collection', { 
//         sourceUrl: pinterestUrl.trim(),
//         images: data.images
//       });
      
//       // Reset input
//       setPinterestUrl('');
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to fetch Pinterest board');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Required', 'Permission to access photos is required!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const imageUris = result.assets.map(asset => asset.uri);
      
//       navigation.navigate('Collection', { 
//         images: imageUris,
//         sourceUrl: 'uploaded'
//       });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
      
//       <ImageBackground
//         source={require('../../assets/images/bg.png')}
//         style={styles.backgroundImage}
//         resizeMode="cover"
//       >
//         <SafeAreaView style={styles.safeArea}>
//           <KeyboardAvoidingView 
//             style={styles.keyboardView}
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             keyboardVerticalOffset={0}
//           >
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//               <ScrollView 
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//                 keyboardShouldPersistTaps="handled"
//               >
//                 {/* Header */}
//                 <View style={styles.header}>
//                   <Text style={styles.emoji}>🌸</Text>
//                   <Text style={styles.title}>
//                     Let's turn your inspiration{'\n'}into wallpapers
//                   </Text>
//                 </View>

//                 {/* Sample Cards Preview */}
//                 <View style={styles.previewContainer}>
//                   <ImageBackground
//                     source={require('../../assets/images/images.png')}
//                     style={styles.previewImage}
//                     resizeMode="contain"
//                   />
//                 </View>

//                 <View style={styles.spacer} />

//                 {/* Bottom Section - Input Areas */}
//                 <View style={styles.bottomSection}>
//                   {/* Pinterest Board Section */}
//                   <View style={styles.inputSection}>
//                     <View style={styles.sectionHeader}>
//                       <Text style={styles.sectionTitle}>Use a Pinterest board</Text>
//                       <Text style={styles.sectionSubtitle}>
//                         Turn your Pinterest vision board into your daily motivation
//                       </Text>
//                     </View>
                    
//                     <TextInput
//                       style={styles.textInput}
//                       placeholder="Your board link here"
//                       placeholderTextColor="rgba(0, 0, 0, 0.4)"
//                       value={pinterestUrl}
//                       onChangeText={setPinterestUrl}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       keyboardType="url"
//                       returnKeyType="go"
//                       onSubmitEditing={handlePinterestSubmit}
//                       editable={!loading}
//                     />
                    
//                     {loading && (
//                       <View style={styles.loadingContainer}>
//                         <ActivityIndicator size="small" color="#FFFFFF" />
//                         <Text style={styles.loadingText}>Fetching images...</Text>
//                       </View>
//                     )}
//                   </View>

//                   <TouchableOpacity
//                     style={styles.uploadSection}
//                     onPress={handleFileUpload}
//                     activeOpacity={0.8}
//                     disabled={loading}
//                   >
//                     <View style={styles.uploadContent}>
//                       <Text style={styles.sectionTitle}>Upload images</Text>
//                       <Text style={styles.sectionSubtitle}>
//                         Choose photos, art, or screenshots you want to use as wallpapers
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </TouchableWithoutFeedback>
//           </KeyboardAvoidingView>
//         </SafeAreaView>
//       </ImageBackground>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     paddingBottom: 30,
//   },
//   header: {
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   emoji: {
//     fontSize: 40,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 30,
//     color: '#FFFFFF',
//     lineHeight: 38,
//     letterSpacing: -0.5,
//     fontFamily: 'Recoleta',
//   },
//   previewContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//     width: '100%',
//   },
//   previewImage: {
//     width: '100%',
//     height: width * 0.5,
//   },
//   spacer: {
//     flex: 1,
//     minHeight: 20,
//   },
//   bottomSection: {
//     gap: 20,
//     marginBottom: 20,
//   },
//   inputSection: {
//     gap: 12,
//   },
//   // uploadSection: {
//   //   backgroundColor: 'rgba(255, 255, 255, 0.25)',
//   //   borderRadius: 16,
//   //   padding: 20,
//   //   borderWidth: 1.5,
//   //   borderColor: 'rgba(255, 255, 255, 0.5)',
//   // },
//   uploadContent: {
//     gap: 8,
//   },
//   sectionHeader: {
//     gap: 4,
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     fontFamily: 'NeueMontreal',
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.95)',
//     lineHeight: 20,
//     fontFamily: 'NeueMontreal',
//   },
//   textInput: {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     height: 56,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: '#000000',
//     fontFamily: 'NeueMontreal',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     gap: 8,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.95)',
//     fontFamily: 'NeueMontreal',
//   },
// });