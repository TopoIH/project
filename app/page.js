// ... keep your login logic the same ...

// Inside your return() form:
<form action={async (formData) => {
    setLoading(true);
    try {
        const data = await fetchEmails(formData);
        setEmails(data);
    } catch (err) { alert(err.message); }
    setLoading(false);
}} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '20px' }}>
    
    <div style={{ flex: 2 }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>Gmail/Email:</label>
        <input name="email" type="email" required style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
    </div>

    {/* NEW FOLDER INPUT */}
    <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>Label/Folder:</label>
        <input name="folder" type="text" defaultValue="INBOX" placeholder="e.g. [Gmail]/Spam" style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
    </div>

    <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>App Password:</label>
        <input name="password" type="password" required style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
    </div>

    <div style={{ width: '50px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>Start:</label>
        <input name="start" type="number" defaultValue="1" min="1" style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
    </div>

    <div style={{ width: '50px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold' }}>Get:</label>
        <input name="count" type="number" defaultValue="5" min="1" style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} />
    </div>

    <button type="submit" disabled={loading} style={{ backgroundColor: '#2c5e8c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        {loading ? 'Processing...' : 'Fetch'}
    </button>
</form>

// ... keep the results mapping the same ...
