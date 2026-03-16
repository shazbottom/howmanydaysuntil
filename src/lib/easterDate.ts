function getEasterSundayForYear(year: number): Date {
  const century = Math.floor(year / 100);
  const yearInCentury = year % 100;
  const leapCenturyCorrection = Math.floor(century / 4);
  const centuryRemainder = century % 4;
  const moonCorrection = Math.floor((century + 8) / 25);
  const adjustedMoonCorrection = Math.floor((century - moonCorrection + 1) / 3);
  const epact =
    (19 * (year % 19) + century - leapCenturyCorrection - adjustedMoonCorrection + 15) % 30;
  const leapYearInCentury = Math.floor(yearInCentury / 4);
  const yearRemainder = yearInCentury % 4;
  const weekdayCorrection =
    (32 + 2 * centuryRemainder + 2 * leapYearInCentury - epact - yearRemainder) % 7;
  const monthFactor = Math.floor((year % 19 + 11 * epact + 22 * weekdayCorrection) / 451);
  const month = Math.floor((epact + weekdayCorrection - 7 * monthFactor + 114) / 31);
  const day = ((epact + weekdayCorrection - 7 * monthFactor + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

export function getNextEasterDate(now: Date = new Date()): Date {
  const currentYear = now.getFullYear();
  const easterThisYear = getEasterSundayForYear(currentYear);

  if (easterThisYear >= now) {
    return easterThisYear;
  }

  return getEasterSundayForYear(currentYear + 1);
}
