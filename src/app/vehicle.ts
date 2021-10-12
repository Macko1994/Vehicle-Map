export interface Vehicle {
  objects: [
    {
      discriminator: string,
      platesNumber: string,
      sideNumber: string,
      color: string,
      type: string,
      picture: {
        id: string,
        name: string,
        extension: string,
        contentType: string
      },
      rangeKm: number,
      batteryLevelPct: number,
      reservationEnd: string | Date,
      reservation: boolean,
      status: string,
      locationDescription: string,
      address: string,
      mapColor: {
        rgb: string,
        alpha: number
      },
      promotion: string,
      id: string,
      name: string,
      description: string,
      location: {
        latitude: number,
        longitude: number
      },
      metadata: string
    }
  ];
}
