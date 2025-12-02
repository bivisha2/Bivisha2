import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InvoiceData {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    dueDate: string;
    issueDate: string;
    items?: Array<{
        description: string;
        quantity: number;
        price: number;
        total: number;
    }>;
    subtotal?: number;
    tax?: number;
    notes?: string;
}

/**
 * Generate and download PDF from an HTML element
 */
export const downloadInvoicePDF = async (
    elementId: string,
    fileName: string = 'invoice.pdf'
): Promise<boolean> => {
    try {
        console.log('Starting PDF generation for element:', elementId);

        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            alert('Error: Invoice content element not found. Please refresh and try again.');
            return false;
        }

        console.log('Element found, dimensions:', element.offsetWidth, 'x', element.offsetHeight);

        // Wait a bit for any rendering to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Capture the element as canvas with error handling
        console.log('Starting html2canvas capture...');
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true,
            onclone: (clonedDoc: Document) => {
                console.log('Document cloned for canvas rendering');
            }
        });

        console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            console.error('Canvas is invalid:', canvas);
            alert('Error: Failed to capture invoice content. Canvas is empty.');
            return false;
        }

        // Calculate PDF dimensions
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        console.log('Creating PDF document...');

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        console.log('Adding image to PDF...');

        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        console.log('Saving PDF as:', fileName);

        // Download the PDF
        pdf.save(fileName);

        console.log('PDF download triggered successfully');
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
};

/**
 * Generate PDF and return as blob
 */
export const generateInvoicePDFBlob = async (
    elementId: string
): Promise<Blob | null> => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return null;
        }

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        return pdf.output('blob');
    } catch (error) {
        console.error('Error generating PDF blob:', error);
        return null;
    }
};

/**
 * Send invoice via email using Gmail
 */
export const sendInvoiceEmail = async (invoiceData: InvoiceData): Promise<boolean> => {
    try {
        const subject = `Invoice ${invoiceData.invoiceNumber} - Payment Due`;
        const body = `Dear ${invoiceData.clientName},

Please find your invoice details below:

Invoice Number: ${invoiceData.invoiceNumber}
Issue Date: ${invoiceData.issueDate}
Due Date: ${invoiceData.dueDate}
Amount Due: Rs. ${invoiceData.amount.toLocaleString()}

${invoiceData.notes ? `Notes: ${invoiceData.notes}\n\n` : ''}
Please make payment by the due date to avoid any late fees.

Thank you for your business!

Best regards,
InvoicePro Team`;

        // Open Gmail compose with pre-filled data
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(invoiceData.clientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(gmailUrl, '_blank');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

/**
 * Send invoice via default email client (mailto)
 */
export const sendInvoiceViaMailto = (invoiceData: InvoiceData): boolean => {
    try {
        const subject = `Invoice ${invoiceData.invoiceNumber} - Payment Due`;
        const body = `Dear ${invoiceData.clientName},

Please find your invoice details below:

Invoice Number: ${invoiceData.invoiceNumber}
Issue Date: ${invoiceData.issueDate}
Due Date: ${invoiceData.dueDate}
Amount Due: Rs. ${invoiceData.amount.toLocaleString()}

${invoiceData.notes ? `Notes: ${invoiceData.notes}\n\n` : ''}
Please make payment by the due date.

Thank you for your business!

Best regards,
InvoicePro Team`;

        const mailtoLink = `mailto:${invoiceData.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
        return true;
    } catch (error) {
        console.error('Error opening mailto:', error);
        return false;
    }
};
