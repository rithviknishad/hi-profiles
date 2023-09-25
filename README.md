# HI Profiles

**This package provides react components for the [ABDM FHIR profiles](https://nrces.in/ndhm/fhir/r4/index.html).**

### Installation

```sh
npm install hi-profiles
```

### Usage

```js
import { HIProfile } from "hi-profiles";
import fhirBundle from "..."; // sample abdm fhir bundles can be found at https://sandbox.abdm.gov.in/abdm-docs/DiagnosticReports

export default function App() {
   return (
      <HIProfile bundle={fhirBundle} />
   )
}
```