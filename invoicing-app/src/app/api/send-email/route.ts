import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { to, subject, invoiceNumber, clientName, amount, dueDate } = await request.json();

        if (!to || !subject) {
            return NextResponse.json(
                { success: false, message: 'Email and subject are required' },
                { status: 400 }
            );
        }

        // Create mailto link with invoice details
        const body = `Hello ${clientName},

Please find your invoice details below:

Invoice Number: ${invoiceNumber}
Amount: Rs. ${amount}
Due Date: ${dueDate}

Thank you for your business!

Best regards,
InvoicePro Team`;

        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        return NextResponse.json({
            success: true,
            message: 'Email client will open',
            mailtoLink: mailtoLink
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to prepare email' },
            { status: 500 }
        );
    }
}
