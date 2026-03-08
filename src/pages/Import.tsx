import { useState } from 'react';
import { addDeck, addCard } from '../utils/db';

export default function Import() {
    const [message, setMessage] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        let totalImported = 0;
        let fileCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const text = await file.text();
                const deck = await addDeck('导入的卡组 - ' + file.name);
                const lines = text.split(/\r?\n/);

                for (const line of lines) {
                    if (!line.trim()) continue;

                    // 解析 CSV 单行，处理双引号内包含逗号的情况
                    const parseCSVLine = (str: string) => {
                        const result = [];
                        let start = 0;
                        let inQuotes = false;
                        for (let j = 0; j < str.length; j++) {
                            if (str[j] === '"') {
                                inQuotes = !inQuotes;
                            } else if (str[j] === ',' && !inQuotes) {
                                result.push(str.substring(start, j).replace(/^"|"$/g, '').replace(/""/g, '"'));
                                start = j + 1;
                            }
                        }
                        result.push(str.substring(start).replace(/^"|"$/g, '').replace(/""/g, '"'));
                        return result;
                    };

                    let parts = parseCSVLine(line);

                    if (parts.length < 2 && line.includes('\t')) {
                        parts = line.split('\t');
                    }

                    if (parts.length >= 2) {
                        const front = parts[0].trim();
                        // 包含多个逗号的内容已被 parseCSVLine 正确分割，取后面的内容（或者剩余全部内容合并以防万一）
                        const back = parts.slice(1).join(',').trim();

                        // 跳过表头（无论有没有带双引号，并且忽略大小写）
                        if (front.replace(/^"|"$/g, '').toLowerCase() === 'question' &&
                            back.replace(/^"|"$/g, '').toLowerCase() === 'answer') {
                            continue;
                        }

                        await addCard(deck.id, front, back);
                        totalImported++;
                    }
                }
                fileCount++;
            } catch (err) {
                console.error(`导入文件 ${file.name} 失败`, err);
            }
        }

        setMessage(`成功从 ${fileCount} 个文件导入了 ${totalImported} 张卡片！`);
        // 允许重复选择同一批文件
        event.target.value = '';
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2>导入 CSV 卡片</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>请选择一个或多个 CSV 格式的文件进行导入，文件每行为一张卡片，正反面用逗号（或 Tab 键）分隔。</p>

            <div style={{ display: 'inline-block' }}>
                <input
                    type="file"
                    accept=".csv,.txt,.tsv"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-block', padding: '1rem 2rem', fontSize: '1.2rem' }}>
                    选择文件并导入
                </label>
            </div>

            {message && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--primary)' }}>
                    {message}
                </div>
            )}
        </div>
    );
}
