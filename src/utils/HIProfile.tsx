export type Author =
  | fhir4.Device
  | fhir4.RelatedPerson
  | fhir4.Patient
  | fhir4.Practitioner
  | fhir4.PractitionerRole
  | fhir4.Organization;

export default class HIProfile {
  private _bundle: fhir4.Bundle;
  private _composition: fhir4.Composition;
  private _entries: fhir4.BundleEntry[];

  constructor(bundle: fhir4.Bundle) {
    this._bundle = bundle;
    this._composition = this.composition;
    this._entries = this.entries;
  }

  get bundle(): fhir4.Bundle {
    return this._bundle;
  }

  get composition(): fhir4.Composition {
    if (!this._composition) {
      const composition = this.bundle.entry?.find(
        (entry) => entry.resource?.resourceType.toLowerCase() === "composition"
      )?.resource as fhir4.Composition;

      if (!composition) {
        throw new Error("No composition found in bundle");
      }

      this._composition = composition;
    }

    return this._composition;
  }

  get entries(): fhir4.BundleEntry[] {
    if (!this._entries) {
      this._entries = this.bundle.entry ?? [];
    }

    return this._entries;
  }

  get details(): {
    title: string;
    date: string;
    authors: Author[];
    status: string;
  } {
    return {
      title: this.composition.title,
      date:
        this.composition.date ??
        this.composition.meta?.lastUpdated ??
        this.bundle.timestamp,
      authors: this.composition.author
        ?.map((author) => this.getResource(author.reference) as Author)
        .filter((author) => author),
      status: this.composition.status,
    };
  }

  parseHumanName(humanName: fhir4.HumanName | undefined): string {
    if (!humanName) return "";

    return [
      humanName.prefix ?? "",
      humanName.text ??
        [humanName.given ?? "", humanName.family ?? ""].join(" ").trim(),
      humanName.suffix ?? "",
    ]
      .join(" ")
      .trim();
  }

  getAuthorName(author: Author): string {
    switch (author.resourceType) {
      case "Patient":
        return this.parseHumanName(author.name?.[0]);
      case "Practitioner":
        return this.parseHumanName(author.name?.[0]);
      case "PractitionerRole":
        return `${author.practitioner?.display}`;
      case "Organization":
        return `${author.name}`;
      case "Device":
        return `${author.deviceName}`;
      case "RelatedPerson":
        return this.parseHumanName(author.name?.[0]);
      default:
        return "";
    }
  }

  getConceptDisplay(concept: fhir4.CodeableConcept | undefined): string | null {
    if (!concept) return null;

    if (concept.text) return concept.text;

    if (concept.coding) {
      for (const coding of concept.coding) {
        const display = this.getCodingDisplay(coding);
        if (display) return display;
      }
    }

    return "";
  }

  getCodingDisplay(coding: fhir4.Coding): string {
    return coding.display ?? coding.code ?? "";
  }

  getObservationValue(
    observation: fhir4.Observation | fhir4.ObservationComponent
  ): string {
    if ("valueString" in observation) {
      return observation.valueString ?? "";
    }

    if ("valueQuantity" in observation) {
      return (
        observation.valueQuantity?.value?.toString() +
        " " +
        observation.valueQuantity?.unit
      );
    }

    if ("valueCodeableConcept" in observation) {
      return this.getConceptDisplay(observation.valueCodeableConcept) ?? "";
    }

    if ("valueBoolean" in observation) {
      return observation.valueBoolean?.toString() ?? "";
    }

    if ("valueInteger" in observation) {
      return observation.valueInteger?.toString() ?? "";
    }

    if ("valueDateTime" in observation) {
      return observation.valueDateTime?.toString() ?? "";
    }

    if ("valueTime" in observation) {
      return observation.valueTime?.toString() ?? "";
    }

    if ("valueRange" in observation) {
      return (
        observation.valueRange?.low?.value?.toString() ??
        "" + " " + observation.valueRange?.low?.unit ??
        "" + " - " + observation.valueRange?.high?.value?.toString() ??
        "" + " " + observation.valueRange?.high?.unit ??
        ""
      );
    }

    if ("valueRatio" in observation) {
      return (
        observation.valueRatio?.numerator?.value?.toString() ??
        "" + " " + observation.valueRatio?.numerator?.unit ??
        "" + " : " + observation.valueRatio?.denominator?.value?.toString() ??
        "" + " " + observation.valueRatio?.denominator?.unit ??
        ""
      );
    }

    if ("valueSampledData" in observation) {
      return (
        observation.valueSampledData?.origin?.value?.toString() ??
        "" + " " + observation.valueSampledData?.origin?.unit ??
        "" + " : " + observation.valueSampledData?.period?.toString() ??
        "" + " " + observation.valueSampledData?.dimensions?.toString() ??
        "" + " " + observation.valueSampledData?.data?.toString() ??
        ""
      );
    }

    if ("valuePeriod" in observation) {
      return (
        observation.valuePeriod?.start?.toString() ??
        "" + " " + observation.valuePeriod?.end?.toString() ??
        ""
      );
    }

    return "";
  }

  getResource(id: string | undefined): fhir4.Resource | null {
    if (!id) return null;

    return (
      this.entries.find((resource) => resource.fullUrl === id)?.resource ?? null
    );
  }

  get encounter(): fhir4.Encounter | null {
    return (
      (this.getResource(
        this.composition.encounter?.reference
      ) as fhir4.Encounter) ?? null
    );
  }
}
