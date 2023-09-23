export function classNames(
  ...classes: (string | boolean | undefined | null)[]
) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
