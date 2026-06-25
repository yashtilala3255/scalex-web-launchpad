import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  country?: string;
  gstin?: string;
  ship_to_same?: boolean;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pin?: string;
  shipping_country?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  unit: string; // hrs, units, months, etc.
  unit_price: number;
  tax_rate: number; // e.g. 18 for 18%
  hsn_sac?: string;
}

export interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_type: "percent" | "flat";
  discount_value: number;
  discount_amount: number;
  tax_rate: number;
  hsn_sac?: string;
  line_total: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque" | "Card";
  transaction_ref?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id?: string;
  client_data: Client;
  invoice_date: string;
  due_date: string;
  status: "Draft" | "Sent" | "Viewed" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled";
  currency: string;
  currency_symbol: string;
  payment_terms: string;
  items: InvoiceItem[];
  subtotal: number;
  discount_type: "percent" | "flat";
  discount_value: number;
  discount_amount: number;
  tax_summary: { label: string; rate: number; taxable_amount: number; tax_amount: number }[];
  total_tax: number;
  shipping_charges: number;
  adjustment: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  business_details: {
    name: string;
    logo_url?: string;
    address: string;
    email: string;
    phone?: string;
    gstin?: string;
    pan?: string;
    cin?: string;
  };
  bank_details?: {
    account_name: string;
    account_number: string;
    ifsc: string;
    bank_name: string;
    branch: string;
    upi_id?: string;
  };
  terms_conditions?: string;
  notes?: string;
  template_id: "classic" | "modern" | "minimal" | "gst" | "creative" | "compact";
  color_theme: string;
  show_logo: boolean;
  show_bank: boolean;
  show_signature: boolean;
  show_qr: boolean;
  signature_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RecurringSchedule {
  id: string;
  schedule_name: string;
  client_id: string;
  client_name: string;
  invoice_template_data: Partial<Invoice>;
  frequency: "Weekly" | "Monthly" | "Quarterly" | "Yearly";
  start_date: string;
  end_date?: string;
  max_occurrences?: number;
  occurrences_count: number;
  is_active: boolean;
  last_generated_at?: string;
  next_generation_date: string;
  auto_send: boolean;
}

export interface CreditNote {
  id: string;
  credit_note_number: string;
  invoice_id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  credit_note_date: string;
  amount: number;
  reason: string;
  items: { name: string; quantity: number; unit_price: number; total: number }[];
}

export interface InvoiceSettings {
  default_currency: string;
  default_currency_symbol: string;
  default_tax_rate: number;
  default_payment_terms: string;
  invoice_prefix: string;
  next_invoice_number: number;
  default_terms: string;
  default_notes: string;
  business_name: string;
  business_logo?: string;
  business_address: string;
  business_email: string;
  business_phone?: string;
  business_gstin?: string;
  business_pan?: string;
  business_cin?: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_ifsc: string;
  bank_name: string;
  bank_branch: string;
  bank_upi_id?: string;
}

const DEFAULT_SETTINGS: InvoiceSettings = {
  default_currency: "INR",
  default_currency_symbol: "₹",
  default_tax_rate: 18,
  default_payment_terms: "Net 30",
  invoice_prefix: "INV-2026-",
  next_invoice_number: 1,
  default_terms: "1. Please pay within the due date to avoid service interruption.\n2. All payments should be made to the bank account listed on this invoice.\n3. Standard support retainers are billed in advance.",
  default_notes: "Thank you for partnering with ScaleXWeb Solution! We appreciate your business.",
  business_name: "ScaleXWeb Solution",
  business_address: "B-402, Titanium Heights, Corporate Road, Prahladnagar, Ahmedabad, Gujarat - 380015",
  business_email: "scalexwebsolution@gmail.com",
  business_phone: "+91 98765 43210",
  business_gstin: "24AAECS7890A1Z2",
  business_pan: "AAECS7890A",
  business_cin: "U72900GJ2026PTC123456",
  bank_account_name: "SCALEXWEB SOLUTION",
  bank_account_number: "50200088992211",
  bank_ifsc: "HDFC0000048",
  bank_name: "HDFC Bank",
  bank_branch: "Prahladnagar Branch, Ahmedabad",
  bank_upi_id: "scalexweb@upi",
};

