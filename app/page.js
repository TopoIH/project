'use client'
import { useState } from 'react';
import { fetchEmails } from './actions';

export default function EmailExtractor() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

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

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f1f3f5', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h5 style={{ color: '#6c757d', margin: 0 }}>📧 Email Original Extractor</h5>
                <button onClick={() => setIsLoggedIn(false)} style={{ color: '#dc3545', background: 'none', border: '1px solid #dc3545', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
            </div>

            {/* Compact Header Form */}
            <form action={async (formData) => {
                setLoading(true);
                try {
                    const data = await fetchEmails(formData);
                    setEmails(data);
                } catch (err) { alert(err.message); }
                setLoading(false);
            }} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '20px' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>Gmail/Email:</label>
                    <input name="email" type="email" required style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>App Password:</label>
                    <input name="password" type="password" required style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <div style={{ width: '60px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>Start:</label>
                    <input name="start" type="number" defaultValue="1" min="1" style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <div style={{ width: '60px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>Get:</label>
                    <input name="count" type="number" defaultValue="5" min="1" style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <button type="submit" disabled={loading} style={{ backgroundColor: '#2c5e8c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    {loading ? 'Processing...' : 'Fetch Original Source'}
                </button>
            </form>

            {/* Results Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {emails.map((msg) => (
                    <div key={msg.id} style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #dee2e6', display: 'flex', overflow: 'hidden', height: '250px' }}>
                        {/* Left Info Panel */}
                        <div style={{ width: '250px', padding: '15px', borderRight: '1px solid #eee', backgroundColor: '#fdfdfd' }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', wordBreak: 'break-all', marginBottom: '5px' }}>{msg.from}</div>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>{msg.subject}</div>
                            <div style={{ fontSize: '10px', padding: '3px 6px', backgroundColor: '#e9ecef', borderRadius: '4px', display: 'inline-block' }}>{msg.date}</div>
                            <button 
                                onClick={() => copyToClipboard(msg.source)}
                                style={{ display: 'block', marginTop: '20px', width: '100%', padding: '5px', fontSize: '11px', backgroundColor: '#343a40', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                            >Copy Full Source</button>
                        </div>
                        
                        {/* Right Scrollable Content (The "foreach" box) */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <pre style={{ 
                                margin: 0, 
                                height: '100%', 
                                padding: '15px', 
                                backgroundColor: '#1e1e1e', 
                                color: '#d4d4d4', 
                                fontSize: '11px', 
                                fontFamily: 'monospace', 
                                overflow: 'auto', // This makes it scrollable
                                whiteSpace: 'pre-wrap', 
                                wordBreak: 'break-all' 
                            }}>
                                {msg.source}
                            </pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
