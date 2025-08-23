// src/services/DocumentService.js
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

class DocumentService {
  async readFileContent(file) {
    return new Promise(async (resolve, reject) => {
      try {
        if (file.type === 'application/pdf') {
          const text = await this.readPDF(file);
          resolve(text);
        } 
        else if (file.name.endsWith('.docx')) {
          const text = await this.readDOCX(file);
          resolve(text);
        }
        else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const text = await this.readTextFile(file);
          resolve(text);
        }
        else {
          reject(new Error(`Unsupported file type: ${file.type}`));
        }
      } catch (error) {
        reject(new Error(`Error reading ${file.name}: ${error.message}`));
      }
    });
  }

  async readPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  }

  async readDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
  }

  async readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  searchInText(text, searchTerm) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const matchingSentences = [];
    let occurrenceCount = 0;

    sentences.forEach((sentence, index) => {
      const cleanSentence = sentence.trim();
      if (cleanSentence.toLowerCase().includes(searchTerm.toLowerCase())) {
        occurrenceCount++;
        matchingSentences.push({
          id: index,
          number: occurrenceCount,
          text: cleanSentence,
          originalIndex: index
        });
      }
    });

    const regex = new RegExp(`\\b${searchTerm}\\b`, 'gi');
    const totalOccurrences = (text.match(regex) || []).length;

    return {
      sentences: matchingSentences,
      totalMatches: matchingSentences.length,
      totalOccurrences: totalOccurrences
    };
  }
}

export default new DocumentService();
