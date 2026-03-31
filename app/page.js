// Inside your return() form in page.js
<div style={{ width: '70px' }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Start:</label>
    <input 
        name="start" 
        type="number" 
        defaultValue="1" 
        min="1" 
        style={{ width: '100%', padding: '5px', border: '1px solid #ddd' }} 
    />
</div>
<div style={{ width: '70px' }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Get:</label>
    <input 
        name="count" 
        type="number" 
        defaultValue="5" 
        min="1" 
        style={{ width: '100%', padding: '5px', border: '1px solid #ddd' }} 
    />
</div>
