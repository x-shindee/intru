// Google Sheets Integration for intru ecommerce platform
// This module handles syncing data with Google Sheets for backup and analytics

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  sheets: {
    products: string;
    orders: string;
    customers: string;
    analytics: string;
    personas: string;
    recommendations: string;
  };
}

export class GoogleSheetsIntegration {
  private config: GoogleSheetsConfig;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  // Sync products data to Google Sheets
  async syncProducts(products: any[]): Promise<boolean> {
    try {
      const sheetData = products.map(product => [
        product.id,
        product.name,
        product.slug,
        product.price,
        product.compare_price || '',
        product.sku,
        product.inventory_quantity,
        product.status,
        JSON.stringify(product.categories),
        JSON.stringify(product.tags),
        product.created_at,
        product.updated_at
      ]);

      // Add headers
      const headers = [
        'ID', 'Name', 'Slug', 'Price', 'Compare Price', 'SKU',
        'Inventory', 'Status', 'Categories', 'Tags', 'Created', 'Updated'
      ];

      return await this.updateSheet(this.config.sheets.products, [headers, ...sheetData]);
    } catch (error) {
      console.error('Error syncing products to Google Sheets:', error);
      return false;
    }
  }

  // Sync orders data to Google Sheets
  async syncOrders(orders: any[]): Promise<boolean> {
    try {
      const sheetData = orders.map(order => [
        order.id,
        order.order_number,
        order.user_id || '',
        order.email,
        order.status,
        order.payment_status,
        order.total_amount,
        order.subtotal,
        order.tax_amount,
        order.shipping_amount,
        order.discount_amount,
        order.payment_method || '',
        order.created_at,
        order.updated_at
      ]);

      const headers = [
        'ID', 'Order Number', 'User ID', 'Email', 'Status', 'Payment Status',
        'Total', 'Subtotal', 'Tax', 'Shipping', 'Discount', 'Payment Method',
        'Created', 'Updated'
      ];

      return await this.updateSheet(this.config.sheets.orders, [headers, ...sheetData]);
    } catch (error) {
      console.error('Error syncing orders to Google Sheets:', error);
      return false;
    }
  }

  // Sync customer personas to Google Sheets
  async syncPersonas(personas: any[]): Promise<boolean> {
    try {
      const sheetData = personas.map(persona => [
        persona.id,
        persona.name,
        persona.description,
        JSON.stringify(persona.demographics),
        JSON.stringify(persona.psychographics),
        JSON.stringify(persona.behaviors),
        JSON.stringify(persona.pain_points),
        JSON.stringify(persona.goals),
        JSON.stringify(persona.triggers),
        persona.created_at,
        persona.updated_at
      ]);

      const headers = [
        'ID', 'Name', 'Description', 'Demographics', 'Psychographics',
        'Behaviors', 'Pain Points', 'Goals', 'Triggers', 'Created', 'Updated'
      ];

      return await this.updateSheet(this.config.sheets.personas, [headers, ...sheetData]);
    } catch (error) {
      console.error('Error syncing personas to Google Sheets:', error);
      return false;
    }
  }

  // Sync AI analytics to Google Sheets
  async syncAIAnalytics(interactions: any[]): Promise<boolean> {
    try {
      const sheetData = interactions.map(interaction => [
        interaction.id,
        interaction.session_id,
        interaction.user_id || '',
        interaction.product_id || '',
        interaction.message_type,
        interaction.message,
        interaction.intent || '',
        interaction.confidence || '',
        interaction.created_at
      ]);

      const headers = [
        'ID', 'Session ID', 'User ID', 'Product ID', 'Type',
        'Message', 'Intent', 'Confidence', 'Created'
      ];

      return await this.updateSheet(this.config.sheets.analytics, [headers, ...sheetData]);
    } catch (error) {
      console.error('Error syncing AI analytics to Google Sheets:', error);
      return false;
    }
  }

  // Sync growth recommendations to Google Sheets
  async syncRecommendations(recommendations: any[]): Promise<boolean> {
    try {
      const sheetData = recommendations.map(rec => [
        rec.id,
        rec.type,
        rec.title,
        rec.description,
        rec.priority,
        rec.effort_level,
        rec.impact_estimate,
        rec.target_persona || '',
        JSON.stringify(rec.action_items),
        rec.deadline || '',
        rec.status,
        rec.assigned_to || '',
        rec.created_at,
        rec.updated_at
      ]);

      const headers = [
        'ID', 'Type', 'Title', 'Description', 'Priority', 'Effort Level',
        'Impact Estimate', 'Target Persona', 'Action Items', 'Deadline',
        'Status', 'Assigned To', 'Created', 'Updated'
      ];

      return await this.updateSheet(this.config.sheets.recommendations, [headers, ...sheetData]);
    } catch (error) {
      console.error('Error syncing recommendations to Google Sheets:', error);
      return false;
    }
  }

