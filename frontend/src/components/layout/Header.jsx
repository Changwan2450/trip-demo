import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { ROLES } from '../../constants/roles';
import { C, MAX_WIDTH } from '../../styles/tokens';
import LogoMark from './LogoMark';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const baseLinks = [
    { to: '/lodgings', label: '숙소 검색', primary: true },
    { to: '/lodgings?region=제주', label: '인기 지역' },
    { to: '/support', label: '문의센터' },
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileNavOpen(false);
    navigate('/');
  };

  const initial = user?.name?.[0] || '?';

  const isBaseLinkActive = (to) => {
    if (to === '/lodgings') return location.pathname === '/lodgings' || location.pathname.startsWith('/lodgings/');
    if (to.startsWith('/lodgings?region=')) return location.pathname === '/lodgings' && new URLSearchParams(location.search).has('region');
    if (to === '/support') return location.pathname === '/support' || location.pathname.startsWith('/inquiry');
    return location.pathname === to;
  };

  const roleLinks = {
    [ROLES.USER]: [
      { to: '/my/bookings', label: '내 예약' },
      { to: '/mypage', label: '마이페이지' },
    ],
    [ROLES.SELLER]: [
      { to: '/seller/lodgings', label: '내 숙소' },
      { to: '/mypage', label: '마이페이지' },
    ],
    [ROLES.ADMIN]: [
      { to: '/admin', label: '관리자' },
    ],
  };

  return (
    <header style={s.header}>
      <style>{`
        .tz-header-nav::-webkit-scrollbar { display: none; }
        .tz-header-nav-item,
        .tz-header-nav-item:link,
        .tz-header-nav-item:visited,
        .tz-header-nav-item:active {
          outline: none !important;
          -webkit-tap-highlight-color: transparent;
        }
        .tz-header-nav-item:hover {
          color: #353535 !important;
          background: #fff !important;
          border-color: #C8CED8 !important;
        }
        .tz-header-nav-item:focus,
        .tz-header-nav-item:focus-visible {
          outline: none !important;
          border-color: #E7C2C2 !important;
          box-shadow: 0 0 0 2px rgba(232,72,74,0.12);
        }
        .tz-header-nav-item.is-active {
          color: #353535 !important;
          background: #fff !important;
          border-color: #C8CED8 !important;
          box-shadow: none;
        }
        .tz-header-nav-item.tz-header-nav-item-primary.is-active {
          color: #fff !important;
          background: linear-gradient(135deg, #F05A5C 0%, #E8484A 100%) !important;
          border-color: #E8484A !important;
          box-shadow: none;
        }
        .tz-header-nav-item.tz-header-nav-item-primary:hover {
          filter: brightness(0.98);
        }
        @media (max-width: 1280px) {
          .tz-header-inner { grid-template-columns: auto 1fr auto !important; }
          .tz-header-nav a { padding: 6px 10px !important; font-size: 12px !important; }
          .tz-header-actions a { padding: 7px 12px !important; font-size: 12px !important; }
        }
        @media (max-width: 980px) {
          .tz-header-nav { overflow-x: auto !important; }
          .tz-header-actions { min-width: auto !important; }
          .tz-header-inner { height: 68px !important; }
        }
        @media (max-width: 840px) {
          .tz-header-inner {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            height: 68px !important;
          }
          .tz-header-nav,
          .tz-header-actions {
            display: none !important;
          }
          .tz-header-mobile-toggle {
            display: inline-flex !important;
          }
          .tz-header-mobile-panel {
            display: block !important;
          }
        }
      `}</style>
      <div style={s.inner} className="tz-header-inner">
        <Link to="/" style={s.logo} className="tz-header-logo">
          <LogoMark compact />
        </Link>

        <nav style={s.nav} className="tz-header-nav">
          {baseLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`tz-header-nav-item ${link.primary ? 'tz-header-nav-item-primary' : ''} ${isBaseLinkActive(link.to) ? 'is-active' : ''}`}
              style={{ ...(link.primary ? s.navSearchLink : s.navLink), ...(isBaseLinkActive(link.to) ? (link.primary ? s.navSearchLinkActive : s.navLinkActive) : null) }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={s.actions} className="tz-header-actions">
          {!user ? (
            <>
              <Link to="/login" style={s.loginBtn}>로그인</Link>
              <Link to="/signup" style={s.signupBtn}>회원가입</Link>
            </>
          ) : (
            <div style={s.profileWrap}>
              <button style={s.profilePillBtn} onClick={() => setMenuOpen(v => !v)}>
                <div style={s.profilePillIcon}>🎈</div>
                <div style={s.profilePillText}>
                  <div style={s.profilePillName}>{user.name}</div>
                  <div style={s.profilePillGrade}>
                    <span style={{ color: '#8A7DF5', fontWeight: 800 }}>Basic</span> 회원
                  </div>
                </div>
                <div style={s.profilePillHamburger}>☰</div>
              </button>
              {menuOpen && (
                <div style={s.dropdown}>
                  <div style={s.dropdownHeader}>
                    <Link to="/mypage" style={s.dropdownUserName} onClick={() => setMenuOpen(false)}>
                      <span>{user.name}</span>
                      <span style={s.dropdownUserArrow}>›</span>
                    </Link>

                    <div style={s.dropdownGradeCard}>
                      <div style={s.dropdownGradeTop}>
                        <span style={s.dropdownGradeText}>Basic</span>
                        <span style={s.dropdownBenefitsBtn}>혜택 안내</span>
                      </div>
                      <div style={s.dropdownGradeDesc}>
                        <span style={s.dropdownGradeHighlight}>3번 더 예약하면</span>
                        <br />다음 등급 쿠폰팩 지급!
                      </div>
                    </div>

                    <div style={s.dropdownBenefitLinks}>
                      <div style={s.dropdownBenefitItem}>
                        <div style={s.benefitLabel}>포인트</div>
                        <div style={s.benefitValue}>0</div>
                      </div>
                      <div style={s.dropdownBenefitDivider} />
                      <div style={s.dropdownBenefitItem}>
                        <div style={s.benefitLabel}>쿠폰</div>
                        <div style={s.benefitValue}>1</div>
                      </div>
                    </div>
                  </div>

                  <ul style={s.dropdownMenu}>
                    {[
                      { label: '예약 내역', to: '/my/bookings' },
                      { label: '최근 본 상품', to: '#' },
                      { label: '찜 목록', to: '#' }
                    ].map(m => (
                      <li key={m.label}>
                        <Link to={m.to} style={s.dropdownMenuItem} onClick={() => setMenuOpen(false)}>{m.label}</Link>
                      </li>
                    ))}

                    <li><div style={s.dropdownMenuSection} /></li>
                    <li><div style={s.dropdownMenuHeader}>모든 여행</div></li>

                    {[
                      { label: '국내숙소', to: '/lodgings' },
                      { label: '해외숙소', to: '#' },
                      { label: '패키지 여행', to: '#', new: true },
                      { label: '항공', to: '#' },
                      { label: '항공+숙소', to: '#' },
                      { label: '레저·티켓', to: '#' },
                      { label: '렌터카', to: '#' },
                      { label: '공간대여', to: '#' },
                    ].map(m => (
                      <li key={m.label}>
                        <Link to={m.to} style={s.dropdownMenuItem} onClick={() => setMenuOpen(false)}>
                          {m.label}
                          {m.new && <span style={s.badgeNew}>new</span>}
                        </Link>
                      </li>
                    ))}

                    <li><div style={s.dropdownMenuSection} /></li>

                    {[
                      { label: '이벤트', to: '#' },
                      { label: '고객센터', to: '/support' },
                      { label: '설정', to: '#' },
                    ].map(m => (
                      <li key={m.label}>
                        <Link to={m.to} style={s.dropdownMenuItem} onClick={() => setMenuOpen(false)}>{m.label}</Link>
                      </li>
                    ))}
                    <li><div style={s.dropdownMenuSection} /></li>
                    <li>
                      <button style={{ ...s.dropdownMenuItem, width: '100%', background: 'none', border: 'none', textAlign: 'left', fontFamily: 'inherit' }} onClick={handleLogout}>
                        로그아웃
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          style={s.mobileToggle}
          className="tz-header-mobile-toggle"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>
      </div>

      {mobileNavOpen && (
        <div style={s.mobilePanel} className="tz-header-mobile-panel">
          <div style={s.mobileLinks}>
            {baseLinks.map((link) => (
              <Link key={link.to} to={link.to} style={link.primary ? s.mobilePrimaryLink : s.mobileLink} onClick={() => setMobileNavOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user && (roleLinks[user.role] || []).map((link) => (
              <Link key={link.to} to={link.to} style={s.mobileLink} onClick={() => setMobileNavOpen(false)}>{link.label}</Link>
            ))}
          </div>
          <div style={s.mobileActions}>
            {!user ? (
              <>
                <Link to="/login" style={s.mobileGhostBtn} onClick={() => setMobileNavOpen(false)}>로그인</Link>
                <Link to="/signup" style={s.mobilePrimaryBtn} onClick={() => setMobileNavOpen(false)}>회원가입</Link>
              </>
            ) : (
              <button style={s.mobileGhostBtn} onClick={handleLogout}>로그아웃</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const s = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid #F0E8E8`,
    fontFamily: 'Manrope, "Noto Sans KR", sans-serif',
  },
  inner: {
    maxWidth: 'min(1580px, calc(100vw - 40px))',
    margin: '0 auto',
    padding: '0 12px',
    height: '74px',
    display: 'grid',
    gridTemplateColumns: '220px 1fr 220px',
    alignItems: 'center',
    columnGap: '10px',
  },
  logo: { textDecoration: 'none', minWidth: '220px' },
  nav: { display: 'flex', gap: '6px', flexWrap: 'nowrap', justifyContent: 'center', flex: 1, minWidth: 0, overflowX: 'hidden', scrollbarWidth: 'none' },
  navLink: {
    fontSize: '13px',
    fontWeight: '700',
    color: C.textSub,
    textDecoration: 'none',
    padding: '8px 13px',
    borderRadius: '999px',
    border: '1px solid #D9DEE6',
    transition: 'color 0.15s, background 0.15s, border-color 0.15s',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    color: '#353535',
    background: '#fff',
    borderColor: '#C8CED8',
  },
  navSearchLink: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    border: '1px solid #E8484A',
    whiteSpace: 'nowrap',
    transition: 'filter 0.15s ease, color 0.15s ease, background 0.15s ease, border-color 0.15s ease',
  },
  navSearchLinkActive: {
    color: '#fff',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    borderColor: '#E8484A',
    boxShadow: 'none',
  },
  actions: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', justifyContent: 'flex-end', flexWrap: 'nowrap' },
  mobileToggle: {
    display: 'none',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: '1px solid #E4E4E4',
    background: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#444',
    cursor: 'pointer',
  },
  loginBtn: {
    fontSize: '13px',
    fontWeight: '600',
    color: C.textSub,
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '999px',
    border: `1px solid ${C.border}`,
    background: '#fff',
  },
  signupBtn: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
  },
  profileWrap: { display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' },
  profilePillBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #EAEAEA',
    borderRadius: '999px',
    padding: '6px 14px 6px 6px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  profilePillIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#FFE0E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  profilePillText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
  },
  profilePillName: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#333',
    lineHeight: 1,
  },
  profilePillGrade: {
    fontSize: '12px',
    color: '#666',
    lineHeight: 1,
  },
  profilePillHamburger: {
    fontSize: '18px',
    color: '#333',
    marginLeft: '6px',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: '56px',
    right: 0,
    background: 'rgba(255, 255, 255, 0.96)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '20px',
    boxShadow: '0 16px 40px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,1)',
    width: '320px',
    zIndex: 200,
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 80px)',
  },
  dropdownHeader: {
    padding: '24px 20px 16px',
  },
  dropdownUserName: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  dropdownUserArrow: {
    color: '#E8484A',
    fontSize: '24px',
    lineHeight: 1,
    fontWeight: 300,
  },
  dropdownGradeCard: {
    position: 'relative',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
    border: '1px solid #FFEBEB',
    borderRadius: '16px',
    padding: '16px 20px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(232, 72, 74, 0.05)',
  },
  dropdownGradeTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  dropdownGradeText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#E8484A',
    letterSpacing: '-0.02em',
  },
  dropdownBenefitsBtn: {
    fontSize: '12px',
    color: '#777',
    fontWeight: '600',
    background: '#F0F0F0',
    padding: '4px 10px',
    borderRadius: '999px',
    cursor: 'pointer',
  },
  dropdownGradeDesc: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500',
    lineHeight: 1.4,
  },
  dropdownGradeHighlight: {
    color: '#D13D3F',
    fontWeight: '700',
  },
  dropdownBenefitLinks: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '12px',
    border: '1px solid #F0E8E8',
  },
  dropdownBenefitItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 0',
    cursor: 'pointer',
  },
  benefitLabel: {
    fontSize: '12px',
    color: '#888',
    fontWeight: '600',
    marginBottom: '4px',
  },
  benefitValue: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '800',
  },
  dropdownBenefitDivider: {
    width: '1px',
    background: '#F0E8E8',
    margin: '16px 0',
  },
  dropdownMenu: {
    listStyle: 'none',
    margin: 0,
    padding: '0 0 12px 0',
  },
  dropdownMenuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  dropdownMenuSection: {
    borderTop: '1px solid #F0F0F0',
    margin: '4px 0',
  },
  dropdownMenuHeader: {
    padding: '12px 20px 8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#999',
  },
  badgeNew: {
    background: '#FFE0E0',
    color: '#E8484A',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '8px',
  },
  mobilePanel: {
    display: 'none',
    borderTop: '1px solid #F0E8E8',
    background: '#fff',
    padding: '14px 16px 16px',
  },
  mobileLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileLink: {
    textDecoration: 'none',
    color: '#3E3E3E',
    fontWeight: 600,
    fontSize: '14px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: '#F8F8F8',
  },
  mobilePrimaryLink: {
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
  },
  mobileActions: { display: 'flex', gap: '8px', marginTop: '12px' },
  mobileGhostBtn: {
    flex: 1,
    textAlign: 'center',
    textDecoration: 'none',
    border: '1px solid #E3E3E3',
    background: '#fff',
    color: '#4B4B4B',
    borderRadius: '999px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  mobilePrimaryBtn: {
    flex: 1,
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    color: '#fff',
    borderRadius: '999px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 700,
  },
};
