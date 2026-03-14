// src/services/wallpaperService.js
import { NativeModules, Platform, PermissionsAndroid } from 'react-native';

const { WallpaperManager } = NativeModules;

export const WallpaperService = {
  /**
   * Request permission to set wallpaper (Android only)
   */
  async requestPermission() {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SET_WALLPAPER,
        {
          title: 'Wallpaper Permission',
          message: 'Twinkle needs permission to set your wallpaper',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  },

  /**
   * Set wallpaper from a URL
   * @param {string} imageUrl - The URL of the image
   * @param {string} type - 'home', 'lock', or 'both'
   */
  async setWallpaper(imageUrl, type = 'home') {
    if (!WallpaperManager) {
      throw new Error('WallpaperManager native module not found. Did you rebuild the app?');
    }

    if (Platform.OS !== 'android') {
      throw new Error('Setting wallpaper is only supported on Android');
    }

    // Request permission first
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('Wallpaper permission denied');
    }

    try {
      console.log(`Setting wallpaper: ${imageUrl} as ${type}`);
      // Call the native module
      const result = await WallpaperManager.setWallpaper(imageUrl, type);
      console.log('Wallpaper set successfully:', result);
      return result;
    } catch (error) {
      console.error('Error setting wallpaper:', error);
      throw error;
    }
  },

  /**
   * Check if the native module is available
   */
  isAvailable() {
    return Platform.OS === 'android' && !!WallpaperManager;
  }
};