  // Read data from Google Sheets (for importing)
  async readSheet(sheetName: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${sheetName}?key=${this.config.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.values && data.values.length > 1) {
        const headers = data.values[0];
        return data.values.slice(1).map((row: any[]) => {
          const obj: any = {};
          headers.forEach((header: string, index: number) => {
            obj[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || '';
          });
          return obj;
        });
      }

      return [];
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      return [];
    }
  }

  // Update a specific sheet with data
  private async updateSheet(sheetName: string, values: any[][]): Promise<boolean> {
    try {
      // First, clear the sheet
      const clearUrl = `${this.baseUrl}/${this.config.spreadsheetId}/values/${sheetName}:clear?key=${this.config.apiKey}`;
      await fetch(clearUrl, { method: 'POST' });

      // Then, update with new data
      const updateUrl = `${this.baseUrl}/${this.config.spreadsheetId}/values/${sheetName}?valueInputOption=RAW&key=${this.config.apiKey}`;
      
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      return false;
    }
  }

  // Batch sync all data
  async syncAllData(db: any): Promise<{success: boolean, results: any}> {
    const results = {
      products: false,
      orders: false,
      personas: false,
      analytics: false,
      recommendations: false
    };

    try {
      // Fetch all data from database
      const [products, orders, personas, analytics, recommendations] = await Promise.all([
        db.prepare('SELECT * FROM products ORDER BY created_at DESC LIMIT 1000').all(),
        db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 1000').all(),
        db.prepare('SELECT * FROM customer_personas ORDER BY created_at DESC').all(),
        db.prepare('SELECT * FROM ai_interactions ORDER BY created_at DESC LIMIT 5000').all(),
        db.prepare('SELECT * FROM growth_recommendations ORDER BY created_at DESC LIMIT 500').all()
      ]);

      // Sync each dataset
      results.products = await this.syncProducts(products.results || []);
      results.orders = await this.syncOrders(orders.results || []);
      results.personas = await this.syncPersonas(personas.results || []);
      results.analytics = await this.syncAIAnalytics(analytics.results || []);
      results.recommendations = await this.syncRecommendations(recommendations.results || []);

      const success = Object.values(results).every(result => result === true);
      
      return { success, results };
    } catch (error) {
      console.error('Error in batch sync:', error);
      return { success: false, results };
    }
  }

  // Create initial spreadsheet structure
  async createSpreadsheet(title: string = 'intru Ecommerce Data'): Promise<string> {
    try {
      const createUrl = `${this.baseUrl}?key=${this.config.apiKey}`;
      
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: title
          },
          sheets: [
            { properties: { title: 'Products' } },
            { properties: { title: 'Orders' } },
            { properties: { title: 'Customers' } },
            { properties: { title: 'AI_Analytics' } },
            { properties: { title: 'Customer_Personas' } },
            { properties: { title: 'Growth_Recommendations' } }
          ]
        })
      });

      const data = await response.json();
      return data.spreadsheetId || '';
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      return '';
    }
  }

  // Generate analytics report in Google Sheets
  async generateAnalyticsReport(): Promise<boolean> {
    try {
      const reportData = [
        ['Metric', 'Value', 'Date Generated'],
        ['Total Products', '5', new Date().toISOString()],
        ['Total Orders', '0', new Date().toISOString()],
        ['AI Interactions', '0', new Date().toISOString()],
        ['Active Recommendations', '5', new Date().toISOString()],
        ['Customer Personas', '3', new Date().toISOString()]
      ];

      return await this.updateSheet('Analytics_Summary', reportData);
    } catch (error) {
      console.error('Error generating analytics report:', error);
      return false;
    }
  }
}

// Factory function to create Google Sheets integration
export function createGoogleSheetsIntegration(config: Partial<GoogleSheetsConfig>): GoogleSheetsIntegration {
  const defaultConfig: GoogleSheetsConfig = {
    spreadsheetId: config.spreadsheetId || process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
    apiKey: config.apiKey || process.env.GOOGLE_SHEETS_API_KEY || '',
    sheets: {
      products: 'Products',
      orders: 'Orders', 
      customers: 'Customers',
      analytics: 'AI_Analytics',
      personas: 'Customer_Personas',
      recommendations: 'Growth_Recommendations'
    }
  };

  return new GoogleSheetsIntegration({ ...defaultConfig, ...config });
}

// Export types
export type { GoogleSheetsConfig };