import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const CONTACT_NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL ?? 'edii_i@hotmail.com';

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error loading contacts:', error);
    return NextResponse.json({ error: 'Failed to load contacts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.fullName || !body?.email || !body?.message) {
      return NextResponse.json({ error: 'Missing required contact fields' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone ?? null,
        message: body.message,
      },
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const emailText = [
        `New contact request from ${contact.fullName}`,
        '',
        `Email: ${contact.email}`,
        `Phone: ${contact.phone || 'N/A'}`,
        '',
        contact.message,
      ].join('\n');

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Mik Adventures <onboarding@resend.dev>',
            to: [CONTACT_NOTIFY_EMAIL],
            subject: `New contact request from ${contact.fullName}`,
            text: emailText,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send contact email:', emailError);
      }
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
