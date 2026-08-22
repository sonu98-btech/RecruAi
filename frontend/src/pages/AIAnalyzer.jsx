import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeTranscript, clearAnalysisResult } from '../redux/slices/aiSlice';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { Brain, FileText, CheckCircle, BarChart, Sparkles } from 'lucide-react';

const AIAnalyzer = () => {
  const dispatch = useDispatch();
  const [transcriptText, setTranscriptText] = useState('');
  const { analysisResult, loading, error } = useSelector((state) => state.ai);

  const handleAnalyze = () => {
    if (!transcriptText.trim()) return;
    dispatch(analyzeTranscript(transcriptText));
  };

  const handleClear = () => {
    setTranscriptText('');
    dispatch(clearAnalysisResult());
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-zinc-100 m-0">AI Call Assistant</h1>
        <p className="text-xs text-zinc-500">Run manual analysis on conversational texts, email threads, or speech-to-text transcripts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input box */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" /> Enter Call Transcript
            </label>
            <textarea
              placeholder="Paste candidate conversation transcripts here. E.g. 'Candidate Priya has 5 years React experience, is currently in Bangalore, wants 15 LPA. Highly articulate, answered state-management questions easily.'"
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              rows={12}
              className="w-full bg-[#12131a] border border-zinc-800 focus:border-purple-500 rounded-xl p-4 text-zinc-200 placeholder-zinc-700 outline-none transition-all text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={!transcriptText.trim() || loading}
              icon={Sparkles}
            >
              {loading ? 'Analyzing...' : 'Analyze Call Transcript'}
            </Button>
            {analysisResult && (
              <Button variant="secondary" onClick={handleClear}>
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-400 animate-pulse-glow" /> AI Intelligence Output
          </h5>

          {loading ? (
            <div className="glass-panel border border-zinc-800 rounded-xl p-10 flex flex-col items-center justify-center gap-3 min-h-[300px]">
              <Loader size="md" />
              <p className="text-xs text-zinc-400 animate-pulse">Running semantic models...</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4">
              {/* Score card */}
              <Card hoverable={false} className="border-purple-500/25">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Candidate Fit Score</span>
                    <h3 className="text-3xl font-extrabold text-purple-400 mt-1">{analysisResult.candidateScore || 85}%</h3>
                  </div>
                  <BarChart className="w-8 h-8 text-purple-500/20" />
                </div>
              </Card>

              {/* Sentiment Card */}
              <Card hoverable={false}>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Candidate Sentiment</span>
                <div className="mt-2">
                  <Badge>{analysisResult.sentiment || 'Positive'}</Badge>
                </div>
              </Card>

              {/* Recommendation Card */}
              <Card hoverable={false} className="border-emerald-500/25">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">AI Recommendation</span>
                <p className="text-sm font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {analysisResult.recommendation || 'Schedule Technical Interview'}
                </p>
              </Card>

              {/* Summary description */}
              <div className="glass-panel border border-zinc-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Semantic Synthesis</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-panel border border-zinc-800 rounded-xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center text-zinc-500">
              <Sparkles className="w-8 h-8 text-zinc-700 mb-2" />
              <p className="text-xs">Submit a transcript on the left to see LLM synthesis, candidate fit scores, and sentiment analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyzer;
