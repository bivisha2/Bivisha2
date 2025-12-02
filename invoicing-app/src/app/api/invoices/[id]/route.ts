import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/invoices/[id] - Fetch single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { clientId, items, status, notes, terms, ...invoiceData } = body;

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        ...invoiceData,
        clientId,
        status,
        notes,
        terms,
      },
    });

    // Delete existing items and create new ones
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });

    if (items && items.length > 0) {
      await prisma.invoiceItem.createMany({
        data: items.map((item: any) => ({
          ...item,
          invoiceId: params.id,
        })),
      });
    }

    // Fetch updated invoice with items
    const updatedInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete invoice items first
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });

    // Delete invoice
    await prisma.invoice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
