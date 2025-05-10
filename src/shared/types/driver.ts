export type Driver = {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export type Constructor = {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export type DriverStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
  year: string;
}

export type DriversResponse = {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    DriverTable: {
      season: string;
      Drivers: Driver[];
    };
  };
}

export type DriverStandingsResponse = {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable: {
      season: string;
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings: DriverStanding[];
      }>;
    };
  };
}

export type ApiDriver = {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
};

export type ApiConstructor = {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
};

export type ApiDriverStanding = {
  position: string;
  points: string;
  Driver: ApiDriver;
  Constructors: ApiConstructor[];
};

export type ApiResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        DriverStandings: ApiDriverStanding[];
      }>;
    };
    total: string;
  };
};

export interface DriverAchievements {
  championships: number;
  wins: number;
  secondPlaces: number;
  thirdPlaces: number;
  podiums: number;
  polePositions: number;
  careerPoints: number;
  seasons: number;
}

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

export interface DriverDetailsResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    DriverTable: {
      Drivers: DriverDetails[];
    };
  };
} 