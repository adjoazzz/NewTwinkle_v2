// src/screens/DiagnosticScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

// Your actual Render URL
const API_BASE_URL = 'https://wallpaper-backend-ihsi.onrender.com';

export default function DiagnosticScreen() {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, status, message, time = null) => {
    setResults(prev => [...prev, { test, status, message, time }]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setTesting(true);

    // Test 1: Basic Network Connectivity
    addResult('Network', 'testing', 'Testing basic network...');
    try {
      const start = Date.now();
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        timeout: 5000 
      });
      const time = Date.now() - start;
      if (response.ok) {
        addResult('Network', 'success', 'Internet connection working', `${time}ms`);
      } else {
        addResult('Network', 'error', 'Internet connection issue');
      }
    } catch (error) {
      addResult('Network', 'error', `No internet: ${error.message}`);
    }

    // Test 2: Backend Server Reachability
    addResult('Backend', 'testing', 'Testing backend server...');
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/admin/`, { 
        method: 'HEAD',
        timeout: 5000 
      });
      const time = Date.now() - start;
      addResult('Backend', 'success', `Backend reachable (${response.status})`, `${time}ms`);
    } catch (error) {
      addResult('Backend', 'error', `Cannot reach backend: ${error.message}`);
    }

    // Test 3: API Endpoint
    addResult('API Endpoint', 'testing', 'Testing scrape-board endpoint...');
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/api/scrape-board/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: 'https://www.pinterest.com/test/board/',
          limit: 5 
        }),
      });
      const time = Date.now() - start;
      const data = await response.json();
      
      if (response.ok) {
        addResult('API Endpoint', 'success', `API working (got ${data.image_count} images)`, `${time}ms`);
      } else {
        addResult('API Endpoint', 'warning', `API returned: ${data.error || 'Unknown error'}`, `${time}ms`);
      }
    } catch (error) {
      addResult('API Endpoint', 'error', `API failed: ${error.message}`);
    }

    // Test 4: Real Pinterest URL (small test)
    addResult('Pinterest Test', 'testing', 'Testing real Pinterest board (may take 30-60 sec)...');
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/api/scrape-board/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: 'https://www.pinterest.com/explore/minimal-wallpaper/',
          limit: 5 
        }),
      });
      const time = Date.now() - start;
      const data = await response.json();
      
      if (response.ok && data.images) {
        addResult('Pinterest Test', 'success', `Fetched ${data.images.length} images`, `${time}ms`);
      } else {
        addResult('Pinterest Test', 'error', data.error || 'Failed to fetch', `${time}ms`);
      }
    } catch (error) {
      addResult('Pinterest Test', 'error', `Failed: ${error.message}`);
    }

    setTesting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'testing': return '#2196F3';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'testing': return '⏳';
      default: return '•';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Network Diagnostics</Text>
        <Text style={styles.subtitle}>Backend: {API_BASE_URL}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {results.map((result, index) => (
          <View key={index} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultIcon}>{getStatusIcon(result.status)}</Text>
              <Text style={styles.resultTest}>{result.test}</Text>
              {result.time && (
                <Text style={styles.resultTime}>{result.time}</Text>
              )}
            </View>
            <Text style={[styles.resultMessage, { color: getStatusColor(result.status) }]}>
              {result.message}
            </Text>
          </View>
        ))}

        {results.length === 0 && !testing && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Press "Run Diagnostics" to test your connection
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, testing && styles.buttonDisabled]}
        onPress={runDiagnostics}
        disabled={testing}
      >
        {testing ? (
          <>
            <ActivityIndicator color="#FFF" size="small" />
            <Text style={styles.buttonText}>Testing...</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>Run Diagnostics</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  resultTest: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  resultTime: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  resultMessage: {
    fontSize: 14,
    marginLeft: 28,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});