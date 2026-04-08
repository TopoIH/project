'use server'
import { ImapFlow } from 'imapflow';

export async function fetchEmails(formData) {
    const email = formData.get('email');
    const password = formData.get('password').replace(/\s/g, '');
    const folder = formData.get('folder');
    const count = parseInt(formData.get('count')) || 5;
    const startOffset = parseInt(formData.get('start')) || 1;
    const cleanMode = formData.get('cleanMode') === 'true'; // New option

    const client = new ImapFlow({
        host: 'imap.gmail.com', port: 993, secure: true,
        auth: { user: email, pass: password },
        logger: false, tls: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        let lock = await client.getMailboxLock(folder);
        const status = await client.status(folder, { messages: true });
        const total = status.messages;
        const end = total - (startOffset - 1);
        const start = Math.max(1, end - (count - 1));

        const emails = [];
        for await (let msg of client.fetch(`${start}:${end}`, { source: true, envelope: true })) {
            let source = msg.source.toString();

            if (cleanMode) {
                // 1. Remove everything from Delivered-To until Return-Path (inclusive)
                source = source.replace(/Delivered-To:[\s\S]*?Return-Path:.*?\r?\n/i, '');

                // 2. Remove specific security headers
                source = source.replace(/Received-SPF:.*?\r?\n/gi, '');
                source = source.replace(/Authentication-Results:.*?\r?\n/gi, '');
                source = source.replace(/DKIM-Signature:[\s\S]*?(\r?\n(?![ \t]))/gi, '');
                
                // 3. Replace From domain with [P_RPATH]
                source = source.replace(/From: (.*?)@.*?\r?\n/gi, 'From: $1@[P_RPATH]\r\n');

                // 4. Replace To address with [*to]
                source = source.replace(/To: .*?\r?\n/gi, 'To: [*to]\r\n');

                // 5. Replace Date with [*date]
                source = source.replace(/Date: .*?\r?\n/gi, 'Date: [*date]\r\n');

                // 6. Add [EID] before @ in Message-ID
                source = source.replace(/Message-ID: <(.*?)@(.*?)>/gi, 'Message-ID: <$1[EID]@$2>');
            }

            emails.push({
                id: msg.seq,
                subject: msg.envelope.subject,
                from: msg.envelope.from[0].address,
                date: msg.envelope.date.toLocaleString(),
                source: source.trim()
            });
        }
        lock.release();
        await client.logout();
        return emails.reverse();
    } catch (err) {
        throw new Error(err.message);
    }
}
