import React, { useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchDriverStandings } from '../../entities/driver/model/driverStandingsThunks';
import { fetchDriverDetails } from '../../entities/driver/model/driverDetailsThunks';
import { 
  selectDriverStandings, 
  selectDriverStandingsLoading, 
  selectDriverStandingsError, 
  selectHasMore,
  selectCachedYear 
} from '../../entities/driver/model/driverStandingsSelectors';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { Pagination } from '../../features/pagination/Pagination';
import { DriversList } from '../../entities/driver/ui/DriversList';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { DriverStanding } from '../../shared/types/driver';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/types';

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

  const standings = React.useMemo(() => {
    if (!allStandings) return [];
    return allStandings.filter(standing => standing.year === String(currentYear));
  }, [allStandings, currentYear]);

  const fetchData = useCallback((year: number, page: number) => {
    if (cachedYear) {
      console.log('loading from cache:', year);
      setIsInitialized(true);
    } else {
      console.log('fetching data:', year, page);
      dispatch(fetchDriverStandings({ year, page }));
    }
  }, [dispatch, cachedYear]);

  const debouncedFetchData = useDebounce(fetchData);

  useEffect(() => {
    setIsInitialized(false);
    debouncedFetchData(currentYear, 1);
  }, [currentYear, debouncedFetchData]);

  useEffect(() => {
    if (!loading && standings.length > 0) {
      setIsInitialized(true);
    }
  }, [loading, standings.length]);

  const handlePrevYear = useCallback(() => {
    setCurrentYear(prev => prev - 1);
    setCurrentPage(1);
  }, []);

  const handleNextYear = useCallback(() => {
    setCurrentYear(prev => prev + 1);
    setCurrentPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(fetchDriverStandings({ year: currentYear, page: nextPage }));
    }
  }, [currentYear, currentPage, hasMore, loading, dispatch]);

  const handleDriverPress = useCallback(async (driverId: string) => {
    try {
      console.log('Starting navigation process for driver:', driverId);
      console.log('Current navigation state:', navigation);
      
      await dispatch(fetchDriverDetails(driverId)).unwrap();
      console.log('Driver details loaded successfully');
      
      console.log('Attempting navigation to DriverPage');
      navigation.navigate('DriverPage', { driverId });
      console.log('Navigation completed');
    } catch (error) {
      console.error('Error in handleDriverPress:', error);
    }
  }, [dispatch, navigation]);

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
      <DriversList
        standings={standings}
        loading={loading}
        hasMore={hasMore}
        onEndReached={handleLoadMore}
        isInitialized={isInitialized}
        onDriverPress={handleDriverPress}
      />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
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