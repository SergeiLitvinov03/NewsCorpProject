export function currentDate() {
  const date = new Date();
  return date.getFullYear() + "-" + date.getDay() +"-"+ date.getMonth();
}