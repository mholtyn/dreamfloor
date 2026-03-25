function parseTimeLabelToMinutesSinceMidnight(timeLabel: string) {
  // Expects HH:MM (24h).
  const parts = timeLabel.split(':');
  if (parts.length !== 2) {
    return 0;
  }
  const hourNumber = Number(parts[0] ?? 0);
  const minuteNumber = Number(parts[1] ?? 0);
  if (Number.isNaN(hourNumber) || Number.isNaN(minuteNumber)) {
    return 0;
  }
  return hourNumber * 60 + minuteNumber;
}

function formatMinutesSinceMidnightToTimeLabel(minutesSinceMidnight: number) {
  const normalizedMinutesSinceMidnight =
    ((minutesSinceMidnight % (24 * 60)) + 24 * 60) % (24 * 60);
  const hourNumber = Math.floor(normalizedMinutesSinceMidnight / 60);
  const minuteNumber = normalizedMinutesSinceMidnight % 60;
  const hourLabel = hourNumber.toString().padStart(2, '0');
  const minuteLabel = minuteNumber.toString().padStart(2, '0');
  return `${hourLabel}:${minuteLabel}`;
}

export function computeSlotTimeRangeLabel(slotStartTimeLabel: string, slotDurationMinutes: number) {
  const startMinutesSinceMidnight = parseTimeLabelToMinutesSinceMidnight(slotStartTimeLabel);
  const endMinutesSinceMidnight = startMinutesSinceMidnight + slotDurationMinutes;
  const endTimeLabel = formatMinutesSinceMidnightToTimeLabel(endMinutesSinceMidnight);
  return `${slotStartTimeLabel}–${endTimeLabel}`;
}

export function computeNextSlotStartTimeLabelFromPreviousSlot(
  previousSlotStartTimeLabel: string,
  previousSlotDurationMinutes: number,
) {
  const startMinutesSinceMidnight = parseTimeLabelToMinutesSinceMidnight(previousSlotStartTimeLabel);
  const nextStartMinutesSinceMidnight = startMinutesSinceMidnight + previousSlotDurationMinutes;
  return formatMinutesSinceMidnightToTimeLabel(nextStartMinutesSinceMidnight);
}

