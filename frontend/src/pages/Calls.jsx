import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalls, fetchCallById } from '../redux/slices/callSlice';
import { analyzeCallById } from '../redux/slices/aiSlice';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { Phone, Calendar, Clock, BrainCircuit, Play, Pause, Sparkles } from 'lucide-react';

const Calls = () => {
  const dispatch = useDispatch();
  const { calls, loading, selectedCall } = useSelector((state) => state.calls);
  const { analysisResult, loading: aiLoading } = useSelector((state) => state.ai);
  
  const [detailOpen, setDetailOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    dispatch(fetchCalls());
  }, [dispatch]);

  const handleOpenDetail = async (call) => {
    setDetailOpen(true);
    setIsPlaying(false);
    dispatch(fetchCallById(call._id));
    dispatch(analyzeCallById(call._id));
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 m-0">Call History CRM</h1>
          <p className="text-xs text-zinc-500">Listen, analyze, and review transcripts of automated AI dialer sessions</p>
        </div>
      </div>

      <Table
        headers={['Candidate', 'Call Type', 'Duration (secs)', 'Status', 'Date', 'Intelligence', 'Actions']}
        data={calls}
        loading={loading}
        emptyMessage="No calls registered in this company workspace."
        renderRow={(call) => (
          <tr key={call._id} className="hover:bg-zinc-900/40 transition-colors">
            <td className="px-6 py-4">
              <span className="font-semibold text-zinc-100 block">
                {call.candidateId?.name || 'Unknown Candidate'}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">ID: {call.candidateId?._id || '-'}</span>
            </td>
            <td className="px-6 py-4">
              <Badge variant="default">{call.callType}</Badge>
            </td>
            <td className="px-6 py-4 font-mono text-zinc-300">{call.duration || 0}s</td>
            <td className="px-6 py-4">
              <Badge>{call.callStatus}</Badge>
            </td>
            <td className="px-6 py-4 text-xs text-zinc-400">
              {new Date(call.createdAt).toLocaleDateString()} {new Date(call.createdAt).toLocaleTimeString()}
            </td>
            <td className="px-6 py-4">
              {call.aiSummary ? (
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" /> AI Processed
                </div>
              ) : (
                <span className="text-xs text-zinc-500">Not analyzed</span>
              )}
            </td>
            <td className="px-6 py-4">
              <Button size="sm" variant="secondary" onClick={() => handleOpenDetail(call)}>
                Review Call
              </Button>
            </td>
          </tr>
        )}
      />

      {/* Review Call Details Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Call Audit & AI Analysis" size="lg">
        {!selectedCall ? (
          <div className="py-12 flex items-center justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Candidate summary bar */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/10 rounded-lg border border-purple-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-200">{selectedCall.candidateId?.name}</h4>
                  <p className="text-xs text-zinc-500">{selectedCall.candidateId?.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Clock className="w-4 h-4 text-zinc-500" /> Duration: <strong className="text-zinc-300">{selectedCall.duration || 0}s</strong>
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Calendar className="w-4 h-4 text-zinc-500" /> Date: <strong className="text-zinc-300">{new Date(selectedCall.createdAt).toLocaleDateString()}</strong>
                </span>
              </div>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="p-4 glass-panel border border-zinc-800 rounded-xl flex items-center justify-between gap-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              {/* Animated waveform visualizer bars */}
              <div className="flex-1 flex items-end gap-1 h-10">
                {Array.from({ length: 30 }).map((_, i) => {
                  const delay = i * 0.05;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-purple-500/20 rounded-full transition-all duration-200"
                      style={{
                        height: isPlaying ? `${Math.floor(Math.random() * 32) + 8}px` : '4px',
                        backgroundColor: isPlaying ? '#a855f7' : 'rgba(255,255,255,0.08)',
                        animation: isPlaying ? `pulse-glow 1.2s infinite ease-in-out` : 'none',
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
              </div>
              <span className="text-xs text-zinc-500 font-mono">00:00 / {selectedCall.duration || 0}s</span>
            </div>

            {/* Transcript & AI Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Call Transcript */}
              <div className="flex flex-col gap-3">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Transcript Log</h5>
                <div className="bg-[#12131a] border border-zinc-850 p-4 rounded-xl h-64 overflow-y-auto text-xs space-y-3 font-mono text-zinc-300">
                  {selectedCall.transcript ? (
                    selectedCall.transcript.split('\n').map((line, idx) => (
                      <p key={idx} className="leading-relaxed border-l-2 border-purple-500/40 pl-2">
                        {line}
                      </p>
                    ))
                  ) : (
                    <span className="text-zinc-600 italic">No transcript recorded for this session.</span>
                  )}
                </div>
              </div>

              {/* AI Agent Analytics */}
              <div className="flex flex-col gap-3">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse-glow" /> AI Intelligence Analysis
                </h5>
                <div className="bg-[#12131a] border border-zinc-850 p-4 rounded-xl h-64 overflow-y-auto space-y-4">
                  {aiLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader size="sm" />
                    </div>
                  ) : analysisResult ? (
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                          Call Summary
                        </span>
                        <p className="text-zinc-200 leading-relaxed bg-zinc-900/50 p-2.5 rounded border border-zinc-800">
                          {analysisResult.summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-900/50 p-2.5 rounded border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                            Candidate Score
                          </span>
                          <span className="text-base font-bold text-purple-400">
                            {analysisResult.candidateScore || analysisResult.score || '85'}%
                          </span>
                        </div>
                        <div className="bg-zinc-900/50 p-2.5 rounded border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                            Sentiment Analysis
                          </span>
                          <Badge>{analysisResult.sentiment || 'Positive'}</Badge>
                        </div>
                      </div>

                      <div className="bg-zinc-900/50 p-2.5 rounded border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                          AI Next-Step Recommendation
                        </span>
                        <p className="font-semibold text-emerald-400">
                          {analysisResult.recommendation || 'Schedule Technical Interview'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <p className="text-xs text-zinc-500">No AI data cached for this call</p>
                      <Button size="sm" className="mt-3" onClick={() => dispatch(analyzeCallById(selectedCall._id))}>
                        Generate AI Analysis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calls;
