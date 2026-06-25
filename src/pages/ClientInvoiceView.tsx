import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Invoice, invoiceStorage } from "@/lib/invoiceStorage";
import { InvoiceTemplate } from "@/components/admin/invoices/InvoiceTemplate";
import { Button } from "@/components/ui/button";
import {
  Printer, Copy, Check, ArrowLeft,
  MessageSquare, DollarSign, ShieldCheck, RefreshCw, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const ClientInvoiceView = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!id) return;
      try {
        const data = await invoiceStorage.getInvoiceById(id);
        if (data) {
          // If invoice is loaded, mark it as 'Viewed' if it was 'Sent'
          if (data.status === "Sent") {
            const updated = { ...data, status: "Viewed" as const };
            await invoiceStorage.saveInvoice(updated);
            setInvoice(updated);
          } else {
            setInvoice(data);
          }
        }
      } catch (e) {
        console.error("Failed to load invoice:", e);
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [id]);



  useEffect(() => {
    if (!loading && invoice) {
      const shouldPrint = 
        window.location.search.includes("print=true") || 
        window.location.search.includes("download=true") ||
        window.location.pathname.includes("/invoices/print/");

      if (shouldPrint) {
        // Wait for all images to fully load before printing to prevent broken QR code or logos
        const images = document.querySelectorAll("img");
        let loadedCount = 0;
        const totalImages = images.length;

        const triggerPrint = () => {
          setTimeout(() => {
            window.print();
          }, 800); // 800ms buffer for layout paint
        };

        if (totalImages === 0) {
          triggerPrint();
        } else {
          images.forEach((img) => {
            if (img.complete) {
              loadedCount++;
              if (loadedCount === totalImages) triggerPrint();
            } else {
              img.addEventListener("load", () => {
                loadedCount++;
                if (loadedCount === totalImages) triggerPrint();
              });
              img.addEventListener("error", () => {
                loadedCount++; // continue printing even if an image fails to load
                if (loadedCount === totalImages) triggerPrint();
              });
            }
          });
        }
      }
    }
  }, [loading, invoice]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Client portal link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!invoice) return;
    const clientName = invoice.client_data?.name || "Client";
    const text = `Hi ${clientName},\n\nPlease find the invoice ${invoice.invoice_number} for ${invoice.currency_symbol}${(Number(invoice.grand_total) || 0).toFixed(2)} from ScaleXWeb Solution.\n\nYou can view and pay the invoice online here:\n${window.location.href}\n\nThank you!`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-sm text-muted-foreground">Loading Invoice Details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-1">Invoice Not Found</h2>
        <p className="text-sm text-muted-foreground mb-4">The invoice link is invalid or the invoice has been removed.</p>
        <Link to="/">
          <Button variant="outline">Back to Homepage</Button>
        </Link>
      </div>
    );
  }

  const isPaid = invoice.status === "Paid";
  const isOverdue = invoice.status === "Overdue";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Dynamic media print stylesheet injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 4mm 6mm !important;
          }
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 11px !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
          /* Target the main printed container */
          #invoice-print-area {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          /* Target the inner templates */
          #invoice-print-area > div {
            padding: 12px 16px !important; /* shrink padding from p-6/p-10 */
            border: none !important;
            box-shadow: none !important;
            min-h-0 !important; /* remove min-height restriction */
            min-height: 0 !important;
            max-width: 100% !important;
          }
          /* Shrink layout spacing, gaps, and paddings to fit on 1 page */
          .space-y-8 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 14px !important;
          }
          .space-y-6 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 10px !important;
          }
          .space-y-4 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 8px !important;
          }
          .space-y-3 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 6px !important;
          }
          .space-y-2\\.5 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 5px !important;
          }
          .space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 3px !important;
          }
          .gap-8 {
            gap: 12px !important;
          }
          .gap-6 {
            gap: 8px !important;
          }
          .p-5 {
            padding: 10px 14px !important;
          }
          .p-4 {
            padding: 8px 12px !important;
          }
          .p-6 {
            padding: 12px !important;
          }
          .pb-6 {
            padding-bottom: 8px !important;
          }
          .pt-6 {
            padding-top: 8px !important;
          }
          .pt-4 {
            padding-top: 6px !important;
          }
          .mt-3 {
            margin-top: 6px !important;
          }
          .mt-4 {
            margin-top: 8px !important;
          }
          /* Shrink table layout */
          table {
            width: 100% !important;
          }
          th, td {
            padding: 5px 8px !important; /* compact table rows */
          }
          .pl-5 {
            padding-left: 8px !important;
          }
          .pr-5 {
            padding-right: 8px !important;
          }
          /* Force everything to fit on 1 page and avoid splits */
          .print-container, #invoice-print-area, #invoice-print-area > div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* Floating Action Banner */}
      <div className="no-print sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border/60 py-3.5 px-4 shadow-sm">
        <div className="max-w-[800px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">{invoice.invoice_number}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isPaid ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                  isOverdue ? "bg-destructive/10 text-destructive border border-destructive/20" :
                  "bg-primary/10 text-primary border border-primary/20"
                }`}>
                  {invoice.status}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Amount Due: <span className="font-bold font-mono text-foreground">{invoice.currency_symbol}{(Number(invoice.balance_due) || 0).toFixed(2)}</span></p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Link</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5"
              onClick={handleWhatsAppShare}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs gap-1.5 bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
              onClick={handlePrint}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main portal container */}
      <div className="max-w-[800px] mx-auto px-4 mt-8 print-container">
        {/* Payment Warning Indicator */}
        {!isPaid && (Number(invoice.balance_due) || 0) > 0 && (
          <div className="no-print mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-foreground">Pending Settlement Required</p>
              <p className="text-muted-foreground leading-relaxed">
                Please transfer the balance due of <strong className="text-foreground font-mono">{invoice.currency_symbol}{(Number(invoice.balance_due) || 0).toFixed(2)}</strong> by the due date of <strong>{invoice.due_date}</strong>. Settlement bank and UPI coordinates are listed in the invoice details panel below.
              </p>
            </div>
          </div>
        )}

        {isPaid && (
          <div className="no-print mb-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-foreground">Invoice Fully Settled</p>
              <p className="text-muted-foreground leading-relaxed">
                This transaction has been completed and marked as settled on our servers. Thank you for choosing ScaleXWeb Solution!
              </p>
            </div>
          </div>
        )}

        {/* Invoice template view */}
        <div id="invoice-print-area">
          <InvoiceTemplate invoice={invoice} printMode={true} />
        </div>
      </div>
    </div>
  );
};

export default ClientInvoiceView;
