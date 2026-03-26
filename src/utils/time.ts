const MINUTES_IN_DAY = 1440;
const DEFAULT_FIRST_SLOT_START_MINUTES = 23 * 60;
const ALL_NIGHT_LONG_DURATION_MINUTES = 8 * 60;

export function formatMinutesAsTimeLabel(totalMinutes: number): string {
  const normalizedMinutes =
    ((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function normalizeDurationForTimeline(durationMinutes: number): number {
  if (durationMinutes === 0) {
    return ALL_NIGHT_LONG_DURATION_MINUTES;
  }
  return durationMinutes;
}

export function computeSlotTimeRange(
  slotIndex: number,
  allSlots: { durationMinutes: number }[],
  firstSlotStartMinutes: number = DEFAULT_FIRST_SLOT_START_MINUTES,
): { startTimeLabel: string; endTimeLabel: string } {
  let currentStartMinutes = firstSlotStartMinutes;
  for (let slotBeforeIndex = 0; slotBeforeIndex < slotIndex; slotBeforeIndex++) {
    currentStartMinutes += normalizeDurationForTimeline(
      allSlots[slotBeforeIndex].durationMinutes,
    );
  }

  const currentSlotDurationMinutes = normalizeDurationForTimeline(
    allSlots[slotIndex].durationMinutes,
  );
  const endMinutes = currentStartMinutes + currentSlotDurationMinutes;
  return {
    startTimeLabel: formatMinutesAsTimeLabel(currentStartMinutes),
    endTimeLabel: formatMinutesAsTimeLabel(endMinutes),
  };
}

