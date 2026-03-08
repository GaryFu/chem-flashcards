import { useState, useEffect } from 'react';
import './Flashcard.css';
import { Rating } from '../utils/srs';
import katex from 'katex';
import 'katex/dist/contrib/mhchem.mjs';

interface FlashcardProps {
    front: string;
    back: string;
    onRate: (rating: Rating) => void;
}


// Simple parser for $inline$ and $$block$$ math expressions, and markdown bold/br
const renderWithKaTeX = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return parts.map((part, i) => {
        try {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                const html = katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false, strict: false, trust: true });
                return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
            } else if (part.startsWith('$') && part.endsWith('$')) {
                const html = katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false, strict: false, trust: true });
                return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
            }
        } catch (e) {
            return <span key={i} className="error">{String(e)}</span>;
        }

        // Handle bold and <br>
        const brParts = part.split(/<br\s*\/?>/i);
        return (
            <span key={i}>
                {brParts.map((brPart, j) => {
                    const boldParts = brPart.split(/\*\*(.*?)\*\*/g);
                    return (
                        <span key={j}>
                            {boldParts.map((bPart, k) => {
                                if (k % 2 === 1) {
                                    return <strong key={k}>{bPart}</strong>;
                                }
                                return <span key={k}>{bPart}</span>;
                            })}
                            {j < brParts.length - 1 && <br />}
                        </span>
                    );
                })}
            </span>
        );
    });
};

export default function Flashcard({ front, back, onRate }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(false);
    }, [front, back]);

    return (
        <div className="flashcard-wrapper">
            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className="flashcard-face flashcard-front">
                    <div className="card-content">
                        <span className="card-label">题目</span>
                        <div className="card-text">{renderWithKaTeX(front)}</div>
                    </div>
                    <div className="card-hint">点击翻转</div>
                </div>

                <div className="flashcard-face flashcard-back">
                    <div className="card-content">
                        <span className="card-label">答案</span>
                        <div className="card-text">{renderWithKaTeX(back)}</div>
                    </div>
                    <div className="card-hint">掌握程度如何？</div>
                </div>
            </div>

            {isFlipped && (
                <div className="rating-controls">
                    <button className="rate-btn btn-again" onClick={() => onRate(Rating.Again)}>
                        <span className="rate-label">重来</span>
                        <span className="rate-time">&lt; 1分钟</span>
                    </button>
                    <button className="rate-btn btn-hard" onClick={() => onRate(Rating.Hard)}>
                        <span className="rate-label">困难</span>
                        <span className="rate-time">6天</span>
                    </button>
                    <button className="rate-btn btn-good" onClick={() => onRate(Rating.Good)}>
                        <span className="rate-label">良好</span>
                        <span className="rate-time">10天</span>
                    </button>
                    <button className="rate-btn btn-easy" onClick={() => onRate(Rating.Easy)}>
                        <span className="rate-label">简单</span>
                        <span className="rate-time">14天</span>
                    </button>
                </div>
            )}
        </div>
    );
}
