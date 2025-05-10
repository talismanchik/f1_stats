import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PaginationProps {
  currentYear: number;
  onYearChange: (year: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentYear, onYearChange }) => {
  const years = [2024, 2023, 2022, 2021, 2020];

  return (
    <View style={styles.container}>
      {years.map((year) => (
        <TouchableOpacity
          key={year}
          style={[
            styles.yearButton,
            year === currentYear && styles.activeYearButton,
          ]}
          onPress={() => onYearChange(year)}
        >
          <Text style={[
            styles.yearText,
            year === currentYear && styles.activeYearText,
          ]}>
            {year}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#2A2A2A',
  },
  yearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#3A3A3A',
  },
  activeYearButton: {
    backgroundColor: '#4A4A4A',
  },
  yearText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  activeYearText: {
    color: '#00FF00',
    fontWeight: '600',
  },
}); 