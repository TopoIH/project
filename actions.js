'use server'
import { ImapFlow } from 'imapflow';

export async function fetchEmails(formData) {
    const email = formData.get('email');
    const password = formData.get('password').replace(/\s/g, '');
    const count = parseInt(formData.get('count')) || 5;

    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: { user: email, pass: password },
        logger: false
    });

    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    const emails = [];

    try {
        // Fetching with 'source: true' gives you the raw RFC822 content
        for await (let msg of client.fetch({ last: count }, { source: true, envelope: true })) {
            emails.push({
                subject: msg.envelope.subject,
                from: msg.envelope.from[0].address,
                date: msg.envelope.date.toLocaleString(),
                source: msg.source.toString()
            });
        }
    } finally {
        lock.release();
    }

    await client.logout();
    return emails.reverse();
}