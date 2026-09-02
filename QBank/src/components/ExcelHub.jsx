import React, { useState } from 'react';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ExcelHub() {
  const [uploading, setUploading] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [file, setFile] = useState(null);

  const handleDownload = () => {
    window.location.href = '/api/admin/questions/export/excel';
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setImportStatus(null);

    const formData = new FormData();
    formData.append('excel_file', file);

    try {
      const res = await fetch('/api/admin/questions/import/excel', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setImportStatus(data);
    } catch (err) {
      setImportStatus({ success: false, message: 'File upload failed: ' + err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="excel-hub animate-fade-in">
      <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <FileSpreadsheet size={54} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Excel Question Repository & Sync Hub
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 2rem' }}>
          Download the complete MATATAG DepEd K-10 Question Bank as a standardized Excel spreadsheet (`questions_bank.xlsx`), or upload modified spreadsheets to sync questions across Form 1 to Form 10.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleDownload} style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            <Download size={20} /> Export questions_bank.xlsx
          </button>
        </div>
      </div>

      {/* Upload Box */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={20} color="var(--accent-primary)" /> Upload & Import Modified Excel Spreadsheet
        </h3>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ border: '2px dashed var(--border-card)', borderRadius: '16px', padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.15)', cursor: 'pointer' }}>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="excel-file-input"
            />
            <label htmlFor="excel-file-input" style={{ cursor: 'pointer', display: 'block' }}>
              <FileSpreadsheet size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {file ? file.name : 'Click to select or drag & drop an Excel file (.xlsx / .csv)'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Supports standard column headers: Question ID, Form Level, Strand, Unit, Topic ID, Question Text, LaTeX Formula, Options, Correct Answer, Step-by-Step Working, Image URL, etc.
              </p>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={!file || uploading}
              style={{ minWidth: '180px' }}
            >
              {uploading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
              {uploading ? 'Processing Import...' : 'Import Spreadsheet'}
            </button>
          </div>
        </form>

        {importStatus && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: importStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${importStatus.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              color: importStatus.success ? 'var(--accent-green)' : 'var(--accent-rose)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
              {importStatus.success ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              {importStatus.message}
            </div>
          </div>
        )}
      </div>

      {/* Column Schema Standard Documentation */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem' }}>
          Standardized Excel Column Headers Reference
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left', color: 'var(--text-primary)' }}>
                <th style={{ padding: '0.6rem 0.8rem' }}>Column Name</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Data Type</th>
                <th style={{ padding: '0.6rem 0.8rem' }}>Description & Sample</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>Question ID</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Integer</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Primary Key (e.g. 1045)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>Form Level</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>String</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Grade level mapping (e.g. Form 1 to Form 10)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>Curriculum Strand / Content Domain</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>String</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>MATATAG Strand (e.g. Number and Algebra)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>LaTeX Formula Expression</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>String</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>LaTeX formula syntax (e.g. \frac&#123;a&#125;&#123;b&#125;)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>Step-by-Step Working</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Text</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Newline-delimited solution derivation steps</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>Graph / Image URL</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>URL</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Visual plot / diagram image URL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
