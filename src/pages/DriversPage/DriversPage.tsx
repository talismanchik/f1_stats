import React, { useEffect, useCallback, memo, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchDriverStandings } from '../../entities/driver/model/standings/driverStandingsThunks';
import { fetchDriverDetails } from '../../entities/driver/model/details/driverDetailsThunks';
import { 
  selectDriverStandings, 
  selectDriverStandingsLoading, 
  selectDriverStandingsError, 
  selectHasMore,
  selectCachedYear,
  selectNoDataForYear
} from '../../entities/driver/model/standings/driverStandingsSelectors';
import { loadFromCache, resetStandings } from '../../entities/driver/model/standings/driverStandingsSlice';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { Pagination } from '../../shared/ui/Pagination/Pagination';
import { DriversList } from '../../entities/driver/ui/DriversList';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { DriverStanding } from '../../shared/types/driver';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/types';
import { TabBar } from '../../widgets/TabBar/TabBar';
import { ResultsPage } from '../ResultsPage/ResultsPage';

const CURRENT_YEAR = new Date().getFullYear();

const ErrorView = memo(({ error }: { error: string }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
));

type DriversPageNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DriversPage: React.FC = () => {
  const navigation = useNavigation<DriversPageNavigationProp>();
  const dispatch = useAppDispatch();
  const allStandings = useSelector(selectDriverStandings);
  const loading = useSelector(selectDriverStandingsLoading);
  const error = useSelector(selectDriverStandingsError);
  const hasMore = useSelector(selectHasMore);
  const [currentYear, setCurrentYear] = React.useState(CURRENT_YEAR - 1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const cachedYear = useSelector(selectCachedYear(currentYear));
  const noDataForYear = useSelector(selectNoDataForYear);
  const [activeTab, setActiveTab] = React.useState<'drivers' | 'results'>('drivers');

  const standings = useMemo(() => {
    const uniqueStandings = new Map();
    (allStandings || [])
      .filter((standing: DriverStanding) => standing.year === String(currentYear))
      .forEach((standing: DriverStanding) => {
        if (!uniqueStandings.has(standing.Driver.driverId)) {
          uniqueStandings.set(standing.Driver.driverId, standing);
        }
      });
    return Array.from(uniqueStandings.values());
  }, [allStandings, currentYear]);

  const fetchData = useCallback((year: number, page: number) => {
    if (page === 1) {
      if (cachedYear) {
        dispatch(loadFromCache(year));
        setIsInitialized(true);
      } else {
        dispatch(fetchDriverStandings({ year, page }))
          .unwrap()
          .then(() => setIsInitialized(true))
          .catch(() => setIsInitialized(false));
      }
    } else {
      dispatch(fetchDriverStandings({ year, page }));
    }
  }, [dispatch, cachedYear]);

  const debouncedFetchData = useDebounce(fetchData);

  useEffect(() => {
    if (currentYear) {
      setIsInitialized(false);
      setCurrentPage(1);
      debouncedFetchData(currentYear, 1);
    }
  }, [currentYear, debouncedFetchData, dispatch]);

  useEffect(() => {
    if (!loading && (standings.length > 0 || cachedYear)) {
      setIsInitialized(true);
    }
  }, [loading, standings.length, cachedYear]);

  const handlePrevYear = useCallback(() => {
    setCurrentYear(prev => prev - 1);
    setCurrentPage(1);
  }, []);

  const handleNextYear = useCallback(() => {
    setCurrentYear(prev => prev + 1);
    setCurrentPage(1);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (hasMore && !loading) {
      try {
        await dispatch(fetchDriverStandings({ year: currentYear, page: currentPage + 1 })).unwrap();
        setCurrentPage(prev => prev + 1);
      } catch (error) {
        console.error('Error loading more drivers:', error);
      }
    }
  }, [currentYear, currentPage, hasMore, loading, dispatch]);

  const handleDriverPress = useCallback((driverId: string) => {
    navigation.navigate('DriverPage', { driverId });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pagination
          value={`${currentYear} г.`}
          onPrev={handlePrevYear}
          onNext={handleNextYear}
          isLastValue={currentYear === CURRENT_YEAR}
          isFirstValue={false}
        />
      </View>
      {activeTab === 'drivers' ? (
        <DriversList
          standings={standings}
          loading={loading}
          hasMore={hasMore}
          onEndReached={handleLoadMore}
          isInitialized={isInitialized}
          onDriverPress={handleDriverPress}
          year={currentYear}
          noDataForYear={noDataForYear}
        />
      ) : (
        <ResultsPage year={currentYear} />
      )}
      {error && (
        <ErrorView 
          error={
            error.includes('Network request failed') 
              ? 'Ошибка подключения к серверу. Проверьте подключение к интернету и перезапустите приложение.' 
              : error.includes('Failed to fetch')
              ? 'Не удалось получить данные. Проверьте подключение к интернету.'
              : error
          } 
        />
      )}
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingBottom: 60,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    backgroundColor: '#1E1E1E',
    zIndex: 1,
  },
  errorText: {
    color: '#FF1E1E',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 