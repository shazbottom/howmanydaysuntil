// Solstice and Equinox Table Courtesy of Fred Espenak, www.Astropixels.com.
// Source publishes GMT to the minute; represented as UTC for calendar planning.
export const SUMMER_SOLSTICE_SOURCE = "https://www.astropixels.com/ephemeris/soleq2001.html";
export const SUMMER_SOLSTICE_CHECKED = "2026-09-18";
export const summerSolstices: Record<number, { north: string; south: string }> = {
  2026: { north: "2026-06-21T08:25:00Z", south: "2026-12-21T20:50:00Z" },
  2027: { north: "2027-06-21T14:11:00Z", south: "2027-12-22T02:43:00Z" },
  2028: { north: "2028-06-20T20:02:00Z", south: "2028-12-21T08:20:00Z" },
  2029: { north: "2029-06-21T01:48:00Z", south: "2029-12-21T14:14:00Z" },
  2030: { north: "2030-06-21T07:31:00Z", south: "2030-12-21T20:09:00Z" },
  2031: { north: "2031-06-21T13:17:00Z", south: "2031-12-22T01:56:00Z" },
  2032: { north: "2032-06-20T19:09:00Z", south: "2032-12-21T07:57:00Z" },
  2033: { north: "2033-06-21T01:01:00Z", south: "2033-12-21T13:45:00Z" },
  2034: { north: "2034-06-21T06:45:00Z", south: "2034-12-21T19:35:00Z" },
  2035: { north: "2035-06-21T12:33:00Z", south: "2035-12-22T01:31:00Z" },
};
