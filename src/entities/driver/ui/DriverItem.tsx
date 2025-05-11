import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { DriverStanding } from '../../../shared/types/driver';
import Icon from 'react-native-vector-icons/Ionicons';

const TEAM_COLORS: { [key: string]: string } = {
  'Mercedes': '#00D2BE',
  'Red Bull': '#0600EF',
  'Ferrari': '#DC0000',
  'McLaren': '#FF8700',
  'Alpine': '#0090FF',
  'AlphaTauri': '#2B4562',
  'Aston Martin': '#006F62',
  'Williams': '#005AFF',
  'Alfa Romeo': '#900000',
  'Haas F1 Team': '#FFFFFF',
};

interface DriverItemProps {
  driver: DriverStanding;
  onPress?: (driverId: string) => void;
}

export const DriverItem: React.FC<DriverItemProps> = ({ driver, onPress }) => {
  const { Driver: driverData, Constructors, position, points } = driver;
  const team = Constructors[0]?.name || '';
  const teamColor = TEAM_COLORS[team] || '#888';
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.99,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePress = () => {
    if (onPress && driverData.driverId) {
      onPress(driverData.driverId);
    }
  };

  return (
    <Animated.View style={{ 
      transform: [{ scale: scaleAnim }],
      opacity: opacityAnim
    }}>
      <Pressable 
        style={styles.container} 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.positionBlock}>
          <Text style={styles.position}>{position}</Text>
        </View>
        {driverData.permanentNumber && (
          <View style={[styles.numberBlock, { backgroundColor: teamColor }]}>
            <Text style={styles.number}>{driverData.permanentNumber}</Text>
          </View>
        )}
        <View style={styles.infoBlock}>
          <Text style={styles.name}>{driverData.givenName} {driverData.familyName}</Text>
          <Text style={styles.team}>{team}</Text>
        </View>
        <View style={styles.rightBlock}>
          <Text style={styles.points}>{points} pts</Text>
          <Icon name="chevron-forward" size={20} color="#888888" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    height: 100,
  },
  positionBlock: {
    width: 32,
    alignItems: 'center',
  },
  numberBlock: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginLeft: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBlock: {
    flex: 1,
    marginLeft: 8,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70,
  },
  position: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgba(139, 139, 139, 0.8)',
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  team: {
    fontSize: 14,
    color: '#888888',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
}); 
