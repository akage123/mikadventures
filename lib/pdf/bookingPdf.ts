import jsPDF from 'jspdf';

export type BookingPdfData = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  instagram?: string | null;
  people: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  trip: {
    id: number;
    location: string;
    dates: string;
  };
};

const LOGO_PATH = '/images/logo/logo.png';
let logoDataUrlPromise: Promise<string | null> | null = null;

const formatDate = (value?: string) => {
  if (!value) {
    return 'N/A';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'N/A';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read logo data.'));
    reader.readAsDataURL(blob);
  });

const getLogoDataUrl = async () => {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(LOGO_PATH)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Logo fetch failed.');
        }
        return response.blob();
      })
      .then((blob) => blobToDataUrl(blob))
      .catch(() => null);
  }
  return logoDataUrlPromise;
};

const toSafeText = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return String(value);
};

const drawLabeledBox = (
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number[],
  border: number[],
  valueColor: number[] = [31, 41, 55],
  valuePaddingX = 12,
) => {
  doc.setDrawColor(border[0], border[1], border[2]);
  doc.setFillColor(fill[0], fill[1], fill[2]);
  doc.roundedRect(x, y, width, height, 10, 10, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(label.toUpperCase(), x + 12, y + 18);
  doc.setFontSize(11);
  doc.setTextColor(valueColor[0], valueColor[1], valueColor[2]);
  const lines = doc.splitTextToSize(value, width - valuePaddingX * 2);
  doc.text(lines, x + valuePaddingX, y + 36);
};

const statusPalette: Record<string, { badge: [number, number, number]; text: [number, number, number] }> = {
  CONFIRMED: { badge: [34, 197, 94], text: [22, 163, 74] },
  NEW: { badge: [59, 130, 246], text: [37, 99, 235] },
  CONTACTED: { badge: [249, 115, 22], text: [234, 88, 12] },
  CLOSED: { badge: [239, 68, 68], text: [220, 38, 38] },
};
const fallbackStatusStyle = { badge: [255, 135, 1], text: [234, 88, 12] };

const drawStatusPill = (doc: jsPDF, text: string, x: number, y: number, height: number, fill: [number, number, number]) => {
  const paddingX = 10;
  const width = Math.max(70, doc.getTextWidth(text) + paddingX * 2);
  doc.setFillColor(fill[0], fill[1], fill[2]);
  doc.setDrawColor(fill[0], fill[1], fill[2]);
  doc.roundedRect(x, y, width, height, height / 2, height / 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(text, x + width / 2, y + height / 2 + 4, { align: 'center' });
};

const drawBookingPage = async (doc: jsPDF, booking: BookingPdfData) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const headerHeight = 120;

  const logoDataUrl = await getLogoDataUrl();

  doc.setFillColor(255, 244, 230);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(254, 215, 170);
    doc.roundedRect(margin, 20, 100, 76, 16, 16, 'FD');
    doc.addImage(logoDataUrl, 'PNG', margin + 6, 26, 88, 64);
  }

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(18);
  doc.text('Mikadventures Booking', logoDataUrl ? margin + 114 : margin, 52);
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text('Adventure confirmation summary', logoDataUrl ? margin + 114 : margin, 70);

  const status = toSafeText(booking.status).toUpperCase();
  const statusStyle = statusPalette[status] ?? fallbackStatusStyle;
  const badgeWidth = Math.max(110, doc.getTextWidth(status) + 26);
  doc.setFillColor(statusStyle.badge[0], statusStyle.badge[1], statusStyle.badge[2]);
  doc.setDrawColor(statusStyle.badge[0], statusStyle.badge[1], statusStyle.badge[2]);
  doc.roundedRect(pageWidth - margin - badgeWidth, 40, badgeWidth, 28, 14, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(status, pageWidth - margin - badgeWidth / 2, 59, { align: 'center' });

  let cursorY = headerHeight + 24;
  const metaGap = 14;
  const metaWidth = (pageWidth - margin * 2 - metaGap) / 2;
  const metaHeight = 64;

  drawLabeledBox(doc, 'Booking ID', `#${booking.id}`, margin, cursorY, metaWidth, metaHeight, [255, 247, 237], [254, 215, 170]);
  drawLabeledBox(doc, 'Trip', toSafeText(booking.trip.location), margin + metaWidth + metaGap, cursorY, metaWidth, metaHeight, [255, 247, 237], [254, 215, 170]);
  cursorY += metaHeight + metaGap;
  drawLabeledBox(doc, 'Travel Dates', toSafeText(booking.trip.dates), margin, cursorY, metaWidth, metaHeight, [255, 247, 237], [254, 215, 170]);
  drawLabeledBox(doc, 'Issue Date', formatDate(new Date().toISOString()), margin + metaWidth + metaGap, cursorY, metaWidth, metaHeight, [255, 247, 237], [254, 215, 170]);

  cursorY += metaHeight + 28;
  doc.setFontSize(12);
  doc.setTextColor(249, 115, 22);
  doc.text('TRAVELER DETAILS', margin, cursorY);
  cursorY += 10;

  const detailGap = 12;
  const detailWidth = (pageWidth - margin * 2 - detailGap) / 2;
  const detailHeight = 66;

  const details = [
    ['Full name', toSafeText(booking.fullName)],
    ['Phone', toSafeText(booking.phone)],
    ['Email', toSafeText(booking.email)],
    ['Country', toSafeText(booking.country)],
    ['Instagram', toSafeText(booking.instagram ?? 'Not provided')],
    ['People', toSafeText(booking.people)],
  ];

  details.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + col * (detailWidth + detailGap);
    const y = cursorY + row * (detailHeight + detailGap) + 12;
    drawLabeledBox(doc, label, value, x, y, detailWidth, detailHeight, [255, 255, 255], [229, 231, 235]);
  });

  cursorY += (detailHeight + detailGap) * 3 + 26;
  doc.setFontSize(12);
  doc.setTextColor(249, 115, 22);
  doc.text('BOOKING TIMELINE', margin, cursorY);
  cursorY += 10;

  const timeline = [
    ['Created', formatDateTime(booking.createdAt)],
    ['Last updated', formatDateTime(booking.updatedAt)],
    ['Status', toSafeText(booking.status)],
    ['Trip ID', toSafeText(booking.trip.id)],
  ];

  timeline.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + col * (detailWidth + detailGap);
    const y = cursorY + row * (detailHeight + detailGap) + 12;
    if (label === 'Status') {
      drawLabeledBox(doc, label, '', x, y, detailWidth, detailHeight, [255, 255, 255], [229, 231, 235]);
      drawStatusPill(doc, value.toUpperCase(), x + 12, y + 30, 20, statusStyle.badge);
      return;
    }
    drawLabeledBox(doc, label, value, x, y, detailWidth, detailHeight, [255, 255, 255], [229, 231, 235]);
  });

  const footerY = doc.internal.pageSize.getHeight() - 60;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.text('Generated by Mikadventures', pageWidth - margin, footerY + 20, { align: 'right' });
};

export const generateBookingPdf = async (booking: BookingPdfData) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  await drawBookingPage(doc, booking);
  const safeName = toSafeText(booking.fullName).replace(/[^a-zA-Z0-9-_]+/g, '-').toLowerCase();
  doc.save(`booking-${booking.id}-${safeName || 'guest'}.pdf`);
};

export const generateBookingsPdf = async (bookings: BookingPdfData[]) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  for (let index = 0; index < bookings.length; index += 1) {
    if (index > 0) {
      doc.addPage();
    }
    await drawBookingPage(doc, bookings[index]);
  }
  doc.save(`bookings-${new Date().toISOString().slice(0, 10)}.pdf`);
};
