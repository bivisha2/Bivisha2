// Export utilities for analytics data

export interface ExportData {
  title: string;
  data: any[];
  filename: string;
}

export class ExportService {
  // Export to CSV
  static exportToCSV(data: ExportData): void {
    const { data: rows, filename } = data;
    
    if (rows.length === 0) {
      alert('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(rows[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...rows.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  // Export to JSON
  static exportToJSON(data: ExportData): void {
    const { data: rows, filename } = data;
    
    const jsonContent = JSON.stringify(rows, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  // Export to PDF (simplified - creates a formatted text file)
  static exportToPDF(data: ExportData): void {
    const { title, data: rows, filename } = data;
    
    let content = `${title}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `${'='.repeat(80)}\n\n`;

    if (rows.length === 0) {
      content += 'No data available\n';
    } else {
      const headers = Object.keys(rows[0]);
      
      // Add header
      content += headers.map(h => h.toUpperCase().padEnd(20)).join(' | ') + '\n';
      content += '-'.repeat(80) + '\n';
      
      // Add rows
      rows.forEach(row => {
        content += headers.map(h => {
          const value = row[h];
          return String(value).padEnd(20);
        }).join(' | ') + '\n';
      });
    }

    this.downloadFile(content, `${filename}.txt`, 'text/plain');
  }

  // Export analytics summary
  static exportAnalyticsSummary(analytics: any): void {
    const summary = {
      generated_at: new Date().toISOString(),
      total_revenue: analytics.totalRevenue,
      total_invoices: analytics.totalInvoices,
      total_clients: analytics.totalClients,
      paid_invoices: analytics.paidInvoices,
      pending_invoices: analytics.pendingInvoices,
      overdue_invoices: analytics.overdueInvoices,
      average_invoice_value: analytics.averageInvoiceValue,
      outstanding_amount: analytics.outstandingAmount,
      payment_rate: analytics.paymentRate,
      monthly_revenue: analytics.monthlyRevenue,
      top_clients: analytics.topClients
    };

    this.exportToJSON({
      title: 'Analytics Summary',
      data: [summary],
      filename: `analytics_summary_${new Date().toISOString().split('T')[0]}`
    });
  }

  // Export invoice list
  static exportInvoices(invoices: any[]): void {
    const invoiceData = invoices.map(inv => ({
      invoice_number: inv.invoiceNumber,
      client_name: inv.clientName,
      date: inv.date,
      due_date: inv.dueDate,
      amount: inv.amount,
      status: inv.status
    }));

    this.exportToCSV({
      title: 'Invoices',
      data: invoiceData,
      filename: `invoices_${new Date().toISOString().split('T')[0]}`
    });
  }

  // Export client list
  static exportClients(clients: any[]): void {
    const clientData = clients.map(client => ({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      total_invoices: client.totalInvoices,
      total_revenue: client.totalRevenue,
      outstanding_balance: client.outstandingBalance
    }));

    this.exportToCSV({
      title: 'Clients',
      data: clientData,
      filename: `clients_${new Date().toISOString().split('T')[0]}`
    });
  }

  // Helper method to download file
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Print invoice
  static printInvoice(invoiceElement: HTMLElement): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Invoice</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; }
        .total { font-weight: bold; font-size: 1.2em; }
        @media print {
          button { display: none; }
        }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write(invoiceElement.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }
}