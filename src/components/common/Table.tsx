import { classNames } from "../../utils";

interface IProps {
  heads: React.ReactNode[];
  rows: React.ReactNode[][];
  className?: string;
}

export default function Table({ heads, rows, className }: IProps) {
  return (
    <div
      className={classNames(
        "-mx-4 mt-10 overflow-x-auto ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg",
        className
      )}
    >
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {heads.map((head) => (
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={classNames(
                    i === 0 ? "" : "border-t border-gray-200",
                    "px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
