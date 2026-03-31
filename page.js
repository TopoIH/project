'use client'
import { useState } from 'react';
import { fetchEmails } from './actions';

export default function EmailExtractor() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    async function handleAction(formData) {
        setLoading(true);
        try {
            const data = await fetchEmails(formData);
            setEmails(data);
        } catch (err) {
            alert("Login Failed: " + err.message);
        }
        setLoading(false);
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6' }}>
            <h3>Email Original Extractor</h3>
            <form action={handleAction} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input name="email" type="email" placeholder="Gmail Address" required />
                <input name="password" type="password" placeholder="App Password" required />
                <input name="count" type="number" defaultValue="5" style={{ width: '50px' }} />
                <button type="submit" disabled={loading}>
                    {loading ? 'Fetching...' : 'Fetch Source'}
                </button>
            </form>

            {emails.map((msg, i) => (
                <div key={i} style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <strong>{msg.from}</strong> <br/>
                    <small>{msg.subject} - {msg.date}</small>
                    <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '10px', overflow: 'auto', maxHeight: '200px', fontSize: '11px', marginTop: '10px' }}>
                        {msg.source}
                    </pre>
                </div>
            ))}
        </div>
    );
}