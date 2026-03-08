import { useState, useEffect } from 'react';
import Flashcard from '../components/Flashcard';
import { getDueCards, updateCard } from '../utils/db';
import type { Flashcard as DBFlashcard } from '../utils/db';
import { calculateNextReview, Rating } from '../utils/srs';

export default function ReviewSession() {
    const [queue, setQueue] = useState<DBFlashcard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCards() {
            // In a real app we would load from DB.
            // For now we attempt to load from DB and supply dummies if empty
            let due = await getDueCards();

            if (due.length === 0) {
                // Fallback dummy data if DB is empty
                due = [
                    {
                        id: 'dummy1',
                        deckId: 'd1',
                        front: 'What is the chemical formula for Water?',
                        back: 'H₂O',
                        createdAt: Date.now(),
                        srs: { easeFactor: 2.5, interval: 0, repetitions: 0, nextReviewDate: Date.now() }
                    },
                    {
                        id: 'dummy2',
                        deckId: 'd1',
                        front: 'What is the molar mass of Carbon?',
                        back: '12.011 g/mol',
                        createdAt: Date.now(),
                        srs: { easeFactor: 2.5, interval: 0, repetitions: 0, nextReviewDate: Date.now() }
                    }
                ];
            }
            setQueue(due);
            setLoading(false);
        }
        fetchCards();
    }, []);

    const handleRate = async (rating: Rating) => {
        if (queue.length === 0) return;

        const currentCard = queue[0];
        const newSrs = calculateNextReview(rating, currentCard.srs);

        currentCard.srs = newSrs;

        // Only update to DB if it's a real card (dummy cards will error as they don't actually exist in idb)
        if (!currentCard.id.startsWith('dummy')) {
            await updateCard(currentCard);
        }

        // Move to next
        setQueue(prev => prev.slice(1));
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>加载复习进度...</div>;
    }

    if (queue.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>🎉 全部复习完毕！</h2>
                <p style={{ color: 'var(--text-secondary)' }}>您已完成今天所有待复习的卡片。</p>
                <button className="btn btn-primary" onClick={() => window.location.href = '/'} style={{ marginTop: '2rem' }}>返回主页</button>
            </div>
        );
    }

    return (
        <div className="review-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>剩余 {queue.length} 张卡片</span>
            </div>

            <Flashcard
                front={queue[0].front}
                back={queue[0].back}
                onRate={handleRate}
            />
        </div>
    );
}
