import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

function isMobileNav(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { pathname } = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const lockBodyScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    document.body.classList.add('mobile-menu-open');
    document.body.style.top = `-${scrollYRef.current}px`;
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.classList.remove('mobile-menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollYRef.current);
  }, []);

  const closeMenu = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    unlockBodyScroll();
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 320);
  }, [unlockBodyScroll]);

  const toggleDropdown = useCallback((index: number, e: React.MouseEvent) => {
    if (isMobileNav()) {
      e.preventDefault();
      setOpenDropdown((prev) => (prev === index ? null : index));
    }
  }, []);

  useEffect(() => {
    isAnimatingRef.current = false;
    if (mobileMenuOpen) {
      closeMenu();
    } else {
      setOpenDropdown(null);
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        closeMenu();
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen, closeMenu]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu();
        toggleRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, closeMenu]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!isMobileNav() && mobileMenuOpen) {
          isAnimatingRef.current = false;
          closeMenu();
        }
      }, 150);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen, closeMenu]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="logo-container">
          <Link to="/" aria-label="BetterAlcala Home" className="brand-lockup">
            <img
              src="/assets/images/logo/alcala-seal.png"
              alt="Official Seal of the Municipality of Alcala — BetterAlcala Logo"
              className="logo-img"
              width={48}
              height={48}
            />
            <span className="brand-text-group">
              <span className="brand-wordmark">
                <span className="brand-better">Better</span>
                <span className="brand-alcala">Alcala</span>
              </span>
              <span className="brand-subtitle">Alcala, Pangasinan</span>
            </span>
          </Link>
        </div>

        <nav
          ref={navRef}
          className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Main Navigation"
        >
          <ul>
            <li>
              <Link to="/" className={pathname === '/' ? 'active' : ''}>
                {t('nav-home')}
              </Link>
            </li>
            <li className={`has-dropdown ${openDropdown === 0 ? 'dropdown-open' : ''}`}>
              <Link
                to="/services"
                className={pathname.startsWith('/services') || pathname.startsWith('/service-details') ? 'active' : ''}
                aria-haspopup="true"
                aria-expanded={openDropdown === 0 ? 'true' : 'false'}
                onClick={(e) => toggleDropdown(0, e)}
              >
                {t('nav-services')}
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/services/certificates">Civil Registration &amp; Certificates</Link>
                </li>
                <li>
                  <Link to="/services/business">Business Permits &amp; Licensing</Link>
                </li>
                <li>
                  <Link to="/services/tax-payments">Municipal Treasury &amp; Assessor</Link>
                </li>
                <li>
                  <Link to="/services/social-services">Social Welfare, Senior, PWD &amp; Solo Parent</Link>
                </li>
                <li>
                  <Link to="/services/health">Health Services (Alcala RHU)</Link>
                </li>
                <li>
                  <Link to="/services/agriculture">Agriculture &amp; Farmer Support</Link>
                </li>
                <li>
                  <Link to="/services/infrastructure">Building &amp; Construction</Link>
                </li>
                <li>
                  <Link to="/services/education">Employment Assistance (PESO)</Link>
                </li>
                <li>
                  <Link to="/services/public-safety">Disaster Risk Reduction &amp; Safety</Link>
                </li>
                <li>
                  <Link to="/services/environment">Environment &amp; Solid Waste</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/government" className={pathname.startsWith('/government') ? 'active' : ''}>
                {t('nav-government')}
              </Link>
            </li>
            <li>
              <Link to="/statistics" className={pathname.startsWith('/statistics') ? 'active' : ''}>
                {t('nav-statistics')}
              </Link>
            </li>
            <li className={`has-dropdown ${openDropdown === 1 ? 'dropdown-open' : ''}`}>
              <Link
                to="/legislative"
                className={pathname.startsWith('/legislative') ? 'active' : ''}
                aria-haspopup="true"
                aria-expanded={openDropdown === 1 ? 'true' : 'false'}
                onClick={(e) => toggleDropdown(1, e)}
              >
                {t('nav-legislative')}
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/legislative/ordinance-framework">Ordinance Framework</Link>
                </li>
                <li>
                  <Link to="/legislative/resolution-framework">Resolution Framework</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/budget" className={pathname.startsWith('/budget') ? 'active' : ''}>
                {t('nav-transparency')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className={pathname.startsWith('/contact') ? 'active' : ''}>
                {t('nav-contact')}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="lang-selector" role="group" aria-label="Language switcher">
            <button
              type="button"
              className={`btn btn-secondary btn-sm lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-sm lang-btn ${language === 'fil' ? 'active' : ''}`}
              onClick={() => setLanguage('fil')}
              aria-label="Switch to Filipino"
            >
              FIL
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-sm lang-btn ${language === 'ilo' ? 'active' : ''}`}
              onClick={() => setLanguage('ilo')}
              aria-label="Switch to Ilocano"
            >
              ILO
            </button>
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="mobile-menu-toggle btn btn-secondary"
          onClick={() => {
            if (isAnimatingRef.current) return;
            if (mobileMenuOpen) {
              closeMenu();
            } else {
              isAnimatingRef.current = true;
              setMobileMenuOpen(true);
              lockBodyScroll();
              setTimeout(() => {
                isAnimatingRef.current = false;
              }, 320);
            }
          }}
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
        >
          <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
