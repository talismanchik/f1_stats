import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Result } from '../../../shared/types/results';

interface ResultsTableProps {
  results: Result[];
  loading?: boolean;
}

type SortBy = 'position' | 'points' | 'grid';
type SortOrder = 'asc' | 'desc';

const defaultSortOrder: Record<SortBy, SortOrder> = {
  position: 'asc', // от меньшего к большему
  points: 'desc',  // от большего к меньшему
  grid: 'asc',     // от меньшего к большему
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, loading }) => {
  const [sortBy, setSortBy] = React.useState<SortBy>('position');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(defaultSortOrder['position']);

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder(defaultSortOrder[column]);
    }
  };

  const sortedResults = React.useMemo(() => {
    const sorted = [...results];
    sorted.sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;
      if (sortBy === 'position') {
        aValue = Number(a.position);
        bValue = Number(b.position);
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else if (sortBy === 'points') {
        aValue = Number(a.points);
        bValue = Number(b.points);
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        // Если очки равны — сортировка по месту в обратном порядке
        const aPos = Number(a.position);
        const bPos = Number(b.position);
        if (aPos < bPos) return sortOrder === 'asc' ? 1 : -1;
        if (aPos > bPos) return sortOrder === 'asc' ? -1 : 1;
        return 0;
      } else if (sortBy === 'grid') {
        aValue = Number(a.grid);
        bValue = Number(b.grid);
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
    return sorted;
  }, [results, sortBy, sortOrder]);

  const renderSortIcon = (column: SortBy) => {
    if (sortBy !== column) return <View style={styles.sortIconPlaceholder} />;
    return (
      <Text style={styles.sortIcon}>{sortOrder === 'asc' ? '▲' : '▼'}</Text>
    );
  };

  return (
    <View style={styles.tableWrapper}>
      <ScrollView horizontal={false} style={{ flex: 1 }}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCellDriver}>Гонщик</Text>
            <TouchableOpacity style={styles.headerCellFixed} onPress={() => handleSort('position')} activeOpacity={0.7}>
              <Text style={styles.headerCellFixedText}>Место</Text>
              {renderSortIcon('position')}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerCellFixed} onPress={() => handleSort('points')} activeOpacity={0.7}>
              <Text style={styles.headerCellFixedText}>Очки</Text>
              {renderSortIcon('points')}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerCellFixed} onPress={() => handleSort('grid')} activeOpacity={0.7}>
              <Text style={styles.headerCellFixedText}>На старте</Text>
              {renderSortIcon('grid')}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.rowsScroll}>
            {sortedResults.map((result, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.cellDriver}>{result.driver}</Text>
                <Text style={styles.cellFixed}>{result.position}</Text>
                <Text style={styles.cellFixed}>{result.points}</Text>
                <Text style={styles.cellFixed}>{result.grid}</Text>
              </View>
            ))}
          </ScrollView>
          {loading && (
            <View style={styles.overlay} pointerEvents="none">
              <ActivityIndicator size="large" color="#FF1E1E" style={styles.overlayLoader} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tableWrapper: {
    width: '100%',
    marginBottom: 80,
    flex: 1,
  },
  table: {
    width: '100%',
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#232323',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerCellDriver: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
    textAlign: 'left',
    justifyContent: 'center',
  },
  headerCellFixed: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  headerCellFixedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 10,
  },
  sortIcon: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    height: 18,
    marginTop: 2,
  },
  sortIconPlaceholder: {
    height: 18,
    marginTop: 2,
  },
  rowsScroll: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  cellDriver: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    padding: 10,
    textAlign: 'left',
  },
  cellFixed: {
    width: 80,
    color: '#fff',
    fontSize: 15,
    padding: 10,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,30,30,0.55)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayLoader: {
    marginTop: 50,
  },
}); 