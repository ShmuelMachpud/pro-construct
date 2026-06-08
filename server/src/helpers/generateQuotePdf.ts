import puppeteer from "puppeteer";
import type { PriceQuote } from "../price_quotes/model/price_quote.entity";
import type { QuoteItem } from "../quote_items/model/quote_item.entity";

const statusLabels: Record<string, string> = {
  DRAFT: "טיוטה",
  SENT: "נשלחה",
  APPROVED: "אושרה",
  REJECTED: "נדחתה",
  EXPIRED: "פגה תוקף",
};

const formatCurrency = (n: number) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (d: Date | string | null) =>
  d ? new Date(d).toLocaleDateString("he-IL") : "-";

const buildHtml = (quote: PriceQuote, items: QuoteItem[], projectName: string): string => {
  const grandTotal = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );

  const itemRows = items.length === 0
    ? `<tr><td colspan="4" class="empty">אין פריטים</td></tr>`
    : items.map((item) => {
        const lineTotal = Number(item.quantity) * Number(item.unitPrice);
        return `
          <tr>
            <td>${item.description}</td>
            <td>${Number(item.quantity)}</td>
            <td>${formatCurrency(Number(item.unitPrice))}</td>
            <td>${formatCurrency(lineTotal)}</td>
          </tr>`;
      }).join("");

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: "Arial", sans-serif;
          font-size: 13px;
          color: #333;
          padding: 40px;
          direction: rtl;
        }
        h1 {
          font-size: 24px;
          color: #000;
          margin-bottom: 6px;
        }
        .divider {
          border: none;
          border-top: 2px solid #FF6B00;
          margin-bottom: 20px;
        }
        .meta {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 6px 12px;
          margin-bottom: 28px;
        }
        .meta-label { color: #888; }
        .meta-value { color: #000; font-weight: 500; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        thead tr { background: #f0f0f0; }
        th {
          padding: 8px 10px;
          font-size: 12px;
          color: #444;
          font-weight: 600;
        }
        td {
          padding: 7px 10px;
          font-size: 12px;
          border-bottom: 1px solid #eee;
        }
        tr:nth-child(even) td { background: #fafafa; }
        .empty { text-align: center; color: #aaa; padding: 14px; }
        .grand-total {
          text-align: left;
          font-size: 14px;
          margin-top: 8px;
        }
        .grand-total span { color: #FF6B00; font-weight: 700; font-size: 16px; }
        .notes {
          margin-top: 24px;
          font-size: 12px;
          color: #555;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }
        .notes-label { font-weight: 600; margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <h1>הצעת מחיר</h1>
      <hr class="divider" />

      <div class="meta">
        <span class="meta-label">פרויקט:</span>
        <span class="meta-value">${projectName}</span>

        <span class="meta-label">כותרת:</span>
        <span class="meta-value">${quote.title}</span>

        <span class="meta-label">סטטוס:</span>
        <span class="meta-value">${statusLabels[quote.status] ?? quote.status}</span>

        <span class="meta-label">תוקף עד:</span>
        <span class="meta-value">${formatDate(quote.validUntil)}</span>

        <span class="meta-label">תאריך יצירה:</span>
        <span class="meta-value">${formatDate(quote.createdAt)}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>תיאור</th>
            <th>כמות</th>
            <th>מחיר יחידה</th>
            <th>סה"כ</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div class="grand-total">
        סה"כ לתשלום: <span>${formatCurrency(grandTotal)}</span>
      </div>

      ${quote.notes ? `
        <div class="notes">
          <div class="notes-label">הערות:</div>
          <div>${quote.notes}</div>
        </div>` : ""}
    </body>
    </html>`;
};

export const generateQuotePdf = async (
  quote: PriceQuote,
  items: QuoteItem[],
  projectName: string,
): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(buildHtml(quote, items, projectName), { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
};
