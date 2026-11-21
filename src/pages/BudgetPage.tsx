import { useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import { VerificationBadge } from '../components/VerificationBadge';
import { BUDGET_RECORDS, INFRASTRUCTURE_PROJECTS } from '../data/transparencyData';

function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BudgetPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeBudget = BUDGET_RECORDS.find((b) => b.fiscalYear === selectedYear) || BUDGET_RECORDS[0];

  const projectCategories = useMemo(() => {
    return ['all', ...Array.from(new Set(INFRASTRUCTURE_PROJECTS.map((p) => p.category)))];
  }, []);

  const filteredProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    return INFRASTRUCTURE_PROJECTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.barangay.toLowerCase().includes(q) ||
        p.contractor.toLowerCase().includes(q)
      );
    });
  }, [projectSearch, selectedCategory]);

  const totalVerifiedContractValue = useMemo(() => {
    return INFRASTRUCTURE_PROJECTS.reduce(
      (sum, p) => sum + (p.contractCost ?? p.abcAmount ?? 0),
      0
    );
  }, []);

  return (
    <Layout breadcrumbs={[{ label: 'Transparency & Budget' }]}>
      <section className="trans-hero-v2">
        <div className="container">
          <div className="trans-hero-content-v2">
            <span className="trans-hero-badge-v2">
              <i className="bi bi-shield-check" aria-hidden="true" />{' '}
              <span>Fiscal &amp; Project Transparency</span>
            </span>
            <h1>Budget &amp; Financial Transparency</h1>
            <p>
              Approved municipal appropriations, execution status, COA/BLGF reporting, and DPWH
              infrastructure projects in Alcala
            </p>
          </div>
        </div>
      </section>

      {/* Annual Budget & SRE Distinction */}
      <section className="sre-section-v2">
        <div className="container">
          <div className="sre-header-v2">
            <div className="sre-title-group">
              <span className="sre-label">
                <i className="bi bi-graph-up-arrow" aria-hidden="true" />{' '}
                <span>Annual Municipal Budget &amp; SRE</span>
              </span>
              <h2>Approved Appropriations vs. Execution Records</h2>
              <p>
                Approved budgets are verified via Sangguniang Panlalawigan resolutions; unreleased
                execution breakdowns are marked Needs Review.
              </p>
            </div>

            <div className="sre-period-toggle" role="tablist" aria-label="Select fiscal year">
              {BUDGET_RECORDS.map((b) => (
                <button
                  key={b.fiscalYear}
                  type="button"
                  role="tab"
                  aria-selected={selectedYear === b.fiscalYear}
                  onClick={() => setSelectedYear(b.fiscalYear)}
                  className={`sre-period-btn ${selectedYear === b.fiscalYear ? 'active' : ''}`}
                >
                  <span className="sre-period-q">FY {b.fiscalYear}</span>
                  <span className="sre-period-range">Operative Budget</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sre-metrics-row">
            <div className="sre-metric-card sre-metric-income">
              <div className="sre-metric-icon">
                <i className="bi bi-check2-circle" aria-hidden="true" />
              </div>
              <div className="sre-metric-data">
                <span className="sre-metric-value tabular-nums">
                  {formatPeso(activeBudget.approvedBudget)}
                </span>
                <span className="sre-metric-label">Approved Annual Budget (FY {activeBudget.fiscalYear})</span>
              </div>
            </div>

            <div className="sre-metric-card sre-metric-expense">
              <div className="sre-metric-icon">
                <i className="bi bi-clipboard-data" aria-hidden="true" />
              </div>
              <div className="sre-metric-data">
                <span className="sre-metric-value">Pending Release</span>
                <span className="sre-metric-label">Obligations (Allotments Committed)</span>
                <div className="mt-1">
                  <VerificationBadge status={activeBudget.sreStatus} />
                </div>
              </div>
            </div>

            <div className="sre-metric-card sre-metric-net">
              <div className="sre-metric-icon">
                <i className="bi bi-cash-stack" aria-hidden="true" />
              </div>
              <div className="sre-metric-data">
                <span className="sre-metric-value">Pending Release</span>
                <span className="sre-metric-label">Disbursements (Cash Paid)</span>
                <div className="mt-1">
                  <VerificationBadge status={activeBudget.sreStatus} />
                </div>
              </div>
            </div>

            <div className="sre-metric-card sre-metric-balance">
              <div className="sre-metric-icon">
                <i className="bi bi-receipt" aria-hidden="true" />
              </div>
              <div className="sre-metric-data">
                <span className="sre-metric-value">Pending Release</span>
                <span className="sre-metric-label">Actual Expenditures (BLGF eSRE)</span>
                <div className="mt-1">
                  <VerificationBadge status={activeBudget.sreStatus} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-2 mt-6" style={{ gap: 'var(--spacing-md)' }}>
            <div className="bg-white border border-black/10 rounded-xl p-5">
              <h3 className="text-base font-bold text-[#0032a0] mb-3">
                FY {activeBudget.fiscalYear} Enactment &amp; Provincial Review
              </h3>
              <dl className="space-y-2 text-sm text-slate-700">
                <div>
                  <dt className="font-semibold text-slate-900">Municipal Enactment</dt>
                  <dd>{activeBudget.appropriationOrdinance}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Sangguniang Panlalawigan Action</dt>
                  <dd>{activeBudget.spResolution}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">National Tax Allotment (NTA) &amp; 20% DF</dt>
                  <dd>{activeBudget.ntaShareNote}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-black/10 rounded-xl p-5">
              <h3 className="text-base font-bold text-[#0032a0] mb-3">
                Understanding Budget Terms &amp; Public Records
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li>
                  <strong>Approved Budget:</strong> Maximum spending authority enacted by the
                  Sangguniang Bayan and declared operative by the Sangguniang Panlalawigan.
                </li>
                <li>
                  <strong>Obligations:</strong> Binding commitments (contracts/purchase orders)
                  charged against approved appropriations.
                </li>
                <li>
                  <strong>Disbursements &amp; Actual Expenditures:</strong> Cash settled and final
                  audited expenses reported in the BLGF Statement of Receipts and Expenditures (SRE)
                  and Commission on Audit (COA) Annual Audit Reports.
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-black/10 flex flex-wrap gap-2">
                <a
                  href="https://blgf.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  BLGF eSRE Portal <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                </a>
                <a
                  href="https://www.coa.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  COA Region I Audit Reports <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                </a>
                <a
                  href="https://notices.philgeps.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  PhilGEPS Procurement <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AIP / Financial Statements / Procurement Status Table */}
      <section className="section bg-alt">
        <div className="container">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Municipal Financial &amp; Procurement Document Registry
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Status of core Full Disclosure Policy (FDP) documents for Alcala, Pangasinan
          </p>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Document Category</th>
                  <th scope="col">Issuing / Oversight Agency</th>
                  <th scope="col">Current Public Availability</th>
                  <th scope="col">Verification Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Annual Budgets (FY 2024 &amp; FY 2025 Totals)</td>
                  <td>SB Alcala / SP Pangasinan</td>
                  <td>Operative totals verified (₱193.59M / ₱230.31M)</td>
                  <td>
                    <span className="text-xs font-medium text-slate-600">Confirmed</span>
                  </td>
                </tr>
                <tr>
                  <td>Annual Investment Program (AIP)</td>
                  <td>MPDC / Municipal Budget Office</td>
                  <td>Full line-item schedule not yet published online</td>
                  <td>
                    <VerificationBadge status="Needs Review" />
                  </td>
                </tr>
                <tr>
                  <td>Statement of Receipts &amp; Expenditures (SRE)</td>
                  <td>Bureau of Local Government Finance (BLGF)</td>
                  <td>Routed via BLGF eSRE portal; municipal breakdown pending extraction</td>
                  <td>
                    <VerificationBadge status="Needs Review" />
                  </td>
                </tr>
                <tr>
                  <td>COA Annual Audit Reports (AAR)</td>
                  <td>Commission on Audit (COA Region I)</td>
                  <td>
                    Archived on{' '}
                    <a href="https://www.coa.gov.ph/" target="_blank" rel="noopener noreferrer">
                      coa.gov.ph
                    </a>
                  </td>
                  <td>
                    <span className="text-xs font-medium text-slate-600">Archived online</span>
                  </td>
                </tr>
                <tr>
                  <td>Municipal Procurement Notices &amp; Bids</td>
                  <td>BAC Alcala / PhilGEPS</td>
                  <td>
                    Published via{' '}
                    <a
                      href="https://notices.philgeps.gov.ph/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PhilGEPS
                    </a>
                  </td>
                  <td>
                    <VerificationBadge status="Needs Review" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DPWH Infrastructure Projects in Alcala */}
      <section id="dpwh-projects" className="infra-section-v5">
        <div className="container">
          <div className="mb-6">
            <span className="sre-label">
              <i className="bi bi-cone-striped" aria-hidden="true" />{' '}
              <span>DPWH Pangasinan 3rd District Engineering Office</span>
            </span>
            <h2 className="mt-2">Infrastructure Projects in Alcala, Pangasinan</h2>
            <p className="text-slate-600">
              {INFRASTRUCTURE_PROJECTS.length} documented DPWH public works projects across Alcala’s
              barangays (total documented ABC/awarded allocations shown:{' '}
              <strong className="tabular-nums">{formatPeso(totalVerifiedContractValue)}</strong>).
            </p>
          </div>

          <div className="bg-slate-50 border border-black/10 rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3 justify-between mb-3">
              <input
                type="search"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search by Contract ID (e.g., 25AI0044), barangay, project title, or contractor..."
                aria-label="Search infrastructure projects"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-[#0032a0] focus:outline-none"
              />
              <span className="text-sm text-slate-600 self-center tabular-nums">
                {filteredProjects.length} projects
              </span>
            </div>
            <div className="filter-tab-bar mb-0">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat === 'all' ? 'All Project Types' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
            {filteredProjects.map((proj) => (
              <article
                key={proj.id}
                className="bg-white border border-black/10 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#0032a0] tabular-nums">
                      Contract ID: {proj.id} · {proj.projectDate}
                    </span>
                    <VerificationBadge status={proj.citation.verificationStatus} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{proj.name}</h3>
                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <div>
                      <strong>Location / Barangay:</strong> {proj.location}
                    </div>
                    <div>
                      <strong>Category:</strong> {proj.category}
                    </div>
                    <div>
                      <strong>Implementing Agency:</strong> {proj.implementingAgency}
                    </div>
                    <div>
                      <strong>Funding Source:</strong> {proj.fundingSource}
                    </div>
                    <div>
                      <strong>Contractor:</strong> {proj.contractor}
                    </div>
                    {proj.abcAmount && (
                      <div className="tabular-nums">
                        <strong>Approved Budget (ABC):</strong> {formatPeso(proj.abcAmount)}
                      </div>
                    )}
                    {proj.contractCost && (
                      <div className="tabular-nums">
                        <strong>Awarded Contract Cost:</strong> {formatPeso(proj.contractCost)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-black/5 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-emerald-700">{proj.statusLabel}</span>
                  <a
                    href={proj.citation.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#0032a0]"
                  >
                    DPWH Source <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
