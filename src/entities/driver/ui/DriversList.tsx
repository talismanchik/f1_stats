import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { DriverStanding } from '../../../shared/types/driver';
import { DriverItem } from './DriverItem';

interface Props {
  standings: DriverStanding[];
  loading: boolean;
  hasMore: boolean;
  onEndReached: () => void;
  onDriverPress: (driverId: string) => void;
  isInitialized: boolean;
}

export const DriversList: React.FC<Props> = ({
  standings,
  loading,
  hasMore,
  onEndReached,
  onDriverPress,
  isInitialized,
}) => {
  const renderFooter = useCallback(() => {
    if (!hasMore || !isInitialized) return null;
    return <LoadingFooter />;
  }, [hasMore, isInitialized]);

  const renderEmpty = useCallback(() => {
    if (!isInitialized || loading) {
      return <LoadingState />;
    }
    if (standings.length === 0) {
      return <EmptyState />;
    }
    return null;
  }, [loading, standings.length, isInitialized]);

  const keyExtractor = useCallback((item: DriverStanding) => 
    item.Driver.driverId, 
  []);

  const renderItem = useCallback(({ item }: { item: DriverStanding }) => (
    <MemoizedDriverItem driver={item} onPress={onDriverPress} />
  ), [onDriverPress]);

  const contentContainerStyle = useCallback(() => 
    standings.length === 0 ? styles.emptyList : styles.list,
  [standings.length]);

  return (
    <FlatList
      data={standings}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={hasMore && isInitialized ? onEndReached : undefined}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={contentContainerStyle()}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  );
};

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
  },
  list: {
    paddingBottom: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    zIndex: 1,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
  },
}); 

const LoadingFooter = memo(() => (
  <View style={styles.loadingMoreContainer}>
    <ActivityIndicator size="large" color="#FF1E1E" />
    <Text style={styles.loadingText}>Загрузка...</Text>
  </View>
));

const LoadingState = memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FF1E1E" />
    <Text style={styles.loadingText}>Загрузка данных...</Text>
  </View>
));

const EmptyState = memo(() => (
  <View style={styles.emptyContainer}>
    <Text style={styles.text}>Нет данных для отображения</Text>
    <Text style={styles.text}>Возможно, сезон еще не окончен</Text>
  </View>
));

const MemoizedDriverItem = memo(({ driver, onPress }: { driver: DriverStanding; onPress: (driverId: string) => void }) => (
  <DriverItem driver={driver} onPress={onPress} />
));