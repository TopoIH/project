'use server'
import { ImapFlow } from 'imapflow';

export async function fetchEmails(formData) {
    const email = formData.get('email');
    const password = formData.get('password').replace(/\s/g, '');
    const count = parseInt(formData.get('count')) || 5;
    const startOffset = parseInt(formData.get('start')) || 1;

    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: { user: email, pass: password },
        logger: false,
        tls: { rejectUnauthorized: false } 
    });

    try {
        await client.connect();
        let lock = await client.getMailboxLock('INBOX');
        
        // Get the total number of messages to calculate the offset
        const status = await client.status('INBOX', { messages: true });
        const total = status.messages;

        // Calculate the range to match your PHP logic (Newest first)
        // If total is 100, start 1, get 5 -> we want messages 100, 99, 98, 97, 96
        const end = total - (startOffset - 1);
        const start = Math.max(1, end - (count - 1));

        const emails = [];
        // Fetch the specific range
        for await (let msg of client.fetch(`${start}:${end}`, { source: true, envelope: true })) {
            emails.push({
                id: msg.seq,
                subject: msg.envelope.subject,
                from: msg.envelope.from[0].address,
                date: msg.envelope.date.toLocaleString(),
                source: msg.source.toString()
            });
        }

        lock.release();
        await client.logout();
        
        // Reverse so the absolute newest is at the top of your screen
        return emails.reverse(); 
    } catch (err) {
        throw new Error(err.message);
    }
}
