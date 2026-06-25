import React from "react";
import { Invoice } from "@/lib/invoiceStorage";
import logoImg from "@/assets/logo.png";

interface InvoiceTemplateProps {
  invoice: Invoice;
  printMode?: boolean;
}

export const InvoiceTemplate = ({ invoice, printMode = false }: InvoiceTemplateProps) => {
  const safeInvoice = invoice || {};
  
  const toNum = (val: any): number => {
    if (val === null || val === undefined) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const invoice_number = safeInvoice.invoice_number ?? "";
  const invoice_date = safeInvoice.invoice_date ?? "";
  const due_date = safeInvoice.due_date ?? "";
  const status = safeInvoice.status ?? "Draft";
  const currency_symbol = safeInvoice.currency_symbol ?? "₹";
  const payment_terms = safeInvoice.payment_terms ?? "";
  const subtotal = toNum(safeInvoice.subtotal);
  const discount_type = safeInvoice.discount_type ?? "percent";
  const discount_value = toNum(safeInvoice.discount_value);
  const discount_amount = toNum(safeInvoice.discount_amount);
  const total_tax = toNum(safeInvoice.total_tax);
  const shipping_charges = toNum(safeInvoice.shipping_charges);
  const adjustment = toNum(safeInvoice.adjustment);
  const grand_total = toNum(safeInvoice.grand_total);
  const amount_paid = toNum(safeInvoice.amount_paid);
  const balance_due = toNum(safeInvoice.balance_due);
  const terms_conditions = safeInvoice.terms_conditions ?? "";
  const notes = safeInvoice.notes ?? "";
  const template_id = safeInvoice.template_id ?? "classic";
  const color_theme = safeInvoice.color_theme ?? "#304ce6";
  const show_logo = safeInvoice.show_logo ?? true;
  const show_bank = safeInvoice.show_bank ?? true;
  const show_signature = safeInvoice.show_signature ?? true;
  const show_qr = safeInvoice.show_qr ?? true;
  const signature_image = safeInvoice.signature_image;

  // Safe checks for nested objects to prevent runtime crashes
  const items = safeInvoice.items || [];
  const tax_summary = safeInvoice.tax_summary || [];
  const client_data = safeInvoice.client_data || { name: "Client", email: "" };
  const business_details = safeInvoice.business_details || { name: "ScaleXWeb Solution", address: "", email: "" };
  const bank_details = safeInvoice.bank_details || null;

  const primaryColor = color_theme;
  const isPaid = status === "Paid";

  // Public invoice shareable URL
  const publicUrl = `${window.location.origin}/invoices/view/${safeInvoice.id || ""}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicUrl)}`;

  // Determine state matching for GST (Gujarat to Gujarat is CGST/SGST, others is IGST)
  const isStateMatch =
    (business_details.address || "").toLowerCase().includes("gujarat") &&
    ((client_data.state || "").toLowerCase().includes("gujarat") ||
      (client_data.address || "").toLowerCase().includes("gujarat"));

  // Render Watermark
  const renderWatermark = () => {
    if (!isPaid) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0 opacity-[0.06] dark:opacity-[0.04]">
        <div className="text-[120px] font-black tracking-widest border-[15px] border-emerald-500 text-emerald-500 rounded-2xl px-12 rotate-[25deg] transform uppercase">
          PAID
        </div>
      </div>
    );
  };

  // 1. CLASSIC TEMPLATE
  if (template_id === "classic") {
    return (
      <div className="relative p-6 sm:p-10 bg-card text-card-foreground border border-border/60 rounded-2xl shadow-sm overflow-hidden font-sans min-h-[842px] max-w-[800px] mx-auto print:border-0 print:shadow-none">
        {renderWatermark()}

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border/60">
            <div>
              {show_logo && (
                <div className="text-xl font-heading font-extrabold flex items-center gap-2.5 mb-2">
                  <img src={logoImg} alt="ScaleXWeb Logo" className="w-8 h-8 object-contain rounded-xl shadow-md" />
                  <span>{business_details.name}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground max-w-sm whitespace-pre-wrap">{business_details.address}</p>
              {business_details.gstin && <p className="text-xs text-muted-foreground mt-1"><strong>GSTIN:</strong> {business_details.gstin}</p>}
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-3xl font-heading font-black tracking-tight uppercase" style={{ color: primaryColor }}>Invoice</h2>
              <p className="text-sm font-mono font-bold mt-1 text-muted-foreground">{invoice_number}</p>
              <div className="mt-2 text-xs space-y-1">
                <p><strong>Date:</strong> {invoice_date}</p>
                <p><strong>Due Date:</strong> {due_date}</p>
                <p><strong>Terms:</strong> {payment_terms}</p>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div>
              <p className="text-muted-foreground uppercase font-bold tracking-wider mb-2">Bill To</p>
              <p className="text-sm font-bold text-foreground">{client_data.name}</p>
              {client_data.company && <p className="font-semibold text-muted-foreground mt-0.5">{client_data.company}</p>}
              <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{client_data.address}</p>
              <p className="text-muted-foreground">{client_data.city}, {client_data.state} {client_data.pin_code}</p>
              {client_data.phone && <p className="text-muted-foreground mt-1"><strong>Phone:</strong> {client_data.phone}</p>}
              {client_data.gstin && <p className="text-muted-foreground"><strong>GSTIN:</strong> {client_data.gstin}</p>}
            </div>
            {client_data.ship_to_same === false && (
              <div>
                <p className="text-muted-foreground uppercase font-bold tracking-wider mb-2">Ship To</p>
                <p className="text-sm font-bold text-foreground">{client_data.name}</p>
                <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{client_data.shipping_address}</p>
                <p className="text-muted-foreground">{client_data.shipping_city}, {client_data.shipping_state} {client_data.shipping_pin}</p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-border/50 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border/50 text-muted-foreground font-semibold">
                  <th className="p-3">#</th>
                  <th className="p-3">Item Details</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  {items.some(i => toNum(i.tax_rate) > 0) && <th className="p-3 text-right">Tax</th>}
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/10">
                    <td className="p-3 font-mono text-[10px] text-muted-foreground">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{item.name}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-pre-wrap">{item.description}</p>}
                    </td>
                    <td className="p-3 text-right font-mono">{item.quantity} <span className="text-[10px] text-muted-foreground">{item.unit}</span></td>
                    <td className="p-3 text-right font-mono">{currency_symbol}{toNum(item.unit_price).toFixed(2)}</td>
                    {items.some(i => toNum(i.tax_rate) > 0) && (
                      <td className="p-3 text-right font-mono text-muted-foreground">{toNum(item.tax_rate) > 0 ? `${item.tax_rate}%` : "-"}</td>
                    )}
                    <td className="p-3 text-right font-mono font-bold text-foreground">{currency_symbol}{toNum(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4">
            <div className="w-full sm:max-w-md space-y-4 text-xs">
              {show_bank && bank_details && (
                <div className="border border-border/40 bg-muted/20 p-4 rounded-xl space-y-2">
                  <p className="font-bold text-foreground uppercase tracking-wider text-[10px]">Bank Transfer Details</p>
                  <div className="grid grid-cols-2 gap-y-1 text-muted-foreground">
                    <p><strong>Bank Name:</strong></p> <p className="text-foreground font-medium">{bank_details.bank_name}</p>
                    <p><strong>Account Name:</strong></p> <p className="text-foreground font-medium">{bank_details.account_name}</p>
                    <p><strong>Account Number:</strong></p> <p className="text-foreground font-mono font-semibold">{bank_details.account_number}</p>
                    <p><strong>IFSC Code:</strong></p> <p className="text-foreground font-mono font-semibold">{bank_details.ifsc}</p>
                    {bank_details.upi_id && (
                      <>
                        <p><strong>UPI ID:</strong></p> <p className="text-foreground font-mono">{bank_details.upi_id}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              {notes && (
                <div>
                  <p className="font-bold text-foreground uppercase tracking-wider text-[10px] mb-1">Notes</p>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Subtotal:</span>
                <span className="font-mono">{currency_symbol}{subtotal.toFixed(2)}</span>
              </div>
              {total_tax > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Tax Amount:</span>
                  <span className="font-mono">{currency_symbol}{total_tax.toFixed(2)}</span>
                </div>
              )}
              {shipping_charges > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Shipping:</span>
                  <span className="font-mono">{currency_symbol}{shipping_charges.toFixed(2)}</span>
                </div>
              )}
              {adjustment !== 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Adjustment:</span>
                  <span className="font-mono">{adjustment > 0 ? "+" : ""}{currency_symbol}{adjustment.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/60">
                <span>Total:</span>
                <span className="font-mono text-base" style={{ color: primaryColor }}>{currency_symbol}{grand_total.toFixed(2)}</span>
              </div>
              {amount_paid > 0 && (
                <div className="flex justify-between text-muted-foreground text-[11px] font-medium">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-success">-{currency_symbol}{amount_paid.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-foreground pt-1 border-t border-dashed border-border/40">
                <span>Balance Due:</span>
                <span className="font-mono">{currency_symbol}{balance_due.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer & T&C */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-6 border-t border-border/50 text-xs">
            <div className="w-full sm:max-w-md">
              {terms_conditions && (
                <div className="space-y-1">
                  <p className="font-bold text-foreground uppercase tracking-wider text-[10px]">Terms &amp; Conditions</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{terms_conditions}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {show_qr && (
                <div className="border border-border/40 p-1.5 bg-white rounded-lg">
                  <img src={qrCodeUrl} alt="Invoice Link QR" className="w-16 h-16 object-contain" />
                </div>
              )}
              {show_signature && (signature_image || printMode) && (
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Authorized Signatory</p>
                  <div className="h-10 w-28 border-b border-border/60 flex items-center justify-center overflow-hidden">
                    {signature_image ? (
                      <img src={signature_image} alt="Signature" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">Sign here</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. MODERN TEMPLATE
  if (template_id === "modern") {
    return (
      <div className="relative p-6 sm:p-10 bg-card text-card-foreground border border-border/60 rounded-2xl shadow-sm overflow-hidden font-sans min-h-[842px] max-w-[800px] mx-auto print:border-0 print:shadow-none">
        {renderWatermark()}

        {/* Decorative top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: primaryColor }} />

        <div className="relative z-10 space-y-8 pt-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-border/40">
            <div>
              {show_logo && (
                <div className="text-xl font-heading font-black flex items-center gap-2.5 mb-2">
                  <img src={logoImg} alt="ScaleXWeb Logo" className="w-8 h-8 object-contain rounded-xl shadow-md" />
                  <span>{business_details.name}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground max-w-xs whitespace-pre-wrap">{business_details.address}</p>
              {business_details.gstin && <p className="text-xs text-muted-foreground mt-1"><strong>GSTIN:</strong> {business_details.gstin}</p>}
            </div>
            <div className="sm:text-right bg-muted/40 p-4 rounded-2xl border border-border/30 w-full sm:w-auto">
              <h2 className="text-xl font-heading font-bold uppercase tracking-wider text-muted-foreground">Invoice Summary</h2>
              <div className="mt-3 text-xs space-y-1.5 font-medium">
                <p className="flex justify-between sm:justify-end gap-6 text-muted-foreground">Invoice No: <span className="font-bold text-foreground font-mono">{invoice_number}</span></p>
                <p className="flex justify-between sm:justify-end gap-6 text-muted-foreground">Date: <span className="text-foreground">{invoice_date}</span></p>
                <p className="flex justify-between sm:justify-end gap-6 text-muted-foreground">Due Date: <span className="text-foreground">{due_date}</span></p>
                <p className="flex justify-between sm:justify-end gap-6 text-muted-foreground">Amount: <span className="font-bold font-mono text-sm" style={{ color: primaryColor }}>{currency_symbol}{grand_total.toFixed(2)}</span></p>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs bg-muted/20 p-5 rounded-2xl border border-border/30">
            <div>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] mb-2">Billing Address</p>
              <p className="text-sm font-black text-foreground">{client_data.name}</p>
              {client_data.company && <p className="font-bold text-muted-foreground mt-0.5">{client_data.company}</p>}
              <p className="text-muted-foreground mt-1.5 whitespace-pre-wrap">{client_data.address}</p>
              <p className="text-muted-foreground">{client_data.city}, {client_data.state} {client_data.pin_code}</p>
              {client_data.gstin && <p className="text-muted-foreground mt-1"><strong>GSTIN:</strong> {client_data.gstin}</p>}
            </div>
            {client_data.ship_to_same === false ? (
              <div>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] mb-2">Shipping Address</p>
                <p className="text-sm font-black text-foreground">{client_data.name}</p>
                <p className="text-muted-foreground mt-1.5 whitespace-pre-wrap">{client_data.shipping_address}</p>
                <p className="text-muted-foreground">{client_data.shipping_city}, {client_data.shipping_state} {client_data.shipping_pin}</p>
              </div>
            ) : (
              <div className="flex flex-col justify-center">
                <span className="text-muted-foreground italic text-[11px]">Shipping matches billing address.</span>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-hidden border border-border/40 rounded-2xl shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-white font-bold" style={{ backgroundColor: primaryColor }}>
                  <th className="p-3.5 pl-5">#</th>
                  <th className="p-3.5">Line Item</th>
                  <th className="p-3.5 text-right">Qty</th>
                  <th className="p-3.5 text-right">Price</th>
                  {items.some(i => toNum(i.tax_rate) > 0) && <th className="p-3.5 text-right">Tax</th>}
                  <th className="p-3.5 text-right pr-5">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-card">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/15 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-[10px] text-muted-foreground">{idx + 1}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">{item.name}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-pre-wrap leading-relaxed">{item.description}</p>}
                    </td>
                    <td className="p-3.5 text-right font-mono">{item.quantity} <span className="text-[10px] text-muted-foreground">{item.unit}</span></td>
                    <td className="p-3.5 text-right font-mono">{currency_symbol}{toNum(item.unit_price).toFixed(2)}</td>
                    {items.some(i => toNum(i.tax_rate) > 0) && (
                      <td className="p-3.5 text-right font-mono text-muted-foreground">{toNum(item.tax_rate) > 0 ? `${item.tax_rate}%` : "-"}</td>
                    )}
                    <td className="p-3.5 text-right font-mono font-bold text-foreground pr-5">{currency_symbol}{toNum(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-4">
            <div className="w-full md:max-w-md space-y-4 text-xs">
              {show_bank && bank_details && (
                <div className="border border-border/30 bg-muted/10 p-5 rounded-2xl space-y-3">
                  <p className="font-bold text-foreground uppercase tracking-widest text-[9px]">Electronic Settlement Instructions</p>
                  <div className="grid grid-cols-2 gap-y-1.5 text-muted-foreground font-medium">
                    <p>Bank:</p> <p className="text-foreground">{bank_details.bank_name}</p>
                    <p>Beneficiary:</p> <p className="text-foreground">{bank_details.account_name}</p>
                    <p>Account No:</p> <p className="text-foreground font-mono font-semibold">{bank_details.account_number}</p>
                    <p>IFSC Code:</p> <p className="text-foreground font-mono font-semibold">{bank_details.ifsc}</p>
                    {bank_details.upi_id && (
                      <>
                        <p>UPI Address:</p> <p className="text-foreground font-mono">{bank_details.upi_id}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              {notes && (
                <div>
                  <p className="font-bold text-foreground uppercase tracking-widest text-[9px] mb-1">Additional Remarks</p>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-72 bg-muted/20 p-5 rounded-2xl border border-border/30 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Subtotal:</span>
                <span className="font-mono">{currency_symbol}{subtotal.toFixed(2)}</span>
              </div>
              {total_tax > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Accumulated Tax:</span>
                  <span className="font-mono">{currency_symbol}{total_tax.toFixed(2)}</span>
                </div>
              )}
              {shipping_charges > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Shipping &amp; Logistics:</span>
                  <span className="font-mono">{currency_symbol}{shipping_charges.toFixed(2)}</span>
                </div>
              )}
              {adjustment !== 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Rounding adjustment:</span>
                  <span className="font-mono">{adjustment > 0 ? "+" : ""}{currency_symbol}{adjustment.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-foreground pt-3 border-t border-border/40">
                <span>Grand Total:</span>
                <span className="font-mono text-lg" style={{ color: primaryColor }}>{currency_symbol}{grand_total.toFixed(2)}</span>
              </div>
              {amount_paid > 0 && (
                <div className="flex justify-between text-muted-foreground text-[11px] font-medium">
                  <span>Sum Settled:</span>
                  <span className="font-mono text-success">-{currency_symbol}{amount_paid.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black text-foreground pt-1.5 border-t border-dashed border-border/30">
                <span>Net Balance Due:</span>
                <span className="font-mono">{currency_symbol}{balance_due.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer & T&C */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-6 border-t border-border/30 text-xs">
            <div className="w-full sm:max-w-md">
              {terms_conditions && (
                <div className="space-y-1">
                  <p className="font-bold text-foreground uppercase tracking-widest text-[9px]">Standard Terms &amp; Guidelines</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{terms_conditions}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-5 flex-shrink-0">
              {show_qr && (
                <div className="border border-border/30 p-1 bg-white rounded-xl shadow-sm">
                  <img src={qrCodeUrl} alt="Invoice Link QR" className="w-16 h-16 object-contain" />
                </div>
              )}
              {show_signature && (signature_image || printMode) && (
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-2 font-bold">Authorized Signatory</p>
                  <div className="h-10 w-28 border-b border-border/40 flex items-center justify-center overflow-hidden">
                    {signature_image ? (
                      <img src={signature_image} alt="Signature" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">Sign here</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. MINIMAL TEMPLATE
  if (template_id === "minimal") {
    return (
      <div className="relative p-6 sm:p-10 bg-card text-card-foreground shadow-sm overflow-hidden font-sans min-h-[842px] max-w-[800px] mx-auto print:border-0 print:shadow-none">
        {renderWatermark()}

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              {show_logo && (
                <div className="text-sm font-heading font-bold flex items-center gap-2 mb-2">
                  <img src={logoImg} alt="ScaleXWeb Logo" className="w-6 h-6 object-contain rounded-md" />
                  <span>{business_details.name}</span>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground max-w-xs whitespace-pre-wrap">{business_details.address}</p>
              {business_details.gstin && <p className="text-[11px] text-muted-foreground mt-0.5">GSTIN: {business_details.gstin}</p>}
            </div>
            <div className="sm:text-right text-xs">
              <h2 className="text-xl font-heading font-black tracking-wide text-foreground uppercase">Invoice</h2>
              <p className="font-mono text-muted-foreground mt-1"># {invoice_number}</p>
              <p className="text-muted-foreground mt-1">Issued: {invoice_date}</p>
              <p className="text-muted-foreground font-bold">Due: {due_date}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="border-t border-border pt-4 text-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">To:</p>
              <p className="font-bold text-foreground">{client_data.name}</p>
              {client_data.company && <p className="text-muted-foreground">{client_data.company}</p>}
              <p className="text-muted-foreground whitespace-pre-wrap mt-0.5">{client_data.address}</p>
              <p className="text-muted-foreground">{client_data.city}, {client_data.state} {client_data.pin_code}</p>
              {client_data.gstin && <p className="text-muted-foreground font-mono">GSTIN: {client_data.gstin}</p>}
            </div>
            {client_data.ship_to_same === false && (
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Ship To:</p>
                <p className="font-bold text-foreground">{client_data.name}</p>
                <p className="text-muted-foreground whitespace-pre-wrap mt-0.5">{client_data.shipping_address}</p>
                <p className="text-muted-foreground">{client_data.shipping_city}, {client_data.shipping_state} {client_data.shipping_pin}</p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="border-t border-border pt-4">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-muted-foreground border-b border-border/80 pb-2">
                  <th className="py-2 pl-0">Item Description</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right pr-0">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 pl-0">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-pre-wrap max-w-lg">{item.description}</p>}
                    </td>
                    <td className="py-3 text-right font-mono">{item.quantity} <span className="text-[10px] text-muted-foreground">{item.unit}</span></td>
                    <td className="py-3 text-right font-mono">{currency_symbol}{toNum(item.unit_price).toFixed(2)}</td>
                    <td className="py-3 text-right font-mono font-bold text-foreground pr-0">{currency_symbol}{toNum(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-t border-border pt-4 text-xs">
            <div className="w-full sm:max-w-md space-y-4">
              {show_bank && bank_details && (
                <div className="space-y-1">
                  <p className="font-bold text-foreground uppercase tracking-widest text-[9px]">Transfer Instructions</p>
                  <p className="text-muted-foreground">
                    Please route payment to {bank_details.bank_name}, Beneficiary: {bank_details.account_name}, Account Number: <span className="font-mono font-bold">{bank_details.account_number}</span>, IFSC Code: <span className="font-mono font-bold">{bank_details.ifsc}</span>
                    {bank_details.upi_id && <>, UPI: <span className="font-mono font-bold">{bank_details.upi_id}</span></>}.
                  </p>
                </div>
              )}
              {notes && (
                <div>
                  <p className="font-bold text-foreground uppercase tracking-widest text-[9px] mb-1">Remarks</p>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>

            <div className="w-full sm:w-60 space-y-1.5 text-xs ml-auto">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-mono">{currency_symbol}{subtotal.toFixed(2)}</span>
              </div>
              {total_tax > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax:</span>
                  <span className="font-mono">{currency_symbol}{total_tax.toFixed(2)}</span>
                </div>
              )}
              {shipping_charges > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span className="font-mono">{currency_symbol}{shipping_charges.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-foreground pt-1.5 border-t border-border">
                <span>Grand Total:</span>
                <span className="font-mono text-sm">{currency_symbol}{grand_total.toFixed(2)}</span>
              </div>
              {amount_paid > 0 && (
                <div className="flex justify-between text-muted-foreground text-[10px]">
                  <span>Paid:</span>
                  <span className="font-mono text-success">-{currency_symbol}{amount_paid.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black text-foreground pt-1 border-t border-dashed border-border/40">
                <span>Balance Due:</span>
                <span className="font-mono">{currency_symbol}{balance_due.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer & T&C */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-t border-border/50 pt-4 text-[10px] text-muted-foreground">
            <div className="w-full sm:max-w-md">
              {terms_conditions && (
                <p className="leading-relaxed whitespace-pre-wrap">{terms_conditions}</p>
              )}
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {show_qr && (
                <div className="border border-border/20 p-1 bg-white rounded">
                  <img src={qrCodeUrl} alt="Invoice Link QR" className="w-12 h-12 object-contain" />
                </div>
              )}
              {show_signature && (signature_image || printMode) && (
                <div className="text-center">
                  <div className="h-8 w-24 border-b border-border/40 flex items-center justify-center overflow-hidden">
                    {signature_image && (
                      <img src={signature_image} alt="Signature" className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                  <p className="text-[8px] uppercase tracking-wider mt-1">Authorized signature</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. CREATIVE TEMPLATE (Modern, high-end design)
  if (template_id === "creative") {
    return (
      <div className="relative p-6 sm:p-10 bg-card text-card-foreground border border-primary/20 rounded-2xl shadow-md overflow-hidden font-sans min-h-[842px] max-w-[800px] mx-auto print:border-0 print:shadow-none">
        {renderWatermark()}
        
        {/* Colorful visual backdrop elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 pb-6 border-b border-border/60">
            <div className="flex flex-col justify-between">
              <div>
                {show_logo && (
                  <div className="text-xl font-heading font-black flex items-center gap-2.5 mb-2">
                    <img src={logoImg} alt="ScaleXWeb Logo" className="w-8 h-8 object-contain rounded-xl shadow-md" />
                    <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">{business_details.name}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground max-w-sm whitespace-pre-wrap leading-relaxed">{business_details.address}</p>
                {business_details.gstin && <p className="text-xs text-muted-foreground mt-1"><strong>GSTIN:</strong> {business_details.gstin}</p>}
              </div>
            </div>
            <div className="bg-primary/[0.03] border border-primary/10 p-5 rounded-2xl md:w-72 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-primary uppercase">Invoice Details</span>
                <h2 className="text-2xl font-mono font-black mt-1 text-foreground">{invoice_number}</h2>
              </div>
              <div className="mt-4 space-y-1.5 text-xs">
                <p className="flex justify-between text-muted-foreground">Issued: <span className="text-foreground font-mono">{invoice_date}</span></p>
                <p className="flex justify-between text-muted-foreground">Due: <span className="text-foreground font-mono font-bold">{due_date}</span></p>
                <p className="flex justify-between text-muted-foreground">Terms: <span className="text-foreground">{payment_terms}</span></p>
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs pt-2">
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">Recipient Details</span>
              <p className="text-sm font-black text-foreground">{client_data.name}</p>
              {client_data.company && <p className="font-semibold text-primary">{client_data.company}</p>}
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{client_data.address}</p>
              <p className="text-muted-foreground">{client_data.city}, {client_data.state} {client_data.pin_code}</p>
              {client_data.phone && <p className="text-muted-foreground">Phone: {client_data.phone}</p>}
              {client_data.gstin && <p className="text-muted-foreground font-mono mt-1 bg-muted/50 inline-block px-2 py-0.5 rounded border border-border">GSTIN: {client_data.gstin}</p>}
            </div>
            {client_data.ship_to_same === false && (
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">Delivery Address</span>
                <p className="text-sm font-black text-foreground">{client_data.name}</p>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{client_data.shipping_address}</p>
                <p className="text-muted-foreground">{client_data.shipping_city}, {client_data.shipping_state} {client_data.shipping_pin}</p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-hidden border border-border/40 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 text-foreground border-b border-border/40 font-bold">
                  <th className="p-3 pl-4">#</th>
                  <th className="p-3">Item details & description</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  {items.some(i => toNum(i.tax_rate) > 0) && <th className="p-3 text-right">Tax</th>}
                  <th className="p-3 text-right pr-4">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 bg-card/50">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-primary/[0.01]">
                    <td className="p-3 pl-4 font-mono text-[10px] text-muted-foreground">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{item.name}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-pre-wrap leading-relaxed">{item.description}</p>}
                    </td>
                    <td className="p-3 text-right font-mono">{item.quantity} <span className="text-[10px] text-muted-foreground">{item.unit}</span></td>
                    <td className="p-3 text-right font-mono">{currency_symbol}{toNum(item.unit_price).toFixed(2)}</td>
                    {items.some(i => toNum(i.tax_rate) > 0) && (
                      <td className="p-3 text-right font-mono text-muted-foreground">{toNum(item.tax_rate) > 0 ? `${item.tax_rate}%` : "-"}</td>
                    )}
                    <td className="p-3 text-right font-mono font-bold text-foreground pr-4">{currency_symbol}{toNum(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4">
            <div className="w-full sm:max-w-md space-y-4 text-xs">
              {show_bank && bank_details && (
                <div className="border border-primary/10 bg-primary/[0.01] p-4 rounded-xl space-y-2">
                  <p className="font-bold text-primary uppercase tracking-widest text-[9px]">Settlement Coordinates</p>
                  <div className="grid grid-cols-2 gap-y-1 text-muted-foreground">
                    <p>Bank Name:</p> <p className="text-foreground font-medium">{bank_details.bank_name}</p>
                    <p>Account Name:</p> <p className="text-foreground font-medium">{bank_details.account_name}</p>
                    <p>Account Number:</p> <p className="text-foreground font-mono font-semibold">{bank_details.account_number}</p>
                    <p>IFSC Code:</p> <p className="text-foreground font-mono font-semibold">{bank_details.ifsc}</p>
                    {bank_details.upi_id && (
                      <>
                        <p>UPI ID:</p> <p className="text-foreground font-mono font-bold">{bank_details.upi_id}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              {notes && (
                <div>
                  <p className="font-bold text-foreground uppercase tracking-widest text-[9px] mb-1">Remarks</p>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs bg-primary/[0.01] border border-primary/5 p-4 rounded-xl">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Subtotal:</span>
                <span className="font-mono">{currency_symbol}{subtotal.toFixed(2)}</span>
              </div>
              {total_tax > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Tax Amount:</span>
                  <span className="font-mono">{currency_symbol}{total_tax.toFixed(2)}</span>
                </div>
              )}
              {shipping_charges > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Shipping:</span>
                  <span className="font-mono">{currency_symbol}{shipping_charges.toFixed(2)}</span>
                </div>
              )}
              {adjustment !== 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Adjustment:</span>
                  <span className="font-mono">{adjustment > 0 ? "+" : ""}{currency_symbol}{adjustment.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/60">
                <span>Total Amount:</span>
                <span className="font-mono text-base font-black text-primary">{currency_symbol}{grand_total.toFixed(2)}</span>
              </div>
              {amount_paid > 0 && (
                <div className="flex justify-between text-muted-foreground text-[11px] font-medium">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-success">-{currency_symbol}{amount_paid.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-foreground pt-1 border-t border-dashed border-border/40">
                <span>Balance Due:</span>
                <span className="font-mono text-primary">{currency_symbol}{balance_due.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer & T&C */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-6 border-t border-border/50 text-xs">
            <div className="w-full sm:max-w-md">
              {terms_conditions && (
                <div className="space-y-1">
                  <p className="font-bold text-foreground uppercase tracking-widest text-[9px]">Terms &amp; Guidelines</p>
                  <p className="text-[10px] text-muted-foreground leading-normal whitespace-pre-wrap">{terms_conditions}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {show_qr && (
                <div className="border border-border/40 p-1.5 bg-white rounded-lg">
                  <img src={qrCodeUrl} alt="Invoice Link QR" className="w-16 h-16 object-contain" />
                </div>
              )}
              {show_signature && (signature_image || printMode) && (
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Authorized Signatory</p>
                  <div className="h-10 w-28 border-b border-border/60 flex items-center justify-center overflow-hidden">
                    {signature_image ? (
                      <img src={signature_image} alt="Signature" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic font-medium">Sign here</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. COMPACT TEMPLATE (Space saving receipt-like template)
  if (template_id === "compact") {
    return (
      <div className="relative p-4 sm:p-6 bg-card text-card-foreground border border-border/40 rounded-xl shadow-sm overflow-hidden font-sans min-h-[500px] max-w-[800px] mx-auto print:border-0 print:shadow-none text-[11px]">
        {renderWatermark()}

        <div className="relative z-10 space-y-4">
          {/* Header (Sender, Meta, Client in 3 columns side-by-side to save space) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-3 border-b border-border/50">
            <div>
              {show_logo && (
                <div className="text-sm font-heading font-black flex items-center gap-1.5 mb-1 text-primary">
                  <img src={logoImg} alt="ScaleXWeb Logo" className="w-5 h-5 object-contain rounded-md" />
                  <span>{business_details.name}</span>
                </div>
              )}
              {!show_logo && <p className="font-bold text-foreground">{business_details.name}</p>}
              <p className="text-[10px] text-muted-foreground leading-normal max-w-xs">{business_details.address.split("\n")[0]}</p>
              {business_details.gstin && <p className="text-[9px] text-muted-foreground font-mono">GSTIN: {business_details.gstin}</p>}
            </div>
            
            <div className="border-l border-border/30 pl-4 space-y-0.5">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Invoiced To</p>
              <p className="font-bold text-foreground">{client_data.name}</p>
              {client_data.company && <p className="text-[10px] text-primary">{client_data.company}</p>}
              {client_data.gstin && <p className="text-[9px] text-muted-foreground font-mono">GSTIN: {client_data.gstin}</p>}
            </div>

            <div className="border-l border-border/30 pl-4 space-y-0.5">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Invoice Metadata</p>
              <p className="font-mono font-bold text-foreground"># {invoice_number}</p>
              <p className="text-muted-foreground">Date: {invoice_date}</p>
              <p className="text-muted-foreground font-bold">Due: {due_date}</p>
            </div>
          </div>

          {/* Table */}
          <div>
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="bg-muted/40 border-b border-border/40 text-muted-foreground font-semibold">
                  <th className="p-2 pl-3">S.No</th>
                  <th className="p-2">Item description</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Rate</th>
                  {items.some(i => toNum(i.tax_rate) > 0) && <th className="p-2 text-right">Tax</th>}
                  <th className="p-2 text-right pr-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/10">
                    <td className="p-2 pl-3 font-mono text-[9px] text-muted-foreground">{idx + 1}</td>
                    <td className="p-2">
                      <p className="font-bold text-foreground">{item.name}</p>
                      {item.description && <p className="text-[9px] text-muted-foreground mt-0.5 max-w-sm whitespace-pre-wrap">{item.description}</p>}
                    </td>
                    <td className="p-2 text-right font-mono">{item.quantity} {item.unit}</td>
                    <td className="p-2 text-right font-mono">{currency_symbol}{toNum(item.unit_price).toFixed(2)}</td>
                    {items.some(i => toNum(i.tax_rate) > 0) && (
                      <td className="p-2 text-right font-mono text-muted-foreground">{toNum(item.tax_rate) > 0 ? `${item.tax_rate}%` : "-"}</td>
                    )}
                    <td className="p-2 text-right font-mono font-bold text-foreground pr-3">{currency_symbol}{toNum(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals & Bank details inline side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
            <div>
              {show_bank && bank_details && (
                <div className="text-[10px] text-muted-foreground leading-normal">
                  <p className="font-bold text-foreground uppercase tracking-widest text-[8px] mb-1">Payment Options</p>
                  <p>Bank: {bank_details.bank_name} | Beneficiary: {bank_details.account_name}</p>
                  <p>A/C: <span className="font-mono text-foreground font-semibold">{bank_details.account_number}</span> | IFSC: <span className="font-mono text-foreground font-semibold">{bank_details.ifsc}</span></p>
                  {bank_details.upi_id && <p>UPI: <span className="font-mono text-foreground font-semibold">{bank_details.upi_id}</span></p>}
                </div>
              )}
              {notes && (
                <div className="mt-2">
                  <p className="text-[9px] text-muted-foreground leading-relaxed whitespace-pre-wrap"><strong>Note:</strong> {notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-1 text-[10px] ml-auto w-full max-w-[200px]">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Subtotal:</span>
                <span className="font-mono">{currency_symbol}{subtotal.toFixed(2)}</span>
              </div>
              {total_tax > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Tax Amount:</span>
                  <span className="font-mono">{currency_symbol}{total_tax.toFixed(2)}</span>
                </div>
              )}
              {shipping_charges > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Shipping:</span>
                  <span className="font-mono">{currency_symbol}{shipping_charges.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-foreground pt-1 border-t border-border/40">
                <span>Total:</span>
                <span className="font-mono text-primary font-black">{currency_symbol}{grand_total.toFixed(2)}</span>
              </div>
              {amount_paid > 0 && (
                <div className="flex justify-between text-muted-foreground text-[9px] font-medium">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-success">-{currency_symbol}{amount_paid.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-foreground pt-0.5 border-t border-dashed border-border/30">
                <span>Balance Due:</span>
                <span className="font-mono">{currency_symbol}{balance_due.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer & T&C */}
          <div className="flex justify-between items-center pt-2 border-t border-border/30 text-[9px] text-muted-foreground">
            <div>
              {terms_conditions && <p className="leading-relaxed whitespace-pre-wrap max-w-sm">{terms_conditions.split("\n")[0]}</p>}
            </div>
            <div className="flex items-center gap-3">
              {show_signature && (signature_image || printMode) && (
                <div className="text-center">
                  <div className="h-6 w-20 border-b border-border/30 flex items-center justify-center overflow-hidden">
                    {signature_image && (
                      <img src={signature_image} alt="Signature" className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                  <p className="text-[7px] uppercase tracking-wider mt-0.5">Auth. signature</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. GST-COMPLIANT TEMPLATE (India-Specific columns and tax splits)
  const taxable_amount = subtotal - discount_amount;

  return (
    <div className="relative p-6 sm:p-10 bg-card text-card-foreground border-2 border-slate-900/60 rounded-2xl shadow-sm overflow-hidden font-sans min-h-[842px] max-w-[800px] mx-auto print:border-0 print:shadow-none">
      {renderWatermark()}

      <div className="relative z-10 space-y-6">
        {/* GST Header */}
        <div className="text-center pb-4 border-b-2 border-slate-900/60">
          <h1 className="text-2xl font-heading font-black tracking-widest uppercase">TAX INVOICE</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">Issued Under Section 31 of GST Act, 2017</p>
        </div>

        {/* Sender details and Invoice Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pb-4 border-b border-border/60">
          <div>
            {show_logo && (
              <div className="text-sm font-heading font-black flex items-center gap-2 mb-2">
                <img src={logoImg} alt="ScaleXWeb Logo" className="w-6 h-6 object-contain rounded-md" />
                <span>{business_details.name}</span>
              </div>
            )}
            {!show_logo && <p className="font-black text-sm uppercase text-foreground">{business_details.name}</p>}
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{business_details.address}</p>
            <div className="mt-2 space-y-0.5">
              {business_details.gstin && <p><strong>GSTIN:</strong> <span className="font-mono">{business_details.gstin}</span></p>}
              {business_details.pan && <p><strong>PAN:</strong> <span className="font-mono">{business_details.pan}</span></p>}
              {business_details.cin && <p><strong>CIN:</strong> <span className="font-mono">{business_details.cin}</span></p>}
              <p><strong>Email:</strong> {business_details.email}</p>
            </div>
          </div>
          <div className="sm:border-l border-border/60 sm:pl-6 space-y-1.5">
            <p className="flex justify-between font-medium">Invoice No: <span className="font-mono font-bold">{invoice_number}</span></p>
            <p className="flex justify-between">Invoice Date: <span className="font-mono">{invoice_date}</span></p>
            <p className="flex justify-between">Payment Terms: <span>{payment_terms}</span></p>
            <p className="flex justify-between font-bold text-destructive">Due Date: <span className="font-mono">{due_date}</span></p>
            {isStateMatch ? (
              <p className="text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 text-center">INTRA-STATE TRANSITION (CGST + SGST)</p>
            ) : (
              <p className="text-[10px] text-indigo-500 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/20 text-center">INTER-STATE TRANSITION (IGST)</p>
            )}
          </div>
        </div>

        {/* GST Billing & Shipping Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-4 border-b border-border/60">
          <div>
            <p className="font-bold uppercase tracking-widest text-[9px] text-muted-foreground mb-1.5">Details of Receiver (Billed To)</p>
            <p className="font-black text-sm text-foreground">{client_data.name}</p>
            {client_data.company && <p className="font-bold text-muted-foreground mt-0.5">{client_data.company}</p>}
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{client_data.address}</p>
            <p className="text-muted-foreground">{client_data.city}, {client_data.state} - {client_data.pin_code}</p>
            <div className="mt-2 space-y-0.5">
              {client_data.phone && <p><strong>Phone:</strong> {client_data.phone}</p>}
              {client_data.email && <p><strong>Email:</strong> {client_data.email}</p>}
              {client_data.gstin ? (
                <p className="text-foreground font-bold"><strong>GSTIN:</strong> <span className="font-mono">{client_data.gstin}</span></p>
              ) : (
                <p className="text-amber-500"><strong>GSTIN:</strong> Unregistered Client</p>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-[9px] text-muted-foreground mb-1.5">Details of Consignee (Shipped To)</p>
            {client_data.ship_to_same !== false ? (
              <div className="text-muted-foreground">
                <p className="font-semibold text-foreground">{client_data.name}</p>
                {client_data.company && <p>{client_data.company}</p>}
                <p className="mt-1 whitespace-pre-wrap">{client_data.address}</p>
                <p>{client_data.city}, {client_data.state} - {client_data.pin_code}</p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p className="font-semibold text-foreground">{client_data.name}</p>
                <p className="mt-1 whitespace-pre-wrap">{client_data.shipping_address}</p>
                <p>{client_data.shipping_city}, {client_data.shipping_state} - {client_data.shipping_pin}</p>
              </div>
            )}
          </div>
        </div>

        {/* GST Specific Items Table */}
        <div className="overflow-x-auto border border-slate-900 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-900">
                <th className="p-2.5">S.No</th>
                <th className="p-2.5">Description of Services</th>
                <th className="p-2.5 text-center">HSN/SAC</th>
                <th className="p-2.5 text-right">Qty</th>
                <th className="p-2.5 text-right">Rate</th>
                <th className="p-2.5 text-right">Tax Rate</th>
                <th className="p-2.5 text-right">Taxable Val</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-card">
              {items.map((item, idx) => {
                const itemTaxable = toNum(item.line_total) / (1 + (toNum(item.tax_rate) / 100));
                return (
                  <tr key={idx}>
                    <td className="p-2.5 font-mono text-muted-foreground text-center">{idx + 1}</td>
                    <td className="p-2.5">
                      <p className="font-bold text-foreground">{item.name}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-pre-wrap">{item.description}</p>}
                    </td>
                    <td className="p-2.5 text-center font-mono font-medium text-muted-foreground">{item.hsn_sac || "9983"}</td>
                    <td className="p-2.5 text-right font-mono">{item.quantity} <span className="text-[10px] text-muted-foreground">{item.unit}</span></td>
                    <td className="p-2.5 text-right font-mono">{currency_symbol}{toNum(item.unit_price).toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">{toNum(item.tax_rate)}%</td>
                    <td className="p-2.5 text-right font-mono font-bold text-foreground">{currency_symbol}{toNum(item.line_total).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* GST Summary Splitting Panel */}
        {tax_summary && tax_summary.length > 0 && (
          <div className="overflow-x-auto border border-border/60 rounded-xl bg-muted/10 p-3 space-y-2">
            <p className="font-bold text-[9px] uppercase tracking-wider text-muted-foreground pl-1">GST Analysis Summary</p>
            <table className="w-full text-[10px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground font-bold">
                  <th className="pb-1 pl-1">HSN/SAC</th>
                  <th className="pb-1 text-right">Taxable Value</th>
                  {isStateMatch ? (
                    <>
                      <th className="pb-1 text-right">CGST Rate</th>
                      <th className="pb-1 text-right">CGST Amt</th>
                      <th className="pb-1 text-right">SGST Rate</th>
                      <th className="pb-1 text-right">SGST Amt</th>
                    </>
                  ) : (
                    <>
                      <th className="pb-1 text-right">IGST Rate</th>
                      <th className="pb-1 text-right">IGST Amt</th>
                    </>
                  )}
                  <th className="pb-1 text-right pr-1">Total Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-mono text-muted-foreground">
                {items.map((item, idx) => {
                  const hsn = item.hsn_sac || "9983";
                  // Reverse calculate taxable amount if line_total is tax-inclusive, or calculate tax on top
                  const taxRate = toNum(item.tax_rate);
                  const totalAmt = toNum(item.line_total);
                  const itemTax = (totalAmt * taxRate) / (100 + taxRate);
                  const itemTaxable = totalAmt - itemTax;

                  return (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="py-1.5 pl-1">{hsn}</td>
                      <td className="py-1.5 text-right">{currency_symbol}{toNum(itemTaxable).toFixed(2)}</td>
                      {isStateMatch ? (
                        <>
                          <td className="py-1.5 text-right">{(taxRate / 2)}%</td>
                          <td className="py-1.5 text-right">{currency_symbol}{toNum(itemTax / 2).toFixed(2)}</td>
                          <td className="py-1.5 text-right">{(taxRate / 2)}%</td>
                          <td className="py-1.5 text-right">{currency_symbol}{toNum(itemTax / 2).toFixed(2)}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-1.5 text-right">{taxRate}%</td>
                          <td className="py-1.5 text-right">{currency_symbol}{toNum(itemTax).toFixed(2)}</td>
                        </>
                      )}
                      <td className="py-1.5 text-right pr-1 font-bold text-foreground">{currency_symbol}{toNum(itemTax).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* GST Totals panel & signature/QR */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 text-xs">
          <div className="w-full sm:max-w-md space-y-4">
            {show_bank && bank_details && (
              <div className="border border-border/60 bg-muted/20 p-4 rounded-xl space-y-1.5">
                <p className="font-bold text-[9px] uppercase tracking-wider text-muted-foreground">Electronic Settlement Details</p>
                <div className="grid grid-cols-2 gap-y-0.5 text-muted-foreground">
                  <p>Bank:</p> <p className="text-foreground font-medium">{bank_details.bank_name}</p>
                  <p>Beneficiary Name:</p> <p className="text-foreground font-medium">{bank_details.account_name}</p>
                  <p>A/C Number:</p> <p className="text-foreground font-mono font-semibold">{bank_details.account_number}</p>
                  <p>IFSC Code:</p> <p className="text-foreground font-mono font-semibold">{bank_details.ifsc}</p>
                  {bank_details.upi_id && <><p>UPI Address:</p> <p className="text-foreground font-mono">{bank_details.upi_id}</p></>}
                </div>
              </div>
            )}
            {notes && (
              <div>
                <p className="font-bold uppercase tracking-widest text-[9px] text-muted-foreground mb-0.5">Remarks</p>
                <p className="text-muted-foreground leading-normal whitespace-pre-wrap">{notes}</p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-64 space-y-1.5 font-medium ml-auto">
            <div className="flex justify-between text-muted-foreground">
              <span>Gross Taxable Value:</span>
              <span className="font-mono">{currency_symbol}{(grand_total - total_tax - shipping_charges - adjustment).toFixed(2)}</span>
            </div>
            {total_tax > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Output GST (Tax):</span>
                <span className="font-mono">{currency_symbol}{total_tax.toFixed(2)}</span>
              </div>
            )}
            {shipping_charges > 0 && (
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Shipping Charges:</span>
                <span className="font-mono">{currency_symbol}{shipping_charges.toFixed(2)}</span>
              </div>
            )}
            {adjustment !== 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Adjustment / Round Off:</span>
                <span className="font-mono">{adjustment > 0 ? "+" : ""}{currency_symbol}{adjustment.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-foreground pt-2 border-t-2 border-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-slate-900">{currency_symbol}{grand_total.toFixed(2)}</span>
            </div>
            {amount_paid > 0 && (
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-success">-{currency_symbol}{amount_paid.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-black text-foreground pt-1 border-t border-dashed border-border/40">
              <span>Net Balance Due:</span>
              <span className="font-mono">{currency_symbol}{balance_due.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* GST Terms and signatures */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-4 border-t-2 border-slate-900/60 text-xs">
          <div className="w-full sm:max-w-md">
            {terms_conditions && (
              <div className="space-y-1">
                <p className="font-bold text-[9px] uppercase tracking-wider text-muted-foreground">Terms &amp; Declarations</p>
                <p className="text-[9px] text-muted-foreground leading-normal whitespace-pre-wrap">{terms_conditions}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-5 flex-shrink-0">
            {show_qr && (
              <div className="border border-border/50 p-1 bg-white rounded-lg">
                <img src={qrCodeUrl} alt="Invoice Link QR" className="w-14 h-14 object-contain" />
              </div>
            )}
            {show_signature && (signature_image || printMode) && (
              <div className="text-center">
                <div className="h-10 w-28 border-b border-slate-900/60 flex items-center justify-center overflow-hidden">
                  {signature_image ? (
                    <img src={signature_image} alt="Signature" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">Sign here</span>
                  )}
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-1 text-slate-900">Authorized Signatory</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