// Purge Mock Data helper to clean up LocalStorage and Supabase database
const purgeMockData = async () => {
  if (typeof window === "undefined") return;

  const mockClientIds = ["client-1", "client-2"];
  const mockProductIds = ["prod-1", "prod-2", "prod-3"];
  const mockInvoiceIds = ["inv-demo-1", "inv-demo-2"];
  const mockPaymentIds = ["pay-1", "pay-2"];

  // 1. Clean LocalStorage
  // Clients
  const storedClients = localStorage.getItem("scalex_invoice_clients");
  if (storedClients) {
    try {
      const clients: Client[] = JSON.parse(storedClients);
      const cleaned = clients.filter(c => !mockClientIds.includes(c.id));
      if (cleaned.length !== clients.length) {
        localStorage.setItem("scalex_invoice_clients", JSON.stringify(cleaned));
      }
    } catch (e) {
      console.error("Error parsing local clients:", e);
    }
  }

  // Products
  const storedProducts = localStorage.getItem("scalex_invoice_products");
  if (storedProducts) {
    try {
      const products: Product[] = JSON.parse(storedProducts);
      const cleaned = products.filter(p => !mockProductIds.includes(p.id));
      if (cleaned.length !== products.length) {
        localStorage.setItem("scalex_invoice_products", JSON.stringify(cleaned));
      }
    } catch (e) {
      console.error("Error parsing local products:", e);
    }
  }

  // Invoices
  const storedInvoices = localStorage.getItem("scalex_invoices");
  if (storedInvoices) {
    try {
      const invoices: Invoice[] = JSON.parse(storedInvoices);
      const cleaned = invoices.filter(inv => !mockInvoiceIds.includes(inv.id));
      if (cleaned.length !== invoices.length) {
        localStorage.setItem("scalex_invoices", JSON.stringify(cleaned));
      }
    } catch (e) {
      console.error("Error parsing local invoices:", e);
    }
  }

  // Payments
  const storedPayments = localStorage.getItem("scalex_invoice_payments");
  if (storedPayments) {
    try {
      const payments: Payment[] = JSON.parse(storedPayments);
      const cleaned = payments.filter(p => !mockPaymentIds.includes(p.id) && !mockInvoiceIds.includes(p.invoice_id));
      if (cleaned.length !== payments.length) {
        localStorage.setItem("scalex_invoice_payments", JSON.stringify(cleaned));
      }
    } catch (e) {
      console.error("Error parsing local payments:", e);
    }
  }

  // 2. Clean Supabase (if configured and running in browser)
  if (isSupabaseConfigured && supabase) {
    try {
      // Order of deletion: payments first (FK constraints), then invoice_items (FK constraints), then invoices, then products and clients
      // Note: We run these asynchronously and don't block
      const deletePayments = supabase.from("payments").delete().in("invoice_id", mockInvoiceIds);
      const deletePaymentsById = supabase.from("payments").delete().in("id", mockPaymentIds);
      const deleteItems = supabase.from("invoice_items").delete().in("invoice_id", mockInvoiceIds);
      const deleteInvoices = supabase.from("invoices").delete().in("id", mockInvoiceIds);
      const deleteProducts = supabase.from("products").delete().in("id", mockProductIds);
      const deleteClients = supabase.from("clients").delete().in("id", mockClientIds);

      // Execute queries
      await Promise.allSettled([
        deletePayments,
        deletePaymentsById,
        deleteItems,
        deleteInvoices,
        deleteProducts,
        deleteClients
      ]);
    } catch (err) {
      console.warn("Could not purge mock data from Supabase:", err);
    }
  }
};

