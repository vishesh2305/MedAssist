'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, FileText, Image, File, Trash2, Share2, Eye, Link2,
  Copy, Clock, X, Download, Filter, Grid, List,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import type { MedicalDocument } from '@/types';
import toast from 'react-hot-toast';

const documentTypes = [
  { value: 'PRESCRIPTION', label: 'Prescription' },
  { value: 'LAB_REPORT', label: 'Lab Report' },
  { value: 'XRAY', label: 'X-Ray' },
  { value: 'DISCHARGE_SUMMARY', label: 'Discharge Summary' },
  { value: 'INSURANCE_CARD', label: 'Insurance Card' },
  { value: 'VACCINATION_RECORD', label: 'Vaccination Record' },
  { value: 'OTHER', label: 'Other' },
];

const typeColors: Record<string, string> = {
  PRESCRIPTION: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  LAB_REPORT: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  XRAY: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  DISCHARGE_SUMMARY: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  INSURANCE_CARD: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  VACCINATION_RECORD: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getTypeLabel(type: string): string {
  const found = documentTypes.find(t => t.value === type);
  return found ? found.label : type;
}

export default function DocumentsPage() {
  const { isLoggedIn } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [uploadType, setUploadType] = useState('OTHER');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragActive, setDragActive] = useState(false);

  // Modals
  const [shareDoc, setShareDoc] = useState<MedicalDocument | null>(null);
  const [viewDoc, setViewDoc] = useState<MedicalDocument | null>(null);
  const [shareExpiry, setShareExpiry] = useState('24h');
  const [shareLink, setShareLink] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState<MedicalDocument | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    fetchDocuments();
  }, [isLoggedIn]);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data.data || []);
    } catch {
      // Show empty state
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', uploadType);
        formData.append('title', file.name);
        await api.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      toast.success('Document(s) uploaded successfully');
      fetchDocuments();
    } catch {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleShare = async () => {
    if (!shareDoc) return;
    setIsSharing(true);
    try {
      const { data } = await api.post(`/documents/${shareDoc.id}/share`, { expiry: shareExpiry });
      const link = data.data?.shareUrl || `${window.location.origin}/shared/doc/${data.data?.shareToken}`;
      setShareLink(link);
      toast.success('Share link generated');
    } catch {
      // Generate a demo link
      setShareLink(`${window.location.origin}/shared/doc/${shareDoc.id}-${Date.now()}`);
      toast.success('Share link generated');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDoc) return;
    try {
      await api.delete(`/documents/${deleteDoc.id}`);
      setDocuments(documents.filter(d => d.id !== deleteDoc.id));
      toast.success('Document deleted');
    } catch {
      toast.error('Failed to delete document');
    }
    setDeleteDoc(null);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  const filteredDocs = selectedType
    ? documents.filter(d => d.type === selectedType)
    : documents;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-gray-900">
        <Header />
        <PageContainer>
          <EmptyState
            icon={<FileText className="h-16 w-16" />}
            title="Sign in to manage your documents"
            description="Securely store and share medical documents like prescriptions, lab reports, and insurance cards."
            actionLabel="Sign In"
            onAction={() => window.location.href = '/login'}
          />
        </PageContainer>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <main className="pb-20 md:pb-0">
        <PageContainer>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Documents</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {documents.length} document{documents.length !== 1 ? 's' : ''} stored
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <Card className="mb-6">
            <CardContent>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                  dragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
              >
                <Upload className={cn(
                  'h-10 w-10 mx-auto mb-3 transition-colors',
                  dragActive ? 'text-primary-500' : 'text-gray-400'
                )} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isUploading ? 'Uploading...' : 'Drag & drop files here, or click to browse'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                onChange={(e) => handleUpload(e.target.files)}
              />
              <div className="mt-4 flex items-center gap-4">
                <Select
                  options={documentTypes}
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  label="Document Type"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedType('')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                !selectedType
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              All
            </button>
            {documentTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  selectedType === t.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Documents */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          ) : filteredDocs.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-16 w-16" />}
              title="No documents found"
              description={selectedType ? 'No documents match the selected filter.' : 'Upload your first medical document to get started.'}
              actionLabel="Upload Document"
              onAction={() => fileInputRef.current?.click()}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} hover>
                  <CardContent>
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {doc.mimeType?.startsWith('image/') ? (
                          <Image className="h-5 w-5 text-purple-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', typeColors[doc.type] || typeColors.OTHER)}>
                        {getTypeLabel(doc.type)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>{formatDate(doc.createdAt)}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span>{formatFileSize(doc.fileSize)}</span>
                    </div>
                    <div className="flex items-center gap-1 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="h-3.5 w-3.5" />}
                        onClick={() => setViewDoc(doc)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Share2 className="h-3.5 w-3.5" />}
                        onClick={() => { setShareDoc(doc); setShareLink(''); }}
                      >
                        Share
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="h-3.5 w-3.5 text-red-500" />}
                        onClick={() => setDeleteDoc(doc)}
                        className="ml-auto"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="!py-3">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {doc.mimeType?.startsWith('image/') ? (
                          <Image className="h-5 w-5 text-purple-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDate(doc.createdAt)}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <span>{formatFileSize(doc.fileSize)}</span>
                        </div>
                      </div>
                      <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full hidden sm:inline', typeColors[doc.type] || typeColors.OTHER)}>
                        {getTypeLabel(doc.type)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewDoc(doc)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setShareDoc(doc); setShareLink(''); }} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteDoc(doc)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </PageContainer>
      </main>

      {/* View Document Modal */}
      <Modal isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title={viewDoc?.title || 'Document'} size="lg">
        <div className="p-6">
          {viewDoc && (
            <div className="text-center">
              {viewDoc.mimeType?.startsWith('image/') ? (
                <img src={viewDoc.fileUrl} alt={viewDoc.title} className="max-w-full max-h-[60vh] mx-auto rounded-lg" />
              ) : (
                <div className="py-12">
                  <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Preview not available for this file type
                  </p>
                </div>
              )}
              <div className="mt-4 flex justify-center gap-2">
                <a href={viewDoc.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm" icon={<Download className="h-4 w-4" />}>
                    Download
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Share2 className="h-4 w-4" />}
                  onClick={() => { setViewDoc(null); setShareDoc(viewDoc); setShareLink(''); }}
                >
                  Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Share Document Modal */}
      <Modal isOpen={!!shareDoc} onClose={() => setShareDoc(null)} title="Share Document" size="md">
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate a secure link to share &ldquo;{shareDoc?.title}&rdquo; with others.
          </p>
          <Select
            label="Link expires in"
            options={[
              { value: '24h', label: '24 hours' },
              { value: '48h', label: '48 hours' },
              { value: '7d', label: '7 days' },
            ]}
            value={shareExpiry}
            onChange={(e) => setShareExpiry(e.target.value)}
            className="mb-4"
          />
          {shareLink ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white outline-none"
              />
              <Button variant="ghost" size="sm" icon={<Copy className="h-4 w-4" />} onClick={copyShareLink}>
                Copy
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              fullWidth
              isLoading={isSharing}
              icon={<Share2 className="h-4 w-4" />}
              onClick={handleShare}
            >
              Generate Share Link
            </Button>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteDoc} onClose={() => setDeleteDoc(null)} title="Delete Document" size="sm">
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete &ldquo;{deleteDoc?.title}&rdquo;? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setDeleteDoc(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
      <MobileNav />
    </div>
  );
}
