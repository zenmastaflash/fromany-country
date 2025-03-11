// src/lib/documentUtils.ts
import { createWorker } from 'tesseract.js';
import { DocumentType } from '@prisma/client';

export async function processImageWithOCR(file: File) {
  try {
    // Create worker in the browser
    const worker = await createWorker('eng');
    const result = await worker.recognize(file);
    await worker.terminate();
    
    const text = result.data.text;
    
    // Extract document details from text
    return {
      extractedText: text,
      documentNumber: extractDocumentNumber(text),
      dates: extractDates(text),
      country: extractCountry(text),
      documentType: identifyDocumentType(text)
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    return null;
  }
}

// Helper functions from your existing extract API
function extractDocumentNumber(text: string): string | null {
  const patterns = [
    /passport no\.?\s*[:]\s*([A-Z0-9]+)/i,
    /document no\.?\s*[:]\s*([A-Z0-9]+)/i,
    /no\.?\s*[:]\s*([A-Z0-9]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

function extractDates(text: string): { issueDate: string | null, expiryDate: string | null } {
  const issueDatePatterns = [
    /date of issue\s*[:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /issued on\s*[:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
  ];
  
  const expiryDatePatterns = [
    /expiry date\s*[:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /date of expiry\s*[:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
    /valid until\s*[:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i,
  ];

  let issueDate = null;
  let expiryDate = null;

  for (const pattern of issueDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      issueDate = match[1].trim();
      break;
    }
  }

  for (const pattern of expiryDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      expiryDate = match[1].trim();
      break;
    }
  }

  return { issueDate, expiryDate };
}

function extractCountry(text: string): string | null {
  const countryPatterns = [
    /issued by\s*[:]\s*([A-Za-z\s]+)/i,
    /country\s*[:]\s*([A-Za-z\s]+)/i,
  ];

  for (const pattern of countryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

function identifyDocumentType(text: string): DocumentType {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('passport')) {
    return DocumentType.PASSPORT;
  } else if (lowerText.includes('driver') && lowerText.includes('license')) {
    return DocumentType.DRIVERS_LICENSE;
  } else if (lowerText.includes('visa')) {
    if (lowerText.includes('tourist') || lowerText.includes('visitor')) {
      return DocumentType.TOURIST_VISA;
    }
    return DocumentType.VISA;
  } else if (lowerText.includes('residency') || lowerText.includes('resident')) {
    return DocumentType.RESIDENCY_PERMIT;
  } else if (lowerText.includes('insurance')) {
    return DocumentType.INSURANCE;
  } else if (lowerText.includes('tax') && lowerText.includes('return')) {
    return DocumentType.TAX_RETURN;
  } else if (lowerText.includes('bank') && lowerText.includes('statement')) {
    return DocumentType.BANK_STATEMENT;
  }
  
  return DocumentType.OTHER;
}
