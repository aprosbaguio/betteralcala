import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { VerificationBadge } from '../components/VerificationBadge';
import { SERVICES_DATA } from '../data/servicesData';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES_DATA.find((s) => s.id === id);

  if (!service) {
    return (
      <Layout breadcrumbs={[{ label: 'Services', to: '/services' }, { label: 'Service Not Found' }]}>
        <section className="section">
          <div className="container text-center py-12">
            <h1>Service Guide Not Found</h1>
            <p className="text-slate-600 mb-6">
              The requested municipal service guide could not be found in the BetterAlcala directory.
            </p>
            <Link to="/services" className="btn btn-primary">
              Browse All Municipal Services
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      breadcrumbs={[
        { label: 'Services', to: '/services' },
        { label: service.category, to: `/services/${service.categoryId}` },
        { label: service.title },
      ]}
    >
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="page-header-badge">
              <i className={`bi ${service.icon}`} aria-hidden="true" /> <span>{service.category}</span>
            </span>
            <h1>{service.title}</h1>
            <p className="page-header-desc">{service.description}</p>
          </div>
        </div>
      </section>

      <section className="bc-section">
        <div className="container">
          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <i className="bi bi-building" aria-hidden="true" />
              <h4>Responsible Office</h4>
              <p>{service.office}</p>
            </div>
            <div className="stat-card">
              <i className="bi bi-clock" aria-hidden="true" />
              <h4>Processing Time</h4>
              <p className="mb-1">{service.processingTime}</p>
              <VerificationBadge status={service.processingTimeStatus} />
            </div>
            <div className="stat-card">
              <i className="bi bi-cash-coin" aria-hidden="true" />
              <h4>Applicable Fees</h4>
              <p className="mb-1">{service.fees}</p>
              <VerificationBadge status={service.feesStatus} />
            </div>
            <div className="stat-card">
              <i className="bi bi-calendar-check" aria-hidden="true" />
              <h4>Last Verified</h4>
              <p className="mb-1 tabular-nums">{service.citation.lastVerified}</p>
              <VerificationBadge status={service.citation.verificationStatus} />
            </div>
          </div>

          {/* Eligibility & Documentary Requirements */}
          <div className="grid grid-2 mb-8" style={{ gap: 'var(--spacing-md)' }}>
            <div className="req-box">
              <h4>
                <i className="bi bi-person-check-fill" aria-hidden="true" /> Eligibility Requirements
              </h4>
              <ul className="req-list">
                {service.eligibility.map((item) => (
                  <li key={item}>
                    <i className="bi bi-check-circle-fill" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="req-box">
              <h4>
                <i className="bi bi-folder-check" aria-hidden="true" /> Documentary Requirements
              </h4>
              <ul className="req-list">
                {service.requirements.map((req) => (
                  <li key={req}>
                    <i className="bi bi-file-earmark-check" aria-hidden="true" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Procedures */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="bi bi-list-ol text-[#0032a0]" aria-hidden="true" />
              <span>Application Procedures</span>
            </h2>
            <div className="process-grid">
              {service.steps.map((s, idx) => (
                <div
                  key={s.step}
                  className={`process-card ${idx === service.steps.length - 1 ? 'final' : ''}`}
                >
                  <div className="step-num">0{s.step}</div>
                  <h4>{s.title}</h4>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Office Contact & Downloadable Forms */}
          <div className="grid grid-2 mb-6" style={{ gap: 'var(--spacing-md)' }}>
            <div className="req-box">
              <h4>
                <i className="bi bi-telephone-fill" aria-hidden="true" /> Office Contact Information
              </h4>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="mb-1">
                  <strong>Office:</strong> {service.office}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {service.officeAddress}
                </p>
                <p className="mb-1">
                  <strong>Hours:</strong> {service.officeHours}
                </p>
                <p className="mb-1">
                  <strong>Telephone:</strong>{' '}
                  {service.officePhones.map((ph, i) => (
                    <span key={ph}>
                      {i > 0 && ' · '}
                      <a href={`tel:${ph.replace(/[^+\d]/g, '')}`}>{ph}</a>
                    </span>
                  ))}
                </p>
                {service.officeEmail && (
                  <p className="mb-0">
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${service.officeEmail}`}>{service.officeEmail}</a>
                  </p>
                )}
              </div>
            </div>

            <div className="req-box">
              <h4>
                <i className="bi bi-file-earmark-arrow-down" aria-hidden="true" /> Downloadable
                Forms &amp; Source Documents
              </h4>
              {service.downloadableForms.length > 0 ? (
                <ul className="req-list">
                  {service.downloadableForms.map((f) => (
                    <li key={f.label} className="justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-900">{f.label}</span>
                        {f.note && <div className="text-xs text-slate-500">{f.note}</div>}
                      </div>
                      <VerificationBadge status={f.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 mb-0">
                  No digital PDF forms are currently published online for this service (Status:{' '}
                  <strong>Unavailable</strong>). Forms are issued in person at {service.office}.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/services" className="btn btn-outline btn-sm">
              ← Back to Services Directory
            </Link>
            <Link to="/contact" className="btn btn-primary btn-sm">
              View All Emergency &amp; Municipal Contacts
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
