import doc1 from "../data/consultation_document.json";
import doc2 from "../data/diagnostic_report_document.json";
import doc3 from "../data/discharge_summary_document.json";
import doc4 from "../data/health_record_document.json";
import doc5 from "../data/immunization_document.json";
import doc6 from "../data/prescription_document.json";
import doc7 from "../data/wellness_record_document.json";
import Profile from "./components/Profile";

export default function App() {
  return (
    <div>
      {[doc1, doc2, doc3, doc4, doc5, doc6, doc7].map((doc) => (
        <Profile key={doc.id} bundle={doc as fhir4.Bundle} />
      ))}
    </div>
  );
}
