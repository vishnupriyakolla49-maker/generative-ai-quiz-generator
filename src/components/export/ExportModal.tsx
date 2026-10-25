import React, { useState } from 'react';
import { X, Download, FileText, Printer, Check, Copy } from 'lucide-react';
import { Quiz, Question } from '../../types';

interface ExportModalProps {
  quiz: Quiz;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ quiz, onClose }) => {
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate printable text / HTML
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${quiz.title} - QuizGenius AI Exam Sheet</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
          h1 { margin-bottom: 4px; font-size: 24px; }
          .meta { color: #666; font-size: 13px; margin-bottom: 24px; border-bottom: 1px solid #ccc; padding-bottom: 12px; }
          .question-card { margin-bottom: 24px; page-break-inside: avoid; }
          .question-title { font-weight: bold; margin-bottom: 8px; font-size: 15px; }
          .option-item { margin-left: 20px; font-size: 14px; margin-bottom: 4px; }
          .answer-key { margin-top: 10px; padding: 10px; background: #f4f4f4; border-left: 3px solid #7c3aed; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>${quiz.title}</h1>
        <div class="meta">
          <strong>Topic:</strong> ${quiz.topic} &nbsp;|&nbsp; 
          <strong>Difficulty:</strong> ${quiz.difficulty.toUpperCase()} &nbsp;|&nbsp; 
          <strong>Quality Index:</strong> ${quiz.qualityOverallScore}/100 &nbsp;|&nbsp;
          <strong>Total Questions:</strong> ${quiz.questions.length}
        </div>
        ${quiz.questions.map((q, idx) => `
          <div class="question-card">
            <div class="question-title">${idx + 1}. ${q.questionText} (${q.questionType.replace('_', ' ')})</div>
            ${q.options && q.options.length > 0 ? q.options.map((opt, oIdx) => `
              <div class="option-item">${String.fromCharCode(65 + oIdx)}) ${opt}</div>
            `).join('') : '<div class="option-item" style="color: #888;">____________________________________</div>'}
            
            ${includeAnswers ? `
              <div class="answer-key">
                <strong>Correct Answer:</strong> ${q.correctAnswer}<br/>
                <strong>Explanation:</strong> ${q.explanation}<br/>
                ${includeSources && q.sourcePassage ? `<strong>Source Reference:</strong> "${q.sourcePassage}"` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${quiz.title.replace(/\s+/g, '_')}_QuizGenius.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCSV = () => {
    const headers = ['Question_Number', 'Question_Text', 'Type', 'Difficulty', 'Correct_Answer', 'Explanation', 'Source_Passage', 'Quality_Score'];
    const rows = quiz.questions.map((q, idx) => [
      idx + 1,
      `"${q.questionText.replace(/"/g, '""')}"`,
      q.questionType,
      q.difficulty,
      `"${q.correctAnswer.replace(/"/g, '""')}"`,
      `"${q.explanation.replace(/"/g, '""')}"`,
      `"${(q.sourcePassage || '').replace(/"/g, '""')}"`,
      q.evaluation?.weightedScore || 90
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `${quiz.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#11182B] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold text-white">Export &amp; Print Assessment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-slate-400">Configure Export Options:</div>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAnswers}
              onChange={(e) => setIncludeAnswers(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
            />
            <span>Include full answer key &amp; pedagogical explanations</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSources}
              onChange={(e) => setIncludeSources(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
            />
            <span>Include exact source passage citations</span>
          </label>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handlePrint}
            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-center space-y-2 group transition-all"
          >
            <Printer className="w-6 h-6 text-violet-400 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">Print / PDF</div>
            <div className="text-[10px] text-slate-400">Printable exam paper</div>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-center space-y-2 group transition-all"
          >
            <FileText className="w-6 h-6 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">CSV Spreadsheet</div>
            <div className="text-[10px] text-slate-400">LMS / Excel compatible</div>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-center space-y-2 group transition-all"
          >
            <Download className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">JSON Archive</div>
            <div className="text-[10px] text-slate-400">Full audit schema</div>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
