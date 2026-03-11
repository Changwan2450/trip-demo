import { Link, useParams } from 'react-router-dom';
import { getPromotionTarget, PROMOTION_ITEMS, findPromotionBySlug } from '../../mock/promotionData';
import { C, MAX_WIDTH } from '../../styles/tokens';

export default function PromotionDetailPage() {
  const { promotionSlug } = useParams();
  const promotion = findPromotionBySlug(promotionSlug);
  const promotionTarget = getPromotionTarget(promotion);
  // TODO(back-end): 프로모션 상세 API가 준비되면 slug 기반 상세 조회 응답으로 교체한다.

  if (!promotion) {
    return (
      <div style={s.page}>
        <div style={s.inner}>
          <div style={s.emptyCard}>
            <p style={s.emptyEyebrow}>PROMOTION DETAIL</p>
            <h1 style={s.emptyTitle}>프로모션을 찾을 수 없습니다.</h1>
            <p style={s.emptyDesc}>존재하지 않거나 종료된 프로모션일 수 있습니다. 다른 프로모션을 확인해 주세요.</p>
            <Link to="/promotions" style={s.primaryBtn}>프로모션 목록 보기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <section style={{ ...s.hero, background: promotion.gradient }}>
        <div style={s.inner}>
          <div style={s.heroTop}>
            <div>
              <p style={s.eyebrow}>{promotion.lead}</p>
              <h1 style={s.title}>{promotion.title}</h1>
              <p style={s.subtitle}>{promotion.subtitle}</p>
              <p style={s.date}>{promotion.date}</p>
            </div>
            <div style={{ ...s.heroCircle, background: promotion.circle }}>
              <img src={promotion.imageUrl} alt={promotion.subtitle} style={s.heroImage} />
            </div>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.inner}>
          <div style={s.infoCard}>
            <p style={s.infoEyebrow}>PROMOTION STORY</p>
            <p style={s.infoDesc}>{promotion.description}</p>
            <div style={s.actions}>
              <Link to="/promotions" style={s.secondaryBtn}>프로모션 목록</Link>
              <Link to={promotionTarget} style={s.primaryBtn}>{promotion.applyLabel || '적용 숙소 보기'}</Link>
            </div>
          </div>

          <div style={s.grid}>
            {promotion.highlights.map((item) => (
              <article key={item.title} style={s.highlightCard}>
                <h2 style={s.highlightTitle}>{item.title}</h2>
                <p style={s.highlightDesc}>{item.desc}</p>
              </article>
            ))}
          </div>

          <div style={s.moreSection}>
            <div style={s.moreHead}>
              <h2 style={s.moreTitle}>다른 프로모션</h2>
            </div>
            <div style={s.moreGrid}>
              {PROMOTION_ITEMS.filter((item) => item.slug !== promotion.slug).slice(0, 3).map((item) => (
                <Link key={item.slug} to={`/promotions/${item.slug}`} style={s.moreCard}>
                  <p style={s.moreLead}>{item.lead}</p>
                  <h3 style={s.moreCardTitle}>{item.title}</h3>
                  <p style={s.moreDate}>{item.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  hero: { padding: '64px 24px 44px', borderBottom: '1px solid #F0E8E8' },
  heroTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
  eyebrow: { margin: '0 0 12px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.12em', color: C.primary },
  title: { margin: '0 0 12px', fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.08, whiteSpace: 'pre-line', color: C.text },
  subtitle: { margin: '0 0 10px', fontSize: '16px', color: C.textSub, fontWeight: '700' },
  date: { margin: 0, fontSize: '14px', color: C.textLight },
  heroCircle: { width: '180px', height: '180px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  section: { padding: '36px 24px 64px' },
  infoCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '24px', marginBottom: '22px' },
  infoEyebrow: { margin: '0 0 10px', fontSize: '12px', color: C.textLight, fontWeight: '800' },
  infoDesc: { margin: 0, fontSize: '15px', color: C.textSub, lineHeight: 1.8, maxWidth: '840px' },
  actions: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '22px' },
  primaryBtn: { padding: '12px 18px', borderRadius: '999px', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', textDecoration: 'none', fontWeight: '800', fontSize: '14px' },
  secondaryBtn: { padding: '12px 18px', borderRadius: '999px', background: '#fff', color: C.text, textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: `1px solid ${C.border}` },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  highlightCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '22px', boxShadow: '0 10px 24px rgba(15,23,42,0.05)' },
  highlightTitle: { margin: '0 0 10px', fontSize: '18px', fontWeight: '800', color: C.text },
  highlightDesc: { margin: 0, fontSize: '14px', lineHeight: 1.7, color: C.textSub },
  moreSection: { marginTop: '28px' },
  moreHead: { marginBottom: '14px' },
  moreTitle: { margin: 0, fontSize: '24px', fontWeight: '800', color: C.text },
  moreGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' },
  moreCard: { display: 'block', background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '18px', padding: '18px', textDecoration: 'none' },
  moreLead: { margin: '0 0 8px', fontSize: '12px', fontWeight: '800', color: C.primary },
  moreCardTitle: { margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: C.text, whiteSpace: 'pre-line' },
  moreDate: { margin: 0, fontSize: '13px', color: C.textLight },
  emptyCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '52px 28px', textAlign: 'center', marginTop: '48px' },
  emptyEyebrow: { margin: '0 0 10px', fontSize: '12px', fontWeight: '800', color: C.primary },
  emptyTitle: { margin: '0 0 10px', fontSize: '32px', fontWeight: '800', color: C.text },
  emptyDesc: { margin: '0 0 20px', fontSize: '15px', color: C.textSub, lineHeight: 1.7 },
};
