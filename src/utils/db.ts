import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { initialSRSData } from './srs';
import type { SRSData } from './srs';

export interface Flashcard {
    id: string;
    deckId: string;
    front: string; // Question or formula
    back: string;  // Answer
    createdAt: number;
    srs: SRSData;
}

export interface Deck {
    id: string;
    name: string;
    createdAt: number;
}

interface ChemDB extends DBSchema {
    decks: {
        key: string;
        value: Deck;
    };
    cards: {
        key: string;
        value: Flashcard;
        indexes: { 'by-deck': string; 'by-next-review': number };
    };
}

let dbPromise: Promise<IDBPDatabase<ChemDB>> | null = null;

export function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<ChemDB>('chem-flashcards-db', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('decks')) {
                    db.createObjectStore('decks', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('cards')) {
                    const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
                    cardStore.createIndex('by-deck', 'deckId');
                    cardStore.createIndex('by-next-review', 'srs.nextReviewDate');
                }
            },
        });
    }
    return dbPromise;
}

// Helper methods

// Fallback for crypto.randomUUID in non-secure contexts
function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Simple fallback using Math.random
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export async function addDeck(name: string) {
    const db = await getDB();
    const deck: Deck = { id: generateUUID(), name, createdAt: Date.now() };
    await db.put('decks', deck);
    return deck;
}

export async function getDecks() {
    const db = await getDB();
    return db.getAll('decks');
}

export async function addCard(deckId: string, front: string, back: string) {
    const db = await getDB();
    const card: Flashcard = {
        id: generateUUID(),
        deckId,
        front,
        back,
        createdAt: Date.now(),
        srs: initialSRSData(),
    };
    await db.put('cards', card);
    return card;
}

export async function getCardsForDeck(deckId: string) {
    const db = await getDB();
    return db.getAllFromIndex('cards', 'by-deck', deckId);
}

export async function getDueCards() {
    const db = await getDB();
    const now = Date.now();
    // Get all cards whose nextReviewDate is <= now
    const range = IDBKeyRange.upperBound(now);
    return db.getAllFromIndex('cards', 'by-next-review', range);
}

export async function updateCard(card: Flashcard) {
    const db = await getDB();
    await db.put('cards', card);
}

export async function clearAllData() {
    const db = await getDB();
    const tx = db.transaction(['decks', 'cards'], 'readwrite');
    await tx.objectStore('decks').clear();
    await tx.objectStore('cards').clear();
    await tx.done;
}
