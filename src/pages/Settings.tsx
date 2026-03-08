import { useState } from 'react';
import { clearAllData, getDB } from '../utils/db';

export default function Settings() {
    const [message, setMessage] = useState<string>('');

    const handleResetProgress = async () => {
        if (!window.confirm('确定要重置所有学习进度吗？这会将所有卡片的熟练度清零。')) {
            return;
        }

        try {
            const db = await getDB();
            const tx = db.transaction('cards', 'readwrite');
            const store = tx.objectStore('cards');
            const allCards = await store.getAll();

            for (const card of allCards) {
                card.srs = {
                    easeFactor: 2.5,
                    interval: 0,
                    repetitions: 0,
                    nextReviewDate: Date.now()
                };
                await store.put(card);
            }

            await tx.done;
            setMessage('学习进度已成功重置！');
        } catch (e) {
            console.error(e);
            setMessage('重置进度时出错。');
        }
    };

    const handleClearData = async () => {
        if (!window.confirm('警告：确定要清空所有数据（包括卡片）吗？此操作不可逆！')) {
            return;
        }

        try {
            await clearAllData();
            setMessage('所有数据已清空！');
        } catch (e) {
            console.error(e);
            setMessage('清空数据时出错。');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>设置</h2>

            <div style={{ marginTop: '2rem' }}>
                <h3>学习进度管理</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>如果您想重新开始学习，可以重置所有卡片的学习进度，但保留卡片本身。</p>
                <button className="btn btn-primary" onClick={handleResetProgress}>重置学习进度</button>
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <h3 style={{ color: '#ff4444' }}>危险区域</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>这会删除所有的卡片和数据。</p>
                <button className="btn" style={{ background: '#ff4444', color: 'white' }} onClick={handleClearData}>清空所有数据</button>
            </div>

            {message && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                    {message}
                </div>
            )}
        </div>
    );
}
