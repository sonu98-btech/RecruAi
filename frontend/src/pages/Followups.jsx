import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { followupApi } from '../services/dashboard.api';
import { candidateApi } from '../services/candidate.api';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { Plus, CheckSquare, Clock } from 'lucide-react';

const Followups = () => {
  const [followups, setFollowups] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
    fetchCandidates();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await followupApi.getAll();
      if (res.success) {
        setFollowups(res.data?.items || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await candidateApi.getAll({ limit: 100 });
      if (res.success) {
        setCandidates(res.data?.items || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (e) {}
  };

  const handleAddSubmit = async (data) => {
    try {
      const res = await followupApi.create(data);
      if (res.success) {
        setIsAddOpen(false);
        reset();
        fetchData();
      }
    } catch (e) {
      alert('Error creating reminder');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = item.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
      const res = await followupApi.update(item._id, { status: newStatus });
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 m-0">Follow-up Management</h1>
          <p className="text-xs text-zinc-500">Track and schedule call reminders, followups, and screening timelines</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Reminder
        </Button>
      </div>

      <Table
        headers={['Candidate', 'Assigned Task', 'Reminder Date', 'Status', 'Actions']}
        data={followups}
        loading={loading}
        emptyMessage="No reminders scheduled."
        renderRow={(item) => (
          <tr key={item._id} className="hover:bg-zinc-900/40 transition-colors">
            <td className="px-6 py-4 font-semibold text-zinc-100">
              {item.candidateId?.name || 'Unknown Candidate'}
            </td>
            <td className="px-6 py-4 text-zinc-300 font-medium">{item.task}</td>
            <td className="px-6 py-4 text-xs text-zinc-400 font-mono">
              {new Date(item.reminderDate).toLocaleDateString()} {new Date(item.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </td>
            <td className="px-6 py-4">
              <Badge>{item.status}</Badge>
            </td>
            <td className="px-6 py-4">
              <Button
                size="sm"
                variant={item.status === 'PENDING' ? 'primary' : 'secondary'}
                onClick={() => handleToggleStatus(item)}
              >
                {item.status === 'PENDING' ? (
                  <>
                    <CheckSquare className="w-4 h-4 mr-1.5" /> Mark Completed
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1.5" /> Mark Pending
                  </>
                )}
              </Button>
            </td>
          </tr>
        )}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule Reminder">
        <form onSubmit={handleSubmit(handleAddSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Select Candidate</label>
            <select
              {...register('candidateId', { required: 'Candidate is required' })}
              className="w-full bg-[#12131a] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-purple-500"
            >
              <option value="">-- Choose Candidate --</option>
              {candidates.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
            {errors.candidateId && <span className="text-xs text-red-400 font-semibold">{errors.candidateId.message}</span>}
          </div>

          <Input label="Task Description" placeholder="Discuss salary expectations & notice period" error={errors.task} {...register('task', { required: 'Task is required' })} />
          
          <Input label="Reminder Date & Time" type="datetime-local" error={errors.reminderDate} {...register('reminderDate', { required: 'Date is required' })} />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit">Schedule Reminder</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Followups;
