export interface DiplomaSchema {
  signee: string;
  subject: string;
  degree: string;
  documentNumber: string;
  body: string;
  dateOfIssue: string;
}

export interface ActionLog {
  source: string;
  target?: string;
  message: string;
}
