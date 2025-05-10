import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Tabs } from '../../shared/ui/Tabs/Tabs';
import { selectDriverDetails, selectDriverDetailsLoading, selectDriverDetailsError } from '../../entities/driver/model/driverDetailsSelectors';
import { fetchDriverDetails } from '../../entities/driver/model/driverDetailsThunks';
import { DriverDetails } from '../../shared/types/driver';
import { AppDispatch } from '../../app/store';

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

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={{ uri: driverDetails?.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <Text style={styles.name}>
        {driverDetails?.givenName} {driverDetails?.familyName}
      </Text>
      <Text style={styles.number}>#{driverDetails?.permanentNumber}</Text>
    </View>
  );

  const renderBiography = () => (
    <View style={styles.tabContent}>
      <Text style={styles.biography}>{driverDetails?.biography}</Text>
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
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  number: {
    fontSize: 18,
    color: '#666',
  },
  tabContent: {
    padding: 20,
  },
  biography: {
    fontSize: 16,
    lineHeight: 24,
  },
  achievement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  achievementTitle: {
    fontSize: 16,
    color: '#666',
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
}); 