import { useProfile } from "../contexts/ProfileContext";
import { classNames, formatDate } from "../utils";
import { HiPaperClip } from "react-icons/hi2";
import { Author } from "../utils/HIProfile";

interface IDocumentReferenceProps {
  document: fhir4.DocumentReference;
  className?: string;
}

export function DocumentReference({ document }: IDocumentReferenceProps) {
  const { profile } = useProfile();

  const documentReferenceDetails = [
    {
      label: "Authors",
      value: document.author
        ?.map((authorReference) =>
          profile!.getAuthorName(
            profile!.getResource(authorReference.reference) as Author
          )
        )
        .filter(Boolean)
        .join(", "),
    },
    { label: "Date", value: formatDate(document.date) },
    { label: "Description", value: document.description },
    { label: "Status", value: document.status },
    { label: "Document Status", value: document.docStatus },
    {
      label: "Context",
      value:
        document.context?.encounter
          ?.map((encounterRef) => encounterRef.display)
          .filter(Boolean)
          .join(", ") ||
        document.context?.encounter
          ?.map((encounterRef) =>
            (
              profile!.getResource(encounterRef.reference) as
                | fhir4.Encounter
                | fhir4.EpisodeOfCare
            )?.type
              ?.map((type) => profile!.getConceptDisplay(type))
              .filter(Boolean)
              .join("; ")
          )
          .filter(Boolean)
          .join(", ") ||
        "NA",
    },
  ];

  return (
    <div className="">
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {documentReferenceDetails.map((detail) =>
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
        <dt className="text-sm font-medium leading-6 text-gray-900">
          Attachments
        </dt>
        <dd className="mt-2 text-sm text-gray-900">
          <ul
            role="list"
            className="divide-y divide-gray-100 rounded-md border border-gray-200"
          >
            {document.content.map((doc) => (
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <HiPaperClip
                    className="h-5 w-5 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">
                      {doc.attachment?.title ?? "Link to document"}
                    </span>
                    {doc.attachment?.size && (
                      <span className="shrink-0 text-gray-400">
                        {doc.attachment?.size / 1000} KB
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <a
                    href={
                      doc.attachment?.url ??
                      URL.createObjectURL(
                        new Blob([atob(doc.attachment?.data ?? "")], {
                          type:
                            doc.attachment?.contentType ??
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
    </div>
  );
}

interface IProps {
  references: fhir4.Reference[];
  className?: string;
}

export default function DocumentReferences({ references, className }: IProps) {
  const { profile } = useProfile();

  if (references.length === 0) {
    return null;
  }

  const documents = references
    .map(
      (reference) =>
        profile!.getResource(reference.reference) as fhir4.DocumentReference
    )
    .filter(
      (resource) => resource && resource?.resourceType === "DocumentReference"
    );

  return (
    <div
      className={classNames(
        "-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg p-6 min-w-full divide-y divide-gray-300",
        className
      )}
    >
      {documents.map((document, i) => (
        <DocumentReference key={i} document={document} />
      ))}
    </div>
  );
}
