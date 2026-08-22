import React, { useState, useEffect } from 'react';
import { useCandidates } from '../hooks/useCandidates';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import { Search, Plus, Edit2, Trash2, PhoneOutgoing, Eye, Upload } from 'lucide-react';
import { triggerCall } from '../redux/slices/callSlice';
import { useDispatch } from 'react-redux';
import { candidateApi } from '../services/candidate.api';

const Candidates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { candidates, totalPages, currentPage, loading, getCandidates, createCandidate, editCandidate, removeCandidate } = useCandidates();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm();

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  const fetchData = () => {
    getCandidates({
      search: searchTerm,
      status: statusFilter,
      page,
      limit: 10,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleAddSubmit = async (data) => {
    // skills can be comma separated
    const formattedData = {
      ...data,
      skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      experience: Number(data.experience),
    };
    const res = await createCandidate(formattedData);
    if (res.meta.requestStatus === 'fulfilled') {
      setIsAddOpen(false);
      reset();
    }
  };

  const handleEditSubmit = async (data) => {
    const formattedData = {
      ...data,
      skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      experience: Number(data.experience),
    };
    const res = await editCandidate(editingCandidate._id, formattedData);
    if (res.meta.requestStatus === 'fulfilled') {
      setIsEditOpen(false);
      setEditingCandidate(null);
    }
  };

  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);
    resetEdit({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      skills: candidate.skills?.join(', ') || '',
      experience: candidate.experience,
      status: candidate.status,
      source: candidate.source || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      removeCandidate(id);
    }
  };

  const handleInitiateCall = async (candidate) => {
    if (window.confirm(`Initiate outbound AI automated screening call to ${candidate.name}?`)) {
      try {
        const action = await dispatch(triggerCall({
          candidateId: candidate._id,
          callType: 'OUTBOUND',
          transcript: `[System] Outbound call auto-initiated. Simulating AI recruiter conversation...`,
        }));
        if (action.meta.requestStatus === 'fulfilled') {
          alert('Call triggered successfully!');
          navigate('/calls');
        }
      } catch (err) {
        alert('Failed to trigger call');
      }
    }
  };

  const handleResumeUpload = async (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await candidateApi.uploadResume(id, file);
      alert('Resume uploaded successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to upload resume');
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 m-0">Candidates Database</h1>
          <p className="text-xs text-zinc-500">Manage candidate profiles, resumes, and automated phone screenings</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Candidate
        </Button>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel border border-zinc-800 p-4 rounded-xl">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <Input
            placeholder="Search candidates by name, email, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#12131a] border border-zinc-800 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="SCREENING">Screening</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidate Table */}
      <Table
        headers={['Name', 'Contact', 'Skills', 'Experience', 'Status', 'Resume', 'Actions']}
        data={candidates}
        loading={loading}
        emptyMessage="No candidates matching filters found."
        renderRow={(candidate) => (
          <tr key={candidate._id} className="hover:bg-zinc-900/40 transition-colors">
            <td className="px-6 py-4 font-semibold text-zinc-100">{candidate.name}</td>
            <td className="px-6 py-4">
              <div className="text-xs space-y-0.5">
                <p className="text-zinc-300">{candidate.email}</p>
                <p className="text-zinc-500">{candidate.phone}</p>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                {candidate.skills?.map((s, idx) => (
                  <span key={idx} className="bg-zinc-800 text-[10px] text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/50">
                    {s}
                  </span>
                )) || <span className="text-zinc-600">-</span>}
              </div>
            </td>
            <td className="px-6 py-4 font-medium text-zinc-300">{candidate.experience} yrs</td>
            <td className="px-6 py-4">
              <Badge>{candidate.status}</Badge>
            </td>
            <td className="px-6 py-4">
              {candidate.resumeUrl ? (
                <a
                  href={`http://localhost:5001${candidate.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-zinc-300 hover:text-white underline font-medium"
                >
                  View PDF
                </a>
              ) : (
                <label className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer font-medium flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleResumeUpload(candidate._id, e)}
                  />
                </label>
              )}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInitiateCall(candidate)}
                  title="Call Candidate"
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 rounded-lg transition-colors"
                >
                  <PhoneOutgoing className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(candidate)}
                  title="Edit Candidate"
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors border border-zinc-700/50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(candidate._id)}
                  title="Delete Candidate"
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Add Candidate Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Candidate">
        <form onSubmit={handleSubmit(handleAddSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Aisha Khan" error={errors.name} {...register('name', { required: 'Name is required' })} />
          <Input label="Email" type="email" placeholder="aisha@example.com" error={errors.email} {...register('email', { required: 'Email is required' })} />
          <Input label="Phone" placeholder="+919876543210" error={errors.phone} {...register('phone', { required: 'Phone is required' })} />
          <Input label="Skills (comma-separated)" placeholder="React, Node.js, AWS" {...register('skills')} />
          <Input label="Experience (years)" type="number" placeholder="3" error={errors.experience} {...register('experience')} />
          <Input label="Source" placeholder="Naukri, LinkedIn, Referral" {...register('source')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit">Save Candidate</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Candidate Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditingCandidate(null); }} title="Edit Candidate">
        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4">
          <Input label="Full Name" error={errorsEdit.name} {...registerEdit('name', { required: 'Name is required' })} />
          <Input label="Email" type="email" error={errorsEdit.email} {...registerEdit('email', { required: 'Email is required' })} />
          <Input label="Phone" error={errorsEdit.phone} {...registerEdit('phone', { required: 'Phone is required' })} />
          <Input label="Skills (comma-separated)" {...registerEdit('skills')} />
          <Input label="Experience (years)" type="number" error={errorsEdit.experience} {...registerEdit('experience')} />
          <Input label="Source" {...registerEdit('source')} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Status</label>
            <select
              {...registerEdit('status')}
              className="w-full bg-[#12131a] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none"
            >
              <option value="NEW">NEW</option>
              <option value="SCREENING">SCREENING</option>
              <option value="INTERVIEW">INTERVIEW</option>
              <option value="SELECTED">SELECTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit">Update Details</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Candidates;