// Seed Defaults Mock Data Helper
const seedInitialData = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("scalex_invoice_settings")) {
    localStorage.setItem("scalex_invoice_settings", JSON.stringify(DEFAULT_SETTINGS));
  }

  // Clean/purge any legacy mock data from local storage & Supabase
  purgeMockData();
};

// Initialize seeding
seedInitialData();

// Persisted failed tables map to survive refreshes
const getFailedTables = (): { [key: string]: boolean } => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("scalex_failed_tables");
  return stored ? JSON.parse(stored) : {};
};

const markTableFailed = (table: string) => {
  if (typeof window === "undefined") return;
  const failed = getFailedTables();
  failed[table] = true;
  localStorage.setItem("scalex_failed_tables", JSON.stringify(failed));
};

// Storage helper functions
export const invoiceStorage = {
  // --- Clear cache and retry sync ---
  resetSyncRegistry(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("scalex_failed_tables");
    }
  },

  // --- Settings ---
  getSettings(): InvoiceSettings {
    const stored = localStorage.getItem("scalex_invoice_settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  },
  saveSettings(settings: InvoiceSettings): void {
    localStorage.setItem("scalex_invoice_settings", JSON.stringify(settings));
  },

  // --- Clients ---
  async getClients(): Promise<Client[]> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["clients"]) {
      try {
        const { data, error } = await supabase.from("clients").select("*").order("name");
        if (!error && data) {
          const cleanedData = data.filter(c => c.id !== "client-1" && c.id !== "client-2");
          if (cleanedData.length > 0) {
            localStorage.setItem("scalex_invoice_clients", JSON.stringify(cleanedData));
            return cleanedData;
          } else {
            // If Supabase is empty, check if we have local storage data to seed it
            const stored = localStorage.getItem("scalex_invoice_clients");
            const localClients = stored ? JSON.parse(stored) : [];
            const cleanedLocal = localClients.filter((c: any) => c.id !== "client-1" && c.id !== "client-2");
            if (cleanedLocal.length > 0) {
              console.log("Supabase clients is empty, seeding from LocalStorage...");
              for (const c of cleanedLocal) {
                await supabase.from("clients").upsert(c);
              }
              return cleanedLocal;
            }
          }
          return cleanedData;
        }
        if (error) {
          console.warn("Supabase clients query failed, falling back to LocalStorage:", error.message);
          markTableFailed("clients");
        }
      } catch (e) {
        markTableFailed("clients");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_clients");
    const localClients = stored ? JSON.parse(stored) : [];
    return localClients.filter((c: any) => c.id !== "client-1" && c.id !== "client-2");
  },

  async saveClient(client: Client): Promise<Client> {
    let savedClient = client;
    if (isSupabaseConfigured && supabase && !getFailedTables()["clients"]) {
      try {
        const { data, error } = await supabase.from("clients").upsert(client).select();
        if (!error && data && data.length > 0) {
          savedClient = data[0];
        }
        if (error) {
          console.warn("Supabase clients write failed, falling back to LocalStorage:", error.message);
          markTableFailed("clients");
        }
      } catch (e) {
        markTableFailed("clients");
      }
    }
    // Always keep LocalStorage updated
    const stored = localStorage.getItem("scalex_invoice_clients");
    const clients: Client[] = stored ? JSON.parse(stored) : [];
    const existingIndex = clients.findIndex((c) => c.id === savedClient.id);
    if (existingIndex >= 0) {
      clients[existingIndex] = savedClient;
    } else {
      clients.push(savedClient);
    }
    localStorage.setItem("scalex_invoice_clients", JSON.stringify(clients));
    return savedClient;
  },

  async deleteClient(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["clients"]) {
      try {
        const { error } = await supabase.from("clients").delete().eq("id", id);
        if (error) {
          console.warn("Supabase clients delete failed, falling back to LocalStorage:", error.message);
          markTableFailed("clients");
        }
      } catch (e) {
        markTableFailed("clients");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_clients");
    const clients: Client[] = stored ? JSON.parse(stored) : [];
    const filtered = clients.filter((c) => c.id !== id);
    localStorage.setItem("scalex_invoice_clients", JSON.stringify(filtered));
    return true;
  },

  // --- Products Library ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["products"]) {
      try {
        const { data, error } = await supabase.from("products").select("*").order("name");
        if (!error && data) {
          const cleanedData = data.filter(p => p.id !== "prod-1" && p.id !== "prod-2" && p.id !== "prod-3");
          if (cleanedData.length > 0) {
            localStorage.setItem("scalex_invoice_products", JSON.stringify(cleanedData));
            return cleanedData;
          } else {
            // If Supabase is empty, check if we have local storage data to seed it
            const stored = localStorage.getItem("scalex_invoice_products");
            const localProducts = stored ? JSON.parse(stored) : [];
            const cleanedLocal = localProducts.filter((p: any) => p.id !== "prod-1" && p.id !== "prod-2" && p.id !== "prod-3");
            if (cleanedLocal.length > 0) {
              console.log("Supabase products is empty, seeding from LocalStorage...");
              for (const p of cleanedLocal) {
                await supabase.from("products").upsert(p);
              }
              return cleanedLocal;
            }
          }
          return cleanedData;
        }
        if (error) {
          console.warn("Supabase products query failed, falling back to LocalStorage:", error.message);
          markTableFailed("products");
        }
      } catch (e) {
        markTableFailed("products");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_products");
    const localProducts = stored ? JSON.parse(stored) : [];
    return localProducts.filter((p: any) => p.id !== "prod-1" && p.id !== "prod-2" && p.id !== "prod-3");
  },

  async saveProduct(product: Product): Promise<Product> {
    let savedProduct = product;
    if (isSupabaseConfigured && supabase && !getFailedTables()["products"]) {
      try {
        const { data, error } = await supabase.from("products").upsert(product).select();
        if (!error && data && data.length > 0) {
          savedProduct = data[0];
        }
        if (error) {
          console.warn("Supabase products write failed, falling back to LocalStorage:", error.message);
          markTableFailed("products");
        }
      } catch (e) {
        markTableFailed("products");
      }
    }
    // Always keep LocalStorage updated
    const stored = localStorage.getItem("scalex_invoice_products");
    const products: Product[] = stored ? JSON.parse(stored) : [];
    const existingIndex = products.findIndex((p) => p.id === savedProduct.id);
    if (existingIndex >= 0) {
      products[existingIndex] = savedProduct;
    } else {
      products.push(savedProduct);
    }
    localStorage.setItem("scalex_invoice_products", JSON.stringify(products));
    return savedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["products"]) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
          console.warn("Supabase products delete failed, falling back to LocalStorage:", error.message);
          markTableFailed("products");
        }
      } catch (e) {
        markTableFailed("products");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_products");
    const products: Product[] = stored ? JSON.parse(stored) : [];
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem("scalex_invoice_products", JSON.stringify(filtered));
    return true;
  },

  // --- Invoices ---
  async getInvoices(): Promise<Invoice[]> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["invoices"]) {
      try {
        const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
        if (!error && data) {
          const cleanedData = data.filter(inv => inv.id !== "inv-demo-1" && inv.id !== "inv-demo-2");
          if (cleanedData.length > 0) {
            const invoicesWithItems: Invoice[] = [];
            for (const inv of cleanedData) {
              const { data: items } = await supabase.from("invoice_items").select("*").eq("invoice_id", inv.id).order("sort_order");
              invoicesWithItems.push({
                ...inv,
                items: items || []
              });
            }
            localStorage.setItem("scalex_invoices", JSON.stringify(invoicesWithItems));
            return invoicesWithItems;
          } else {
            // If Supabase is empty, check if we have local storage data to seed it
            const stored = localStorage.getItem("scalex_invoices");
            const localInvoices = stored ? JSON.parse(stored) : [];
            const cleanedLocal = localInvoices.filter((inv: any) => inv.id !== "inv-demo-1" && inv.id !== "inv-demo-2");
            if (cleanedLocal.length > 0) {
              console.log("Supabase invoices is empty, seeding from LocalStorage...");
              for (const inv of cleanedLocal) {
                const { items, ...invoiceDbFields } = inv;
                await supabase.from("invoices").upsert(invoiceDbFields);
                if (items && items.length > 0) {
                  await supabase.from("invoice_items").delete().eq("invoice_id", inv.id);
                  const dbItems = items.map((item: any, index: number) => ({
                    invoice_id: inv.id,
                    name: item.name,
                    description: item.description || "",
                    quantity: item.quantity,
                    unit: item.unit,
                    unit_price: item.unit_price,
                    discount_type: item.discount_type,
                    discount_value: item.discount_value,
                    discount_amount: item.discount_amount,
                    tax_rate: item.tax_rate,
                    hsn_sac: item.hsn_sac || "",
                    line_total: item.line_total,
                    sort_order: index
                  }));
                  await supabase.from("invoice_items").insert(dbItems);
                }
              }
              return cleanedLocal;
            }
          }
          return [];
        }
        if (error) {
          console.warn("Supabase invoices query failed, falling back to LocalStorage:", error.message);
          markTableFailed("invoices");
        }
      } catch (e) {
        markTableFailed("invoices");
      }
    }
    const stored = localStorage.getItem("scalex_invoices");
    const localInvoices = stored ? JSON.parse(stored) : [];
    return localInvoices.filter((inv: any) => inv.id !== "inv-demo-1" && inv.id !== "inv-demo-2");
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    if (id === "inv-demo-1" || id === "inv-demo-2") return null;
    if (isSupabaseConfigured && supabase && !getFailedTables()["invoices"]) {
      try {
        const { data: inv, error } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
        if (!error && inv) {
          // Fetch invoice items
          const { data: items, error: itemsError } = await supabase
            .from("invoice_items")
            .select("*")
            .eq("invoice_id", id)
            .order("sort_order");
          
          if (!itemsError) {
            const fullInvoice = {
              ...inv,
              items: items || []
            } as Invoice;

            // Update LocalStorage cache for this specific invoice so it survives offline/refreshes
            const stored = localStorage.getItem("scalex_invoices");
            const localInvoices: Invoice[] = stored ? JSON.parse(stored) : [];
            const idx = localInvoices.findIndex((i) => i.id === id);
            if (idx >= 0) {
              localInvoices[idx] = fullInvoice;
            } else {
              localInvoices.push(fullInvoice);
            }
            localStorage.setItem("scalex_invoices", JSON.stringify(localInvoices));

            return fullInvoice;
          }
        }
        if (error) {
          console.warn("Supabase getInvoiceById query failed, checking LocalStorage:", error.message);
        }
      } catch (e) {
        console.warn("Error fetching invoice from Supabase, checking LocalStorage:", e);
      }
    }
    const stored = localStorage.getItem("scalex_invoices");
    const invoices: Invoice[] = stored ? JSON.parse(stored) : [];
    return invoices.find((inv) => inv.id === id) || null;
  },

  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status !== "Paid" && invoice.status !== "Cancelled";
    const finalStatus = isOverdue ? "Overdue" : invoice.status;
    let finalInvoice = { ...invoice, status: finalStatus };

    if (isSupabaseConfigured && supabase && !getFailedTables()["invoices"]) {
      try {
        const { items, ...invoiceDbFields } = finalInvoice;
        const { data, error } = await supabase.from("invoices").upsert(invoiceDbFields).select();
        if (!error && data && data.length > 0) {
          await supabase.from("invoice_items").delete().eq("invoice_id", data[0].id);
          const dbItems = items.map((item, index) => ({
            invoice_id: data[0].id,
            name: item.name,
            description: item.description || "",
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: item.discount_amount,
            tax_rate: item.tax_rate,
            hsn_sac: item.hsn_sac || "",
            line_total: item.line_total,
            sort_order: index
          }));
          await supabase.from("invoice_items").insert(dbItems);
          finalInvoice = {
            ...finalInvoice,
            ...data[0],
            items
          };
        }
        if (error) {
          console.warn("Supabase invoice write failed, falling back to LocalStorage:", error.message);
          markTableFailed("invoices");
        }
      } catch (e) {
        markTableFailed("invoices");
      }
    }

    // Always keep LocalStorage updated
    const stored = localStorage.getItem("scalex_invoices");
    const invoices: Invoice[] = stored ? JSON.parse(stored) : [];
    const existingIndex = invoices.findIndex((i) => i.id === finalInvoice.id);
    if (existingIndex >= 0) {
      invoices[existingIndex] = finalInvoice;
    } else {
      invoices.push(finalInvoice);
      const settings = this.getSettings();
      if (finalInvoice.invoice_number.endsWith(String(settings.next_invoice_number).padStart(4, "0"))) {
        settings.next_invoice_number += 1;
        this.saveSettings(settings);
      }
    }
    localStorage.setItem("scalex_invoices", JSON.stringify(invoices));
    return finalInvoice;
  },

  async deleteInvoice(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["invoices"]) {
      try {
        const { error } = await supabase.from("invoices").delete().eq("id", id);
        if (error) {
          console.warn("Supabase invoices delete failed, falling back to LocalStorage:", error.message);
          markTableFailed("invoices");
        }
      } catch (e) {
        markTableFailed("invoices");
      }
    }
    const stored = localStorage.getItem("scalex_invoices");
    const invoices: Invoice[] = stored ? JSON.parse(stored) : [];
    const filtered = invoices.filter((i) => i.id !== id);
    localStorage.setItem("scalex_invoices", JSON.stringify(filtered));
    return true;
  },

  // --- Payments ---
  async getPayments(invoiceId?: string): Promise<Payment[]> {
    const isMockPayment = (p: Payment) => 
      p.id === "pay-1" || 
      p.id === "pay-2" || 
      p.invoice_id === "inv-demo-1" || 
      p.invoice_id === "inv-demo-2";

    if (isSupabaseConfigured && supabase && !getFailedTables()["payments"]) {
      try {
        let query = supabase.from("payments").select("*").order("payment_date", { ascending: false });
        if (invoiceId) {
          query = query.eq("invoice_id", invoiceId);
        }
        const { data, error } = await query;
        if (!error && data) {
          const cleanedData = data.filter(p => !isMockPayment(p));
          if (cleanedData.length > 0) {
            localStorage.setItem("scalex_invoice_payments", JSON.stringify(cleanedData));
            return cleanedData;
          } else {
            // Seed Supabase if empty
            const stored = localStorage.getItem("scalex_invoice_payments");
            const localPayments = stored ? JSON.parse(stored) : [];
            const cleanedLocal = localPayments.filter((p: any) => !isMockPayment(p));
            if (cleanedLocal.length > 0) {
              console.log("Supabase payments is empty, seeding from LocalStorage...");
              for (const p of cleanedLocal) {
                await supabase.from("payments").upsert(p);
              }
              return invoiceId ? cleanedLocal.filter((p: any) => p.invoice_id === invoiceId) : cleanedLocal;
            }
          }
          return cleanedData;
        }
        if (error) {
          console.warn("Supabase payments query failed, falling back to LocalStorage:", error.message);
          markTableFailed("payments");
        }
      } catch (e) {
        markTableFailed("payments");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_payments");
    const allPayments: Payment[] = stored ? JSON.parse(stored) : [];
    const cleanedAll = allPayments.filter((p) => !isMockPayment(p));
    if (invoiceId) {
      return cleanedAll.filter((p) => p.invoice_id === invoiceId);
    }
    return cleanedAll;
  },

  async addPayment(payment: Payment): Promise<Payment> {
    let savedPayment = payment;
    if (isSupabaseConfigured && supabase && !getFailedTables()["payments"]) {
      try {
        const { data, error } = await supabase.from("payments").insert(payment).select();
        if (!error && data && data.length > 0) {
          savedPayment = data[0];
          await this.syncInvoicePayments(payment.invoice_id);
        }
        if (error) {
          console.warn("Supabase payment write failed, falling back to LocalStorage:", error.message);
          markTableFailed("payments");
        }
      } catch (e) {
        markTableFailed("payments");
      }
    }
    // Always keep LocalStorage updated
    const stored = localStorage.getItem("scalex_invoice_payments");
    const payments: Payment[] = stored ? JSON.parse(stored) : [];
    payments.push(savedPayment);
    localStorage.setItem("scalex_invoice_payments", JSON.stringify(payments));

    const invoice = await this.getInvoiceById(payment.invoice_id);
    if (invoice) {
      const paid = invoice.amount_paid + payment.amount;
      const balance = Math.max(0, invoice.grand_total - paid);
      let status = invoice.status;
      if (balance === 0) {
        status = "Paid";
      } else if (paid > 0) {
        status = "Partially Paid";
      }
      await this.saveInvoice({
        ...invoice,
        amount_paid: paid,
        balance_due: balance,
        status: status as any
      });
    }

    return savedPayment;
  },

  async syncInvoicePayments(invoiceId: string): Promise<void> {
    const payments = await this.getPayments(invoiceId);
    const invoice = await this.getInvoiceById(invoiceId);
    if (invoice) {
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = Math.max(0, invoice.grand_total - totalPaid);
      let status = invoice.status;
      if (balance === 0) {
        status = "Paid";
      } else if (totalPaid > 0) {
        status = "Partially Paid";
      }
      await this.saveInvoice({
        ...invoice,
        amount_paid: totalPaid,
        balance_due: balance,
        status: status as any
      });
    }
  },

  // --- Credit Notes ---
  async getCreditNotes(): Promise<CreditNote[]> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["credit_notes"]) {
      try {
        const { data, error } = await supabase.from("credit_notes").select("*").order("created_at", { ascending: false });
        if (!error && data) {
          if (data.length > 0) {
            localStorage.setItem("scalex_invoice_credit_notes", JSON.stringify(data));
            return data;
          } else {
            // Seed Supabase if empty
            const stored = localStorage.getItem("scalex_invoice_credit_notes");
            const localCN = stored ? JSON.parse(stored) : [];
            if (localCN.length > 0) {
              console.log("Supabase credit notes is empty, seeding from LocalStorage...");
              for (const cn of localCN) {
                await supabase.from("credit_notes").upsert(cn);
              }
              return localCN;
            }
          }
          return data;
        }
        if (error) {
          console.warn("Supabase credit notes query failed, falling back to LocalStorage:", error.message);
          markTableFailed("credit_notes");
        }
      } catch (e) {
        markTableFailed("credit_notes");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_credit_notes");
    return stored ? JSON.parse(stored) : [];
  },

  async saveCreditNote(creditNote: CreditNote): Promise<CreditNote> {
    let savedCN = creditNote;
    if (isSupabaseConfigured && supabase && !getFailedTables()["credit_notes"]) {
      try {
        const { data, error } = await supabase.from("credit_notes").upsert(creditNote).select();
        if (!error && data && data.length > 0) {
          savedCN = data[0];
        }
        if (error) {
          console.warn("Supabase credit note write failed, falling back to LocalStorage:", error.message);
          markTableFailed("credit_notes");
        }
      } catch (e) {
        markTableFailed("credit_notes");
      }
    }
    // Always keep LocalStorage updated
    const stored = localStorage.getItem("scalex_invoice_credit_notes");
    const creditNotes: CreditNote[] = stored ? JSON.parse(stored) : [];
    creditNotes.push(savedCN);
    localStorage.setItem("scalex_invoice_credit_notes", JSON.stringify(creditNotes));

    const invoice = await this.getInvoiceById(creditNote.invoice_id);
    if (invoice) {
      const newGrandTotal = Math.max(0, invoice.grand_total - creditNote.amount);
      const balance = Math.max(0, newGrandTotal - invoice.amount_paid);
      const status = balance === 0 && invoice.amount_paid > 0 ? "Paid" : invoice.status;
      await this.saveInvoice({
        ...invoice,
        grand_total: newGrandTotal,
        balance_due: balance,
        status: status as any,
        notes: `${invoice.notes || ""}\n[Applied Credit Note ${creditNote.credit_note_number} for ${invoice.currency_symbol}${creditNote.amount}]`
      });
    }

    return savedCN;
  },

  // --- Recurring Schedules ---
  async getRecurringSchedules(): Promise<RecurringSchedule[]> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["recurring_invoices"]) {
      try {
        const { data, error } = await supabase.from("recurring_invoices").select("*");
        if (!error && data) {
          if (data.length > 0) {
            localStorage.setItem("scalex_invoice_recurring", JSON.stringify(data));
            return data;
          } else {
            // Seed Supabase if empty
            const stored = localStorage.getItem("scalex_invoice_recurring");
            const localRecurring = stored ? JSON.parse(stored) : [];
            if (localRecurring.length > 0) {
              console.log("Supabase recurring schedules is empty, seeding from LocalStorage...");
              for (const rec of localRecurring) {
                await supabase.from("recurring_invoices").upsert(rec);
              }
              return localRecurring;
            }
          }
          return data;
        }
        if (error) {
          console.warn("Supabase recurring schedules query failed, falling back to LocalStorage:", error.message);
          markTableFailed("recurring_invoices");
        }
      } catch (e) {
        markTableFailed("recurring_invoices");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_recurring");
    return stored ? JSON.parse(stored) : [];
  },

  async saveRecurringSchedule(schedule: RecurringSchedule): Promise<RecurringSchedule> {
    let savedRec = schedule;
    if (isSupabaseConfigured && supabase && !getFailedTables()["recurring_invoices"]) {
      try {
        const { data, error } = await supabase.from("recurring_invoices").upsert(schedule).select();
        if (!error && data && data.length > 0) {
          savedRec = data[0];
        }
        if (error) {
          console.warn("Supabase recurring schedule write failed, falling back to LocalStorage:", error.message);
          markTableFailed("recurring_invoices");
        }
      } catch (e) {
        markTableFailed("recurring_invoices");
      }
    }
    // Always keep LocalStorage updated
    const stored = localStorage.getItem("scalex_invoice_recurring");
    const schedules: RecurringSchedule[] = stored ? JSON.parse(stored) : [];
    const existingIndex = schedules.findIndex((s) => s.id === savedRec.id);
    if (existingIndex >= 0) {
      schedules[existingIndex] = savedRec;
    } else {
      schedules.push(savedRec);
    }
    localStorage.setItem("scalex_invoice_recurring", JSON.stringify(schedules));
    return savedRec;
  },

  async deleteRecurringSchedule(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase && !getFailedTables()["recurring_invoices"]) {
      try {
        const { error } = await supabase.from("recurring_invoices").delete().eq("id", id);
        if (error) {
          console.warn("Supabase recurring schedules delete failed, falling back to LocalStorage:", error.message);
          markTableFailed("recurring_invoices");
        }
      } catch (e) {
        markTableFailed("recurring_invoices");
      }
    }
    const stored = localStorage.getItem("scalex_invoice_recurring");
    const schedules: RecurringSchedule[] = stored ? JSON.parse(stored) : [];
    const filtered = schedules.filter((s) => s.id !== id);
    localStorage.setItem("scalex_invoice_recurring", JSON.stringify(filtered));
    return true;
  }
};
