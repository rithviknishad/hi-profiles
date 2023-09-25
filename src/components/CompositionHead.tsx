import {
  HiOutlineUsers,
  HiCalendar,
  HiMiniPaperClip,
  HiArrowDownTray,
} from "react-icons/hi2";
import { useProfile } from "../contexts/ProfileContext";
import { formatDate } from "../utils";

export default function CompositionHead() {
  const { profile } = useProfile();
  const { title, authors, date, status } = profile!.details;

  return (
    <>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {title}
      </h2>
      <div className="flex items-end justify-between">
        <div className="min-w-0 flex-1">
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <HiOutlineUsers
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <p className="flex items-center gap-2">
                {authors?.map((author, i) => (
                  <span className="cursor-pointer hover:text-gray-700">
                    {profile!.getAuthorName(author)}{" "}
                    {i < authors.length - 1 && "•"}
                  </span>
                ))}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <HiMiniPaperClip
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {status}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <HiCalendar
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {formatDate(date)}
            </div>
          </div>
        </div>
        <div className="flex lg:ml-4">
          <span>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([JSON.stringify(profile!.bundle)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "bundle.json";
                a.click();
              }}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <HiArrowDownTray
                className="-ml-0.5 mr-1.5 h-4 w-4"
                aria-hidden="true"
              />
              Download Raw FHIR Bundle
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
