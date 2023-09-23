import { useProfile } from "../contexts/ProfileContext";
import { classNames, formatDate } from "../utils";

interface IProps {
  className?: string;
}

export default function Encounter({ className }: IProps) {
  const { profile } = useProfile();
  const { encounter } = profile!;

  return encounter ? (
    <div className={classNames("rounded shadow p-4 pl-6", className)}>
      <div className="px-4 sm:px-0">
        <h3 className="text-xl font-semibold leading-7 text-gray-900">
          Encounter Details
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          This includes the dates like admission and discharge, and some extra
          details.
        </p>
      </div>
      <div className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Category
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {encounter.class.display ?? encounter.class.code}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Status
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {encounter.status}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Start Date
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {encounter.period?.start
                ? formatDate(encounter.period?.start)
                : "Not available"}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              End Date
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {encounter.period?.end
                ? formatDate(encounter.period?.end)
                : "Not available"}
            </dd>
          </div>

          {encounter.diagnosis?.length && (
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Diagnosis
              </dt>
              <dd className="mt-2 text-sm text-gray-900">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {encounter.diagnosis.map((diagnosis) => (
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <span className="truncate font-medium">
                          {diagnosis.condition?.display ??
                            diagnosis.condition?.reference}{" "}
                          {/* TODO: replace this with a valid display name or consider using diagnosis component */}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  ) : (
    <p className={classNames("text-gray-400 p-4 pl-6", className)}>
      No Encounter Found
    </p>
  );
}
