import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchClients, addClient, updateClient, deleteClient } from '../redux/slices/clientSlice';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, loading } = useSelector((state) => state.clients);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm();

  useEffect(() => {
    dispatch(fetchClients({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleAddSubmit = async (data) => {
    const res = await dispatch(addClient(data));
    if (res.meta.requestStatus === 'fulfilled') {
      setIsAddOpen(false);
      reset();
    }
  };

  const handleEditSubmit = async (data) => {
    const res = await dispatch(updateClient({ id: editingClient._id, data }));
    if (res.meta.requestStatus === 'fulfilled') {
      setIsEditOpen(false);
      setEditingClient(null);
    }
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    resetEdit({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      requirements: client.requirements || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this client?')) {
      dispatch(deleteClient(id));
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 m-0">Client Directory</h1>
          <p className="text-xs text-zinc-500">Manage hiring companies, contacts, and contract requirements</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Client
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md w-full glass-panel border border-zinc-800 p-2.5 rounded-xl">
        <Input
          placeholder="Search by company or contact name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Table
        headers={['Company', 'Contact Person', 'Email', 'Phone', 'Requirements', 'Actions']}
        data={clients}
        loading={loading}
        emptyMessage="No clients added yet."
        renderRow={(client) => (
          <tr key={client._id} className="hover:bg-zinc-900/40 transition-colors">
            <td className="px-6 py-4 font-semibold text-zinc-100">{client.companyName}</td>
            <td className="px-6 py-4 text-zinc-300 font-medium">{client.contactPerson}</td>
            <td className="px-6 py-4 text-zinc-400">{client.email}</td>
            <td className="px-6 py-4 text-zinc-500">{client.phone}</td>
            <td className="px-6 py-4 text-zinc-300 max-w-xs truncate">{client.requirements || '-'}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(client)}
                  className="p-1.5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(client._id)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add Client Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Client">
        <form onSubmit={handleSubmit(handleAddSubmit)} className="space-y-4">
          <Input label="Company Name" placeholder="Acme Systems" error={errors.companyName} {...register('companyName', { required: 'Company name is required' })} />
          <Input label="Contact Person" placeholder="Priya Sharma" error={errors.contactPerson} {...register('contactPerson', { required: 'Contact person is required' })} />
          <Input label="Email" type="email" placeholder="priya@acmesystems.com" error={errors.email} {...register('email', { required: 'Email is required' })} />
          <Input label="Phone" placeholder="+919876543211" error={errors.phone} {...register('phone')} />
          <Input label="Requirements" placeholder="Looking for Senior Node Developers" {...register('requirements')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit">Save Client</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditingClient(null); }} title="Edit Client">
        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4">
          <Input label="Company Name" error={errorsEdit.companyName} {...registerEdit('companyName', { required: 'Company name is required' })} />
          <Input label="Contact Person" error={errorsEdit.contactPerson} {...registerEdit('contactPerson', { required: 'Contact person is required' })} />
          <Input label="Email" type="email" error={errorsEdit.email} {...registerEdit('email', { required: 'Email is required' })} />
          <Input label="Phone" error={errorsEdit.phone} {...registerEdit('phone')} />
          <Input label="Requirements" {...registerEdit('requirements')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit">Update Details</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
