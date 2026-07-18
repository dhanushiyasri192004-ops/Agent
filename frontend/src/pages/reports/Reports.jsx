import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ClipboardList, Plus, ShieldAlert, Check, X, FileText, CheckCircle } from 'lucide-react';
import api from '../../services/api.js';

const Reports = () => {
  const { user } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reportType, setReportType] = useState('Daily Report');
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await api.patch(`/api/reports/${reportId}/status`, { status: newStatus });
      fetchReports();
    } catch (err) {
      console.error('Error updating report status:', err);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('reportType', reportType);
    if (documentFile) {
      formData.append('document', documentFile);
    }

    try {
      await api.post('/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Report submitted successfully!');
      setTitle('');
      setContent('');
      setReportType('Daily Report');
      setDocumentFile(null);
      // Reset file input element
      const fileInput = document.getElementById('report-document-file');
      if (fileInput) fileInput.value = '';
      
      fetchReports();
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="text-forge-gold w-6 h-6" /> Activity Reports & Escalations
          </h1>
          <p className="text-xs text-forge-grayText mt-0.5">Submit daily reports or review summaries submitted by subordinate agents.</p>
        </div>
        {user?.role !== 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-forge-gold hover:bg-forge-goldHover text-forge-dark text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-4 h-4" /> Submit Report
          </button>
        )}
      </div>

      {/* Reports list */}
      <div className="bg-forge-dark border border-forge-card/40 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-forge-grayText">Loading reports list...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-forge-grayText">No reports found. Click submit to create one.</div>
        ) : (
          <div className="divide-y divide-forge-card/25">
            {reports.map((report) => {
              const isAssignedToMe = report.assignedTo?._id === user?._id;
              const isSubmittedByMe = report.createdBy?._id === user?._id;

              return (
                <div key={report._id} className="p-5 hover:bg-forge-card/10 transition text-xs flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${report.reportType === 'Escalation' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-forge-accent/20 text-blue-300 border border-forge-card'}`}>
                        {report.reportType}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${report.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : report.status === 'Reviewed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {report.status}
                      </span>
                      <span className="text-[10px] text-forge-grayText">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{report.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{report.content}</p>

                    {report.documentUrl && (
                      <a
                        href={report.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-forge-gold hover:underline font-bold mt-1 text-[11px]"
                      >
                        <FileText className="w-4 h-4" /> View Attachment File
                      </a>
                    )}

                    <div className="text-[10px] text-forge-grayText pt-1 flex gap-3">
                      <span>Submitted By: <strong className="text-white">{report.createdBy?.email} ({report.createdBy?.role})</strong></span>
                      <span>Assigned To: <strong className="text-white">{report.assignedTo?.email}</strong></span>
                    </div>
                  </div>

                  {/* Actions (if recipient of report) */}
                  {isAssignedToMe && report.status === 'Pending' && (
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                      <button
                        onClick={() => handleStatusUpdate(report._id, 'Reviewed')}
                        className="bg-forge-card hover:bg-forge-card/80 text-white font-bold px-3 py-1.5 rounded-lg border border-forge-card/60 transition"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report._id, 'Resolved')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-forge-dark font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-forge-dark border border-forge-card rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-forge-card/45 pb-3">
              <h3 className="text-sm font-bold text-white">Submit Activity Report</h3>
              <button onClick={() => setShowModal(false)} className="text-forge-grayText hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-200 text-xs px-3 py-2 rounded flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs px-3 py-2 rounded flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs font-semibold text-forge-grayText uppercase tracking-wider">
              
              <div>
                <label className="block mb-1.5">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-forge-card/40 border border-forge-card text-white px-3 py-2.5 rounded-lg outline-none focus:border-forge-gold"
                >
                  <option value="Daily Report">Daily Report</option>
                  <option value="Activity Report">Activity Report</option>
                  <option value="Escalation">Escalation Issue</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Progress Summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-forge-card/40 border border-forge-card text-white px-3 py-2.5 rounded-lg outline-none focus:border-forge-gold"
                />
              </div>

              <div>
                <label className="block mb-1.5">Detailed Summary</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Enter details of your visits, operations or issue escalation..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-forge-card/40 border border-forge-card text-white p-3 rounded-lg outline-none focus:border-forge-gold"
                ></textarea>
              </div>

              <div>
                <label className="block mb-1.5">Attach Supporting Document (Optional)</label>
                <input
                  type="file"
                  id="report-document-file"
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                  className="w-full bg-forge-card/25 border border-forge-card/50 text-white px-3 py-2 rounded-lg outline-none focus:border-forge-gold"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-forge-gold hover:bg-forge-goldHover text-forge-dark font-bold py-3 rounded-lg shadow-lg mt-3 uppercase tracking-wider text-[11px] transition"
              >
                {submitting ? 'Submitting report...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
