import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import {
  selectResultsCurrentRound,
  selectResultsLoading,
  selectResultsError,
  selectGrandPrixList,
  selectResultsByCurrentRound,
} from '../../entities/results/model/resultsSelectors';
import { fetchGrandPrixList, fetchResultsByGrandPrix } from '../../entities/results/model/resultsThunks';
import { setYear, setCurrentRound } from '../../entities/results/model/resultsSlice';
import { ResultsTable } from '../../entities/results/ui/ResultsTable';

interface ResultsPageProps {
  year: number;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ year }) => {
  const dispatch = useAppDispatch();
  const currentRound = useSelector(selectResultsCurrentRound);
  const loading = useSelector(selectResultsLoading);
  const error = useSelector(selectResultsError);
  const grandPrixList = useSelector(selectGrandPrixList);
  const results = useSelector(selectResultsByCurrentRound);

  React.useEffect(() => {
    dispatch(setYear(year));
  }, [dispatch, year]);

  React.useEffect(() => {
    dispatch(fetchGrandPrixList(year));
  }, [dispatch, year]);

  React.useEffect(() => {
    if (grandPrixList.length > 0) {
      console.log('Список этапов (гран-при) за', year, grandPrixList);
    }
  }, [dispatch, year, currentRound, grandPrixList.length]);

  React.useEffect(() => {
    if (results.length > 0) {
      console.log('Результаты для этапа', currentRound, results);
    }
  }, [results, currentRound]);

  React.useEffect(() => {
    if (grandPrixList.length > 0) {
      console.log('fetchResultsByGrandPrix');
      
      dispatch(fetchResultsByGrandPrix({ year, round: currentRound }));
    }
  }, [dispatch, year, currentRound, grandPrixList.length]);

  const handlePrev = () => {
    if (currentRound > 1) {
      dispatch(setCurrentRound(currentRound - 1));
    }
  };
  const handleNext = () => {
    if (currentRound < grandPrixList.length) {
      dispatch(setCurrentRound(currentRound + 1));
    }
  };

  const hasGrandPrix = grandPrixList.length > 0;
  const hasResults = results.length > 0;
  const isDataReady = hasGrandPrix && hasResults && !loading;

  return (
    <View style={styles.container}>
      {hasGrandPrix && <ResultsTable results={results} loading={loading} />}
      {hasGrandPrix && (
        <View style={styles.paginationFixed}>
          <TouchableOpacity onPress={handlePrev} disabled={currentRound === 1}>
            <Text style={[styles.arrow, currentRound === 1 && styles.disabledArrow]}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.gpName}>
            {currentRound}  |  {grandPrixList[currentRound - 1]?.raceName || ''}
          </Text>
          <TouchableOpacity onPress={handleNext} disabled={currentRound === grandPrixList.length}>
            <Text style={[styles.arrow, currentRound === grandPrixList.length && styles.disabledArrow]}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      )}
      {!hasGrandPrix && loading && 
      <ActivityIndicator size="large" color="#FF1E1E" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: '#FF4444', marginTop: 20 }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paginationFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#232323',
    borderTopWidth: 1,
    borderTopColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  arrow: {
    color: '#fff',
    fontSize: 28,
    paddingHorizontal: 20,
  },
  disabledArrow: {
    color: '#555',
  },
  gpName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    minWidth: 120,
    textAlign: 'center',
  },
}); 