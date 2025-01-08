export interface CongressItem {
  congressId: number;
  name: string;
  startDate: string; // O usa Date si prefieres convertirla manualmente
  endDate: string;
  location: string;
  guid: string;
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

export let researchLines = [
  { value: 0, label: 'Tecnologías de la Información y Comunicación' },
  { value: 1, label: 'Educación Superior y modalidades de estudio' },
  { value: 2, label: 'Administración, Marketing y Emprendimiento' },
  { value: 3, label: 'Calidad e innovación educativa' },
  { value: 4, label: 'Artes y Humanidades' },
  { value: 5, label: 'Actividad física y deportiva' },
  { value: 6, label: 'Servicios de protección, seguridad y transporte' },
  { value: 7, label: 'Ingeniería, Industria y Construcción' }
];

export let academicDegrees = [
  { value: 0, label: 'Doctor/a (PhD)' },
  { value: 1, label: 'Magister' },
  { value: 2, label: 'Especialización' },
  { value: 3, label: 'Tercer Nivel de Grado (Licenciado/a, Ingeniero/a, otros)' },
  { value: 4, label: 'Tercer Nivel Técnico o Tecnológico' },
  { value: 5, label: 'Estudiante' }
];

export interface AuthorItem {
  Position: number,
  Name: string,
  IDNumber: string,
  InstitutionalMail:string,
  PersonalMail: string,
  PhoneNumber: string,
  Country: string,
  City: string,
  AcademicDegree: number | null
}

export interface ExposureInsertItem {
  Name: string,
  ResearchLine: number | null,
  CongressGuid: string,
  Authors: AuthorItem[],
  pdfFile: File | null,
}
