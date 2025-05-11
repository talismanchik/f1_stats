import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from '../Button/Button';

type Props = {
  value: string;
  onPrev: () => void;
  onNext: () => void;
  isLastValue: boolean;
  isFirstValue: boolean;
}

export const Pagination = ({
  value,
  onPrev,
  onNext,
  isLastValue,
  isFirstValue,
}: Props) => {
  const getButtonStyle = (isDisabled: boolean): ViewStyle => ({
    ...styles.button,
    ...(isDisabled ? styles.buttonDisabled : {}),
  });

  return (
    <View style={styles.container}>
      <Button
        title="←"
        onPress={onPrev}
        style={getButtonStyle(isFirstValue)}
        textStyle={styles.buttonText}
        disabled={isFirstValue}
      />
      <Text style={styles.valueText}>{value}</Text>
      <Button
        title="→"
        onPress={onNext}
        style={getButtonStyle(isLastValue)}
        textStyle={styles.buttonText}
        disabled={isLastValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
}); 