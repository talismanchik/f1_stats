import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Tabs } from '../../shared/ui/Tabs/Tabs';
import { selectDriverDetails, selectDriverDetailsLoading, selectDriverDetailsError } from '../../entities/driver/model/details/driverDetailsSelectors';
import { fetchDriverDetails } from '../../entities/driver/model/details/driverDetailsThunks';
import { resetDriverDetails, setDriverDetailsLoading } from '../../entities/driver/model/details/driverDetailsSlice';
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
      dispatch(setDriverDetailsLoading());
      
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
      
      {!loading && driverDetails && (
        <View style={styles.driverInfo}>
          <View style={styles.numberContainer}>
            <Text style={styles.number}>{driverDetails.permanentNumber}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {driverDetails.givenName} {driverDetails.familyName}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF1E1E" />
          <Text style={styles.loadingText}>Загрузка данных гонщика...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(fetchDriverDetails(route.params.driverId))}
          >
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : !driverDetails ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Данные гонщика не найдены</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(fetchDriverDetails(route.params.driverId))}
          >
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <Tabs
            tabs={TABS}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
          {activeTab === 'biography' ? (
            <View style={styles.tabContent}>
              <View style={styles.bioItem}>
                <Text style={styles.bioLabel}>Дата рождения</Text>
                <Text style={styles.bioValue}>{driverDetails.dateOfBirth}</Text>
              </View>
              <View style={styles.bioItem}>
                <Text style={styles.bioLabel}>Национальность</Text>
                <Text style={styles.bioValue}>{driverDetails.nationality}</Text>
              </View>
              <View style={styles.bioItem}>
                <Text style={styles.bioLabel}>Код гонщика</Text>
                <Text style={styles.bioValue}>{driverDetails.code}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <View style={styles.achievement}>
                <Text style={styles.achievementTitle}>Чемпионства</Text>
                <Text style={styles.achievementValue}>{driverDetails.achievements.championships}</Text>
              </View>
              <View style={styles.achievement}>
                <Text style={styles.achievementTitle}>Победы</Text>
                <Text style={styles.achievementValue}>{driverDetails.achievements.wins}</Text>
              </View>
              <View style={styles.achievement}>
                <Text style={styles.achievementTitle}>Подиумы</Text>
                <Text style={styles.achievementValue}>{driverDetails.achievements.podiums}</Text>
              </View>
              <View style={styles.achievement}>
                <Text style={styles.achievementTitle}>Поулы</Text>
                <Text style={styles.achievementValue}>{driverDetails.achievements.polePositions}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
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
  tabContent: {
    padding: 20,
  },
  bioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  bioLabel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  bioValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  achievement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  achievementTitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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