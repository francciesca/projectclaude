import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, CreditCard as Edit, Trash2, Download, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { Document } from '../../types';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { DocumentModal } from './DocumentModal';

interface Props {
  companyId: string;
}

export function DocumentsModule({ companyId }: Props) {
  const { data: documents, isLoading, addItem, updateItem, deleteItem } = useSupabaseData<Document>('documents', companyId);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  useEffect(() => {
    let filtered = documents;
    if (searchTerm) filtered = filtered.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (typeFilter !== 'all') filtered = filtered.filter(d => d.type === typeFilter);
    if (statusFilter !== 'all') filtered = filtered.filter(d => d.status === statusFilter);
    setFilteredDocuments(filtered);
  }, [documents, searchTerm, typeFilter, statusFilter]);

  const handleAddDocument = async (data: Omit<Document, 'id' | 'company_id'>) => {
    await addItem(data as Omit<Document, 'id'>);
    setShowModal(false);
  };

  const handleEditDocument = async (data: Omit<Document, 'id' | 'company_id'>) => {
    if (editingDocument) {
      await updateItem(editingDocument.id, data);
      setEditingDocument(null);
      setShowModal(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Esta seguro de que desea eliminar este documento?')) {
      await deleteItem(id);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'valid') return 'bg-green-100 text-green-800';
    if (status === 'expiring') return 'bg-yellow-100 text-yellow-800';
    if (status === 'expired') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'valid') return 'Vigente';
    if (status === 'expiring') return 'Por Vencer';
    if (status === 'expired') return 'Vencido';
    return status;
  };

  const getTypeLabel = (type: string) => {
    if (type === 'insurance') return 'Seguro';
    if (type === 'registration') return 'Registro';
    if (type === 'permit') return 'Permiso';
    if (type === 'technical-review') return 'Rev. Tecnica';
    return 'Otro';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'technical-review' || type === 'insurance') return <Shield className="text-blue-500" size={20} />;
    return <FileText className="text-gray-500" size={20} />;
  };

  const stats = {
    total: documents.length,
    valid: documents.filter(d => d.status === 'valid').length,
    expiring: documents.filter(d => d.status === 'expiring').length,
    expired: documents.filter(d => d.status === 'expired').length,
    technicalReviews: documents.filter(d => d.type === 'technical-review').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de Documentos</h1>
          <p className="text-gray-600">Administra los documentos de la flota</p>
        </div>
        <button onClick={() => { setEditingDocument(null); setShowModal(true); }} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} className="mr-2" /> Agregar Documento
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200"><p className="text-sm text-gray-600">Total</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div>
        <div className="bg-white rounded-lg p-4 border border-gray-200"><p className="text-sm text-gray-600">Vigentes</p><p className="text-2xl font-bold text-green-600">{stats.valid}</p></div>
        <div className="bg-white rounded-lg p-4 border border-gray-200"><p className="text-sm text-gray-600">Por Vencer</p><p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p></div>
        <div className="bg-white rounded-lg p-4 border border-gray-200"><p className="text-sm text-gray-600">Vencidos</p><p className="text-2xl font-bold text-red-600">{stats.expired}</p></div>
        <div className="bg-white rounded-lg p-4 border border-gray-200"><p className="text-sm text-gray-600">Rev. Tecnicas</p><p className="text-2xl font-bold text-blue-600">{stats.technicalReviews}</p></div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar documentos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos los tipos</option>
              <option value="insurance">Seguro</option>
              <option value="registration">Registro</option>
              <option value="permit">Permiso</option>
              <option value="technical-review">Rev. Tecnica</option>
              <option value="other">Otro</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos</option>
              <option value="valid">Vigente</option>
              <option value="expiring">Por Vencer</option>
              <option value="expired">Vencido</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(doc.type)}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{getTypeLabel(doc.type)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>{getStatusLabel(doc.status)}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Vencimiento:</span>
                  <span className="ml-2">{new Date(doc.expiry_date).toLocaleDateString()}</span>
                </div>
                {doc.vehicle_id && <div className="flex items-center text-sm text-gray-600"><span className="font-medium">Vehiculo:</span><span className="ml-2">{doc.vehicle_id}</span></div>}
                {doc.driver_id && <div className="flex items-center text-sm text-gray-600"><span className="font-medium">Conductor:</span><span className="ml-2">{doc.driver_id}</span></div>}
              </div>

              <div className="flex justify-between space-x-2">
                <button onClick={() => alert(`Descargando: ${doc.name}`)} className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download size={16} className="mr-1" /> Descargar
                </button>
                <button onClick={() => { setEditingDocument(doc); setShowModal(true); }} className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit size={16} className="mr-1" /> Editar
                </button>
                <button onClick={() => handleDeleteDocument(doc.id)} className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} className="mr-1" /> Eliminar
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
          <p className="text-gray-600">{searchTerm || typeFilter !== 'all' || statusFilter !== 'all' ? 'Ajusta los filtros' : 'Agrega tu primer documento'}</p>
        </div>
      )}

      <DocumentModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingDocument(null); }} onSave={editingDocument ? handleEditDocument : handleAddDocument} document={editingDocument} companyId={companyId} />
    </div>
  );
}
