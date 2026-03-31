'use server'
import { ImapFlow } from 'imapflow';

export async function fetchEmails(formData) {
    const email = formData.get('email');
    const password = formData.get('password').replace(/\s/g, '');
    const count = parseInt(formData.get('count')) || 5;
    const start = parseInt(formData.get('start')) || 1;

    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: { user: email, pass: password },
        logger: false,
        // Gmail sometimes needs this for Vercel's shared IPs
        tls: { rejectUnauthorized: false } 
    });

    try {
        await client.connect();
        let lock = await client.getMailboxLock('INBOX');
        const emails = [];

        // This matches your PHP 'rsort' and 'array_slice' logic
        // We fetch from the end (newest first)
        const status = await client.status('INBOX', { messages: true });
        const totalMessages = status.messages;
        
        // Calculate range based on your "Start" and "Get" inputs
        const rangeEnd = totalMessages - (start - 1);
        const rangeStart = Math.max(1, rangeEnd - (count - 1));

        for await (let msg of client.fetch(`${rangeStart}:${rangeEnd}`, { source: true, envelope: true })) {
            emails.push({
                id: msg.seq,
                subject: msg.envelope.subject,
                from: msg.envelope.from[0].address,
                date: msg.envelope.date.toUTCString(),
                source: msg.source.toString()
            });
        }

        lock.release();
        await client.logout();
        return emails.reverse(); // Newest at top
    } catch (err) {
        throw new Error(err.message);
    }
}
