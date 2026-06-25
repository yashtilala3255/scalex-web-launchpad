import React, { useState, useEffect } from "react";
import {
  Invoice, Client, Product, Payment, RecurringSchedule, CreditNote, InvoiceSettings,
  invoiceStorage
} from "@/lib/invoiceStorage";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Receipt, Plus, Trash2, Edit2, Save, RefreshCw,
  Search, Filter, ChevronLeft, ChevronRight, FileSpreadsheet,
  Calendar, CreditCard, User, Tag, Settings, ListCollapse,
  Eye, CornerDownRight, CheckCircle, Clock, AlertCircle, X,
  Printer, MessageSquare, Copy, Link, Check, PlusCircle, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

export const InvoiceSystem = () => {
  const [activeTab, setActiveTab] = useState<"invoices" | "clients" | "products" | "recurring" | "credit-notes" | "settings">("invoices");
  
  // Invoice states
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit" | "detail">("list");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Invoice creation form states
  const [invoiceForm, setInvoiceForm] = useState<Partial<Invoice>>({});
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [isNewClientInline, setIsNewClientInline] = useState(false);
  const [inlineClient, setInlineClient] = useState<Partial<Client>>({});

  // Library & lists
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringSchedule[]>([]);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [settings, setSettings] = useState<InvoiceSettings>(invoiceStorage.getSettings());

  // Edit / Add modal states
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);




  const handleDownloadPDF = async (inv: Invoice) => {
    window.open(`${window.location.origin}/invoices/view/${inv.id}?print=true`, "_blank");
  };

  // Payments and Credit Notes forms
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"Cash" | "UPI" | "Bank Transfer" | "Cheque" | "Card">("Bank Transfer");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);

  const [creditNoteFormOpen, setCreditNoteFormOpen] = useState(false);
  const [creditNoteAmount, setCreditNoteAmount] = useState("");
  const [creditNoteReason, setCreditNoteReason] = useState("");

  // Recurring form
  const [recurringFormOpen, setRecurringFormOpen] = useState(false);
  const [recurringScheduleName, setRecurringScheduleName] = useState("");
  const [recurringFrequency, setRecurringFrequency] = useState<"Weekly" | "Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [recurringAutoSend, setRecurringAutoSend] = useState(true);

  // Load all lists
  const reloadData = async () => {
    setLoading(true);
    try {
      const invList = await invoiceStorage.getInvoices();
      const cliList = await invoiceStorage.getClients();
      const prodList = await invoiceStorage.getProducts();
      const recList = await invoiceStorage.getRecurringSchedules();
      const cnList = await invoiceStorage.getCreditNotes();
      
      setInvoices(invList);
      setClients(cliList);
      setProducts(prodList);
      setRecurringSchedules(recList);
      setCreditNotes(cnList);
    } catch (e) {
      console.error("Failed to load invoice system data:", e);
      toast.error("Error loading invoice configurations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, [activeTab]);

  // Load payments when invoice is selected
  useEffect(() => {
    if (selectedInvoice) {
      invoiceStorage.getPayments(selectedInvoice.id).then(setPaymentHistory);
    }
  }, [selectedInvoice]);

  // Handle invoice number generation
  const getNextInvoiceNumber = () => {
    const curSettings = invoiceStorage.getSettings();
    return `${curSettings.invoice_prefix}${String(curSettings.next_invoice_number).padStart(4, "0")}`;
  };

  // Trigger invoice creation
  const handleStartCreate = () => {
    const defaultSettings = invoiceStorage.getSettings();
    const invNum = getNextInvoiceNumber();
    
    // Default dates (Today, Net 30 default)
    const today = new Date().toISOString().split("T")[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 30);
    const net30 = dueDateObj.toISOString().split("T")[0];

    setInvoiceForm({
      id: Math.random().toString(36).substring(2, 9),
      invoice_number: invNum,
      invoice_date: today,
      due_date: net30,
      status: "Draft",
      currency: defaultSettings.default_currency,
      currency_symbol: defaultSettings.default_currency_symbol,
      payment_terms: defaultSettings.default_payment_terms,
      discount_type: "percent",
      discount_value: 0,
      discount_amount: 0,
      shipping_charges: 0,
      adjustment: 0,
      grand_total: 0,
      amount_paid: 0,
      balance_due: 0,
      business_details: {
        name: defaultSettings.business_name,
        address: defaultSettings.business_address,
        email: defaultSettings.business_email,
        phone: defaultSettings.business_phone,
        gstin: defaultSettings.business_gstin,
        pan: defaultSettings.business_pan,
        cin: defaultSettings.business_cin,
      },
      bank_details: {
        account_name: defaultSettings.bank_account_name,
        account_number: defaultSettings.bank_account_number,
        ifsc: defaultSettings.bank_ifsc,
        bank_name: defaultSettings.bank_name,
        branch: defaultSettings.bank_branch,
        upi_id: defaultSettings.bank_upi_id,
      },
      terms_conditions: defaultSettings.default_terms,
      notes: defaultSettings.default_notes,
      template_id: "classic",
      color_theme: "#304ce6",
      show_logo: true,
      show_bank: true,
      show_signature: true,
      show_qr: true,
    });
    setInvoiceItems([{
      name: "",
      description: "",
      quantity: 1,
      unit: "units",
      unit_price: 0,
      discount_type: "percent",
      discount_value: 0,
      discount_amount: 0,
      tax_rate: defaultSettings.default_tax_rate,
      line_total: 0,
    }]);
    setSelectedClientId("");
    setIsNewClientInline(false);
    setInlineClient({});
    setCurrentView("create");
  };

  // Add Item Row
  const handleAddItemRow = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        name: "",
        description: "",
        quantity: 1,
        unit: "units",
        unit_price: 0,
        discount_type: "percent",
        discount_value: 0,
        discount_amount: 0,
        tax_rate: settings.default_tax_rate,
        line_total: 0,
      }
    ]);
  };

  // Remove Item Row
  const handleRemoveItemRow = (index: number) => {
    if (invoiceItems.length === 1) {
      toast.warning("Invoices must have at least one line item.");
      return;
    }
    setInvoiceItems(invoiceItems.filter((_, idx) => idx !== index));
  };

  // Update Item Property
  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;
    
    // Auto calculate line total
    const qty = Number(updated[index].quantity || 0);
    const price = Number(updated[index].unit_price || 0);
    const discVal = Number(updated[index].discount_value || 0);
    const discType = updated[index].discount_type;
    const taxRate = Number(updated[index].tax_rate || 0);

    let baseSub = qty * price;
    let discAmt = 0;
    if (discType === "percent") {
      discAmt = (baseSub * discVal) / 100;
    } else {
      discAmt = discVal;
    }
    
    updated[index].discount_amount = discAmt;
    let itemSubtotal = baseSub - discAmt;
    
    // Tax is calculated on top or inclusive (GST is inclusive in standard Indian pricing, let's treat tax as inclusive here)
    const taxAmt = (itemSubtotal * taxRate) / (100 + taxRate);
    updated[index].line_total = itemSubtotal; // item total is including tax

    setInvoiceItems(updated);
  };

  // Select item from library
  const handleSelectLibraryProduct = (index: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const updated = [...invoiceItems];
    updated[index].name = prod.name;
    updated[index].description = prod.description || "";
    updated[index].unit = prod.unit;
    updated[index].unit_price = prod.unit_price;
    updated[index].tax_rate = prod.tax_rate;
    updated[index].hsn_sac = prod.hsn_sac || "";
    setInvoiceItems(updated);
    handleUpdateItem(index, "quantity", 1); // trigger calculation
  };

  // Drag & Drop reordering
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number, dragIndex: number) => {
    const updated = [...invoiceItems];
    const draggedItem = updated[dragIndex];
    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);
    setInvoiceItems(updated);
  };

  // Calculate Subtotal, Discounts, Taxes, Shipping and Grand Totals
  const calculateTotals = () => {
    let sub = 0;
    let itemDiscs = 0;
    let taxMap: { [rate: number]: { taxable: number, tax: number } } = {};

    invoiceItems.forEach(item => {
      const qty = item.quantity || 0;
      const price = item.unit_price || 0;
      const baseSub = qty * price;
      const discAmt = 0;
      const taxable = baseSub;
      
      sub += baseSub;
      itemDiscs += discAmt;

      const rate = item.tax_rate || 0;
      if (rate > 0) {
        const itemTax = (taxable * rate) / (100 + rate);
        if (!taxMap[rate]) {
          taxMap[rate] = { taxable: 0, tax: 0 };
        }
        taxMap[rate].taxable += (taxable - itemTax);
        taxMap[rate].tax += itemTax;
      }
    });

    const isStateMatch =
      invoiceForm.business_details?.address?.toLowerCase().includes("gujarat") &&
      (invoiceForm.client_data?.state?.toLowerCase().includes("gujarat") ||
        invoiceForm.client_data?.address?.toLowerCase().includes("gujarat"));

    // Prepare tax split list
    const taxSummary: any[] = [];
    let accumulatedTax = 0;

    Object.keys(taxMap).forEach(key => {
      const rate = Number(key);
      const { taxable, tax } = taxMap[rate];
      accumulatedTax += tax;

      if (isStateMatch) {
        // Intra-state splits CGST + SGST (9% + 9%)
        const halfRate = rate / 2;
        const halfTax = tax / 2;
        taxSummary.push({ label: `CGST (${halfRate}%)`, rate: halfRate, taxable_amount: taxable, tax_amount: halfTax });
        taxSummary.push({ label: `SGST (${halfRate}%)`, rate: halfRate, taxable_amount: taxable, tax_amount: halfTax });
      } else {
        // Inter-state IGST (18%)
        taxSummary.push({ label: `IGST (${rate}%)`, rate, taxable_amount: taxable, tax_amount: tax });
      }
    });

    // Invoice level discounts (removed)
    const globalDiscVal = 0;
    const globalDiscType = "percent";
    let globalDiscAmt = 0;

    const shipping = Number(invoiceForm.shipping_charges || 0);
    const adjustment = Number(invoiceForm.adjustment || 0);
    const grand = sub - itemDiscs - globalDiscAmt + accumulatedTax + shipping + adjustment;
    const balance = Math.max(0, grand - (invoiceForm.amount_paid || 0));

    return {
      subtotal: sub,
      discount_amount: 0,
      tax_summary: taxSummary,
      total_tax: accumulatedTax,
      grand_total: grand,
      balance_due: balance
    };
  };

  // Submit invoice creation
  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    let clientInfo: Client;
    if (isNewClientInline) {
      if (!inlineClient.name || !inlineClient.email) {
        toast.error("Inline client requires at least a Name and Email address.");
        return;
      }
      const newClient = await invoiceStorage.saveClient({
        id: Math.random().toString(36).substring(2, 9),
        name: inlineClient.name,
        company: inlineClient.company || "",
        email: inlineClient.email,
        phone: inlineClient.phone || "",
        address: inlineClient.address || "",
        city: inlineClient.city || "",
        state: inlineClient.state || "",
        pin_code: inlineClient.pin_code || "",
        gstin: inlineClient.gstin || "",
      });
      clientInfo = newClient;
      toast.success(`Client ${newClient.name} added successfully!`);
    } else {
      const selected = clients.find(c => c.id === selectedClientId);
      if (!selected) {
        toast.error("Please select a client or add a new client inline.");
        return;
      }
      clientInfo = selected;
    }

    const totals = calculateTotals();
    const finalInvoice: Invoice = {
      ...(invoiceForm as Invoice),
      client_id: clientInfo.id,
      client_data: clientInfo,
      items: invoiceItems,
      ...totals
    };

    await invoiceStorage.saveInvoice(finalInvoice);
    toast.success(`Invoice ${finalInvoice.invoice_number} saved successfully!`);
    setCurrentView("list");
    reloadData();
  };

  // Tab handlers
  const handleSaveClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient?.name || !editingClient?.email) {
      toast.error("Client Name and Email are required.");
      return;
    }
    const finalClient: Client = {
      id: editingClient.id || Math.random().toString(36).substring(2, 9),
      name: editingClient.name,
      company: editingClient.company,
      email: editingClient.email,
      phone: editingClient.phone,
      address: editingClient.address,
      city: editingClient.city,
      state: editingClient.state,
      pin_code: editingClient.pin_code,
      gstin: editingClient.gstin,
    };
    await invoiceStorage.saveClient(finalClient);
    toast.success(`Client ${finalClient.name} saved successfully.`);
    setClientModalOpen(false);
    reloadData();
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.unit_price) {
      toast.error("Product Name and Unit Price are required.");
      return;
    }
    const finalProduct: Product = {
      id: editingProduct.id || Math.random().toString(36).substring(2, 9),
      name: editingProduct.name,
      description: editingProduct.description,
      unit: editingProduct.unit || "units",
      unit_price: Number(editingProduct.unit_price),
      tax_rate: Number(editingProduct.tax_rate || 0),
      hsn_sac: editingProduct.hsn_sac,
    };
    await invoiceStorage.saveProduct(finalProduct);
    toast.success(`Product ${finalProduct.name} saved to library.`);
    setProductModalOpen(false);
    reloadData();
  };

  // settings saver
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    invoiceStorage.saveSettings(settings);
    toast.success("Default invoice configurations updated successfully!");
  };

  // Add payments logic
  const handleAddPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Payment amount must be a positive number.");
      return;
    }
    if (amount > selectedInvoice.balance_due) {
      toast.error("Payment amount cannot exceed the balance due.");
      return;
    }

    const pay: Payment = {
      id: Math.random().toString(36).substring(2, 9),
      invoice_id: selectedInvoice.id,
      amount,
      payment_date: new Date().toISOString(),
      payment_mode: paymentMode,
      transaction_ref: paymentRef,
      notes: paymentNotes
    };

    await invoiceStorage.addPayment(pay);
    toast.success(`Payment of ${selectedInvoice.currency_symbol}${amount} logged!`);
    
    // Refresh details
    const refreshed = await invoiceStorage.getInvoiceById(selectedInvoice.id);
    setSelectedInvoice(refreshed);
    setPaymentFormOpen(false);
    setPaymentAmount("");
    setPaymentRef("");
    setPaymentNotes("");
    reloadData();
  };

  // Add Credit Notes
  const handleAddCreditNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    const amount = Number(creditNoteAmount);
    if (!amount || amount <= 0) {
      toast.error("Credit note amount must be positive.");
      return;
    }
    if (amount > selectedInvoice.grand_total) {
      toast.error("Credit note amount cannot exceed the invoice total.");
      return;
    }

    const cn: CreditNote = {
      id: Math.random().toString(36).substring(2, 9),
      credit_note_number: `CN-2026-${String(creditNotes.length + 1).padStart(4, "0")}`,
      invoice_id: selectedInvoice.id,
      invoice_number: selectedInvoice.invoice_number,
      client_id: selectedInvoice.client_data.id,
      client_name: selectedInvoice.client_data.name,
      credit_note_date: new Date().toISOString().split("T")[0],
      amount,
      reason: creditNoteReason,
      items: [{ name: "Credit Adjustment", quantity: 1, unit_price: amount, total: amount }]
    };

    await invoiceStorage.saveCreditNote(cn);
    toast.success(`Credit Note ${cn.credit_note_number} generated!`);

    const refreshed = await invoiceStorage.getInvoiceById(selectedInvoice.id);
    setSelectedInvoice(refreshed);
    setCreditNoteFormOpen(false);
    setCreditNoteAmount("");
    setCreditNoteReason("");
    reloadData();
  };

  // Recurring Billing Schedule Saver
  const handleSaveRecurringSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const start = new Date();
    const nextGen = new Date();
    nextGen.setMonth(nextGen.getMonth() + 1); // Set next generation to Net 30 days

    const schedule: RecurringSchedule = {
      id: Math.random().toString(36).substring(2, 9),
      schedule_name: recurringScheduleName || `Monthly Retainer for ${selectedInvoice.client_data.name}`,
      client_id: selectedInvoice.client_data.id,
      client_name: selectedInvoice.client_data.name,
      invoice_template_data: selectedInvoice,
      frequency: recurringFrequency,
      start_date: start.toISOString().split("T")[0],
      occurrences_count: 0,
      is_active: true,
      next_generation_date: nextGen.toISOString().split("T")[0],
      auto_send: recurringAutoSend
    };

    await invoiceStorage.saveRecurringSchedule(schedule);
    toast.success(`Recurring schedule ${schedule.schedule_name} created successfully!`);
    setRecurringFormOpen(false);
    setRecurringScheduleName("");
    reloadData();
  };

  // CSV Export for list of invoices
  const handleExportInvoicesCSV = () => {
    if (invoices.length === 0) {
      toast.warning("No invoices available to export.");
      return;
    }
    const headers = ["Invoice Number", "Client Name", "Company", "Invoice Date", "Due Date", "Grand Total", "Amount Paid", "Balance Due", "Status"];
    const rows = invoices.map(inv => [
      inv.invoice_number,
      inv.client_data.name,
      inv.client_data.company || "",
      inv.invoice_date,
      inv.due_date,
      inv.grand_total,
      inv.amount_paid,
      inv.balance_due,
      inv.status
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `invoices_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoice export CSV downloaded!");
  };

  // Bulk GSTR-1 Tax Summary Export
  const handleExportGSTR1CSV = () => {
    if (invoices.length === 0) {
      toast.warning("No invoices available for tax export.");
      return;
    }
    const headers = ["GSTIN of Recipient", "Recipient Name", "Invoice Number", "Invoice Date", "Invoice Value", "Place of Supply", "Applicable % Tax", "Taxable Value", "CGST", "SGST", "IGST"];
    const rows: any[] = [];

    invoices.forEach(inv => {
      const gstin = inv.client_data.gstin || "Unregistered";
      const isStateMatch =
        inv.business_details?.address?.toLowerCase().includes("gujarat") &&
        (inv.client_data?.state?.toLowerCase().includes("gujarat") ||
          inv.client_data?.address?.toLowerCase().includes("gujarat"));
      const state = inv.client_data.state || "Unknown State";

      inv.items.forEach(item => {
        const rate = item.tax_rate;
        const total = item.line_total;
        const tax = (total * rate) / (100 + rate);
        const taxable = total - tax;
        
        const cgst = isStateMatch ? tax / 2 : 0;
        const sgst = isStateMatch ? tax / 2 : 0;
        const igst = !isStateMatch ? tax : 0;

        rows.push([
          gstin,
          inv.client_data.name,
          inv.invoice_number,
          inv.invoice_date,
          inv.grand_total,
          state,
          rate,
          taxable.toFixed(2),
          cgst.toFixed(2),
          sgst.toFixed(2),
          igst.toFixed(2)
        ]);
      });
    });

    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GSTR1_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("GSTR-1 report downloaded!");
  };

  // Filtered & Searched Invoices list
  const getFilteredInvoices = () => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.client_data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.client_data.company || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesClient = clientFilter === "all" || inv.client_data.id === clientFilter;

      return matchesSearch && matchesStatus && matchesClient;
    });
  };

  // Summary Metrics calculations
  const totalInvoiced = invoices.reduce((sum, i) => sum + (i.status !== "Cancelled" ? i.grand_total : 0), 0);
  const totalPaidSum = invoices.reduce((sum, i) => sum + (i.status !== "Cancelled" ? i.amount_paid : 0), 0);
  const totalOutstanding = invoices.reduce((sum, i) => sum + (i.status !== "Cancelled" ? i.balance_due : 0), 0);
  const totalOverdue = invoices.reduce((sum, i) => sum + (i.status === "Overdue" ? i.balance_due : 0), 0);

  // Paginated list
  const filtered = getFilteredInvoices();
  const paginatedInvoices = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  return (
    <div className="space-y-6">
      {/* Tab Navigation header */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border/30 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "invoices", label: "Invoices", icon: Receipt },
            { id: "clients", label: "Clients", icon: User },
            { id: "products", label: "Product Library", icon: Tag },
            { id: "recurring", label: "Recurring Schedules", icon: Calendar },
            { id: "credit-notes", label: "Credit Notes", icon: CreditCard },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setCurrentView("list");
                setSelectedInvoice(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow"
                  : "bg-card border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Connection status badge */}
        <div className="flex items-center gap-2">
          {isSupabaseConfigured ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Sync Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold" title="Supabase credentials not configured in environment variables. Data is saved locally in this browser and will not sync across devices.">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Local Offline Mode</span>
            </div>
          )}
        </div>
      </div>

      {loading && currentView === "list" ? (
        <div className="flex flex-col items-center justify-center h-80 bg-card rounded-2xl border border-border/30">
          <RefreshCw className="w-6 h-6 text-primary animate-spin mb-2" />
          <p className="text-xs text-muted-foreground">Loading Invoice Records...</p>
        </div>
      ) : (
        <>
          {/* ================================================================= */}
          {/* 1. INVOICES VIEW MANAGER */}
          {/* ================================================================= */}
          {activeTab === "invoices" && (
            <>
              {currentView === "list" && (
                <div className="space-y-6">
                  {/* Summary widgets cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Invoiced", val: totalInvoiced, col: "text-primary" },
                      { label: "Total Collected", val: totalPaidSum, col: "text-emerald-500" },
                      { label: "Outstanding Balance", val: totalOutstanding, col: "text-blue-500" },
                      { label: "Overdue Amount", val: totalOverdue, col: "text-destructive" }
                    ].map((card, i) => (
                      <div key={i} className="border border-border/30 bg-card rounded-2xl p-5">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{card.label}</p>
                        <h3 className={`text-xl font-bold font-mono mt-1 ${card.col}`}>₹{card.val.toLocaleString()}</h3>
                      </div>
                    ))}
                  </div>

                  {/* Actions & Filters */}
                  <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search Invoice #, client name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-10 rounded-xl"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="viewed">Viewed</option>
                          <option value="partially paid">Partially Paid</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                          value={clientFilter}
                          onChange={(e) => setClientFilter(e.target.value)}
                          className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none max-w-[150px]"
                        >
                          <option value="all">All Clients</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl h-10 text-xs gap-1.5" onClick={handleExportInvoicesCSV}>
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </Button>
                      <Button variant="outline" className="rounded-xl h-10 text-xs gap-1.5" onClick={handleExportGSTR1CSV}>
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>GSTR-1</span>
                      </Button>
                      <Button className="rounded-xl h-10 text-xs gap-1.5" onClick={handleStartCreate}>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Invoice</span>
                      </Button>
                    </div>
                  </div>

                  {/* Invoices Table List */}
                  <div className="border border-border/30 bg-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border/30 text-muted-foreground font-semibold">
                            <th className="p-4">Invoice #</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Invoice Date</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4 text-right">Grand Total</th>
                            <th className="p-4 text-right">Balance Due</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {paginatedInvoices.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-muted-foreground italic">No invoices matching search query.</td>
                            </tr>
                          ) : (
                            paginatedInvoices.map(inv => {
                              const isPaid = inv.status === "Paid";
                              const isOverdue = inv.status === "Overdue";
                              return (
                                <tr key={inv.id} className="hover:bg-muted/10">
                                  <td className="p-4 font-mono font-bold">{inv.invoice_number}</td>
                                  <td className="p-4">
                                    <p className="font-bold text-foreground">{inv.client_data?.name || "Client"}</p>
                                    {inv.client_data?.company && <p className="text-[10px] text-muted-foreground">{inv.client_data.company}</p>}
                                  </td>
                                  <td className="p-4">{inv.invoice_date}</td>
                                  <td className="p-4">{inv.due_date}</td>
                                  <td className="p-4 text-right font-mono font-semibold">{inv.currency_symbol || "₹"}{(inv.grand_total || 0).toFixed(2)}</td>
                                  <td className="p-4 text-right font-mono text-muted-foreground">{inv.currency_symbol || "₹"}{(inv.balance_due || 0).toFixed(2)}</td>
                                  <td className="p-4 text-center">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      isPaid ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                      isOverdue ? "bg-destructive/10 text-destructive border border-destructive/20" :
                                      "bg-primary/10 text-primary border border-primary/20"
                                    }`}>
                                      {inv.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="flex justify-center gap-1.5">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-lg"
                                        title="View Details"
                                        onClick={() => {
                                          setSelectedInvoice(inv);
                                          setCurrentView("detail");
                                        }}
                                      >
                                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-lg"
                                        title="Copy Client Link"
                                        onClick={() => {
                                          const shareUrl = `${window.location.origin}/invoices/view/${inv.id}`;
                                          navigator.clipboard.writeText(shareUrl);
                                          toast.success(`Public URL for ${inv.invoice_number} copied!`);
                                        }}
                                      >
                                        <Link className="w-3.5 h-3.5 text-muted-foreground" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-lg"
                                        title="Print / Save PDF"
                                        onClick={() => handleDownloadPDF(inv)}
                                      >
                                        <Printer className="w-3.5 h-3.5 text-muted-foreground" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-lg"
                                        title="Edit Invoice"
                                        onClick={async () => {
                                          const itemSnapshot = [...(inv.items || [])];
                                          setInvoiceForm({ ...inv });
                                          setInvoiceItems(itemSnapshot);
                                          setSelectedClientId(inv.client_data?.id || "");
                                          setIsNewClientInline(false);
                                          setCurrentView("edit");
                                        }}
                                      >
                                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-lg hover:text-destructive hover:bg-destructive/10"
                                        title="Delete Invoice"
                                        onClick={async () => {
                                          if (confirm(`Are you sure you want to delete invoice ${inv.invoice_number}?`)) {
                                            await invoiceStorage.deleteInvoice(inv.id);
                                            toast.success("Invoice deleted successfully.");
                                            reloadData();
                                          }
                                        }}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-border/30 p-4 flex justify-between items-center text-xs text-muted-foreground">
                      <span>Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries</span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="w-8 h-8 rounded-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="w-8 h-8 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* 1.1 INVOICE CREATION / EDITING FORM */}
              {/* ========================================== */}
              {(currentView === "create" || currentView === "edit") && (
                <form onSubmit={handleSaveInvoice} className="border border-border/30 bg-card rounded-2xl p-6 md:p-8 space-y-8">
                  <div className="flex justify-between items-center pb-4 border-b border-border/30">
                    <h3 className="text-lg font-bold text-foreground">{currentView === "create" ? "New Invoice" : "Edit Invoice"}</h3>
                    <Button variant="ghost" type="button" onClick={() => setCurrentView("list")} className="rounded-xl">Cancel</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Invoice number prefix */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Invoice Number</label>
                      <Input
                        required
                        value={invoiceForm.invoice_number || ""}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_number: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    {/* Invoice date */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Invoice Date</label>
                      <Input
                        type="date"
                        required
                        value={invoiceForm.invoice_date || ""}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    {/* Due date */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Due Date</label>
                      <Input
                        type="date"
                        required
                        value={invoiceForm.due_date || ""}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border/30 pt-6">
                    {/* Currency */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Currency &amp; Symbol</label>
                      <div className="flex gap-2">
                        <select
                          value={invoiceForm.currency}
                          onChange={(e) => {
                            const val = e.target.value;
                            const symbol = val === "USD" ? "$" : val === "EUR" ? "€" : val === "GBP" ? "£" : "₹";
                            setInvoiceForm({ ...invoiceForm, currency: val, currency_symbol: symbol });
                          }}
                          className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none flex-1"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                        <Input
                          value={invoiceForm.currency_symbol || "₹"}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, currency_symbol: e.target.value })}
                          className="w-16 rounded-xl text-center font-bold"
                        />
                      </div>
                    </div>

                    {/* Payment Terms */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Payment Terms</label>
                      <select
                        value={invoiceForm.payment_terms}
                        onChange={(e) => {
                          const val = e.target.value;
                          const today = new Date(invoiceForm.invoice_date || "");
                          if (val === "Net 15") today.setDate(today.getDate() + 15);
                          else if (val === "Net 30") today.setDate(today.getDate() + 30);
                          else if (val === "Net 60") today.setDate(today.getDate() + 60);
                          
                          setInvoiceForm({
                            ...invoiceForm,
                            payment_terms: val,
                            due_date: val !== "Custom" ? today.toISOString().split("T")[0] : invoiceForm.due_date
                          });
                        }}
                        className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none w-full"
                      >
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 60">Net 60</option>
                        <option value="Custom">Custom / Due on Receipt</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Invoice Status</label>
                      <select
                        value={invoiceForm.status}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value as any })}
                        className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none w-full"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Viewed">Viewed</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Client Select / Inline Form */}
                  <div className="border-t border-border/30 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-foreground">Billing Details (Client)</label>
                      <button
                        type="button"
                        onClick={() => setIsNewClientInline(!isNewClientInline)}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        {isNewClientInline ? "Select Existing Client" : "+ Add New Client Inline"}
                      </button>
                    </div>

                    {isNewClientInline ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/20 p-5 rounded-2xl border border-border/30">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Client Name</label>
                          <Input
                            placeholder="John Doe"
                            value={inlineClient.name || ""}
                            onChange={(e) => setInlineClient({ ...inlineClient, name: e.target.value })}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Email</label>
                          <Input
                            placeholder="john@example.com"
                            value={inlineClient.email || ""}
                            onChange={(e) => setInlineClient({ ...inlineClient, email: e.target.value })}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Company</label>
                          <Input
                            placeholder="Company Name"
                            value={inlineClient.company || ""}
                            onChange={(e) => setInlineClient({ ...inlineClient, company: e.target.value })}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground mb-1 block">State / Region</label>
                          <Input
                            placeholder="e.g. Gujarat"
                            value={inlineClient.state || ""}
                            onChange={(e) => setInlineClient({ ...inlineClient, state: e.target.value })}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Address</label>
                          <Input
                            placeholder="Street details"
                            value={inlineClient.address || ""}
                            onChange={(e) => setInlineClient({ ...inlineClient, address: e.target.value })}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground mb-1 block">GSTIN</label>
                          <Input
                            placeholder="GSTIN Number"
                            value={inlineClient.gstin || ""}
                            onChange={(e) => setInlineClient({ ...inlineClient, gstin: e.target.value })}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <select
                          value={selectedClientId}
                          onChange={(e) => setSelectedClientId(e.target.value)}
                          className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none w-full max-w-md"
                        >
                          <option value="">-- Choose Client --</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Line Items Editor */}
                  <div className="border-t border-border/30 pt-6 space-y-4">
                    <label className="text-sm font-bold text-foreground">Line Items (Reorderable via Drag-and-Drop)</label>
                    <div className="space-y-3">
                      {invoiceItems.map((item, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", idx.toString())}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(idx, Number(e.dataTransfer.getData("text/plain")))}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 border border-border/40 rounded-xl bg-muted/10 cursor-move hover:border-primary/20 transition-all duration-200"
                        >
                          <div className="lg:col-span-3">
                            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Select Saved Product OR Enter Name</label>
                            <div className="space-y-1">
                              <select
                                onChange={(e) => handleSelectLibraryProduct(idx, e.target.value)}
                                className="h-9 text-xs border border-border rounded-lg bg-card text-card-foreground px-2 outline-none w-full"
                              >
                                <option value="">-- Library Products --</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                              <Input
                                placeholder="Service / Item Name"
                                value={item.name}
                                required
                                onChange={(e) => handleUpdateItem(idx, "name", e.target.value)}
                                className="rounded-lg h-9 text-xs"
                              />
                            </div>
                          </div>

                          <div className="lg:col-span-3">
                            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Description</label>
                            <Textarea
                              placeholder="Detail descriptions"
                              value={item.description}
                              rows={2}
                              onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                              className="rounded-lg text-xs"
                            />
                          </div>

                          <div className="lg:col-span-1">
                            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Qty</label>
                            <Input
                              type="number"
                              required
                              min="0.01"
                              step="any"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(idx, "quantity", Number(e.target.value))}
                              className="rounded-lg h-9 text-xs text-right"
                            />
                          </div>

                          <div className="lg:col-span-1">
                            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Unit</label>
                            <Input
                              value={item.unit}
                              onChange={(e) => handleUpdateItem(idx, "unit", e.target.value)}
                              className="rounded-lg h-9 text-xs"
                            />
                          </div>

                          <div className="lg:col-span-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Unit Price</label>
                            <Input
                              type="number"
                              required
                              min="0"
                              value={item.unit_price}
                              onChange={(e) => handleUpdateItem(idx, "unit_price", Number(e.target.value))}
                              className="rounded-lg h-9 text-xs text-right"
                            />
                          </div>

                          <div className="lg:col-span-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Tax (GST)</label>
                            <select
                              value={item.tax_rate}
                              onChange={(e) => handleUpdateItem(idx, "tax_rate", Number(e.target.value))}
                              className="h-9 text-xs border border-border rounded-lg bg-card text-card-foreground px-2 outline-none w-full"
                            >
                              <option value="0">No Tax (0%)</option>
                              <option value="5">GST 5%</option>
                              <option value="12">GST 12%</option>
                              <option value="18">GST 18%</option>
                              <option value="28">GST 28%</option>
                            </select>
                          </div>

                          <div className="lg:col-span-1 flex flex-col justify-end items-center pb-1">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="w-9 h-9 rounded-lg hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddItemRow}
                      className="rounded-xl text-xs gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Item Line</span>
                    </Button>
                  </div>

                  {/* Calculations and Discounts summary */}
                  {(() => {
                    const t = calculateTotals();
                    return (
                      <div className="border-t border-border/30 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 text-xs">
                          {/* Invoice configurations */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Template Layout</label>
                              <select
                                value={invoiceForm.template_id || "classic"}
                                onChange={(e) => setInvoiceForm({ ...invoiceForm, template_id: e.target.value as any })}
                                className="h-9 text-xs border border-border rounded-lg bg-card text-card-foreground px-2 outline-none w-full"
                              >
                                <option value="classic">Classic Template</option>
                                <option value="modern">Modern Template</option>
                                <option value="minimal">Minimal Layout</option>
                                <option value="gst">Tax/GST Compliant</option>
                                <option value="creative">Creative Layout</option>
                                <option value="compact">Compact Template</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Primary Theme Color</label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  value={invoiceForm.color_theme || "#304ce6"}
                                  onChange={(e) => setInvoiceForm({ ...invoiceForm, color_theme: e.target.value })}
                                  className="w-10 h-9 p-0 rounded-lg outline-none cursor-pointer"
                                />
                                <Input
                                  value={invoiceForm.color_theme || "#304ce6"}
                                  onChange={(e) => setInvoiceForm({ ...invoiceForm, color_theme: e.target.value })}
                                  className="h-9 text-xs rounded-lg"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/20">
                            {[
                              { key: "show_logo", label: "Logo" },
                              { key: "show_bank", label: "Bank Info" },
                              { key: "show_signature", label: "Signature" },
                              { key: "show_qr", label: "QR Code" }
                            ].map(item => (
                              <label key={item.key} className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!(invoiceForm as any)[item.key]}
                                  onChange={(e) => setInvoiceForm({ ...invoiceForm, [item.key]: e.target.checked })}
                                  className="accent-primary rounded focus:ring-primary w-3.5 h-3.5"
                                />
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.label}</span>
                              </label>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Notes &amp; Footer Message</label>
                              <Textarea
                                rows={2}
                                value={invoiceForm.notes || ""}
                                onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                                className="rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground mb-1 block">Terms &amp; Conditions</label>
                              <Textarea
                                rows={2}
                                value={invoiceForm.terms_conditions || ""}
                                onChange={(e) => setInvoiceForm({ ...invoiceForm, terms_conditions: e.target.value })}
                                className="rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculations summary column */}
                        <div className="bg-muted/10 p-5 rounded-2xl border border-border/30 text-xs space-y-3">
                          <div className="flex justify-between text-muted-foreground font-medium">
                            <span>Subtotal:</span>
                            <span className="font-mono">{invoiceForm.currency_symbol}{t.subtotal.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between text-muted-foreground">
                            <span>GST Tax Amount:</span>
                            <span className="font-mono">{invoiceForm.currency_symbol}{t.total_tax.toFixed(2)}</span>
                          </div>

                          {/* Shipping charges */}
                          <div className="flex items-center justify-between gap-3 text-muted-foreground">
                            <span>Shipping / Handling:</span>
                            <Input
                              type="number"
                              min="0"
                              value={invoiceForm.shipping_charges || 0}
                              onChange={(e) => setInvoiceForm({ ...invoiceForm, shipping_charges: Number(e.target.value) })}
                              className="rounded-lg h-7 text-xs text-right p-1.5 w-20"
                            />
                          </div>

                          {/* Rounding Adjustments */}
                          <div className="flex items-center justify-between gap-3 text-muted-foreground">
                            <span>Adjustment (round off):</span>
                            <Input
                              type="number"
                              step="any"
                              value={invoiceForm.adjustment || 0}
                              onChange={(e) => setInvoiceForm({ ...invoiceForm, adjustment: Number(e.target.value) })}
                              className="rounded-lg h-7 text-xs text-right p-1.5 w-20"
                            />
                          </div>

                          <div className="flex justify-between text-sm font-bold text-foreground pt-3 border-t border-border/40">
                            <span>Grand Total:</span>
                            <span className="font-mono text-base text-primary">{invoiceForm.currency_symbol}{t.grand_total.toFixed(2)}</span>
                          </div>

                          {/* Amount paid (pre-filled offset for initial partial settings) */}
                          <div className="flex items-center justify-between gap-3 text-muted-foreground">
                            <span>Already Paid Offset:</span>
                            <Input
                              type="number"
                              min="0"
                              value={invoiceForm.amount_paid || 0}
                              onChange={(e) => setInvoiceForm({ ...invoiceForm, amount_paid: Number(e.target.value) })}
                              className="rounded-lg h-7 text-xs text-right p-1.5 w-20"
                            />
                          </div>

                          <div className="flex justify-between text-xs font-black text-foreground pt-1.5 border-t border-dashed border-border/30">
                            <span>Net Balance Due:</span>
                            <span className="font-mono text-foreground">{invoiceForm.currency_symbol}{t.balance_due.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="border-t border-border/30 pt-6 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setCurrentView("list")} className="rounded-xl">Cancel</Button>
                    <Button className="rounded-xl" type="submit">Save Invoice</Button>
                  </div>
                </form>
              )}

              {/* ============================================== */}
              {/* 1.2 INVOICE DETAIL VIEW & ACTIONS PANEL */}
              {/* ============================================== */}
              {currentView === "detail" && selectedInvoice && (() => {
                const clientName = selectedInvoice.client_data?.name || "Client";
                const grandTotalStr = (selectedInvoice.grand_total || 0).toFixed(2);
                const balanceDueStr = (selectedInvoice.balance_due || 0).toFixed(2);
                const currencySymbol = selectedInvoice.currency_symbol || "₹";
                
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: live preview */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="no-print flex justify-between items-center p-4 border border-border/30 bg-card rounded-2xl">
                        <Button variant="outline" className="rounded-xl text-xs gap-1.5" onClick={() => setCurrentView("list")}>
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Invoices List</span>
                        </Button>
                              <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="rounded-xl text-xs gap-1.5"
                            title="Copy link or open native device sharing menu"
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/invoices/view/${selectedInvoice.id}`;
                              if (navigator.share) {
                                navigator.share({
                                  title: `Invoice ${selectedInvoice.invoice_number}`,
                                  text: `Please find the invoice ${selectedInvoice.invoice_number} from ScaleXWeb Solution.`,
                                  url: shareUrl,
                                }).then(() => {
                                  toast.success("Shared successfully!");
                                }).catch((err) => {
                                  console.log(err);
                                  navigator.clipboard.writeText(shareUrl);
                                  toast.success("Invoice link copied to clipboard!");
                                });
                              } else {
                                navigator.clipboard.writeText(shareUrl);
                                toast.success("Invoice link copied to clipboard!");
                              }
                            }}
                          >
                            <Link className="w-3.5 h-3.5" />
                            <span>Share URL</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl text-xs gap-1.5"
                            onClick={() => {
                              const text = `Hi ${clientName},\n\nPlease find the invoice ${selectedInvoice.invoice_number} for ${currencySymbol}${grandTotalStr} from ScaleXWeb Solution.\n\nView details here:\n${window.location.origin}/invoices/view/${selectedInvoice.id}`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                            }}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </Button>
                          <Button 
                            className="rounded-xl text-xs gap-1.5"
                            onClick={() => handleDownloadPDF(selectedInvoice)}
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print / Save PDF</span>
                          </Button>
                        </div>
                      </div>

                      <InvoiceTemplate invoice={selectedInvoice} />
                    </div>

                    {/* Right Column: details management */}
                    <div className="space-y-6">
                      {/* Invoice Lifecycle actions */}
                      <div className="border border-border/30 bg-card rounded-2xl p-5 space-y-4">
                        <h4 className="font-bold text-sm text-foreground">Invoice Management</h4>
                        <div className="text-xs space-y-2 text-muted-foreground font-medium">
                          <p className="flex justify-between">Number: <span className="font-bold text-foreground font-mono">{selectedInvoice.invoice_number}</span></p>
                          <p className="flex justify-between">Due Date: <span className="text-foreground">{selectedInvoice.due_date}</span></p>
                          <p className="flex justify-between">Total: <span className="text-foreground font-mono font-bold">{currencySymbol}{grandTotalStr}</span></p>
                          <p className="flex justify-between">Outstanding: <span className="font-bold font-mono text-destructive">{currencySymbol}{balanceDueStr}</span></p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          {/* Record Payment Trigger */}
                          {(selectedInvoice.balance_due || 0) > 0 && (
                            <Button className="rounded-xl text-xs w-full" onClick={() => setPaymentFormOpen(true)}>
                              Record Payment
                            </Button>
                          )}
                          {/* Issue Credit Note trigger */}
                          <Button variant="outline" className="rounded-xl text-xs w-full" onClick={() => setCreditNoteFormOpen(true)}>
                            Issue Credit Note
                          </Button>
                          {/* Setup Recurring Billing */}
                          <Button variant="outline" className="rounded-xl text-xs w-full" onClick={() => {
                            setRecurringScheduleName(`Monthly Retainer for ${clientName}`);
                            setRecurringFormOpen(true);
                          }}>
                            Make Invoice Recurring
                          </Button>
                          
                          {(selectedInvoice.balance_due || 0) > 0 && (
                            <Button
                              variant="ghost"
                              className="rounded-xl text-xs w-full text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                              onClick={async () => {
                                const pay: Payment = {
                                  id: Math.random().toString(36).substring(2, 9),
                                  invoice_id: selectedInvoice.id,
                                  amount: selectedInvoice.balance_due || 0,
                                  payment_date: new Date().toISOString(),
                                  payment_mode: "Bank Transfer",
                                  notes: "Marked as fully paid by admin."
                                };
                                await invoiceStorage.addPayment(pay);
                                const refreshed = await invoiceStorage.getInvoiceById(selectedInvoice.id);
                                setSelectedInvoice(refreshed);
                                toast.success("Invoice successfully marked as Fully Paid!");
                              }}
                            >
                              Mark as Fully Paid
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Payments History Timeline */}
                      <div className="border border-border/30 bg-card rounded-2xl p-5 space-y-4">
                        <h4 className="font-bold text-sm text-foreground">Payment History</h4>
                        {paymentHistory.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">No payments recorded yet.</p>
                        ) : (
                          <div className="relative border-l border-border/60 pl-4 space-y-4">
                            {paymentHistory.map(pay => (
                              <div key={pay.id} className="relative text-xs">
                                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                                <p className="font-bold text-foreground font-mono">+{currencySymbol}{(pay.amount || 0).toFixed(2)}</p>
                                <p className="text-[10px] text-muted-foreground">{new Date(pay.payment_date).toLocaleDateString()} via {pay.payment_mode}</p>
                                {pay.transaction_ref && <p className="text-[9px] font-mono text-muted-foreground">Ref: {pay.transaction_ref}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* ================================================================= */}
          {/* 2. CLIENTS MANAGER */}
          {/* ================================================================= */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-foreground">Clients Library</h3>
                <Button className="rounded-xl text-xs gap-1" onClick={() => {
                  setEditingClient({});
                  setClientModalOpen(true);
                }}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Client</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clients.map(client => (
                  <div key={client.id} className="border border-border/30 bg-card rounded-2xl p-5 space-y-3 relative hover:border-primary/20 transition-all duration-300">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{client.name}</h4>
                      {client.company && <p className="text-xs text-muted-foreground font-semibold">{client.company}</p>}
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground font-medium">
                      <p>Email: {client.email}</p>
                      {client.phone && <p>Phone: {client.phone}</p>}
                      {client.city && <p>Location: {client.city}, {client.state}</p>}
                      {client.gstin && <p className="font-mono text-[10px]">GSTIN: {client.gstin}</p>}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/20">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs flex-1 gap-1"
                        onClick={() => {
                          setEditingClient(client);
                          setClientModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        onClick={async () => {
                          if (confirm(`Delete client ${client.name}?`)) {
                            await invoiceStorage.deleteClient(client.id);
                            reloadData();
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. PRODUCTS LIBRARY MANAGER */}
          {/* ================================================================= */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-foreground">Services &amp; Products Library</h3>
                <Button className="rounded-xl text-xs gap-1" onClick={() => {
                  setEditingProduct({ tax_rate: 18, unit: "units" });
                  setProductModalOpen(true);
                }}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(prod => (
                  <div key={prod.id} className="border border-border/30 bg-card rounded-2xl p-5 space-y-3 hover:border-primary/20 transition-all duration-300">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{prod.name}</h4>
                      {prod.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{prod.description}</p>}
                    </div>
                    <div className="text-xs space-y-1.5 text-muted-foreground font-medium">
                      <p>Default Rate: <span className="font-bold font-mono text-foreground">₹{prod.unit_price} / {prod.unit}</span></p>
                      <p>Default Tax: <span className="font-mono">{prod.tax_rate}% GST</span></p>
                      {prod.hsn_sac && <p>HSN/SAC: <span className="font-mono">{prod.hsn_sac}</span></p>}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/20">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs flex-1 gap-1"
                        onClick={() => {
                          setEditingProduct(prod);
                          setProductModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        onClick={async () => {
                          if (confirm(`Delete product ${prod.name}?`)) {
                            await invoiceStorage.deleteProduct(prod.id);
                            reloadData();
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 4. RECURRING INVOICES LIST */}
          {/* ================================================================= */}
          {activeTab === "recurring" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground">Recurring Schedules</h3>
              <div className="border border-border/30 bg-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border/30 text-muted-foreground font-semibold">
                        <th className="p-4">Schedule Name</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Frequency</th>
                        <th className="p-4">Next Gen Date</th>
                        <th className="p-4 text-center">Auto Send</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {recurringSchedules.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground italic">No active recurring schedules configured. To add one, navigate to invoices list, select an invoice, and click "Make Invoice Recurring".</td>
                        </tr>
                      ) : (
                        recurringSchedules.map(sched => (
                          <tr key={sched.id} className="hover:bg-muted/10">
                            <td className="p-4 font-bold">{sched.schedule_name}</td>
                            <td className="p-4">{sched.client_name}</td>
                            <td className="p-4">{sched.frequency}</td>
                            <td className="p-4 font-mono font-medium">{sched.next_generation_date}</td>
                            <td className="p-4 text-center font-bold text-muted-foreground">{sched.auto_send ? "Enabled" : "Disabled"}</td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                sched.is_active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-muted text-muted-foreground"
                              }`}>
                                {sched.is_active ? "Active" : "Paused"}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 rounded-lg"
                                  onClick={async () => {
                                    const updated = { ...sched, is_active: !sched.is_active };
                                    await invoiceStorage.saveRecurringSchedule(updated);
                                    toast.success("Schedule status toggled!");
                                    reloadData();
                                  }}
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 rounded-lg hover:text-destructive hover:bg-destructive/10"
                                  onClick={async () => {
                                    if (confirm("Delete recurring schedule?")) {
                                      await invoiceStorage.deleteRecurringSchedule(sched.id);
                                      reloadData();
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 5. CREDIT NOTES LIST */}
          {/* ================================================================= */}
          {activeTab === "credit-notes" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground">Issued Credit Notes</h3>
              <div className="border border-border/30 bg-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border/30 text-muted-foreground font-semibold">
                        <th className="p-4">Credit Note #</th>
                        <th className="p-4">Original Invoice</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Date Issued</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4 text-right">Amount Credited</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {creditNotes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground italic">No credit notes issued yet.</td>
                        </tr>
                      ) : (
                        creditNotes.map(cn => (
                          <tr key={cn.id} className="hover:bg-muted/10">
                            <td className="p-4 font-mono font-bold text-destructive">{cn.credit_note_number}</td>
                            <td className="p-4 font-mono font-medium">{cn.invoice_number}</td>
                            <td className="p-4">{cn.client_name}</td>
                            <td className="p-4">{cn.credit_note_date}</td>
                            <td className="p-4 text-muted-foreground italic">{cn.reason}</td>
                            <td className="p-4 text-right font-mono font-bold text-destructive">-₹{cn.amount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 6. SETTINGS PANEL CONFIG */}
          {/* ================================================================= */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="border border-border/30 bg-card rounded-2xl p-6 md:p-8 space-y-6">
              <div className="pb-4 border-b border-border/30">
                <h3 className="text-lg font-bold text-foreground">Global Invoice Configurations</h3>
                <p className="text-xs text-muted-foreground">Setup details pre-filled on every newly generated invoice.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-semibold">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Default Currency</label>
                  <Input
                    required
                    value={settings.default_currency}
                    onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Default Currency Symbol</label>
                  <Input
                    required
                    value={settings.default_currency_symbol}
                    onChange={(e) => setSettings({ ...settings, default_currency_symbol: e.target.value })}
                    className="rounded-xl text-center"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Default Tax (GST) Rate %</label>
                  <Input
                    type="number"
                    required
                    value={settings.default_tax_rate}
                    onChange={(e) => setSettings({ ...settings, default_tax_rate: Number(e.target.value) })}
                    className="rounded-xl text-right"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Default Payment Terms</label>
                  <Input
                    required
                    value={settings.default_payment_terms}
                    onChange={(e) => setSettings({ ...settings, default_payment_terms: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold pt-4 border-t border-border/20">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Invoice Serial Prefix</label>
                  <Input
                    required
                    value={settings.invoice_prefix}
                    onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Next Invoice Sequence No.</label>
                  <Input
                    type="number"
                    required
                    value={settings.next_invoice_number}
                    onChange={(e) => setSettings({ ...settings, next_invoice_number: Number(e.target.value) })}
                    className="rounded-xl text-right"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border/20 space-y-4">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-widest text-[9px] text-primary">Business / Sender Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Company Name</label>
                    <Input
                      required
                      value={settings.business_name}
                      onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Company Email</label>
                    <Input
                      required
                      value={settings.business_email}
                      onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Company Phone</label>
                    <Input
                      value={settings.business_phone || ""}
                      onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-bold text-foreground mb-1 block">Corporate Address</label>
                    <Input
                      required
                      value={settings.business_address}
                      onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">GSTIN</label>
                    <Input
                      value={settings.business_gstin || ""}
                      onChange={(e) => setSettings({ ...settings, business_gstin: e.target.value })}
                      className="rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">PAN</label>
                    <Input
                      value={settings.business_pan || ""}
                      onChange={(e) => setSettings({ ...settings, business_pan: e.target.value })}
                      className="rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">CIN</label>
                    <Input
                      value={settings.business_cin || ""}
                      onChange={(e) => setSettings({ ...settings, business_cin: e.target.value })}
                      className="rounded-xl font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/20 space-y-4">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-widest text-[9px] text-primary">Settlement Bank Account Coordinates</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Beneficiary Account Name</label>
                    <Input
                      required
                      value={settings.bank_account_name}
                      onChange={(e) => setSettings({ ...settings, bank_account_name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Account Number</label>
                    <Input
                      required
                      value={settings.bank_account_number}
                      onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                      className="rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">IFSC Code</label>
                    <Input
                      required
                      value={settings.bank_ifsc}
                      onChange={(e) => setSettings({ ...settings, bank_ifsc: e.target.value })}
                      className="rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Bank Name</label>
                    <Input
                      required
                      value={settings.bank_name}
                      onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Branch Details</label>
                    <Input
                      required
                      value={settings.bank_branch}
                      onChange={(e) => setSettings({ ...settings, bank_branch: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">UPI ID Address</label>
                    <Input
                      value={settings.bank_upi_id || ""}
                      onChange={(e) => setSettings({ ...settings, bank_upi_id: e.target.value })}
                      className="rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/20 text-xs font-semibold">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">Default Invoice T&amp;C Clauses</label>
                  <Textarea
                    rows={3}
                    value={settings.default_terms}
                    onChange={(e) => setSettings({ ...settings, default_terms: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border/30 flex justify-end">
                <Button className="rounded-xl" type="submit">Update Configurations</Button>
              </div>
            </form>
          )}
        </>
      )}

      {/* ================================================================= */}
      {/* 7. MODALS & SUB-FORMS OVERLAYS */}
      {/* ================================================================= */}
      
      {/* 7.1 CLIENT ADD / EDIT MODAL */}
      {clientModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSaveClientSubmit} className="border border-border/30 bg-card rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border/20">
              <h4 className="font-bold text-foreground">{editingClient.id ? "Edit Client" : "Add Client"}</h4>
              <Button variant="ghost" size="icon" type="button" onClick={() => setClientModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="sm:col-span-2">
                <label className="mb-1 block">Client Name</label>
                <Input required value={editingClient.name || ""} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} className="rounded-xl" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block">Company Name</label>
                <Input value={editingClient.company || ""} onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block">Email</label>
                <Input required type="email" value={editingClient.email || ""} onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block">Phone</label>
                <Input value={editingClient.phone || ""} onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })} className="rounded-xl" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block">Billing Street Address</label>
                <Input value={editingClient.address || ""} onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block">City</label>
                <Input value={editingClient.city || ""} onChange={(e) => setEditingClient({ ...editingClient, city: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block">State / Region</label>
                <Input value={editingClient.state || ""} onChange={(e) => setEditingClient({ ...editingClient, state: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block">PIN Code</label>
                <Input value={editingClient.pin_code || ""} onChange={(e) => setEditingClient({ ...editingClient, pin_code: e.target.value })} className="rounded-xl font-mono" />
              </div>
              <div>
                <label className="mb-1 block">GSTIN</label>
                <Input value={editingClient.gstin || ""} onChange={(e) => setEditingClient({ ...editingClient, gstin: e.target.value })} className="rounded-xl font-mono uppercase" />
              </div>
            </div>
            <div className="pt-4 border-t border-border/20 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setClientModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl">Save Client</Button>
            </div>
          </form>
        </div>
      )}

      {/* 7.2 PRODUCT LIBRARY ADD / EDIT MODAL */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSaveProductSubmit} className="border border-border/30 bg-card rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border/20">
              <h4 className="font-bold text-foreground">{editingProduct.id ? "Edit Library Item" : "Add Library Item"}</h4>
              <Button variant="ghost" size="icon" type="button" onClick={() => setProductModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs font-semibold space-y-3">
              <div>
                <label className="mb-1 block">Product / Service Name</label>
                <Input required value={editingProduct.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block">Description</label>
                <Textarea value={editingProduct.description || ""} rows={2} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block">Rate / Price</label>
                  <Input type="number" required value={editingProduct.unit_price || ""} onChange={(e) => setEditingProduct({ ...editingProduct, unit_price: e.target.value })} className="rounded-xl text-right font-mono" />
                </div>
                <div>
                  <label className="mb-1 block">Unit</label>
                  <Input value={editingProduct.unit || "units"} onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block">Default Tax Rate (GST %)</label>
                  <Input type="number" value={editingProduct.tax_rate || 0} onChange={(e) => setEditingProduct({ ...editingProduct, tax_rate: e.target.value })} className="rounded-xl text-right font-mono" />
                </div>
                <div>
                  <label className="mb-1 block">HSN / SAC Code</label>
                  <Input value={editingProduct.hsn_sac || ""} onChange={(e) => setEditingProduct({ ...editingProduct, hsn_sac: e.target.value })} className="rounded-xl font-mono" />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-border/20 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setProductModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl">Save Item</Button>
            </div>
          </form>
        </div>
      )}

      {/* 7.3 RECORD PAYMENT MODAL */}
      {paymentFormOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleAddPaymentSubmit} className="border border-border/30 bg-card rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border/20">
              <h4 className="font-bold text-foreground">Record Payment</h4>
              <Button variant="ghost" size="icon" type="button" onClick={() => setPaymentFormOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Log payment details received against invoice {selectedInvoice.invoice_number}.</p>
            <div className="text-xs font-semibold space-y-3">
              <div>
                <label className="mb-1 block">Amount ({selectedInvoice.currency_symbol || "₹"})</label>
                <Input
                  type="number"
                  required
                  placeholder={(selectedInvoice.balance_due || 0).toFixed(2)}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="rounded-xl font-mono text-right"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Outstanding Balance: {selectedInvoice.currency_symbol || "₹"}{(selectedInvoice.balance_due || 0).toFixed(2)}</p>
              </div>
              <div>
                <label className="mb-1 block">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none w-full"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="UPI">UPI Payment</option>
                  <option value="Cash">Cash Settlement</option>
                  <option value="Card">Stripe / Card Link</option>
                  <option value="Cheque">Bank Cheque</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block">Transaction Reference / ID</label>
                <Input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} className="rounded-xl font-mono" placeholder="TXN123456789" />
              </div>
              <div>
                <label className="mb-1 block">Internal Payment Notes</label>
                <Textarea value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} rows={2} className="rounded-xl" placeholder="Settlement details" />
              </div>
            </div>
            <div className="pt-4 border-t border-border/20 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setPaymentFormOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl">Record Payment</Button>
            </div>
          </form>
        </div>
      )}

      {/* 7.4 ISSUE CREDIT NOTE MODAL */}
      {creditNoteFormOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleAddCreditNoteSubmit} className="border border-border/30 bg-card rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border/20">
              <h4 className="font-bold text-foreground">Issue Credit Note</h4>
              <Button variant="ghost" size="icon" type="button" onClick={() => setCreditNoteFormOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Reduce the billing total of invoice {selectedInvoice.invoice_number} via Credit Note credit.</p>
            <div className="text-xs font-semibold space-y-3">
              <div>
                <label className="mb-1 block">Credit Note Amount ({selectedInvoice.currency_symbol || "₹"})</label>
                <Input
                  type="number"
                  required
                  placeholder={(selectedInvoice.grand_total || 0).toFixed(2)}
                  value={creditNoteAmount}
                  onChange={(e) => setCreditNoteAmount(e.target.value)}
                  className="rounded-xl font-mono text-right"
                />
              </div>
              <div>
                <label className="mb-1 block">Reason for Credit</label>
                <Textarea required value={creditNoteReason} onChange={(e) => setCreditNoteReason(e.target.value)} rows={3} className="rounded-xl" placeholder="Describe reason (e.g. Scope reduction, project discount, refund offset)" />
              </div>
            </div>
            <div className="pt-4 border-t border-border/20 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreditNoteFormOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl">Issue Credit Note</Button>
            </div>
          </form>
        </div>
      )}

      {/* 7.5 CONFIGURE RECURRING BILLING MODAL */}
      {recurringFormOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSaveRecurringSchedule} className="border border-border/30 bg-card rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border/20">
              <h4 className="font-bold text-foreground">Make Invoice Recurring</h4>
              <Button variant="ghost" size="icon" type="button" onClick={() => setRecurringFormOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Setup an automated generating schedule based on the layout and pricing of invoice {selectedInvoice.invoice_number}.</p>
            <div className="text-xs font-semibold space-y-3">
              <div>
                <label className="mb-1 block">Schedule Name</label>
                <Input
                  required
                  value={recurringScheduleName}
                  onChange={(e) => setRecurringScheduleName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="mb-1 block">Frequency / Period</label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as any)}
                  className="h-10 text-xs border border-border rounded-xl bg-card text-card-foreground px-3 outline-none w-full"
                >
                  <option value="Weekly">Weekly Generation</option>
                  <option value="Monthly">Monthly Retainer</option>
                  <option value="Quarterly">Quarterly Billing</option>
                  <option value="Yearly">Annual Renewal</option>
                </select>
              </div>
              <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recurringAutoSend}
                  onChange={(e) => setRecurringAutoSend(e.target.checked)}
                  className="accent-primary rounded w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-foreground">Auto-generate and Email automatically</span>
              </label>
            </div>
            <div className="pt-4 border-t border-border/20 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setRecurringFormOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl">Create Schedule</Button>
            </div>
          </form>
        </div>
      )}


    </div>
  );
};
