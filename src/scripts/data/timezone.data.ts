interface TimezoneEntry {
  display: string;
  value: string;
}

function getTimezoneOffset(timezone: string): string {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  });
  const parts = formatter.formatToParts(date);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value || "";
  return offset;
}

function createTimezoneEntry(timezone: string): TimezoneEntry {
  let offset = getTimezoneOffset(timezone);
  return {
    display: `${timezone} (${offset})`,
    value: timezone,
  };
}

export const timezoneData: TimezoneEntry[] = [
  createTimezoneEntry("Africa/Cairo"),
  createTimezoneEntry("Africa/Johannesburg"),
  createTimezoneEntry("Africa/Lagos"),
  createTimezoneEntry("Africa/Nairobi"),
  createTimezoneEntry("Africa/Tunis"),
  createTimezoneEntry("America/Anchorage"),
  createTimezoneEntry("America/Argentina/Buenos_Aires"),
  createTimezoneEntry("America/Bogota"),
  createTimezoneEntry("America/Caracas"),
  createTimezoneEntry("America/Chicago"),
  createTimezoneEntry("America/Denver"),
  createTimezoneEntry("America/Havana"),
  createTimezoneEntry("America/Lima"),
  createTimezoneEntry("America/Los_Angeles"),
  createTimezoneEntry("America/Mexico_City"),
  createTimezoneEntry("America/New_York"),
  createTimezoneEntry("America/Phoenix"),
  createTimezoneEntry("America/Sao_Paulo"),
  createTimezoneEntry("America/Toronto"),
  createTimezoneEntry("Asia/Baghdad"),
  createTimezoneEntry("Asia/Bangkok"),
  createTimezoneEntry("Asia/Beirut"),
  createTimezoneEntry("Asia/Dhaka"),
  createTimezoneEntry("Asia/Dubai"),
  createTimezoneEntry("Asia/Hong_Kong"),
  createTimezoneEntry("Asia/Jakarta"),
  createTimezoneEntry("Asia/Karachi"),
  createTimezoneEntry("Asia/Kolkata"),
  createTimezoneEntry("Asia/Manila"),
  createTimezoneEntry("Asia/Riyadh"),
  createTimezoneEntry("Asia/Seoul"),
  createTimezoneEntry("Asia/Shanghai"),
  createTimezoneEntry("Asia/Singapore"),
  createTimezoneEntry("Asia/Tashkent"),
  createTimezoneEntry("Asia/Tokyo"),
  createTimezoneEntry("Australia/Adelaide"),
  createTimezoneEntry("Australia/Perth"),
  createTimezoneEntry("Australia/Sydney"),
  createTimezoneEntry("Europe/Amsterdam"),
  createTimezoneEntry("Europe/Athens"),
  createTimezoneEntry("Europe/Belgrade"),
  createTimezoneEntry("Europe/Berlin"),
  createTimezoneEntry("Europe/Brussels"),
  createTimezoneEntry("Europe/Bucharest"),
  createTimezoneEntry("Europe/Budapest"),
  createTimezoneEntry("Europe/Copenhagen"),
  createTimezoneEntry("Europe/Dublin"),
  createTimezoneEntry("Europe/Helsinki"),
  createTimezoneEntry("Europe/Lisbon"),
  createTimezoneEntry("Europe/London"),
  createTimezoneEntry("Europe/Madrid"),
  createTimezoneEntry("Europe/Moscow"),
  createTimezoneEntry("Europe/Paris"),
  createTimezoneEntry("Europe/Prague"),
  createTimezoneEntry("Europe/Rome"),
  createTimezoneEntry("Europe/Warsaw"),
  createTimezoneEntry("Europe/Zurich"),
  createTimezoneEntry("Pacific/Auckland"),
  createTimezoneEntry("Pacific/Fiji"),
  createTimezoneEntry("Pacific/Guam"),
  createTimezoneEntry("Pacific/Honolulu"),
  createTimezoneEntry("Pacific/Tahiti"),
];
