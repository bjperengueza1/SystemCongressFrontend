export interface CongressItem {
  congressId: number;
  name: string;
  startDate: string; // O usa Date si prefieres convertirla manualmente
  endDate: string;
  location: string;
  minHours: number;
  guid: string;
  status: number;
  fileFlayer: string;
  fileCertificateConference: string;
  fileCertificateAttendance: string;
  fileCertificateExposure: string;
}

export interface CongressInsertItem {
  congressId: number;
  name: string;
  startDate: string; // O usa Date si prefieres convertirla manualmente
  endDate: string;
  location: string;
  minHours: number;
  guid: string;
  status: number;
  fileFlayer: File | null;
  fileConferencia: File | null;
  filePonencia: File | null;
  fileAttendeee: File | null;
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
  { value: 1, label: 'Tecnologías de la Información y Comunicación' },
  { value: 2, label: 'Educación Superior y modalidades de estudio' },
  { value: 3, label: 'Administración, Marketing y Emprendimiento' },
  { value: 4, label: 'Calidad e innovación educativa' },
  { value: 5, label: 'Artes y Humanidades' },
  { value: 6, label: 'Actividad física y deportiva' },
  { value: 7, label: 'Servicios de protección, seguridad y transporte' },
  { value: 8, label: 'Ingeniería, Industria y Construcción' }
];

export let academicDegrees = [
  { value: 1, label: 'Doctor/a (PhD)' },
  { value: 2, label: 'Magister' },
  { value: 3, label: 'Especialización' },
  { value: 4, label: 'Tercer Nivel de Grado (Licenciado/a, Ingeniero/a, otros)' },
  { value: 5, label: 'Tercer Nivel Técnico o Tecnológico' },
  { value: 6, label: 'Estudiante' }
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
  Country: string | null,
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
  Type: number,
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
  type: number,
  guid: string,
  congressId: number,
  congressName: string,
  dateStart: string,
  dateEnd: string,
  observation: string,
  authors: AuthorItem[],
  room: RoomsItem
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


/*TEMPORAL*/
export interface ListCongressCertificate {
  congressId: number,
  name: string,
  startDate: string,
  endDate: string,
  location: string,
  exposure: ExposureItem[],
  certificateAttendance: boolean
}

export type ApproveExposureModel = {
  exposureId: number,
  congressId: number,
  roomId: number | null,
  dateStart: string,
  dateEnd: string,
  observation: string,
}

export type RejectExposureModel = {
  exposureId: number,
  observation: string,
}
