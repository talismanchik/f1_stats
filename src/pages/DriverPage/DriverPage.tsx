import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Tabs } from '../../shared/ui/Tabs/Tabs';
import { selectDriverDetails, selectDriverDetailsLoading, selectDriverDetailsError } from '../../entities/driver/model/driverDetailsSelectors';
import { fetchDriverDetails } from '../../entities/driver/model/driverDetailsThunks';
import { DriverDetails } from '../../shared/types/driver';
import { AppDispatch } from '../../app/store';
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
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  
  const driverDetails = useSelector(selectDriverDetails) as DriverDetails | null;
  const loading = useSelector(selectDriverDetailsLoading);
  const error = useSelector(selectDriverDetailsError);

  useEffect(() => {
    const driverId = route.params.driverId;
    if (driverId) {
      dispatch(fetchDriverDetails(driverId));
    }
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

  const renderBiography = () => (
    <View style={styles.tabContent}>
      <View style={styles.bioItem}><Text style={styles.bioLabel}>Дата рождения</Text><Text style={styles.bioValue}>{driverDetails?.dateOfBirth}</Text></View>
      <View style={styles.bioItem}><Text style={styles.bioLabel}>Национальность</Text><Text style={styles.bioValue}>{driverDetails?.nationality}</Text></View>
      <View style={styles.bioItem}><Text style={styles.bioLabel}>Код гонщика</Text><Text style={styles.bioValue}>{driverDetails?.code}</Text></View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      <View style={styles.achievement}>
        <Text style={styles.achievementTitle}>Чемпионства</Text>
        <Text style={styles.achievementValue}>{driverDetails?.achievements?.championships || 0}</Text>
      </View>
      <View style={styles.achievement}>
        <Text style={styles.achievementTitle}>Победы</Text>
        <Text style={styles.achievementValue}>{driverDetails?.achievements?.wins || 0}</Text>
      </View>
      <View style={styles.achievement}>
        <Text style={styles.achievementTitle}>Вторые места</Text>
        <Text style={styles.achievementValue}>{driverDetails?.achievements?.secondPlaces || 0}</Text>
      </View>
      <View style={styles.achievement}>
        <Text style={styles.achievementTitle}>Подиумы</Text>
        <Text style={styles.achievementValue}>{driverDetails?.achievements?.podiums || 0}</Text>
      </View>
      <View style={styles.achievement}>
        <Text style={styles.achievementTitle}>Поулы</Text>
        <Text style={styles.achievementValue}>{driverDetails?.achievements?.polePositions || 0}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!driverDetails) {
    return (
      <View style={styles.container}>
        <Text>Гонщик не найден</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderHeader()}
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
        {activeTab === 'biography' ? renderBiography() : renderAchievements()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    padding: 10,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginLeft: 4,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
    marginBottom: 4,
  },
  team: {
    fontSize: 16,
    color: '#CCCCCC',
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
  error: {
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 20,
  },
}); 