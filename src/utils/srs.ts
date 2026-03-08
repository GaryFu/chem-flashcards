/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * Adapted for Anki-style difficulty ratings (Again, Hard, Good, Easy)
 */

export const Rating = {
    Again: 1,
    Hard: 3,
    Good: 4,
    Easy: 5
} as const;

export type Rating = typeof Rating[keyof typeof Rating];

export interface SRSData {
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: number; // timestamp
}

export const initialSRSData = (): SRSData => ({
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: Date.now()
});

export function calculateNextReview(rating: Rating, current: SRSData): SRSData {
    let { easeFactor, interval, repetitions } = current;

    if (rating >= Rating.Hard) {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    } else {
        // If "Again", reset repetitions
        repetitions = 0;
        interval = 1;
    }

    // Calculate new Ease Factor
    easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Add interval (in days) to current time
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    return {
        easeFactor,
        interval,
        repetitions,
        nextReviewDate: nextDate.getTime()
    };
}
