import { useProfile } from "../contexts/ProfileContext";
import { classNames, formatDate } from "../utils";
import { HiPaperClip } from "react-icons/hi2";
import { Author } from "../utils/HIProfile";
import Observations from "./Observations";

interface IDiagnosticReportProps {
  report: fhir4.DiagnosticReport;
  className?: string;
}

export function DiagnosticReport({ report }: IDiagnosticReportProps) {
  const { profile } = useProfile();

  const reportDetails = [
    {
      label: "Date",
      value:
        formatDate(report.effectiveDateTime) ??
        [
          formatDate(report.effectivePeriod?.start),
          formatDate(report.effectivePeriod?.end),
        ]
          .filter(Boolean)
          .join(" - "),
    },
    { label: "Status", value: report.status },
    {
      label: "Categories",
      value: report.category
        ?.map((cat) => profile!.getConceptDisplay(cat))
        .filter(Boolean)
        .join(", "),
    },
    { label: "Conclusion", value: report.conclusion },
    {
      label: "Performers",
      value: report.performer
        ?.map((performerRef) =>
          profile!.getAuthorName(
            profile!.getResource(performerRef.reference) as Author
          )
        )
        .filter(Boolean)
        .join(", "),
    },
    {
      label: "Interpreters",
      value: report.resultsInterpreter
        ?.map((interpreter) =>
          profile!.getAuthorName(
            profile!.getResource(interpreter.reference) as Author
          )
        )
        .filter(Boolean)
        .join(", "),
    },
  ];

  return (
    <div className="">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {profile!.getConceptDisplay(report.code)}
        </h3>
        {report.text && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {report.text.div}
          </p>
        )}
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {reportDetails.map((detail) =>
          detail.value ? (
            <div className="px-4 py-4 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                {detail.label}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {detail.value}
              </dd>
            </div>
          ) : null
        )}
      </dl>

      <div className="px-4 py-4 sm:col-span-2 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Results</dt>
        <dd className="mt-2 text-sm text-gray-900">
          <Observations references={report.result ?? []} />
        </dd>
      </div>

      {/* TODO: handle media and dicom files */}
      {report.presentedForm && (
        <div className="px-4 py-4 sm:col-span-2 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Attachments
          </dt>
          <dd className="mt-2 text-sm text-gray-900">
            <ul
              role="list"
              className="divide-y divide-gray-100 rounded-md border border-gray-200"
            >
              {report.presentedForm.map((attachment) => (
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <HiPaperClip
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">
                        {attachment.title ?? "Link to document"}
                      </span>
                      {attachment.size && (
                        <span className="flex-shrink-0 text-gray-400">
                          {attachment.size / 1000} KB
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={
                        attachment.url ??
                        URL.createObjectURL(
                          new Blob([atob(attachment.data ?? "")], {
                            type:
                              attachment.contentType ??
                              "application/octet-stream",
                          })
                        ) ??
                        "#"
                      }
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
    </div>
  );
}

interface IProps {
  references: fhir4.Reference[];
  className?: string;
}

export default function DiagnosticReports({ references, className }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const reports = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.DiagnosticReport
    )
    .filter(
      (resource) => resource && resource?.resourceType === "DiagnosticReport"
    );

  return (
    <div
      className={classNames(
        "-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg p-6 min-w-full divide-y divide-gray-300",
        className
      )}
    >
      {reports.map((report, i) => (
        <DiagnosticReport key={i} report={report} />
      ))}
    </div>
  );
}
