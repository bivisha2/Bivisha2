// Data Backup and Restore Service

import { dataStore } from '../lib/dataStore';

export class BackupService {
  private static readonly BACKUP_KEY = 'invoicepro_backup';
  private static readonly AUTO_BACKUP_KEY = 'invoicepro_auto_backup';
  private static readonly BACKUP_TIMESTAMP_KEY = 'invoicepro_backup_timestamp';

  // Create a full backup of all data
  static createBackup(): string {
    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      data: {
        clients: dataStore.getAllClients(),
        products: dataStore.getAllProducts(),
        invoices: dataStore.getAllInvoices(),
        users: dataStore.getAllUsers()
      }
    };

    return JSON.stringify(backupData, null, 2);
  }

  // Save backup to file
  static downloadBackup(): void {
    const backupData = this.createBackup();
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `invoicepro_backup_${new Date().toISOString().replace(/:/g, '-')}.json`;

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Save to localStorage as well
    this.saveToLocalStorage(backupData);

    console.log('✅ Backup created successfully:', filename);
  }

  // Save backup to localStorage
  static saveToLocalStorage(backupData: string): void {
    try {
      localStorage.setItem(this.BACKUP_KEY, backupData);
      localStorage.setItem(this.BACKUP_TIMESTAMP_KEY, new Date().toISOString());
      console.log('✅ Backup saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save backup to localStorage:', error);
    }
  }

  // Restore from backup file
  static async restoreFromFile(file: File): Promise<boolean> {
    try {
      const content = await this.readFile(file);
      return this.restoreFromJSON(content);
    } catch (error) {
      console.error('❌ Failed to restore from file:', error);
      return false;
    }
  }

  // Restore from JSON string
  static restoreFromJSON(jsonString: string): boolean {
    try {
      const backupData = JSON.parse(jsonString);

      // Validate backup structure
      if (!backupData.version || !backupData.data) {
        console.error('❌ Invalid backup format');
        return false;
      }

      // Clear existing data
      console.log('🔄 Clearing existing data...');

      // Restore data
      console.log('🔄 Restoring data...');

      if (backupData.data.clients) {
        backupData.data.clients.forEach((client: any) => {
          dataStore.createClient(client);
        });
        console.log(`✅ Restored ${backupData.data.clients.length} clients`);
      }

      if (backupData.data.products) {
        backupData.data.products.forEach((product: any) => {
          dataStore.createProduct(product);
        });
        console.log(`✅ Restored ${backupData.data.products.length} products`);
      }

      if (backupData.data.invoices) {
        backupData.data.invoices.forEach((invoice: any) => {
          dataStore.createInvoice(invoice);
        });
        console.log(`✅ Restored ${backupData.data.invoices.length} invoices`);
      }

      console.log('✅ Backup restored successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to restore backup:', error);
      return false;
    }
  }

  // Restore from localStorage
  static restoreFromLocalStorage(): boolean {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY);

      if (!backupData) {
        console.log('ℹ️ No backup found in localStorage');
        return false;
      }

      return this.restoreFromJSON(backupData);
    } catch (error) {
      console.error('❌ Failed to restore from localStorage:', error);
      return false;
    }
  }

  // Auto backup - called periodically or on important changes
  static autoBackup(): void {
    const backupData = this.createBackup();
    localStorage.setItem(this.AUTO_BACKUP_KEY, backupData);
    console.log('🔄 Auto-backup saved');
  }

  // Get last backup info
  static getLastBackupInfo(): { exists: boolean; timestamp?: string } {
    const timestamp = localStorage.getItem(this.BACKUP_TIMESTAMP_KEY);

    if (!timestamp) {
      return { exists: false };
    }

    return {
      exists: true,
      timestamp: timestamp
    };
  }

  // Helper to read file content
  private static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };

      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsText(file);
    });
  }

  // Export specific data types
  static exportClients(): void {
    const clients = dataStore.getAllClients();
    const data = JSON.stringify(clients, null, 2);
    this.downloadData(data, 'clients');
  }

  static exportProducts(): void {
    const products = dataStore.getAllProducts();
    const data = JSON.stringify(products, null, 2);
    this.downloadData(data, 'products');
  }

  static exportInvoices(): void {
    const invoices = dataStore.getAllInvoices();
    const data = JSON.stringify(invoices, null, 2);
    this.downloadData(data, 'invoices');
  }

  private static downloadData(data: string, type: string): void {
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `${type}_${new Date().toISOString().split('T')[0]}.json`;

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Check if auto-backup is needed (e.g., every hour)
  static shouldAutoBackup(): boolean {
    const lastBackup = localStorage.getItem(this.BACKUP_TIMESTAMP_KEY);

    if (!lastBackup) return true;

    const lastBackupTime = new Date(lastBackup).getTime();
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    return (currentTime - lastBackupTime) > oneHour;
  }

  // Initialize auto-backup
  static initAutoBackup(): void {
    // Check and perform auto-backup every 5 minutes
    setInterval(() => {
      if (this.shouldAutoBackup()) {
        this.autoBackup();
      }
    }, 5 * 60 * 1000);

    // Also backup on page unload
    window.addEventListener('beforeunload', () => {
      this.autoBackup();
    });
  }
}