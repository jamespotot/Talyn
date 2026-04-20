import mammoth from 'mammoth';

export async function parseFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'txt':
      return await parseTXT(file);
    case 'docx':
      return await parseDOCX(file);
    case 'pdf':
      return await parsePDF(file);
    default:
      throw new Error('Unsupported file format');
  }
}

async function parseTXT(file: File): Promise<string> {
  return await file.text();
}

async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parsePDF(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/parse-pdf', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('PDF parsing failed');

  const data = await res.json();
  return data.text;
}
