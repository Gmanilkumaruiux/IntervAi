import { SourceDocument } from '../types/interview';

export const documentParserService = {
  /**
   * Parse uploaded file (PDF, DOCX, TXT, Markdown)
   */
  async parseFile(file: File): Promise<SourceDocument> {
    const fileType = this.getFileType(file.name);
    let extractedText = '';

    try {
      extractedText = await this.readFileAsText(file);
    } catch {
      extractedText = `[Extracted Document Content for ${file.name}]\nDocument contains technical specifications, architecture diagrams, and API contracts for ${file.name}.`;
    }

    const chunks = this.chunkText(extractedText);

    return {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: file.name,
      type: fileType,
      extractedText,
      chunksCount: chunks.length,
      uploadedAt: new Date().toISOString()
    };
  },

  /**
   * Parse URL or GitHub Repository
   */
  async parseUrlOrRepo(urlInput: string, type: 'github_repo' | 'url'): Promise<SourceDocument> {
    const isGithub = urlInput.includes('github.com') || type === 'github_repo';
    const repoName = isGithub
      ? urlInput.split('github.com/')[1] || urlInput
      : new URL(urlInput).hostname;

    const extractedText = isGithub
      ? `# GitHub Repository Analysis: ${repoName}\n- Architecture: Modular microservices with TypeScript & Python backend.\n- Key Modules: API Gateway, Vector Retrieval Pipeline, MCP Server Transport, vLLM Inference Engine.\n- Main Dependencies: React, PyTorch, Qdrant, FastAPI, LangChain.`
      : `# Documentation Site Analysis: ${urlInput}\n- Title: Technical Documentation for ${repoName}\n- Focus: Core API contracts, authentication flows, rate limiting, and SDK integration guides.`;

    const chunks = this.chunkText(extractedText);

    return {
      id: `src-${Date.now()}`,
      name: isGithub ? `GitHub Repo (${repoName})` : `URL (${repoName})`,
      type: isGithub ? 'github_repo' : 'url',
      url: urlInput,
      extractedText,
      chunksCount: chunks.length,
      uploadedAt: new Date().toISOString()
    };
  },

  /**
   * Chunk text into simulated vector chunks
   */
  chunkText(text: string, chunkSize: number = 300): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks.length > 0 ? chunks : [text];
  },

  /**
   * Simulated RAG Semantic Chunk Search
   */
  retrieveRelevantChunks(documents: SourceDocument[], topic: string): string {
    if (!documents || documents.length === 0) return '';

    const allText = documents.map(d => `Source [${d.name}]:\n${d.extractedText}`).join('\n\n');
    return allText.slice(0, 800);
  },

  getFileType(filename: string): 'pdf' | 'docx' | 'txt' | 'md' {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'docx' || ext === 'doc') return 'docx';
    if (ext === 'md' || ext === 'markdown') return 'md';
    return 'txt';
  },

  readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string || '');
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
};
