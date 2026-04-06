const MINUTES_IN_DAY = 1440;
const DEFAULT_FIRST_SLOT_START_MINUTES = 23 * 60;

/** `durationMinutes === 0` marks an all-night-long slot (MVP: not selectable in lineup UI). */
export const ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL = 0;

/** Timeline length when a slot is all-night-long. Kept for post-MVP UI. */
const ALL_NIGHT_LONG_DURATION_MINUTES = 8 * 60;

export function formatMinutesAsTimeLabel(totalMinutes: number): string {
  const normalizedMinutes =
    ((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * `durationMinutes === 0` means "all night long" (not a zero-length set).
 * MVP: users cannot pick this in the lineup UI; logic remains for poster + timeline.
 */
function normalizeDurationForTimeline(durationMinutes: number): number {
  if (durationMinutes === ALL_NIGHT_LONG_DURATION_MINUTES_SENTINEL) {
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
