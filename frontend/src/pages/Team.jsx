import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { teamApi } from '../services/team.api';
import { useAuth } from '../hooks/useAuth';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { Plus, UserPlus, ShieldCheck } from 'lucide-react';

const Team = () => {
  const { role } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const isAuthorized = ['SUPER_ADMIN', 'COMPANY_ADMIN'].includes(role);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getAll();
      if (res.success) {
        setMembers(res.data?.items || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (data) => {
    try {
      const res = await teamApi.create(data);
      if (res.success) {
        setIsAddOpen(false);
        reset();
        fetchData();
        alert('Team member registered successfully!');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Error registering team member');
    }
  };

  const handleToggleStatus = async (member) => {
    if (!isAuthorized) return;
    try {
      const nextStatus = !member.isActive;
      const res = await teamApi.update(member._id, { isActive: nextStatus });
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#09090b]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-bold text-zinc-100 uppercase tracking-wider m-0">Team Settings</h1>
          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Manage system users, recruiters, and agents</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsAddOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        )}
      </div>

      <Table
        headers={['Name', 'Email', 'Phone', 'Role', 'Status', 'Actions']}
        data={members}
        loading={loading}
        emptyMessage="No team members registered yet."
        renderRow={(member) => (
          <tr key={member._id} className="hover:bg-zinc-900/40 transition-colors">
            <td className="px-6 py-4 font-semibold text-zinc-100">{member.name}</td>
            <td className="px-6 py-4 text-zinc-300 font-mono text-xs">{member.email}</td>
            <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{member.phone || '-'}</td>
            <td className="px-6 py-4">
              <Badge>{member.role}</Badge>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                member.isActive 
                  ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/20' 
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}>
                {member.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4">
              {isAuthorized ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleToggleStatus(member)}
                >
                  {member.isActive ? 'Suspend' : 'Activate'}
                </Button>
              ) : (
                <span className="text-zinc-600 text-xs italic">No actions available</span>
              )}
            </td>
          </tr>
        )}
      />

      {/* Add Team Member Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Team Member">
        <form onSubmit={handleSubmit(handleAddSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Ravi Recruiter" error={errors.name} {...register('name', { required: 'Name is required' })} />
          <Input label="Email Address" type="email" placeholder="ravi@company.com" error={errors.email} {...register('email', { required: 'Email is required' })} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
          <Input label="Phone Number" placeholder="+919876543212" error={errors.phone} {...register('phone')} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Assigned Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full bg-[#12131a] border border-zinc-850 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-700"
            >
              <option value="RECRUITER">RECRUITER</option>
              <option value="AGENT">AGENT</option>
            </select>
            {errors.role && <span className="text-xs text-red-400 font-semibold">{errors.role.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;
