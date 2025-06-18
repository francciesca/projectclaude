import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Download, Upload, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { Document } from '../../types';
import { mockDocuments } from '../../data/mockData';
import { useCompany } from '../../hooks/useCompany';
import { DocumentModal } from './DocumentModal';

export function DocumentsModule() {
  const { currentCompany } = useCompany();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments.filter(d => d.companyId === currentCompany.id));
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Filter documents based on search and filters
  React.useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, typeFilter, statusFilter]);

  const handleAddDocument = (documentData: Omit<Document, 'id' | 'companyId'>) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now().toString(),
      companyId: currentCompany.id
    };
    setDocuments([...documents, newDocument]);
    setShowModal(false);
  };

  const handleEditDocument = (documentData: Omit<Document, 'id' | 'companyId'>) => {
    if (editingDocument) {
      const updatedDocuments = documents.map(d =>
        d.id === editingDocument.id ? { ...documentData, id: editingDocument.id, companyId: currentCompany.id } : d
      );
      setDocuments(updatedDocuments);
      setEditingDocument(null);
      setShowModal(false);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este documento?')) {
      setDocuments(documents.filter(d => d.id !== documentId));
    }
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setShowModal(true);
  };

  const handleDownload = (document: Document) => {
    // Simulate download
    alert(`Descargando: ${document.name}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'expiring':
        return <Clock className="text-yellow-500" size={20} />;
      case 'expired':
        return <AlertTriangle className="text-red-500" size={20} />;
      default:
        return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Vigente';
      case 'expiring':
        return 'Por Vencer';
      case 'expired':
        return 'Vencido';
      default:
        return 'Desconocido';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'insurance':
        return 'Seguro';
      case 'registration':
        return 'Registro';
      case 'permit':
        return 'Permiso';
      case 'technical-review':
        return 'Revisión Técnica';
      case 'other':
        return 'Otro';
      default:
        return 'Desconocido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical-review':
        return <Shield className="text-blue-500" size={20} />;
      case 'insurance':
        return <Shield className="text-green-500" size={20} />;
      default:
        return <FileText className="text-gray-500" size={20} />;
    }
  };

  const stats = {
    total: documents.length,
    valid: documents.filter(d => d.status === 'valid').length,
    expiring: documents.filter(d => d.status === 'expiring').length,
    expired: documents.filter(d => d.status === 'expired').length,
    technicalReviews: documents.filter(d => d.type === 'technical-review').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h1>
          <p className="text-gray-600">Administra los documentos de {currentCompany.name}</p>
        </div>
        <button
          onClick={() => {
            setEditingDocument(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Agregar Documento
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vigentes</p>
              <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Por Vencer</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rev. Técnicas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.technicalReviews}</p>
            </div>
            <Shield className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="insurance">Seguro</option>
              <option value="registration">Registro</option>
              <option value="permit">Permiso</option>
              <option value="technical-review">Revisión Técnica</option>
              <option value="other">Otro</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="valid">Vigente</option>
              <option value="expiring">Por Vencer</option>
              <option value="expired">Vencido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(document.type)}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{document.name}</h3>
                    <p className="text-sm text-gray-600">{getTypeLabel(document.type)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                  {getStatusLabel(document.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Vencimiento:</span>
                  <span className="ml-2">{new Date(document.expiryDate).toLocaleDateString()}</span>
                </div>
                {document.vehicleId && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Vehículo:</span>
                    <span className="ml-2">{document.vehicleId}</span>
                  </div>
                )}
                {document.driverId && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Conductor:</span>
                    <span className="ml-2">{document.driverId}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => handleDownload(document)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Download size={16} className="mr-1" />
                  Descargar
                </button>
                <button
                  onClick={() => handleEdit(document)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteDocument(document.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron documentos</h3>
          <p className="text-gray-600">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer documento'}
          </p>
        </div>
      )}

      {/* Add/Edit Document Modal */}
      <DocumentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDocument(null);
        }}
        onSave={editingDocument ? handleEditDocument : handleAddDocument}
        document={editingDocument}
      />
    </div>
  );
}