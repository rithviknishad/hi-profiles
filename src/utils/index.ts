export function classNames(
  ...classes: (string | boolean | undefined | null)[]
) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(
  date: string | number | Date | undefined | null,
  includeTime = false
) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime && {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  });
}
