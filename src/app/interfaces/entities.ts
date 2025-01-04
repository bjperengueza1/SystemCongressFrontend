export interface CongressItem {
  congressId: number;
  name: string;
  startDate: string; // O usa Date si prefieres convertirla manualmente
  endDate: string;
  location: string;
}

export interface RoomsItem {
  roomId: number;
  congressId: number;
  name: string;
  capacity: number;
  location: string;
}

export interface RoomWitchCongressItem {
  roomId: number;
  congressId: number;
  name: string;
  capacity: number;
  location: string;
  congressName: string;
}
