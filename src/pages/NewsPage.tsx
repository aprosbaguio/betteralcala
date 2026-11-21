import { useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import { SourceCitationBox, VerificationBadge } from '../components/VerificationBadge';
import { MUNICIPAL_PROFILE } from '../data/municipalInfo';
import { NEWS_ITEMS } from '../data/communityData';

export default function NewsPage() {
  const [originFilter, setOriginFilter] = useState<'all' | 'Official Government Source' | 'Independently Compiled Civic Summary'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(NEWS_ITEMS.map((n) => n.category)))],
    []
  );

  const filtered = useMemo(() => {
    return NEWS_ITEMS.filter((item) => {
      if (originFilter !== 'all' && item.originType !== originFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      return true;
    });
  }, [originFilter, categoryFilter]);

  return (
    <Layout breadcrumbs={[{ label: 'News & Announcements' }]}>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="page-header-badge">
              <i className="bi bi-megaphone-fill" aria-hidden="true" />{' '}
              <span>News &amp; Advisories</span>
            </span>
            <h1>Announcements &amp; Civic Updates</h1>
            <p className="page-header-desc">
              Verified government notices, public advisories, deadlines, and civic summaries for
              Alcala, Pangasinan
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="civic-notice-banner mb-6">
            <i className="bi bi-info-circle-fill" aria-hidden="true" />
            <div>
              <strong>Source Transparency:</strong> BetterAlcala clearly separates{' '}
              <strong>Official Government Source</strong> notices (derived directly from enacted
              ordinances, provincial resolutions, and agency bulletins) from{' '}
              <strong>Independently Compiled Civic Summaries</strong>. For real-time LGU posts,
              visit the{' '}
              <a
                href={MUNICIPAL_PROFILE.officialFacebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Official LGU Alcala Facebook Page{' '}
                <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
              </a>
              .
            </div>
          </div>

          <div className="bg-slate-50 border border-black/10 rounded-xl p-4 mb-6 space-y-3">
            <div className="filter-tab-bar mb-0">
              {(['all', 'Official Government Source', 'Independently Compiled Civic Summary'] as const).map(
                (org) => (
                  <button
                    key={org}
                    type="button"
                    onClick={() => setOriginFilter(org)}
                    className={`filter-tab-btn ${originFilter === org ? 'active' : ''}`}
                  >
                    {org === 'all' ? 'All Sources' : org}
                  </button>
                )
              )}
            </div>
            <div className="filter-tab-bar mb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`filter-tab-btn ${categoryFilter === cat ? 'active' : ''}`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-black/10 rounded-xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs text-slate-600">
                  <div className="flex flex-wrap items-center gap-2 font-semibold">
                    <span className="text-[#0032a0]">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.originType}</span>
                  </div>
                  <VerificationBadge status={item.citation.verificationStatus} />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h2>
                <p className="text-sm font-medium text-slate-800 mb-2">{item.summary}</p>
                <p className="text-sm text-slate-600 mb-3">{item.details}</p>

                <SourceCitationBox citation={item.citation} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
