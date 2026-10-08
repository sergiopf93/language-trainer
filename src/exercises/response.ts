import type { Activity } from '../../shared/learning';
export function indexes(response: string): number[] {
  try {
    const value: unknown = JSON.parse(response);
    return Array.isArray(value) && value.every((n) => Number.isSafeInteger(n))
      ? value
      : [];
  } catch {
    return [];
  }
}
export function responseText(
  activity: Activity,
  response: string,
): string | null {
  if (!['ordering', 'matching'].includes(activity.format)) return response;
  if (!response) return '';
  const ids = indexes(response);
  if (
    ids.length !== activity.options.length ||
    new Set(ids).size !== ids.length ||
    ids.some((i) => i < 0 || i >= activity.options.length)
  )
    return null;
  return activity.format === 'ordering'
    ? ids.map((i) => activity.options[i]).join(' ')
    : JSON.stringify(ids);
}
export function displayResponse(activity: Activity, response: string) {
  if (activity.format === 'ordering')
    return indexes(response)
      .map((i) => activity.options[i])
      .join(' ');
  if (activity.format === 'matching')
    return indexes(response)
      .map(
        (i, n) =>
          `${activity.task?.matchingPrompts[n]} → ${activity.options[i] ?? '…'}`,
      )
      .join('; ');
  return response;
}
