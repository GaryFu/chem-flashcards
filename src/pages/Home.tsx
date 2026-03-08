import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDB, type Flashcard } from '../utils/db';

export default function Home() {
    const [stats, setStats] = useState({
        total: 0,
        due: 0,
        newCards: 0,
        learned: 0,
        mature: 0
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const db = await getDB();
                const allCards = await db.getAll('cards') as Flashcard[];
                const now = Date.now();

                let dueCount = 0;
                let newCount = 0;
                let learnedCount = 0;
                let matureCount = 0; // 熟悉度高的卡片

                allCards.forEach(card => {
                    if (card.srs.nextReviewDate <= now) dueCount++;
                    if (card.srs.repetitions === 0) newCount++;
                    if (card.srs.repetitions > 0) learnedCount++;
                    if (card.srs.interval >= 21) matureCount++;
                });

                setStats({
                    total: allCards.length,
                    due: dueCount,
                    newCards: newCount,
                    learned: learnedCount,
                    mature: matureCount
                });
            } catch (e) {
                console.error("Error fetching stats", e);
            }
        }
        fetchStats();
    }, []);

    const learnedPercent = stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0;
    const maturePercent = stats.learned > 0 ? Math.round((stats.mature / stats.learned) * 100) : 0;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Inter", sans-serif' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #FF6B6B, #556270)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>学习进度概览</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', margin: 0 }}>
                    掌握进度，科学记忆，攻克高中化学知识点
                </p>
            </div>

            {/* Main Progress Bar */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>整体学习进度</h2>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }}>{learnedPercent}%</span>
                </div>

                {/* Visual Bar */}
                <div style={{ width: '100%', height: '24px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        width: `${learnedPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                        borderRadius: '12px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>0 卡片</span>
                    <span>共 {stats.total} 张卡片</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {/* Stat Card 1 */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>今日待复习</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#ff7675' }}>{stats.due}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>优先清空这些卡片</div>
                </div>

                {/* Stat Card 2 */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>全新未学卡片</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#74b9ff' }}>{stats.newCards}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>还有知识等待探索</div>
                </div>

                {/* Stat Card 3 */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>完全掌握卡片</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#55efc4' }}>{stats.mature}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>占比已学内容的 {maturePercent}%</div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <Link to="/review" className="btn" style={{
                    padding: '1.2rem 3rem',
                    fontSize: '1.3rem',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 20px rgba(118, 75, 162, 0.3)',
                    textDecoration: 'none'
                }}>
                    ▶ 开始学习 / 复习
                </Link>

                <Link to="/import" className="btn" style={{
                    padding: '1.2rem 3rem',
                    fontSize: '1.3rem',
                    borderRadius: '50px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                }}>
                    ➕ 导入新卡片
                </Link>
            </div>
        </div>
    );
}
