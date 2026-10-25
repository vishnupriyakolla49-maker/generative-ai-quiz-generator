import React, { useState, useEffect, useRef } from 'react';
import {
  FileUp,
  FileText,
  Trash2,
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { StudyMaterial, DocumentChunk } from '../../types';
import { fetchMaterials, extractDocument, deleteMaterial } from '../../services/api';

interface MaterialsPageProps {
  onGenerateQuizFromMaterial: (material: StudyMaterial) => void;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({ onGenerateQuizFromMaterial }) => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');

  // Paste text state
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteText, setPasteText] = useState('');

  // Drag and drop / file upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const list = await fetchMaterials();
      setMaterials(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setUploadError(null);
    const validExtensions = ['pdf', 'docx', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      setUploadError('Unsupported format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds the 15MB limit.');
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        const newMaterial = await extractDocument({
          title: file.name,
          fileType: ext as 'pdf' | 'docx' | 'txt',
          base64Content
        });
        setMaterials([newMaterial, ...materials]);
        setSelectedMaterial(newMaterial);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read file from disk.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Document processing error.');
      setIsProcessing(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim() || pasteText.trim().length < 30) {
      setUploadError('Please paste at least 30 characters of study content.');
      return;
    }
    setUploadError(null);
    setIsProcessing(true);
    try {
      const newMaterial = await extractDocument({
        title: pasteTitle.trim() || 'Pasted Study Notes',
        fileType: 'pasted',
        rawText: pasteText.trim()
      });
      setMaterials([newMaterial, ...materials]);
      setSelectedMaterial(newMaterial);
      setPasteText('');
      setPasteTitle('');
      setIsProcessing(false);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to extract text.');
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this study material and its extracted chunks?')) {
      await deleteMaterial(id);
      setMaterials(materials.filter((m) => m.id !== id));
      if (selectedMaterial?.id === id) {
        setSelectedMaterial(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Study Material Ingestion</h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF textbooks, lecture documents, or paste notes for semantic chunking and grounded quiz synthesis.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'upload' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          File Upload (PDF/DOCX)
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'paste' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Paste Text
        </button>
      </div>

      {/* Upload & Ingestion Controls */}
      {activeTab === 'upload' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) {
              processFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 sm:p-12 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-600/10'
              : 'border-white/10 bg-white/[0.02] hover:border-violet-500/40 hover:bg-white/[0.04]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
            <FileUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">
            {isProcessing ? 'Extracting & Chunking Document...' : 'Drag and drop your study file here'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Supports PDF, Microsoft Word (.docx), and plain text (.txt) up to 15MB.
          </p>
          <button
            type="button"
            disabled={isProcessing}
            className="mt-4 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
          >
            Browse files on computer
          </button>
        </div>
      ) : (
        <form onSubmit={handlePasteSubmit} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Document Title</label>
            <input
              type="text"
              value={pasteTitle}
              onChange={(e) => setPasteTitle(e.target.value)}
              placeholder="e.g. Chapter 4: Photosynthesis and Light Reactions"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Study Material Content</label>
            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste lecture notes, study guide excerpts, or book paragraphs..."
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="py-2.5 px-5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 flex items-center gap-2"
          >
            {isProcessing ? (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Process &amp; Ingest Material</span>
          </button>
        </form>
      )}

      {uploadError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* ----------------- MATERIALS LIST & CHUNK INSPECTOR ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Materials List */}
        <div className="space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span>Stored Materials ({materials.length})</span>
          </div>

          <div className="space-y-2">
            {materials.map((m) => {
              const isSelected = selectedMaterial?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMaterial(m)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-violet-950/30 border-violet-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-violet-400 flex-shrink-0" />
                      <span className="text-xs font-semibold truncate">{m.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(m.id, e)}
                      title="Delete material"
                      className="text-slate-500 hover:text-red-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="uppercase font-mono">{m.fileType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{m.chunks?.length || 1} chunks</span>
                    <span aria-hidden="true">·</span>
                    <span>{Math.round(m.fileSize / 1024)} KB</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Material Inspector & Chunk Breakdown */}
        <div className="lg:col-span-2">
          {selectedMaterial ? (
            <div className="p-6 rounded-2xl border border-white/10 bg-[#11182B] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    Document Inspector · {selectedMaterial.fileType.toUpperCase()}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedMaterial.title}</h3>
                </div>
                <button
                  onClick={() => onGenerateQuizFromMaterial(selectedMaterial)}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 self-start"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Generate Quiz from Material</span>
                </button>
              </div>

              {/* Chunk list */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                  <span>Semantic Passages ({selectedMaterial.chunks?.length || 0})</span>
                  <span className="text-[11px] text-slate-500">Separated at logical paragraph boundaries</span>
                </h4>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {selectedMaterial.chunks?.map((chunk, idx) => (
                    <div
                      key={chunk.id || idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-violet-400">
                          Passage #{chunk.chunkIndex + 1}
                        </span>
                        <span>{chunk.wordCount} words · Est. Page {chunk.pageNumber || 1}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans line-clamp-4">
                        {chunk.content}
                      </p>
                      {chunk.keyConcepts && chunk.keyConcepts.length > 0 && (
                        <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="text-slate-500">Key Concepts:</span>
                          <span className="text-cyan-400 font-mono">
                            {chunk.keyConcepts.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-white/5 bg-white/[0.02] text-center text-xs text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div>Select a study material to inspect its extracted text and semantic chunks.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
