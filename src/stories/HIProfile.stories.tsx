import type { Meta, StoryObj } from "@storybook/react";
import Profile from "../components/Profile";

const meta: Meta<typeof Profile> = {
  title: "HI Profile",
  component: Profile,
};
export default meta;

type Story = StoryObj<typeof Profile>;

import consultationDocument from "./data/consultation_document.json";
export const ConsultationDocument: Story = {
  args: {
    bundle: consultationDocument as fhir4.Bundle,
    downloadable: true,
  },
};

import dischargeSummaryDocument from "./data/discharge_summary_document.json";
export const DischargeSummaryDocument: Story = {
  args: {
    bundle: dischargeSummaryDocument as fhir4.Bundle,
    downloadable: true,
  },
};

import diagnosticReportDocument from "./data/diagnostic_report_document.json";
export const DiagnosticReportDocument: Story = {
  args: {
    bundle: diagnosticReportDocument as fhir4.Bundle,
    downloadable: true,
  },
};

import healthRecordDocument from "./data/health_record_document.json";
export const HealthRecordDocument: Story = {
  args: {
    bundle: healthRecordDocument as fhir4.Bundle,
    downloadable: true,
  },
};

import immunizationDocument from "./data/immunization_document.json";
export const ImmunizationDocument: Story = {
  args: {
    bundle: immunizationDocument as fhir4.Bundle,
    downloadable: true,
  },
};

import prescriptionDocument from "./data/prescription_document.json";
export const PrescriptionDocument: Story = {
  args: {
    bundle: prescriptionDocument as fhir4.Bundle,
    downloadable: true,
  },
};

import wellnessRecordDocument from "./data/wellness_record_document.json";
export const WellnessRecordDocument: Story = {
  args: {
    bundle: wellnessRecordDocument as fhir4.Bundle,
    downloadable: true,
  },
};
