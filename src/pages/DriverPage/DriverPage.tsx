import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Tabs } from '../../shared/ui/Tabs/Tabs';
import { selectDriverDetails, selectDriverDetailsLoading, selectDriverDetailsError } from '../../entities/driver/model/details/driverDetailsSelectors';
import { fetchDriverDetails } from '../../entities/driver/model/details/driverDetailsThunks';
import { resetDriverDetails } from '../../entities/driver/model/details/driverDetailsSlice';
import { DriverDetails } from '../../shared/types/driver';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TEAM_COLORS } from '../../shared/constants/teamColors';

type DriverPageParams = {
  driverId: string;
};

type DriverPageRouteProp = RouteProp<{ DriverPage: DriverPageParams }, 'DriverPage'>;

const TABS = [
  { id: 'biography', title: 'Биография' },
  { id: 'achievements', title: 'Достижения' },
];

export const DriverPage: React.FC = () => {
  const route = useRoute<DriverPageRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  
  const driverDetails = useAppSelector(selectDriverDetails) as DriverDetails | null;
  const loading = useAppSelector(selectDriverDetailsLoading);
  const error = useAppSelector(selectDriverDetailsError);

  useEffect(() => {
    const driverId = route.params.driverId;
    if (driverId) {
      console.log('Loading driver details for:', driverId);
      dispatch(fetchDriverDetails(driverId))
        .unwrap()
        .catch((error) => {
          console.error('Failed to load driver details:', error);
        });
    }

    return () => {
      console.log('Cleaning up driver details');
      dispatch(resetDriverDetails());
    };
  }, [dispatch, route.params.driverId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <View style={styles.backButtonContent}>
          <Icon name="chevron-left" size={20} color="#888888" />
          <Text style={styles.backButtonText}>Назад</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.driverInfo}>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{driverDetails?.permanentNumber}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {driverDetails?.givenName} {driverDetails?.familyName}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF1E1E" />
          <Text style={styles.loadingText}>Загрузка данных гонщика...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(fetchDriverDetails(route.params.driverId))}
          >
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!driverDetails) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Данные гонщика не найдены</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(fetchDriverDetails(route.params.driverId))}
          >
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView style={styles.content}>
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
        {activeTab === 'biography' ? (
          <View style={styles.biographyContainer}>
            <Text style={styles.biographyText}>
              {driverDetails.givenName} {driverDetails.familyName} - гонщик Формулы-1 из {driverDetails.nationality}.
              {driverDetails.permanentNumber && ` Постоянный номер: ${driverDetails.permanentNumber}.`}
              {driverDetails.code && ` Код гонщика: ${driverDetails.code}.`}
            </Text>
          </View>
        ) : (
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementLabel}>Чемпионства</Text>
              <Text style={styles.achievementValue}>{driverDetails.achievements.championships}</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementLabel}>Победы</Text>
              <Text style={styles.achievementValue}>{driverDetails.achievements.wins}</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementLabel}>Вторые места</Text>
              <Text style={styles.achievementValue}>{driverDetails.achievements.secondPlaces}</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementLabel}>Подиумы</Text>
              <Text style={styles.achievementValue}>{driverDetails.achievements.podiums}</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementLabel}>Поулы</Text>
              <Text style={styles.achievementValue}>{driverDetails.achievements.polePositions}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#888888',
    marginLeft: 4,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  number: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  biographyContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  biographyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  achievementsContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  achievementLabel: {
    fontSize: 16,
    color: '#888888',
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF1E1E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 