export default function convertToSubcurrency(amount, factor = 10) {;
  return Math.round(amount * factor);

}
