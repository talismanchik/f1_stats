export interface DriverDetails {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  achievements: {
    championships: number;
    wins: number;
    firstPlaces: number;
    secondPlaces: number;
    podiums: number;
    polePositions: number;
  };
} 