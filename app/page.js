'use client'
import { useState } from 'react';
import { fetchEmails } from './actions';

export default function EmailExtractor() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Password Lock (Replaces your PHP session check)
    if (!isLoggedIn) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '320px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Access</h4>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        onKeyDown={(e) => e.key === 'Enter' && e.target.value === 'CMH14' && setIsLoggedIn(true)}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <button 
                        onClick={(e) => {
                            const val = e.target.previousSibling.value;
                            if(val === 'CMH14') setIsLoggedIn(true);
                            else alert('Wrong Password');
                        }}
                        style={{ width: '100%', padding: '10px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '5px' }}
                    >Unlock</button>
                </div>
            </div>
        );
    }

    // 2. Main Extractor UI
    async function handleAction(formData) {
        setLoading(true);
        try {
            const data = await fetchEmails(formData);
            setEmails(data);
        } catch (err) {
            alert("Connection Failed: " + err.message);
        }
        setLoading(false);
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h5 style={{ color: '#6c757d' }}>Email Original Extractor</h5>
                <button onClick={() => setIsLoggedIn(false)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
            </div>

            <form action={handleAction} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Gmail Address:</label>
                    <input name="email" type="email" required style={{ padding: '5px', border: '1px solid #ddd' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>App Password:</label>
                    <input name="password" type="password" required style={{ padding: '5px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ width: '60px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Start:</label>
                    <input name="start" type="number" defaultValue="1" style={{ width: '100%', padding: '5px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ width: '60px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Get:</label>
                    <input name="count" type="number" defaultValue="5" style={{ width: '100%', padding: '5px', border: '1px solid #ddd' }} />
                </div>
                <button type="submit" disabled={loading} style={{ backgroundColor: '#2c5e8c', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', flexGrow: 1 }}>
                    {loading ? 'Fetching...' : 'Fetch Original Source'}
                </button>
            </form>

            {emails.map((msg) => (
                <div key={msg.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', marginBottom: '15px', border: '1px solid #eee' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <strong>{msg.from}</strong> <br/>
                        <span style={{ fontSize: '13px', color: '#666' }}>{msg.subject}</span>
                    </div>
                    <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '5px', fontSize: '11px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                        {msg.source}
                    </pre>
                </div>
            ))}
        </div>
    );
}
