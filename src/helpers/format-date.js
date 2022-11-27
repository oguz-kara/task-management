import format from 'date-fns/format';

export function getDateOfCreation(millis) {
  const date = new Date(millis);
  const today = new Date();
  const tomorrow = new Date(date).setHours(24, 0, 0, 0);
  const nextYear = new Date(date).setFullYear(date.getFullYear() + 1, 0, 1);
  const isToday = tomorrow - today > 0;
  const isThisYear = nextYear - today > 0;

  if (isToday) {
    return format(millis, 'HH:mm');
  } else if (isThisYear) {
    return format(millis, 'dd MMM, HH:mm');
  } else {
    return format(millis, 'dd MMM, yyyy');
  }
}
