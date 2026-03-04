import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Users, 
  Rocket, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  RefreshCw,
  ChevronRight,
  LayoutDashboard,
  FileText,
  PieChart,
  Target,
  Zap
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  Language, 
  TeamInfo, 
  UserStory, 
  ElevatorPitchInput, 
  SimulationResult,
  AppState,
  InnovationReport
} from './types';
import { translations } from './translations';
import { generateSimulation, generateFullReport } from './services/geminiService';

export default function App() {
  const [state, setState] = useState<AppState>({
    language: 'en',
    step: 0, // 0: Lang, 1: Team, 2: Step1, 3: Step2, 4: Result
    teamInfo: null,
    userStory: null,
    elevatorPitch: null,
    result: null,
    report: null,
    isGenerating: false,
    isGeneratingReport: false,
  });

  const t = translations[state.language];

  const handleLanguageSelect = (lang: Language) => {
    setState(prev => ({ ...prev, language: lang, step: 1 }));
  };

  const handleTeamSubmit = (info: TeamInfo) => {
    setState(prev => ({ ...prev, teamInfo: info, step: 2 }));
  };

  const handleUserStorySubmit = (story: UserStory) => {
    setState(prev => ({ ...prev, userStory: story, step: 3 }));
  };

  const handleElevatorPitchSubmit = async (pitch: ElevatorPitchInput) => {
    setState(prev => ({ ...prev, elevatorPitch: pitch, isGenerating: true }));
    try {
      const result = await generateSimulation(
        state.language,
        state.teamInfo!,
        state.userStory!,
        pitch
      );
      setState(prev => ({ ...prev, result, isGenerating: false, step: 4 }));
    } catch (error) {
      console.error("Generation failed:", error);
      setState(prev => ({ ...prev, isGenerating: false }));
      alert("AI Generation failed. Please try again.");
    }
  };

  const handleRegenerate = async () => {
    if (!state.elevatorPitch) return;
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const result = await generateSimulation(
        state.language,
        state.teamInfo!,
        state.userStory!,
        state.elevatorPitch
      );
      setState(prev => ({ ...prev, result, isGenerating: false }));
    } catch (error) {
      console.error("Regeneration failed:", error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleGenerateReport = async () => {
    if (!state.result) return;
    setState(prev => ({ ...prev, isGeneratingReport: true }));
    try {
      const report = await generateFullReport(
        state.language,
        state.teamInfo!,
        state.userStory!,
        state.elevatorPitch!,
        state.result
      );
      setState(prev => ({ ...prev, report, isGeneratingReport: false }));
    } catch (error) {
      console.error("Report generation failed:", error);
      setState(prev => ({ ...prev, isGeneratingReport: false }));
      alert("Report generation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Persistent Header */}
      {state.step > 0 && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Globe className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">{t.title}</h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.subtitle}</p>
              </div>
            </div>
            {state.teamInfo && (
              <div className="hidden md:flex items-center gap-6 text-sm bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">#</span>
                  <span className="font-semibold">{state.teamInfo.teamNumber}</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{state.teamInfo.country}, {state.teamInfo.city}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              {(['en', 'zh', 'ja'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setState(prev => ({ ...prev, language: lang }))}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    state.language === lang 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {state.step === 0 && (
            <motion.div
              key="lang-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[70vh] text-center"
            >
              <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
                <Globe className="w-20 h-20 text-indigo-600 relative" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight text-slate-900">
                Zero to Global
              </h2>
              <p className="text-slate-500 mb-12 max-w-md text-lg">
                The Executive Innovation Challenge. Build your global business model with AI guidance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                {[
                  { id: 'en', label: 'English', sub: 'Global Standard' },
                  { id: 'zh', label: '繁體中文', sub: 'Traditional Chinese' },
                  { id: 'ja', label: '日本語', sub: 'Japanese' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageSelect(lang.id as Language)}
                    className="group p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all text-left"
                  >
                    <div className="font-bold text-xl mb-1 group-hover:text-indigo-600">{lang.label}</div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-widest">{lang.sub}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {state.step === 1 && (
            <TeamSetupForm t={t} onSubmit={handleTeamSubmit} />
          )}

          {state.step === 2 && (
            <Step1Form t={t} onSubmit={handleUserStorySubmit} />
          )}

          {state.step === 3 && (
            <Step2Form 
              t={t} 
              onSubmit={handleElevatorPitchSubmit} 
              isGenerating={state.isGenerating} 
            />
          )}

          {state.step === 4 && state.result && (
            <Dashboard 
              t={t} 
              result={state.result} 
              report={state.report}
              teamInfo={state.teamInfo!}
              onRegenerate={handleRegenerate}
              onGenerateReport={handleGenerateReport}
              isGenerating={state.isGenerating}
              isGeneratingReport={state.isGeneratingReport}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function TeamSetupForm({ t, onSubmit }: { t: any, onSubmit: (info: TeamInfo) => void }) {
  const [formData, setFormData] = useState<TeamInfo>({
    teamNumber: '',
    country: 'Japan',
    prefecture: '',
    city: '',
    town: ''
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-indigo-100 p-3 rounded-2xl">
          <Users className="text-indigo-600 w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">{t.teamSetup}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.teamNumber}</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.teamNumber}
            onChange={e => setFormData({ ...formData, teamNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.country}</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.prefecture}</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.prefecture}
            onChange={e => setFormData({ ...formData, prefecture: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.city}</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.town}</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.town}
            onChange={e => setFormData({ ...formData, town: e.target.value })}
          />
        </div>
      </div>
      <button
        onClick={() => onSubmit(formData)}
        disabled={!formData.teamNumber}
        className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
      >
        {t.startChallenge}
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

function Step1Form({ t, onSubmit }: { t: any, onSubmit: (story: UserStory) => void }) {
  const [formData, setFormData] = useState<UserStory>({
    targetUser: '',
    coreProblem: '',
    solutionSummary: '',
    desiredOutcome: ''
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-100 p-3 rounded-2xl">
          <Users className="text-emerald-600 w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">{t.step1}</h2>
      </div>
      
      <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
        <p className="text-slate-600 italic leading-relaxed">
          "As a <span className="text-indigo-600 font-bold underline">target user</span>, 
          I want to <span className="text-indigo-600 font-bold underline">specific need</span>, 
          so that I can achieve <span className="text-indigo-600 font-bold underline">desired outcome</span>."
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.targetUser}</label>
          <input
            type="text"
            placeholder="e.g. Small business owners in Tokyo"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.targetUser}
            onChange={e => setFormData({ ...formData, targetUser: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.coreProblem}</label>
          <textarea
            rows={3}
            placeholder="What is the main pain point?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            value={formData.coreProblem}
            onChange={e => setFormData({ ...formData, coreProblem: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.solutionSummary}</label>
          <textarea
            rows={3}
            placeholder="How do you solve it?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            value={formData.solutionSummary}
            onChange={e => setFormData({ ...formData, solutionSummary: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.desiredOutcome}</label>
          <input
            type="text"
            placeholder="What is the ultimate value?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.desiredOutcome}
            onChange={e => setFormData({ ...formData, desiredOutcome: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={() => onSubmit(formData)}
        disabled={!formData.targetUser || !formData.coreProblem || !formData.solutionSummary || !formData.desiredOutcome}
        className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
      >
        {t.submit}
      </button>
    </motion.div>
  );
}

function Step2Form({ t, onSubmit, isGenerating }: { t: any, onSubmit: (pitch: ElevatorPitchInput) => void, isGenerating: boolean }) {
  const [formData, setFormData] = useState<ElevatorPitchInput>({
    for: '',
    who: '',
    product: '',
    that: '',
    unlike: '',
    we: ''
  });

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center"
      >
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
          <RefreshCw className="w-16 h-16 text-indigo-600 animate-spin relative" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t.generating}</h2>
        <p className="text-slate-500">Executing chained backend prompts for strategic analysis...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-indigo-100 p-3 rounded-2xl">
          <Rocket className="text-indigo-600 w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">{t.step2}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">For (Target Segment)</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.for}
              onChange={e => setFormData({ ...formData, for: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Who (Context & Pain Point)</label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.who}
              onChange={e => setFormData({ ...formData, who: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Our Product (One Sentence)</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.product}
              onChange={e => setFormData({ ...formData, product: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">That (Core Value Proposition)</label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.that}
              onChange={e => setFormData({ ...formData, that: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Unlike (Differentiation)</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.unlike}
              onChange={e => setFormData({ ...formData, unlike: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">We (Competitive Advantage)</label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.we}
              onChange={e => setFormData({ ...formData, we: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Preview Pitch</h3>
        <p className="text-slate-700 leading-relaxed">
          For <span className="font-bold">{formData.for || '...'}</span> who <span className="font-bold">{formData.who || '...'}</span>, 
          our product <span className="font-bold">{formData.product || '...'}</span> that <span className="font-bold">{formData.that || '...'}</span>. 
          Unlike <span className="font-bold">{formData.unlike || '...'}</span>, we <span className="font-bold">{formData.we || '...'}</span>.
        </p>
      </div>

      <button
        onClick={() => onSubmit(formData)}
        disabled={Object.values(formData).some(v => !v)}
        className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
      >
        {t.submit} & Generate Strategic Model
      </button>
    </motion.div>
  );
}

function Dashboard({ t, result, report, teamInfo, onRegenerate, onGenerateReport, isGenerating, isGeneratingReport }: { 
  t: any, 
  result: SimulationResult, 
  report: InnovationReport | null,
  teamInfo: TeamInfo,
  onRegenerate: () => void, 
  onGenerateReport: () => void,
  isGenerating: boolean,
  isGeneratingReport: boolean
}) {
  const [activeTab, setActiveTab] = useState(3);

  const tabs = [
    { id: 3, label: t.step3, icon: LayoutDashboard },
    { id: 4, label: t.step4, icon: BarChart3 },
    { id: 5, label: t.step5, icon: Target },
    { id: 7, label: t.step7, icon: TrendingUp },
    { id: 8, label: t.step8, icon: ShieldCheck },
    { id: 9, label: t.step9, icon: FileText },
  ];

  const generatePDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Header
    doc.setFontSize(20);
    doc.text("Business Model Innovation Report", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Team: ${teamInfo.teamNumber} | Country: ${teamInfo.country} | Date: ${timestamp}`, 105, 30, { align: "center" });
    doc.line(20, 35, 190, 35);

    let y = 45;

    const addSection = (title: string, content: string | object) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      if (typeof content === 'string') {
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 10;
      } else {
        Object.entries(content).forEach(([key, val]) => {
          const text = `${key}: ${val}`;
          const lines = doc.splitTextToSize(text, 170);
          doc.text(lines, 20, y);
          y += lines.length * 5 + 2;
        });
        y += 5;
      }
    };

    addSection("1. Executive Overview", report.executiveOverview.pitch);
    addSection("Vision", report.executiveOverview.vision);
    addSection("Thesis", report.executiveOverview.thesis);
    
    addSection("2. Problem & Opportunity Analysis", report.problemAnalysis.painPoints);
    addSection("Gap Analysis", report.problemAnalysis.gapAnalysis);
    addSection("Opportunity Context", report.problemAnalysis.opportunityContext);

    addSection("3. Business Model Design", report.businessModelDesign.bmcSummary);
    addSection("Value Creation", report.businessModelDesign.valueCreation);
    addSection("Positioning", report.businessModelDesign.positioning);

    addSection("4. Financial Model & Sustainability", report.financialSustainability.ltvCocaAnalysis);
    addSection("Projections Summary", report.financialSustainability.projectionsSummary);
    addSection("Risk & Sensitivity", report.financialSustainability.riskSensitivity);

    addSection("5. Strategic Risk Assessment", "");
    addSection("Market Risk", report.strategicRisk.market);
    addSection("Regulatory Risk", report.strategicRisk.regulatory);
    addSection("Operational Risk", report.strategicRisk.operational);
    addSection("Competitive Risk", report.strategicRisk.competitive);

    addSection("6. Growth & Scalability Strategy", report.growthStrategy.domesticPath);
    addSection("International Potential", report.growthStrategy.internationalPotential);
    addSection("Strategic Partnerships", report.growthStrategy.partnerships);

    doc.save(`Innovation_Report_Team_${teamInfo.teamNumber}.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Gamification Layer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ScoreCard 
          label={t.gamification.sustainability} 
          value={result.gamification.sustainabilityScore} 
          icon={ShieldCheck} 
          color="emerald" 
        />
        <ScoreCard 
          label={t.gamification.risk} 
          value={result.gamification.riskLevel} 
          icon={ShieldCheck} 
          color="rose" 
          isInverse
        />
        <ScoreCard 
          label={t.gamification.scalability} 
          value={result.gamification.scalabilityIndex} 
          icon={Globe} 
          color="indigo" 
        />
        <ScoreCard 
          label={t.gamification.feedback} 
          value={result.gamification.aiScore} 
          icon={Zap} 
          color="amber" 
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
          <div className="pt-4">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="text-sm">Regenerate AI</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 3 && (
              <motion.div
                key="tab3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6">{t.step3}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BMCCard title={t.bmc.keyPartners} content={result.bmc.keyPartners} />
                  <BMCCard title={t.bmc.keyActivities} content={result.bmc.keyActivities} />
                  <BMCCard title={t.bmc.valueProposition} content={result.bmc.valueProposition} highlight />
                  <BMCCard title={t.bmc.keyResources} content={result.bmc.keyResources} />
                  <BMCCard title={t.bmc.customerRelationships} content={result.bmc.customerRelationships} />
                  <BMCCard title={t.bmc.customerSegments} content={result.bmc.customerSegments} />
                  <BMCCard title={t.bmc.channels} content={result.bmc.channels} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BMCCard title={t.bmc.costStructure} content={result.bmc.costStructure} />
                  <BMCCard title={t.bmc.revenueStreams} content={result.bmc.revenueStreams} />
                </div>
                
                <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Zap className="text-indigo-600 w-5 h-5" />
                    {t.valueCreation.title}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">{t.valueCreation.create}</div>
                      <p className="text-sm text-slate-600 leading-relaxed">{result.valueCreation.create}</p>
                    </div>
                    <div>
                      <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">{t.valueCreation.deliver}</div>
                      <p className="text-sm text-slate-600 leading-relaxed">{result.valueCreation.deliver}</p>
                    </div>
                    <div>
                      <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">{t.valueCreation.capture}</div>
                      <p className="text-sm text-slate-600 leading-relaxed">{result.valueCreation.capture}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 4 && (
              <motion.div
                key="tab4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6">{t.step4}</h3>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8">
                  <h4 className="font-bold text-indigo-900 mb-2">{t.ltv.explanation}</h4>
                  <p className="text-indigo-800/80 text-sm leading-relaxed">{result.ltv.explanation}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatBox label="ARPU" value={`$${result.ltv.arpu}`} />
                  <StatBox label="Gross Margin" value={`${result.ltv.margin}%`} />
                  <StatBox label="Lifetime" value={`${result.ltv.lifetime} yrs`} />
                  <StatBox label="Total LTV" value={`$${result.ltv.total}`} highlight />
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold mb-4">{t.ltv.calculation}</h4>
                  <p className="font-mono text-sm text-slate-600 whitespace-pre-wrap">{result.ltv.calculation}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 5 && (
              <motion.div
                key="tab5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6">{t.step5}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="font-bold mb-2">{t.coca.definition}</h4>
                      <p className="text-sm text-slate-600">{result.coca.definition}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="font-bold mb-2">{t.coca.assumptions}</h4>
                      <p className="text-sm text-slate-600">{result.coca.assumptions}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-12 bg-indigo-600 rounded-3xl text-white text-center">
                    <Target className="w-12 h-12 mb-4 opacity-50" />
                    <div className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">{t.coca.cost}</div>
                    <div className="text-6xl font-black">${result.coca.cost}</div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">{t.step6}</h3>
                  <div className="flex items-center gap-8 p-8 bg-slate-900 rounded-3xl text-white">
                    <div className="text-center">
                      <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Ratio</div>
                      <div className="text-5xl font-black text-indigo-400">{result.ltvCocaRatio.toFixed(1)}x</div>
                    </div>
                    <div className="w-px h-16 bg-slate-700" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Interpretation</div>
                      <div className={`text-xl font-bold ${
                        result.ltvCocaRatio > 3 ? 'text-emerald-400' : result.ltvCocaRatio > 1 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {result.ltvCocaRatio > 3 ? t.ratio.healthy : result.ltvCocaRatio > 1 ? t.ratio.moderate : t.ratio.risky}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 7 && (
              <motion.div
                key="tab7"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6">{t.step7}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-4 font-bold text-slate-400 uppercase text-xs tracking-wider">Year</th>
                        <th className="py-4 font-bold text-slate-400 uppercase text-xs tracking-wider">Revenue</th>
                        <th className="py-4 font-bold text-slate-400 uppercase text-xs tracking-wider">Costs</th>
                        <th className="py-4 font-bold text-slate-400 uppercase text-xs tracking-wider">Cash Flow</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.financials.table.map(row => (
                        <tr key={row.year} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                          <td className="py-4 font-bold">Year {row.year}</td>
                          <td className="py-4 text-slate-600">${row.revenue.toLocaleString()}</td>
                          <td className="py-4 text-slate-600">${row.costs.toLocaleString()}</td>
                          <td className={`py-4 font-bold ${row.cashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ${row.cashFlow.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <StatBox label={t.financials.payback} value={`${result.financials.paybackPeriod} yrs`} />
                  <StatBox label={t.financials.roi} value={`${result.financials.roi}%`} />
                  <StatBox label={t.financials.npv} value={`$${result.financials.npv.toLocaleString()}`} highlight />
                </div>

                <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-indigo-600 w-5 h-5" />
                    {t.financials.risks}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <RiskItem label="Market" content={result.financials.risks.market} />
                    <RiskItem label="Regulatory" content={result.financials.risks.regulatory} />
                    <RiskItem label="Competitive" content={result.financials.risks.competitive} />
                    <RiskItem label="Sensitivity" content={result.financials.risks.sensitivity} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 8 && (
              <motion.div
                key="tab8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">{t.step8}</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Download className="w-4 h-4" />
                    {t.investor.download}
                  </button>
                </div>

                <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Rocket className="w-64 h-64" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Investor Pitch</div>
                    <p className="text-2xl font-medium leading-relaxed italic">
                      "{result.investorOutput.polishedPitch}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <SummaryCard title="Problem" content={result.investorOutput.summary.problem} />
                  <SummaryCard title="Solution" content={result.investorOutput.summary.solution} />
                  <SummaryCard title="Market" content={result.investorOutput.summary.market} />
                  <SummaryCard title="Business Model" content={result.investorOutput.summary.businessModel} />
                  <SummaryCard title="Viability" content={result.investorOutput.summary.viability} />
                  <SummaryCard title="Advantage" content={result.investorOutput.summary.advantage} />
                  <SummaryCard title="Impact" content={result.investorOutput.summary.impact} />
                </div>
              </motion.div>
            )}

            {activeTab === 9 && (
              <motion.div
                key="tab9"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">{t.step9}</h3>
                </div>

                {!report ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    {isGeneratingReport ? (
                      <div className="text-center">
                        <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-bold">{t.generatingReport}</p>
                      </div>
                    ) : (
                      <div className="text-center max-w-md px-6">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-8">Ready to synthesize all steps into a professional executive report.</p>
                        <button 
                          onClick={onGenerateReport}
                          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3"
                        >
                          <Zap className="w-5 h-5" />
                          {t.generateReport}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <button 
                        onClick={generatePDF}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF Report
                      </button>
                      <button 
                        onClick={onGenerateReport}
                        className="px-6 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ReportSection title="Executive Overview" content={report.executiveOverview.pitch} />
                      <ReportSection title="Problem Analysis" content={report.problemAnalysis.painPoints} />
                      <ReportSection title="Business Model Design" content={report.businessModelDesign.bmcSummary} />
                      <ReportSection title="Financial Sustainability" content={report.financialSustainability.ltvCocaAnalysis} />
                      <ReportSection title="Growth Strategy" content={report.growthStrategy.domesticPath} />
                      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Innovation Scorecard</h4>
                        <div className="space-y-4">
                          <ScoreBar label="Sustainability" value={report.scorecard.sustainability} />
                          <ScoreBar label="Scalability" value={report.scorecard.scalability} />
                          <ScoreBar label="Innovation" value={report.scorecard.innovation} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ReportSection({ title, content }: { title: string, content: string }) {
  return (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">{content}</p>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-900/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-indigo-200 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-indigo-600"
        />
      </div>
    </div>
  );
}

function ScoreCard({ label, value, icon: Icon, color, isInverse = false }: { label: string, value: number, icon: any, color: string, isInverse?: boolean }) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} flex flex-col gap-4`}>
      <div className="flex justify-between items-center">
        <Icon className="w-5 h-5 opacity-60" />
        <span className="text-2xl font-black">{value}</span>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</div>
        <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            className={`h-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'rose' ? 'bg-rose-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500'}`}
          />
        </div>
      </div>
    </div>
  );
}

function BMCCard({ title, content, highlight = false, onEdit }: { title: string, content: string, highlight?: boolean, onEdit?: (val: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(content);

  return (
    <div className={`p-5 rounded-2xl border ${highlight ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100'} transition-all hover:shadow-md relative group`}>
      <h4 className={`text-xs font-black uppercase tracking-widest mb-3 ${highlight ? 'text-indigo-600' : 'text-slate-400'}`}>{title}</h4>
      {isEditing ? (
        <textarea 
          className="w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 resize-none h-24"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onEdit?.(val);
          }}
          autoFocus
        />
      ) : (
        <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
      )}
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600"
      >
        <FileText className="w-4 h-4" />
      </button>
    </div>
  );
}

function StatBox({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100'}`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${highlight ? 'opacity-70' : 'text-slate-400'}`}>{label}</div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}

function RiskItem({ label, content }: { label: string, content: string }) {
  return (
    <div>
      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</div>
      <p className="text-sm text-slate-600">{content}</p>
    </div>
  );
}

function SummaryCard({ title, content }: { title: string, content: string }) {
  return (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
}
