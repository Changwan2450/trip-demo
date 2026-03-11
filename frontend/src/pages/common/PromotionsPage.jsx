import { Link } from 'react-router-dom';
import { getPromotionTarget, PROMOTION_ITEMS } from '../../mock/promotionData';
import { C, MAX_WIDTH } from '../../styles/tokens';

export default function PromotionsPage() {
  // TODO(back-end): 프로모션 목록 API가 준비되면 카테고리/상태/노출 우선순위 응답으로 교체한다.
  return (
    <div style={s.page}>
      <section style={s.hero}>
        <div style={s.inner}>
          <p style={s.eyebrow}>PROMOTION HUB</p>
          <h1 style={s.title}>프로모션</h1>
          <p style={s.desc}>쿠폰팩, 오픈런 특가, 시즌 할인처럼 바로 예약에 연결되는 혜택형 프로모션을 한곳에 모았습니다.</p>
          <div style={s.heroActions}>
            <Link to="/events" style={s.secondaryBtn}>이벤트 보기</Link>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.inner}>
          <div style={s.grid}>
            {PROMOTION_ITEMS.map((item) => (
              <article key={item.slug} style={s.card}>
                <Link to={`/promotions/${item.slug}`} style={s.cardLink}>
                  <div style={{ ...s.thumbWrap, background: item.gradient }}>
                    <div>
                      <p style={s.cardLead}>{item.lead}</p>
                      <h2 style={s.cardTitle}>{item.title}</h2>
                      <p style={s.cardSub}>{item.subtitle}</p>
                    </div>
                    <div style={{ ...s.thumbCircle, background: item.circle }}>
                      <img src={item.imageUrl} alt={item.subtitle} style={s.thumbImage} />
                    </div>
                  </div>
                  <div style={s.body}>
                    <p style={s.date}>{item.date}</p>
                    <p style={s.bodyDesc}>{item.description}</p>
                  </div>
                </Link>
                <div style={s.actionRow}>
                  <Link to={`/promotions/${item.slug}`} style={s.moreBtn}>상세 보기</Link>
                  <Link to={getPromotionTarget(item)} style={s.applyBtn}>{item.applyLabel}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)' },
  hero: { padding: '64px 24px 40px', background: 'linear-gradient(145deg, #FFF6F1 0%, #FFFFFF 52%, #F7F7FF 100%)', borderBottom: '1px solid #F0E8E8' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  eyebrow: { margin: '0 0 12px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 12px', fontSize: '42px', fontWeight: '800', color: C.text },
  desc: { margin: 0, maxWidth: '760px', fontSize: '16px', lineHeight: 1.8, color: C.textSub },
  heroActions: { marginTop: '20px', display: 'flex', gap: '10px' },
  section: { padding: '32px 24px 64px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' },
  card: { display: 'flex', flexDirection: 'column', background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 28px rgba(15,23,42,0.05)' },
  cardLink: { display: 'block', textDecoration: 'none' },
  thumbWrap: { minHeight: '210px', padding: '24px', display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'center' },
  cardLead: { margin: '0 0 8px', fontSize: '12px', fontWeight: '800', color: C.primary },
  cardTitle: { margin: '0 0 10px', fontSize: '28px', lineHeight: 1.1, color: C.text, whiteSpace: 'pre-line' },
  cardSub: { margin: 0, fontSize: '14px', color: C.textSub, fontWeight: '700' },
  thumbCircle: { width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%', objectFit: 'cover' },
  body: { padding: '20px 22px 18px' },
  date: { margin: '0 0 10px', fontSize: '13px', color: C.textLight, fontWeight: '700' },
  bodyDesc: { margin: 0, fontSize: '14px', lineHeight: 1.7, color: C.textSub },
  actionRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '0 22px 22px' },
  moreBtn: { display: 'inline-flex', padding: '10px 14px', borderRadius: '999px', background: '#F5F5F5', color: C.text, fontSize: '13px', fontWeight: '800', textDecoration: 'none' },
  applyBtn: { display: 'inline-flex', padding: '10px 14px', borderRadius: '999px', background: '#FFF1F1', color: C.primary, fontSize: '13px', fontWeight: '800', textDecoration: 'none' },
  secondaryBtn: { display: 'inline-flex', padding: '11px 16px', borderRadius: '999px', border: `1px solid ${C.border}`, background: '#fff', color: C.text, textDecoration: 'none', fontSize: '14px', fontWeight: '700' },
};
