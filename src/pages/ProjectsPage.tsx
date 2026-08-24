import React, { useState, useEffect } from 'react';
import { Project } from '../types/database.js';
import { Building, CheckCircle2, Clock, MapPin, ChevronRight, FileText, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { DocumentViewerModal } from '../components/public/DocumentViewerModal.js';

interface ProjectsPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (serviceSlug?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'COMMERCIAL' | 'RESIDENTIAL' | 'INDUSTRIAL'>('ALL');
  const [selectedHandoverId, setSelectedHandoverId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filterType !== 'ALL' && p.type !== filterType) return false;
    return true;
  });

  return (
    <div id="projects-page" className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-[#07111F] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">Engineering Projects</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Delivered Infrastructure</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
                Project Tracking & Case Studies
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Review milestone progression, installation schematics, and commissioning reports for commercial towers, luxury estates, and industrial plants in Ethiopia.
              </p>
            </div>

            <button
              onClick={() => onOpenQuoteModal()}
              className="self-start md:self-auto px-6 py-3.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Submit New Project RFP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          {(['ALL', 'COMMERCIAL', 'RESIDENTIAL', 'INDUSTRIAL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === tab
                  ? 'bg-[#07111F] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Engineering Projects' : `${tab} Facilities`}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        {loading ? (
          <div className="py-24 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-3 border-[#1F6FEB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading project milestone records...
          </div>
        ) : (
          <div className="space-y-8 mt-8">
            {filteredProjects.map(project => {
              const isCompleted = project.status === 'COMPLETED';
              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 hover:border-slate-300 transition-all"
                >
                  {/* Left Column: Metadata & Details */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {project.projectNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {project.type}
                        </span>
                      </div>

                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {project.status} ({project.progressPercentage}%)
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">{project.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1F6FEB]" />
                        <span>{project.location}</span>
                        <span>• Customer: {project.customerName}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Scope Items */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                        Scope of Work & Installed Assets:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                        {project.scopeOfWork.map((scope, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{scope}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar & Assigned Staff */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700">Milestone Progression:</span>
                        <span className="font-mono font-bold text-[#1F6FEB]">{project.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1F6FEB] to-emerald-500 transition-all duration-500"
                          style={{ width: `${project.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600">
                        <UserCheck className="w-4 h-4 text-[#1F6FEB]" />
                        <span>Lead Field Engineer: <strong className="text-slate-900">{project.assignedTechnicianNames?.join(', ') || 'Dawit Bekele'}</strong></span>
                      </div>

                      {isCompleted && (
                        <button
                          onClick={() => setSelectedHandoverId(project.id)}
                          className="px-4 py-2 bg-[#07111F] hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#1F6FEB]" />
                          <span>View Handover Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Live Milestones List */}
                  <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Engineering Milestones & Staging
                      </h4>

                      <div className="space-y-2.5 text-xs">
                        {project.milestones.map((m, idx) => {
                          const isDone = m.status === 'COMPLETED';
                          const isCurrent = m.status === 'IN_PROGRESS';
                          return (
                            <div
                              key={m.id || idx}
                              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                isDone
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                  : isCurrent
                                  ? 'bg-blue-50 border-[#1F6FEB]/40 text-blue-950 ring-1 ring-[#1F6FEB]/20'
                                  : 'bg-white border-slate-200 text-slate-500'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : isCurrent ? (
                                  <div className="w-4 h-4 rounded-full border-2 border-[#1F6FEB] border-t-transparent animate-spin" />
                                ) : (
                                  <Clock className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold leading-tight truncate">{m.title}</div>
                                <div className="text-[10px] opacity-75 mt-0.5">
                                  Status: {m.status} {m.dueDate && `• Due: ${m.dueDate}`}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Budget Valued at ETB {project.budget?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Handover Document Viewer */}
      {selectedHandoverId && (
        <DocumentViewerModal
          isOpen={!!selectedHandoverId}
          onClose={() => setSelectedHandoverId(null)}
          type="PROJECT_HANDOVER"
          dataId={selectedHandoverId}
        />
      )}
    </div>
  );
};
