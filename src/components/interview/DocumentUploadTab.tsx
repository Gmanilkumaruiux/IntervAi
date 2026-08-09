import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SourceDocument } from '../../types/interview';
import { documentParserService } from '../../services/documentParserService';
import { FileText, Upload, Github, Link as LinkIcon, Trash2, CheckCircle2 } from 'lucide-react';

export interface DocumentUploadTabProps {
  documents: SourceDocument[];
  onDocumentsChange: (documents: SourceDocument[]) => void;
}

export const DocumentUploadTab: React.FC<DocumentUploadTabProps> = ({
  documents,
  onDocumentsChange
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isParsingUrl, setIsParsingUrl] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: SourceDocument[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const parsedDoc = await documentParserService.parseFile(file);
      newDocs.push(parsedDoc);
    }

    onDocumentsChange([...documents, ...newDocs]);
  };

  const handleAddUrlOrRepo = async (type: 'github_repo' | 'url') => {
    if (!urlInput.trim()) return;
    setIsParsingUrl(true);
    try {
      const parsedDoc = await documentParserService.parseUrlOrRepo(urlInput.trim(), type);
      onDocumentsChange([...documents, parsedDoc]);
      setUrlInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsingUrl(false);
    }
  };

  const handleRemoveDoc = (id: string) => {
    onDocumentsChange(documents.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card variant="glass" className="bg-white border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F97316]" /> RAG Document & Repository Knowledge Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-[#E2E8F0] hover:border-[#F97316] rounded-2xl p-6 text-center bg-[#F8FAFC] transition-colors relative">
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-[#F97316]">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Upload Documentation Files</h4>
              <p className="text-xs text-[#64748B]">Drag & drop PDF, DOCX, TXT, or Markdown files here</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" size="sm">PDF</Badge>
                <Badge variant="outline" size="sm">DOCX</Badge>
                <Badge variant="outline" size="sm">TXT</Badge>
                <Badge variant="outline" size="sm">Markdown</Badge>
              </div>
            </div>
          </div>

          {/* GitHub Repo / Documentation URL Parser */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <label className="text-xs font-bold text-[#0F172A] block">Add GitHub Repository or Documentation Link:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative flex items-center">
                <LinkIcon className="w-4 h-4 text-[#64748B] absolute left-3" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://github.com/org/repo OR https://docs.example.com"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => handleAddUrlOrRepo('github_repo')}
                  isLoading={isParsingUrl}
                  variant="secondary"
                  size="sm"
                  leftIcon={<Github className="w-3.5 h-3.5" />}
                >
                  GitHub Repo
                </Button>

                <Button
                  type="button"
                  onClick={() => handleAddUrlOrRepo('url')}
                  isLoading={isParsingUrl}
                  variant="outline"
                  size="sm"
                  leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
                >
                  Parse URL
                </Button>
              </div>
            </div>
          </div>

          {/* Indexed Documents List */}
          {documents.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
                Indexed RAG Documents ({documents.length})
              </h4>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-[#0F172A] block">{doc.name}</span>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          {doc.chunksCount} Vector Chunks Indexed • Uploaded {new Date(doc.uploadedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-[#64748B] hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
