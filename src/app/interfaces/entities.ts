export interface CongressItem {
  congressId: number;
  name: string;
  startDate: string; // O usa Date si prefieres convertirla manualmente
  endDate: string;
  location: string;
  minHours: number;
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

export let statusExposure = [
  { value: 0, label: 'Pendiente' },
  { value: 1, label: 'Aprobada' },
  { value: 2, label: 'Rechazada' }
];

export interface AuthorInsertItem {
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

/*export interface ExposureInsertItem {
  Name: string,
  ResearchLine: number | null,
  CongressGuid: string,
  Authors: AuthorInsertItem[],
  pdfFile: File | null,
}*/

export type ExposureInsertItem = {
  Name: string,
  ResearchLine: number | null,
  CongressGuid: string,
  Authors: AuthorInsertItem[],
  pdfFile: File | null
}

export interface AuthorItem {
  authorId: number,
  position: number,
  name: string,
  idNumber: string,
  institutionalMail:string,
  personalMail: string,
  phoneNumber: string,
  country: string,
  city: string,
  academicDegree: number,
  academicDegreeLabel: string,
}

export interface ExposureItem {
  exposureId: number,
  name: string,
  summaryFilePath: string,
  statusExposure: number,
  statusLabelExposure: string,
  researchLine: number,
  researchLineLabel: string,
  guid: string,
  congressId: number,
  congressName: string,
  authors: AuthorItem[],
}

export interface AttendeeItem {
  attendeeId: number,
  name: string,
  email: string,
  phone: string,
  institution: string,
  idNumber: string
}

export interface AttendanceInsertItem {
  exposureId: number;
  attendee: AttendeeItem;
}

export interface AttendanceItem {
  attendanceId: number,
  date: string,
  attendee:AttendeeItem,
  exposure: ExposureItem,
}
