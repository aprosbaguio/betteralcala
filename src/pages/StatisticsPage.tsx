import { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { VerificationBadge } from '../components/VerificationBadge';
import { BARANGAYS_DATA, MUNICIPAL_PROFILE } from '../data/municipalInfo';

export default function StatisticsPage() {
  const rankedBarangays = useMemo(() => {
    return [...BARANGAYS_DATA].sort((a, b) => b.population2020 - a.population2020);
  }, []);

  const maxBarangayPop = rankedBarangays[0]?.population2020 || 1;
  const growthPct = (
    ((MUNICIPAL_PROFILE.population2024 - MUNICIPAL_PROFILE.historicalCensus[0].population) /
      MUNICIPAL_PROFILE.historicalCensus[0].population) *
    100
  ).toFixed(1);

  return (
    <Layout breadcrumbs={[{ label: 'Statistics' }]}>
      <section className="stats-hero">
        <div className="container">
          <div className="stats-hero-content">
            <span className="stats-hero-badge">
              <i className="bi bi-bar-chart-fill" aria-hidden="true" />{' '}
              <span>PSA &amp; PSGC Verified Data</span>
            </span>
            <h1>Alcala Municipal Statistics</h1>
            <p>
              Official demographic, geographic, and economic indicators for the Municipality of
              Alcala, Pangasinan (PSGC {MUNICIPAL_PROFILE.psgcCode})
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="stats-metrics">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <i className="bi bi-people-fill" aria-hidden="true" />
              </div>
              <div className="metric-info">
                <span className="metric-value tabular-nums">
                  {MUNICIPAL_PROFILE.population2024.toLocaleString()}
                </span>
                <span className="metric-label">Population (2024 POPCEN)</span>
                <span className="metric-source">Up from 48,908 in 2020</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <i className="bi bi-geo-alt-fill" aria-hidden="true" />
              </div>
              <div className="metric-info">
                <span className="metric-value tabular-nums">{MUNICIPAL_PROFILE.barangayCount}</span>
                <span className="metric-label">Official Barangays</span>
                <span className="metric-source">PSGC Verified Units</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <i className="bi bi-rulers" aria-hidden="true" />
              </div>
              <div className="metric-info">
                <span className="metric-value tabular-nums">{MUNICIPAL_PROFILE.landAreaKm2} km²</span>
                <span className="metric-label">Total Land Area</span>
                <span className="metric-source">~1,082 / km² density (2024)</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <i className="bi bi-award-fill" aria-hidden="true" />
              </div>
              <div className="metric-info">
                <span className="metric-value">3rd Class</span>
                <span className="metric-label">Income Classification</span>
                <span className="metric-source">Pangasinan 5th District</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Population Trends */}
      <section className="stats-section stats-trends">
        <div className="container">
          <div className="section-header-minimal">
            <span className="section-tag">
              <i className="bi bi-graph-up" aria-hidden="true" /> <span>PSA Census Series</span>
            </span>
            <h2>Population Trends (1990–2024)</h2>
            <p>Verified historical census figures from the Philippine Statistics Authority (PSA)</p>
          </div>

          <div className="trends-summary">
            <div className="trend-stat">
              <span className="trend-stat-label">1990 Census</span>
              <span className="trend-stat-value tabular-nums">30,684</span>
            </div>
            <div className="trend-arrow">
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </div>
            <div className="trend-stat trend-stat-current">
              <span className="trend-stat-label">2024 POPCEN</span>
              <span className="trend-stat-value tabular-nums">49,479</span>
            </div>
            <div className="trend-stat trend-stat-growth">
              <span className="trend-stat-label">34-Year Growth</span>
              <span className="trend-stat-value tabular-nums">+{growthPct}%</span>
            </div>
          </div>

          {/* Clean Visual Bar Chart */}
          <div className="bg-white border border-black/10 rounded-xl p-6 mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-end">
              {MUNICIPAL_PROFILE.historicalCensus.map((point) => {
                const heightPct = Math.round((point.population / 52000) * 160);
                return (
                  <div key={point.year} className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[#0032a0] mb-2 tabular-nums">
                      {point.population.toLocaleString()}
                    </span>
                    <div
                      className="w-full max-w-[56px] rounded-t-md bg-[#0032a0]"
                      style={{ height: `${heightPct}px` }}
                      aria-label={`${point.year}: ${point.population.toLocaleString()}`}
                    />
                    <span className="mt-2 text-xs font-semibold text-slate-700 tabular-nums">
                      {point.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Population by Barangay (All 21) */}
      <section className="stats-section stats-distribution bg-alt">
        <div className="container">
          <div className="section-header-minimal">
            <span className="section-tag">
              <i className="bi bi-pie-chart-fill" aria-hidden="true" />{' '}
              <span>All 21 PSGC Barangays</span>
            </span>
            <h2>Population by Barangay</h2>
            <p>
              2020 PSA Census baseline totaling 48,908 residents across 21 barangays (Vacante also
              reflects 2024 POPCEN 1,318; full 2024 barangay release marked Needs Review)
            </p>
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-6">
            <div className="space-y-3">
              {rankedBarangays.map((b, idx) => {
                const widthPct = Math.round((b.population2020 / maxBarangayPop) * 100);
                return (
                  <div
                    key={b.psgcCode}
                    className="grid grid-cols-12 items-center gap-3 text-sm py-1 border-b border-black/5 last:border-0"
                  >
                    <span className="col-span-2 sm:col-span-1 font-bold text-[#0032a0] tabular-nums">
                      #{idx + 1}
                    </span>
                    <div className="col-span-10 sm:col-span-4">
                      <span className="font-semibold text-slate-900">{b.name}</span>
                      <span className="ml-2 text-xs text-slate-500 tabular-nums">{b.psgcCode}</span>
                    </div>
                    <div className="col-span-8 sm:col-span-5">
                      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0032a0]"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                    <span className="col-span-4 sm:col-span-2 text-right font-semibold text-slate-900 tabular-nums">
                      {b.population2020.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Economic & Agricultural Profile */}
      <section className="stats-section stats-economy">
        <div className="container">
          <div className="section-header-minimal">
            <span className="section-tag">
              <i className="bi bi-briefcase-fill" aria-hidden="true" />{' '}
              <span>Economic &amp; Geographic Profile</span>
            </span>
            <h2>Economy, Agriculture &amp; Geography</h2>
            <p>Verified economic profile from Provincial Government of Pangasinan &amp; DA Region I</p>
          </div>

          <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
            <div className="bg-white border border-black/10 rounded-xl p-5">
              <h3 className="text-base font-bold text-[#0032a0] mb-2">
                Primary Agricultural Economy
              </h3>
              <p className="text-sm text-slate-700 mb-0">
                Alcala’s economy is anchored in rice and corn production, supplemented by tobacco,
                lowland vegetables, poultry, and livestock farming.
              </p>
            </div>

            <div className="bg-white border border-black/10 rounded-xl p-5">
              <h3 className="text-base font-bold text-[#0032a0] mb-2">
                Agro-Industrial &amp; Cooperatives
              </h3>
              <p className="text-sm text-slate-700 mb-0">
                Facilities such as the Alcala Agro-Industrial Complex in Barangay Bersamin and active
                farmers’ cooperatives support grain trading, post-harvest processing, and KADIWA
                initiatives.
              </p>
            </div>

            <div className="bg-white border border-black/10 rounded-xl p-5">
              <h3 className="text-base font-bold text-[#0032a0] mb-2">
                CMCI Competitiveness &amp; Poverty Stats
              </h3>
              <p className="text-sm text-slate-700 mb-2">
                Detailed DTI Cities and Municipalities Competitiveness Index (CMCI) pillar scores
                and PSA Small Area Poverty Estimates are pending direct extraction.
              </p>
              <VerificationBadge status="Needs Review" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
