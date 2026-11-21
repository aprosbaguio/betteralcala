import { useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import { VerificationBadge } from '../components/VerificationBadge';
import { ORDINANCES_DATA } from '../data/transparencyData';

export default function OrdinanceFrameworkPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(ORDINANCES_DATA.map((o) => o.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORDINANCES_DATA.filter((o) => {
      if (selectedCategory !== 'all' && o.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        o.ordinanceNo.toLowerCase().includes(q) ||
        o.title.toLowerCase().includes(q) ||
        o.summary.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory]);

  return (
    <Layout
      breadcrumbs={[
        { label: 'Legislative', to: '/legislative' },
        { label: 'Ordinance Framework' },
      ]}
    >
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="page-header-badge">
              <i className="bi bi-journal-text" aria-hidden="true" /> <span>Legislative</span>
            </span>
            <h1>Ordinance Framework</h1>
            <p className="page-header-desc">
              Verified Municipal Ordinances enacted by the Sangguniang Bayan of Alcala, Pangasinan
              and reviewed by the Sangguniang Panlalawigan
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="bg-slate-50 border border-black/10 rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3 justify-between mb-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ordinances by number (e.g., 2025-04), title, or topic..."
                aria-label="Search municipal ordinances"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-[#0032a0] focus:outline-none"
              />
              <span className="text-sm text-slate-600 self-center tabular-nums">
                {filtered.length} ordinances
              </span>
            </div>
            <div className="filter-tab-bar mb-0">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`filter-tab-btn ${selectedCategory === c ? 'active' : ''}`}
                >
                  {c === 'all' ? 'All Categories' : c}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table ordinance-table">
              <thead>
                <tr>
                  <th scope="col">Ordinance No.</th>
                  <th scope="col">Title &amp; Summary</th>
                  <th scope="col">Category</th>
                  <th scope="col">Date / Review</th>
                  <th scope="col">Status &amp; Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ord) => (
                  <tr key={ord.ordinanceNo}>
                    <td className="font-bold text-[#0032a0] whitespace-nowrap tabular-nums">
                      Ord. {ord.ordinanceNo}
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900">{ord.title}</div>
                      <div className="text-xs text-slate-600 mt-1">{ord.summary}</div>
                    </td>
                    <td className="whitespace-nowrap text-xs font-medium">{ord.category}</td>
                    <td className="whitespace-nowrap text-xs tabular-nums">
                      {ord.sessionDate}
                      {ord.spResolutionRef && (
                        <div className="text-slate-500">{ord.spResolutionRef}</div>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-col items-start gap-1">
                        <VerificationBadge status={ord.citation.verificationStatus} />
                        {ord.documentUrl && (
                          <a
                            href={ord.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium"
                          >
                            SP Archive <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
}
