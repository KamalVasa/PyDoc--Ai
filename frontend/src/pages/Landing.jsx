import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ShieldCheck,
  Zap,
  Database,
  FileCheck,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Footer } from '../components/Footer';

export const Landing = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-400" />,
      title: "Strict Python Topic Guard",
      description: "Classifies every query before processing. Non-Python questions are instantly rejected without LLM or ChromaDB calls.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Zero Hallucination RAG",
      description: "Answers ONLY from uploaded documentation context. If content is missing, responds with strict non-found messaging.",
    },
    {
      icon: <Database className="w-6 h-6 text-indigo-400" />,
      title: "ChromaDB + MiniLM Embeddings",
      description: "Fast semantic retrieval powered by sentence-transformers/all-MiniLM-L6-v2 vector embeddings.",
    },
    {
      icon: <FileCheck className="w-6 h-6 text-emerald-400" />,
      title: "25MB PDF Documentation Upload",
      description: "Extract, clean, and chunk official Python documentation PDFs into indexed vector collections.",
    },
  ];

  const steps = [
    { num: "01", title: "Upload Python PDF", desc: "Drag & drop official Python documentation or package guides." },
    { num: "02", title: "Automated Vector Indexing", desc: "PyMuPDF extracts text, RecursiveSplitter chunks it, ChromaDB embeds it." },
    { num: "03", title: "Ask Python Query", desc: "Submit your question. Strict validator verifies Python topic alignment." },
    { num: "04", title: "Streamed Accurate Answer", desc: "Groq LLM generates Python code, expected output, and best practices." },
  ];

  const faqs = [
    {
      q: "What happens if I ask a non-Python question like JavaScript or React?",
      a: "The Python Topic Guard immediately intercepts the message and returns: 'I'm a Python Documentation Assistant. I can answer only Python-related questions.' No retrieval or LLM call is made.",
    },
    {
      q: "Does the chatbot use outside general knowledge?",
      a: "No. The system prompt and RAG pipeline strictly enforce answering only from retrieved documentation context.",
    },
    {
      q: "What file formats are supported?",
      a: "Only PDF format files up to 25MB are accepted to guarantee documentation structural integrity.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-sky-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
            <span>Strict Python Documentation Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            AI RAG Chatbot for <br />
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-400 bg-clip-text text-transparent">
              Python Developers
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload Python documentation PDFs and query them with zero hallucinations. Strict topic validation ensures answers come strictly from your docs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-base shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base transition-all"
            >
              Sign In to Chat
            </Link>
          </div>

          {/* Interactive Code Preview Card */}
          <div className="mt-16 max-w-3xl mx-auto glass-card rounded-3xl p-6 text-left shadow-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-500" />
                <span>Python Topic Validation Guard</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Status: Active</span>
            </div>
            <pre className="mt-4 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 overflow-x-auto leading-relaxed">
              <code>{`>>> user_query = "Explain Python decorators"
>>> is_python_topic(user_query)
True  # -> Proceed to ChromaDB similarity search & Groq LLM

>>> user_query = "How do I build a React component?"
>>> is_python_topic(user_query)
False # -> "I'm a Python Documentation Assistant. I can answer only Python-related questions."`}</code>
            </pre>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for Enterprise-Grade Python Precision
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Every detail is engineered to provide precise, verifiable answers from Python documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-500/50 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5 border border-slate-200 dark:border-slate-700">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              How the RAG Pipeline Works
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Four steps from PDF upload to clean Python answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-3xl font-black text-sky-500/30 dark:text-sky-400/20 mb-2 block font-mono">
                  {step.num}
                </span>
                <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-sky-500 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
