import Profile from "../components/Profile";

export default {
  title: "HI Profile",
  component: Profile,
};

import consultationDocument from "./data/consultation_document.json";
export const ConsultationDocument = () => (
  <Profile bundle={consultationDocument as fhir4.Bundle} />
);

import dischargeSummaryDocument from "./data/discharge_summary_document.json";
export const DischargeSummaryDocument = () => (
  <Profile bundle={dischargeSummaryDocument as fhir4.Bundle} />
);

import diagnosticReportDocument from "./data/diagnostic_report_document.json";
export const DiagnosticReportDocument = () => (
  <Profile bundle={diagnosticReportDocument as fhir4.Bundle} />
);

import healthRecordDocument from "./data/health_record_document.json";
export const HealthRecordDocument = () => (
  <Profile bundle={healthRecordDocument as fhir4.Bundle} />
);

import immunizationDocument from "./data/immunization_document.json";
export const ImmunizationDocument = () => (
  <Profile bundle={immunizationDocument as fhir4.Bundle} />
);

import prescriptionDocument from "./data/prescription_document.json";
export const PrescriptionDocument = () => (
  <Profile bundle={prescriptionDocument as fhir4.Bundle} />
);

import wellnessRecordDocument from "./data/wellness_record_document.json";
export const WellnessRecordDocument = () => (
  <Profile bundle={wellnessRecordDocument as fhir4.Bundle} />
);
