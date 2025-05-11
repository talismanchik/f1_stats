import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabBarProps {
  activeTab: 'drivers' | 'results';
  onTabPress: (tab: 'drivers' | 'results') => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'drivers' && styles.activeTab]}
      onPress={() => onTabPress('drivers')}
    >
      <Text style={[styles.tabText, activeTab === 'drivers' && styles.activeTabText]}>Гонщики</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'results' && styles.activeTab]}
      onPress={() => onTabPress('results')}
    >
      <Text style={[styles.tabText, activeTab === 'results' && styles.activeTabText]}>Результаты</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#232323',
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 60,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeTab: {
    backgroundColor: '#333',
  },
  tabText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
}); 