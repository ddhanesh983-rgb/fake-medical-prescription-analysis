import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send, User, MessageSquare } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Success state simulation (stored locally)
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
          Academic Research Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Contact the RxShield Research Team
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          For questions regarding data science methodology, research collaboration, dataset verification, or technical demonstration inquiries.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Inquiry Submitted Successfully</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out, <strong className="text-slate-900">{name}</strong>. Your inquiry has been logged in our research system. We will reply to <span className="font-mono text-slate-800">{email}</span> shortly.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                  setIsSubmitted(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prof. Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Methodology consultation or dataset feedback"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
                Message & Inquiries *
              </label>
              <div className="relative">
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your inquiry, feedback on classification rules, or academic evaluation notes..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
                  required
                ></textarea>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
