// src/app/api/documents/extract/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';

export async function POST(req: NextRequest) {
  try {
    console.log("OCR API route called with POST method");
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log("No file provided in request");
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to ArrayBuffer and then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Processing file: ${file.name}, size: ${buffer.length} bytes`);
    
    // Initialize Tesseract worker
    const worker = await createWorker('eng');
    
    // Process image with Tesseract
    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    const extractedText = data.text;
    console.log(`OCR extraction completed. Extracted ${extractedText.length} characters`);
    
    // Extract potential metadata
    const metadata = {
      extractedText,
      documentNumber: extractDocumentNumber(extractedText),
      dates: extractDates(extractedText),
      country: extractCountry(extractedText),
      documentType: identifyDocumentType(extractedText),
    };

    console.log("Extracted metadata:", metadata);
    return NextResponse.json({ success: true, metadata });
  } catch (error) {
    console.error('OCR extraction error:', error);
    return NextResponse.json({ 
      error: 'Failed to process document', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Helper functions to extract metadata
function extractDocumentNumber(text: string): string | null {
  // Look for common document number patterns
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
  // Simplified date extraction
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
  // Look for country names
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

function identifyDocumentType(text: string): string | null {
  // Simple heuristics to identify document type
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('passport')) {
    return 'PASSPORT';
  } else if (lowerText.includes('driver') && lowerText.includes('license')) {
    return 'DRIVERS_LICENSE';
  } else if (lowerText.includes('visa')) {
    if (lowerText.includes('tourist') || lowerText.includes('visitor')) {
      return 'TOURIST_VISA';
    }
    return 'VISA';
  } else if (lowerText.includes('residency') || lowerText.includes('resident')) {
    return 'RESIDENCY_PERMIT';
  } else if (lowerText.includes('insurance')) {
    return 'INSURANCE';
  } else if (lowerText.includes('tax') && lowerText.includes('return')) {
    return 'TAX_RETURN';
  } else if (lowerText.includes('bank') && lowerText.includes('statement')) {
    return 'BANK_STATEMENT';
  }
  
  return 'OTHER';
}

// Add this to the same file
export async function GET() {
  return NextResponse.json({ status: 'OCR API is working' });
}
