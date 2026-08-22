import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { campaignApi } from '../services/dashboard.api';
import { candidateApi } from '../services/candidate.api';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { Plus, Play, Pause, AlertCircle } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
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
      const res = await campaignApi.getAll();
      if (res.success) {
        setCampaigns(res.data?.items || (Array.isArray(res.data) ? res.data : []));
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
      // Map multiple selected candidates
      const payload = {
        ...data,
        candidates: Array.isArray(data.candidates) ? data.candidates : [data.candidates],
      };
      const res = await campaignApi.create(payload);
      if (res.success) {
        setIsAddOpen(false);
        reset();
        fetchData();
      }
    } catch (e) {
      alert('Error creating campaign');
    }
  };

  const handleStartCampaign = async (id) => {
    try {
      const res = await campaignApi.start(id);
      if (res.success) {
        fetchData();
        alert('Campaign started! Outbound calls initiated.');
      }
    } catch (e) {
      alert('Failed to start campaign');
    }
  };

  const handlePauseCampaign = async (id) => {
    try {
      const res = await campaignApi.pause(id);
      if (res.success) {
        fetchData();
        alert('Campaign paused.');
      }
    } catch (e) {
      alert('Failed to pause campaign');
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 m-0">Campaign Dashboard</h1>
          <p className="text-xs text-zinc-500">Launch and track automated outbound screening dialers for candidate pools</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create Campaign
        </Button>
      </div>

      <Table
        headers={['Campaign Name', 'Script Prompt', 'Candidates Pool', 'Status', 'Date Created', 'Actions']}
        data={campaigns}
        loading={loading}
        emptyMessage="No campaigns created yet."
        renderRow={(item) => (
          <tr key={item._id} className="hover:bg-zinc-900/40 transition-colors">
            <td className="px-6 py-4">
              <span className="font-semibold text-zinc-100 block">{item.name}</span>
              <span className="text-xs text-zinc-500">{item.description}</span>
            </td>
            <td className="px-6 py-4 text-zinc-300 max-w-xs truncate">{item.script || '-'}</td>
            <td className="px-6 py-4 font-mono text-xs text-zinc-400">
              {item.candidates?.length || 0} candidates
            </td>
            <td className="px-6 py-4">
              <Badge>{item.status}</Badge>
            </td>
            <td className="px-6 py-4 text-xs text-zinc-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                {item.status !== 'ACTIVE' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStartCampaign(item._id)}
                  >
                    <Play className="w-3.5 h-3.5 mr-1" /> Run
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handlePauseCampaign(item._id)}
                  >
                    <Pause className="w-3.5 h-3.5 mr-1" /> Pause
                  </Button>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Campaign">
        <form onSubmit={handleSubmit(handleAddSubmit)} className="space-y-4">
          <Input label="Campaign Name" placeholder="React Surge Outreach" error={errors.name} {...register('name', { required: 'Name is required' })} />
          <Input label="Description" placeholder="Outreach for screening junior-to-mid candidates" {...register('description')} />
          <Input label="AI Dial Script Prompt" placeholder="Introduce yourself as the AI recruiter and ask candidate about their availability & salary..." error={errors.script} {...register('script', { required: 'Prompt script is required' })} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Select Target Candidates (Ctrl+Click to choose multiple)</label>
            <select
              multiple
              {...register('candidates', { required: 'Choose at least one candidate' })}
              className="w-full bg-[#12131a] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-200 outline-none h-32 focus:border-purple-500"
            >
              {candidates.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.skills?.join(', ') || 'No skills listed'})
                </option>
              ))}
            </select>
            {errors.candidates && <span className="text-xs text-red-400 font-semibold">{errors.candidates.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit">Create Campaign</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Campaigns;
