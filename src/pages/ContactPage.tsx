import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { SourceCitationBox, VerificationBadge } from '../components/VerificationBadge';
import { EMERGENCY_CONTACTS, MUNICIPAL_PROFILE } from '../data/municipalInfo';

export default function ContactPage() {
  const [senderName, setSenderName] = useState('');
  const [topic, setTopic] = useState('Data Verification / Update');
  const [message, setMessage] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedNotice(true);
    const subject = encodeURIComponent(`[BetterAlcala] ${topic} - ${senderName || 'Resident'}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${MUNICIPAL_PROFILE.hallEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <Layout breadcrumbs={[{ label: 'Contact & Hotlines' }]}>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="page-header-badge">
              <i className="bi bi-telephone-fill" aria-hidden="true" />{' '}
              <span>Contact &amp; Emergency Directory</span>
            </span>
            <h1>Contact &amp; Emergency Hotlines</h1>
            <p className="page-header-desc">
              Verified municipal trunklines, Alcala Municipal Police Station, Alcala Rural Health
              Unit, and provincial emergency escalation numbers
            </p>
          </div>
        </div>
      </section>

      {/* Municipal Hall Contacts */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
            <div className="home-contact-v2-card" style={{ cursor: 'default' }}>
              <div className="home-contact-v2-icon">
                <i className="bi bi-telephone-fill" aria-hidden="true" />
              </div>
              <div className="home-contact-v2-content">
                <h3>Municipal Hall Trunklines</h3>
                <div className="flex flex-col gap-1 text-sm font-semibold">
                  {MUNICIPAL_PROFILE.hallPhones.map((ph) => (
                    <a key={ph} href={`tel:${ph.replace(/[^+\d]/g, '')}`}>
                      {ph}
                    </a>
                  ))}
                </div>
                <span className="home-contact-v2-note">Mon–Fri: 8:00 AM – 5:00 PM</span>
              </div>
            </div>

            <a href={`mailto:${MUNICIPAL_PROFILE.hallEmail}`} className="home-contact-v2-card">
              <div className="home-contact-v2-icon">
                <i className="bi bi-envelope-fill" aria-hidden="true" />
              </div>
              <div className="home-contact-v2-content">
                <h3>Official Municipal Email</h3>
                <p className="home-contact-v2-value">{MUNICIPAL_PROFILE.hallEmail}</p>
                <span className="home-contact-v2-note">Verified via DTI / LGU Directory</span>
              </div>
            </a>

            <div className="home-contact-v2-card" style={{ cursor: 'default' }}>
              <div className="home-contact-v2-icon">
                <i className="bi bi-geo-alt-fill" aria-hidden="true" />
              </div>
              <div className="home-contact-v2-content">
                <h3>Municipal Hall Address</h3>
                <p className="home-contact-v2-value">Poblacion East, Alcala</p>
                <span className="home-contact-v2-note">{MUNICIPAL_PROFILE.hallAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Hotlines Directory */}
      <section className="section bg-alt">
        <div className="container">
          <div className="text-center mb-8">
            <h2>Verified Emergency Contacts Directory</h2>
            <p className="text-slate-600">
              Tap any telephone number to dial directly from mobile devices. Unconfirmed local
              extension lines are transparently flagged.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
            {EMERGENCY_CONTACTS.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-black/10 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#0032a0]">{item.category}</span>
                    <VerificationBadge status={item.citation.verificationStatus} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.office}</h3>
                  <p className="text-xs text-slate-600 mb-2">
                    <i className="bi bi-geo-alt" aria-hidden="true" /> {item.address}
                  </p>
                  <p className="text-xs text-slate-600 mb-3">
                    <i className="bi bi-clock" aria-hidden="true" /> {item.hours}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.phones.map((ph) => (
                      <a
                        key={ph}
                        href={`tel:${ph.replace(/[^+\d]/g, '')}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-[#0032a0]/20 px-3 py-1.5 text-sm font-bold text-[#0032a0] hover:bg-[#0032a0] hover:text-white transition"
                      >
                        <i className="bi bi-telephone-fill" aria-hidden="true" />
                        <span>{ph}</span>
                      </a>
                    ))}
                    {item.email && (
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800"
                      >
                        <i className="bi bi-envelope" aria-hidden="true" />
                        <span>{item.email}</span>
                      </a>
                    )}
                  </div>
                </div>

                <SourceCitationBox citation={item.citation} compact />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Civic Feedback / Data Verification Report */}
      <section id="feedback" className="section">
        <div className="container max-w-3xl">
          <div className="bg-white border border-black/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#0032a0] mb-2">
              Submit a Data Update or Civic Inquiry
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Notice a record marked <em>Needs Review</em> or have an official Citizen’s Charter PDF,
              ordinance, or hotline update from LGU Alcala? Compose an email inquiry to{' '}
              <a href={`mailto:${MUNICIPAL_PROFILE.hallEmail}`}>{MUNICIPAL_PROFILE.hallEmail}</a>.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-2" style={{ gap: 'var(--spacing-sm)' }}>
                <div>
                  <label htmlFor="fb-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="fb-topic" className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Category
                  </label>
                  <select
                    id="fb-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="Data Verification / Update">Data Verification / Update</option>
                    <option value="Citizen's Charter Inquiry">Citizen's Charter Inquiry</option>
                    <option value="Barangay Contact Update">Barangay Contact Update</option>
                    <option value="General Civic Inquiry">General Civic Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="fb-msg" className="block text-xs font-semibold text-slate-700 mb-1">
                  Message &amp; Source Reference
                </label>
                <textarea
                  id="fb-msg"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details, official document reference, or your question..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                <i className="bi bi-envelope" aria-hidden="true" /> Open Email Client to Send
              </button>

              {submittedNotice && (
                <p className="text-xs text-emerald-700 mt-2 mb-0">
                  Email draft prepared for {MUNICIPAL_PROFILE.hallEmail}. If no mail app opened,
                  please email directly or call (075) 632-5938.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
