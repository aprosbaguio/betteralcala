import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES_DATA } from '../data/servicesData';
import { BARANGAYS_DATA, MUNICIPAL_OFFICES, OFFICIALS_DATA } from '../data/municipalInfo';
import { INFRASTRUCTURE_PROJECTS, ORDINANCES_DATA } from '../data/transparencyData';

interface SearchEntry {
  id: string;
  label: string;
  type: 'Service' | 'Office' | 'Official' | 'Barangay' | 'Ordinance' | 'Project';
  route: string;
  keywords: string;
}

interface Props {
  placeholder?: string;
  inputId?: string;
  className?: string;
}

export default function SearchAutocomplete({
  placeholder = 'e.g., birth certificate, business permit, RHU, San Juan...',
  inputId = 'hero-search',
  className = 'service-search-input',
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const index = useMemo<SearchEntry[]>(() => {
    const entries: SearchEntry[] = [];

    SERVICES_DATA.forEach((s) => {
      entries.push({
        id: `srv-${s.id}`,
        label: s.title,
        type: 'Service',
        route: `/service-details/${s.id}`,
        keywords: `${s.title} ${s.category} ${s.description} ${s.keywords.join(' ')} ${s.office}`.toLowerCase(),
      });
    });

    MUNICIPAL_OFFICES.forEach((o) => {
      entries.push({
        id: `off-${o.id}`,
        label: o.name,
        type: 'Office',
        route: `/government#offices`,
        keywords: `${o.name} ${o.description} ${o.responsibilities.join(' ')}`.toLowerCase(),
      });
    });

    OFFICIALS_DATA.forEach((off) => {
      entries.push({
        id: `official-${off.id}`,
        label: `${off.name} (${off.title})`,
        type: 'Official',
        route: `/government`,
        keywords: `${off.name} ${off.title} ${off.branch}`.toLowerCase(),
      });
    });

    BARANGAYS_DATA.forEach((b) => {
      entries.push({
        id: `brgy-${b.psgcCode}`,
        label: `Brgy. ${b.name} (PSGC ${b.psgcCode})`,
        type: 'Barangay',
        route: `/government#barangays`,
        keywords: `barangay ${b.name} ${b.psgcCode}`.toLowerCase(),
      });
    });

    ORDINANCES_DATA.forEach((ord) => {
      entries.push({
        id: `ord-${ord.ordinanceNo}`,
        label: `Ordinance No. ${ord.ordinanceNo}: ${ord.title}`,
        type: 'Ordinance',
        route: `/legislative/ordinance-framework`,
        keywords: `ordinance ${ord.ordinanceNo} ${ord.title} ${ord.category}`.toLowerCase(),
      });
    });

    INFRASTRUCTURE_PROJECTS.forEach((proj) => {
      entries.push({
        id: `proj-${proj.id}`,
        label: `${proj.id} · ${proj.name}`,
        type: 'Project',
        route: `/budget#dpwh-projects`,
        keywords: `${proj.id} ${proj.name} ${proj.barangay} ${proj.contractor}`.toLowerCase(),
      });
    });

    return entries;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index.filter((item) => item.keywords.includes(q) || item.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, index]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (entry: SearchEntry) => {
    setQuery(entry.label);
    setOpen(false);
    setActiveIndex(-1);
    navigate(entry.route);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      handleSelect(results[activeIndex]);
      return;
    }
    if (results.length > 0) {
      handleSelect(results[0]);
      return;
    }
    const q = query.trim();
    if (q) {
      setOpen(false);
      navigate(`/services?q=${encodeURIComponent(q)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <div className="search-input-wrapper search-autocomplete-wrapper" ref={wrapperRef}>
        <input
          type="search"
          id={inputId}
          className={className}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(e.target.value.trim().length >= 2);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search municipal services, offices, barangays, ordinances, or projects"
          aria-expanded={open && results.length > 0}
          autoComplete="off"
        />
        <button type="submit" className="search-submit-btn" aria-label="Search">
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>

        {open && results.length > 0 && (
          <ul className="search-autocomplete-list" role="listbox" aria-label="Search suggestions">
            {results.map((item, idx) => (
              <li
                key={item.id}
                role="option"
                aria-selected={idx === activeIndex}
                className={`search-autocomplete-item ${
                  idx === activeIndex ? 'search-autocomplete-item--active' : ''
                }`}
                onClick={() => handleSelect(item)}
              >
                <span className="truncate">{item.label}</span>
                <span className="search-autocomplete-type">{item.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}
