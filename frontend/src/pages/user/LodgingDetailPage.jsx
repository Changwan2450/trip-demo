import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import BookingSummaryCard from '../../components/booking/BookingSummaryCard';
import LodgingMap from '../../components/lodging/LodgingMap';
import ReviewCard from '../../components/review/ReviewCard';
import ReviewComposer from '../../components/review/ReviewComposer';
import { getLodging } from '../../api/lodging';
import { createReview, deleteReview, getReviewEligibility, getReviewSummary, getReviewsByLodging } from '../../utils/reviewMock';
import { C, MAX_WIDTH, R } from '../../styles/tokens';

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const [inY, inM, inD] = String(checkIn).split('-').map(Number);
  const [outY, outM, outD] = String(checkOut).split('-').map(Number);
  if (!inY || !inM || !inD || !outY || !outM || !outD) return 0;
  const inUtc = Date.UTC(inY, inM - 1, inD);
  const outUtc = Date.UTC(outY, outM - 1, outD);
  return Math.max(0, Math.floor((outUtc - inUtc) / 86400000));
}

function getTodayText() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getLodgingHighlights(lodging) {
  if (!lodging) return [];
  return [
    '즉시 예약 확정',
    '무료 취소 가능',
    `${lodging.region} 인기 숙소`,
  ];
}

function getAmenityItems(lodging) {
  const common = ['무료 Wi-Fi', '주차 가능', '셀프 체크인'];
  if (String(lodging?.region || '').includes('제주')) return [...common, '바비큐 공간', '오션/산 전망'];
  if (String(lodging?.region || '').includes('서울')) return [...common, '짐 보관', '대중교통 접근'];
  if (String(lodging?.region || '').includes('강원')) return [...common, '테라스', '조식 제공'];
  return [...common, '가족실', '냉난방 완비'];
}

function getPolicyRows(lodging) {
  return [
    { label: '체크인', value: '15:00 이후' },
    { label: '체크아웃', value: '11:00 이전' },
    { label: '취소 정책', value: '체크인 3일 전까지 무료 취소' },
    { label: '호스트 응답', value: '평균 10분 이내' },
    { label: '예약 확정', value: '결제 후 즉시 확정' },
    { label: '기준 인원', value: '2명 · 최대 4명' },
  ];
}

function getLocationNotes(lodging) {
  return [
    `${lodging?.region || '주요 지역'} 중심 이동이 편리한 위치`,
    '편의점/카페 도보권',
    '주요 관광지 차량 10~20분 내 이동 가능',
  ];
}

export default function LodgingDetailPage() {
  const { lodgingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [lodging, setLodging] = useState(null);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookingError, setBookingError] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [reviewSort, setReviewSort] = useState('latest');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviews, setReviews] = useState([]);

  const nights = calcNights(checkIn, checkOut);
  const today = getTodayText();
  const highlights = getLodgingHighlights(lodging);
  const amenityItems = getAmenityItems(lodging);
  const policyRows = getPolicyRows(lodging);
  const locationNotes = getLocationNotes(lodging);

  useEffect(() => {
    getLodging(lodgingId).then(res => setLodging(res.data)).catch(() => { });
  }, [lodgingId]);

  useEffect(() => {
    setReviews(getReviewsByLodging(lodgingId, user?.userId));
  }, [lodgingId, user?.userId]);

  if (!lodging) return (
    <div style={{ padding: '80px', textAlign: 'center', color: C.textSub }}>
      로딩 중...
    </div>
  );

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    if (!checkIn || !checkOut) {
      setBookingError('체크인/체크아웃 날짜를 선택해 주세요.');
      return;
    }
    if (nights <= 0) {
      setBookingError('체크아웃은 체크인보다 이후 날짜여야 합니다.');
      return;
    }
    setBookingError('');
    navigate(`/booking/${lodgingId}`, { state: { checkIn, checkOut, guests } });
  };

  const handleInquiry = () => {
    if (!user) { navigate('/login'); return; }
    navigate(`/inquiry/create?lodgingId=${lodgingId}&type=USER_TO_SELLER`);
  };

  const liked = isWishlisted(lodgingId);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: lodging.name, text: `${lodging.name} 공유`, url: shareUrl });
        setShareMessage('공유가 완료되었습니다.');
        window.setTimeout(() => setShareMessage(''), 1400);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('링크가 복사되었습니다.');
      window.setTimeout(() => setShareMessage(''), 1400);
    } catch {
      setShareMessage('공유에 실패했습니다. 다시 시도해 주세요.');
      window.setTimeout(() => setShareMessage(''), 1800);
    }
  };

  const handleReviewImageChange = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    const nextImages = await Promise.all(files.map((file, index) => (
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `${file.name}-${index}-${file.size}`,
            name: file.name,
            url: String(reader.result || ''),
          });
        };
        reader.readAsDataURL(file);
      })
    )));
    setReviewImages(nextImages);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const trimmedContent = reviewContent.trim();
    if (!trimmedContent) {
      setReviewError('리뷰 내용을 입력해 주세요.');
      setReviewMessage('');
      return;
    }
    if (!user) {
      setReviewError('로그인 후 리뷰를 작성할 수 있습니다.');
      setReviewMessage('');
      return;
    }
    // TODO(back-end): 리뷰 작성 API가 준비되면 rating/content/imageUrls와 bookingId를 함께 서버에 전송한다.
    createReview({
      lodgingId,
      user,
      rating: reviewRating,
      content: trimmedContent,
      imageUrls: reviewImages.map((image) => image.url),
    });
    setReviews(getReviewsByLodging(lodgingId, user?.userId));
    setReviewContent('');
    setReviewImages([]);
    setReviewRating(5);
    setReviewMessage('리뷰가 등록되었습니다.');
    setReviewError('');
  };

  const handleReviewDelete = (reviewId) => {
    if (!user) return;
    const deleted = deleteReview(reviewId, user.userId);
    if (!deleted) {
      setReviewError('리뷰 삭제에 실패했습니다.');
      setReviewMessage('');
      return;
    }
    setReviews(getReviewsByLodging(lodgingId, user?.userId));
    setReviewMessage('리뷰가 삭제되었습니다.');
    setReviewError('');
  };

  const reviewSummary = getReviewSummary(lodgingId);
  const reviewEligibility = getReviewEligibility(user, lodgingId);
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'rating') return b.rating - a.rating;
    if (reviewSort === 'photo') return (b.imageUrls?.length || 0) - (a.imageUrls?.length || 0);
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });

  return (
    <div>
      <style>{`
        @media (max-width: 980px) {
          .tz-lodging-gallery {
            grid-template-columns: 1fr !important;
            max-height: none !important;
          }
          .tz-lodging-main-img {
            height: 320px !important;
          }
          .tz-lodging-gallery-subs {
            flex-direction: row !important;
          }
          .tz-lodging-sub-img {
            height: 140px !important;
          }
          .tz-lodging-content {
            flex-direction: column !important;
            gap: 28px !important;
          }
          .tz-lodging-sidebar {
            width: 100% !important;
          }
          .tz-lodging-wrap {
            padding: 28px 16px 44px !important;
          }
        }
        @media (max-width: 560px) {
          .tz-lodging-main-img {
            height: 240px !important;
          }
          .tz-lodging-sub-img {
            height: 120px !important;
          }
        }
        .tz-action-btn { transition: all 0.2s ease; }
        .tz-action-btn:hover { background: #f9f9f9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .tz-lodging-img { transition: transform 0.4s ease; }
        .tz-gallery-wrap:hover .tz-lodging-img { transform: scale(1.02); }
      `}</style>
      {/* ── 이미지 갤러리 ── */}
      <div style={s.gallery} className="tz-lodging-gallery">
        <div style={s.galleryMain}>
          <img src={lodging.thumbnailUrl} alt={lodging.name} style={s.mainImg} className="tz-lodging-main-img" />
        </div>
        <div style={s.gallerySubs} className="tz-lodging-gallery-subs">
          <img src={`https://picsum.photos/seed/${lodgingId}a/400/300`} alt="" style={s.subImg} className="tz-lodging-sub-img" />
          <img src={`https://picsum.photos/seed/${lodgingId}b/400/300`} alt="" style={s.subImg} className="tz-lodging-sub-img" />
        </div>
      </div>

      {/* ── 콘텐츠 ── */}
      <div style={s.wrap} className="tz-lodging-wrap">
        <div style={s.content} className="tz-lodging-content">
          {/* 좌측 메인 */}
          <div style={s.main}>
            <p style={s.region}>{lodging.region}</p>
            <h1 style={s.name}>{lodging.name}</h1>
            <div style={s.highlightRow}>
              {highlights.map((item) => (
                <span key={item} style={s.highlightChip}>{item}</span>
              ))}
            </div>
            <div style={s.meta}>
              <span>★ {lodging.rating}</span>
              <span style={s.dot}>·</span>
              <span>{lodging.reviewCount}개 후기</span>
              <span style={s.dot}>·</span>
              <span>{lodging.address}</span>
            </div>
            <div style={s.quickInfoGrid}>
              <div style={s.quickInfoItem}>
                <span style={s.quickInfoLabel}>체크인/체크아웃</span>
                <strong style={s.quickInfoValue}>15:00 · 11:00</strong>
              </div>
              <div style={s.quickInfoItem}>
                <span style={s.quickInfoLabel}>기준/최대 인원</span>
                <strong style={s.quickInfoValue}>2명 / 4명</strong>
              </div>
              <div style={s.quickInfoItem}>
                <span style={s.quickInfoLabel}>숙소 유형</span>
                <strong style={s.quickInfoValue}>프라이빗 스테이</strong>
              </div>
              <div style={s.quickInfoItem}>
                <span style={s.quickInfoLabel}>최근 예약</span>
                <strong style={s.quickInfoValue}>이번 주 9건</strong>
              </div>
            </div>
            <div style={s.actionRow}>
              <button type="button" className="tz-action-btn" style={{ ...s.actionBtn, ...(liked ? s.actionBtnActive : null) }} onClick={() => toggleWishlist(lodging)}>
                {liked ? '♥ 찜 완료' : '♡ 찜하기'}
              </button>
              <button type="button" className="tz-action-btn" style={s.actionBtn} onClick={handleShare}>
                {shareMessage || '공유하기'}
              </button>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <h2 style={s.sectionTitle}>숙소 소개</h2>
              <p style={s.desc}>{lodging.description}</p>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <h2 style={s.sectionTitle}>편의시설</h2>
              <div style={s.amenityList}>
                {amenityItems.map((item) => (
                  <div key={item} style={s.amenityItem}>{item}</div>
                ))}
              </div>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <h2 style={s.sectionTitle}>이용 안내</h2>
              <div style={s.policyList}>
                {policyRows.map((row) => (
                  <div key={row.label} style={s.policyRow}>
                    <span style={s.policyLabel}>{row.label}</span>
                    <span style={s.policyValue}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              {/* TODO(back-end): 리뷰 요약/리뷰 목록/작성 가능 여부는 아래 mock 대신 리뷰 API 응답으로 교체한다. */}
              <div style={s.reviewSectionHeader}>
                <div>
                  <h2 style={s.sectionTitle}>리뷰</h2>
                  <p style={s.reviewSectionDesc}>실제 투숙 경험을 기준으로 한 리뷰와 사진을 모아봤습니다.</p>
                </div>
                <div style={s.reviewScoreInline}>
                  <span style={s.reviewScoreValue}>★ {reviewSummary.averageRating.toFixed(1)}</span>
                  <span style={s.reviewScoreMeta}>리뷰 {reviewSummary.reviewCount}개</span>
                </div>
              </div>

              <div style={s.reviewSummaryInline}>
                <div style={s.reviewSummaryStat}>
                  <span style={s.reviewSummaryLabel}>평균 별점</span>
                  <span style={s.reviewSummaryText}>{reviewSummary.averageRating.toFixed(1)}</span>
                </div>
                <div style={s.reviewSummaryDivider} />
                <div style={s.reviewSummaryStat}>
                  <span style={s.reviewSummaryLabel}>전체 리뷰</span>
                  <span style={s.reviewSummaryText}>{reviewSummary.reviewCount}개</span>
                </div>
                <div style={s.reviewSummaryDivider} />
                <div style={s.reviewSummaryStat}>
                  <span style={s.reviewSummaryLabel}>사진 리뷰</span>
                  <span style={s.reviewSummaryText}>{reviewSummary.photoReviewCount}개</span>
                </div>
              </div>

              <ReviewComposer
                user={user}
                canWrite={reviewEligibility.canWrite}
                reason={reviewEligibility.reason}
                rating={reviewRating}
                content={reviewContent}
                selectedImages={reviewImages}
                onRatingChange={setReviewRating}
                onContentChange={setReviewContent}
                onImageChange={handleReviewImageChange}
                onLogin={() => navigate('/login')}
                onSubmit={handleReviewSubmit}
              />

              {reviewMessage ? <p style={s.reviewSuccess}>{reviewMessage}</p> : null}
              {reviewError ? <p style={s.reviewError}>{reviewError}</p> : null}

              <div style={s.reviewSortRow}>
                {[
                  { value: 'latest', label: '최신순' },
                  { value: 'rating', label: '평점 높은순' },
                  { value: 'photo', label: '사진 리뷰' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    style={{ ...s.reviewSortBtn, ...(reviewSort === option.value ? s.reviewSortBtnActive : null) }}
                    onClick={() => setReviewSort(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div style={s.reviewList}>
                {sortedReviews.length ? (
                  sortedReviews.map((review) => <ReviewCard key={review.reviewId} review={review} onDelete={handleReviewDelete} />)
                ) : (
                  <div style={s.reviewEmpty}>
                    <p style={s.reviewEmptyTitle}>아직 리뷰가 없습니다.</p>
                    <p style={s.reviewEmptyDesc}>첫 번째 리뷰를 남겨 숙소 경험을 공유해 주세요.</p>
                  </div>
                )}
              </div>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <h2 style={s.sectionTitle}>위치</h2>
              <div style={s.mapBox}>
                <LodgingMap
                  latitude={lodging.latitude}
                  longitude={lodging.longitude}
                  name={lodging.name}
                  address={lodging.address}
                  pricePerNight={lodging.pricePerNight}
                />
              </div>
              <p style={s.mapCoord}>위도 {lodging.latitude} / 경도 {lodging.longitude}</p>
              <div style={s.locationNoteList}>
                {locationNotes.map((note) => (
                  <div key={note} style={s.locationNoteItem}>{note}</div>
                ))}
              </div>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <button onClick={handleInquiry} style={s.inquiryBtn}>판매자에게 문의하기</button>
            </div>
          </div>

          {/* 우측 예약 카드 */}
          <div style={s.sidebar} className="tz-lodging-sidebar">
            <div style={s.inputCard}>
              <div style={s.dateRow}>
                <div style={s.dateField}>
                  <label style={s.fieldLabel}>체크인</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      const nextCheckIn = e.target.value;
                      setCheckIn(nextCheckIn);
                      if (checkOut && nextCheckIn && checkOut <= nextCheckIn) setCheckOut('');
                      setBookingError('');
                    }}
                    style={s.dateInput}
                  />
                </div>
                <div style={s.dateDivider} />
                <div style={s.dateField}>
                  <label style={s.fieldLabel}>체크아웃</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      setBookingError('');
                    }}
                    style={s.dateInput}
                  />
                </div>
              </div>
              <div style={s.guestField}>
                <label style={s.fieldLabel}>인원</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={s.guestSelect}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}명</option>)}
                </select>
              </div>
            </div>
            <BookingSummaryCard
              lodging={lodging}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onBook={handleBook}
              hideSelectionSummary
            />
            {bookingError && <p style={s.bookingError}>{bookingError}</p>}
            <div style={s.sideInfoCard}>
              <div style={s.sideInfoHeader}>
                <p style={s.sideInfoTitle}>예약 전 확인해 주세요</p>
                <span style={s.sideInfoBadge}>필수</span>
              </div>
              <ul style={s.sideInfoList}>
                <li>체크인 3일 전까지 무료 취소가 가능합니다.</li>
                <li>결제 완료 후 즉시 예약이 확정됩니다.</li>
                <li>현장 결제 없이 예약 단계에서 총액이 확정됩니다.</li>
              </ul>
            </div>
            <div style={s.sideInfoCard}>
              <div style={s.sideInfoHeader}>
                <p style={s.sideInfoTitle}>이 숙소의 혜택</p>
                <span style={{ ...s.sideInfoBadge, background: '#EEF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}>혜택</span>
              </div>
              <ul style={s.sideInfoList}>
                <li>리뷰 작성 시 포인트 적립 예정</li>
                <li>등급별 추가 적립률 적용 가능</li>
                <li>쿠폰/포인트는 예약 페이지에서 함께 적용할 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  gallery: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '8px',
    maxHeight: '520px',
    overflow: 'hidden',
    background: C.bgGray,
  },
  galleryMain: { overflow: 'hidden' },
  mainImg: { width: '100%', height: '480px', objectFit: 'cover', display: 'block' },
  gallerySubs: { display: 'flex', flexDirection: 'column', gap: '8px' },
  subImg: { width: '100%', height: '236px', objectFit: 'cover', display: 'block' },
  wrap: { maxWidth: MAX_WIDTH, margin: '0 auto', padding: '40px 24px 64px' },
  content: { display: 'flex', gap: '80px', alignItems: 'flex-start' },
  main: { flex: 1, minWidth: 0 },
  region: { fontSize: '13px', fontWeight: '600', color: C.textSub, margin: '0 0 8px' },
  name: { fontSize: '28px', fontWeight: '700', color: C.text, margin: '0 0 12px', lineHeight: 1.25 },
  highlightRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' },
  highlightChip: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#B45309',
    background: '#FFF7ED',
    border: '1px solid #FED7AA',
    borderRadius: '999px',
    padding: '6px 10px',
  },
  meta: { display: 'flex', gap: '6px', alignItems: 'center', fontSize: '14px', color: C.text, flexWrap: 'wrap' },
  quickInfoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '18px' },
  quickInfoItem: { borderTop: `2px solid ${C.borderLight}`, paddingTop: '12px' },
  quickInfoLabel: { display: 'block', fontSize: '12px', color: C.textSub, fontWeight: 700, marginBottom: '6px' },
  quickInfoValue: { fontSize: '15px', color: C.text, fontWeight: 800 },
  actionRow: { display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' },
  actionBtn: {
    border: `1px solid ${C.border}`,
    background: '#fff',
    color: C.text,
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  actionBtnActive: {
    borderColor: '#E8484A',
    background: '#FFF1F1',
    color: '#C13A3D',
  },
  dot: { color: C.textSub },
  hr: { border: 'none', borderTop: `1px solid ${C.borderLight}`, margin: '32px 0' },
  section: { marginBottom: '8px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: C.text, margin: '0 0 16px' },
  desc: { fontSize: '15px', lineHeight: '1.75', color: C.text, margin: 0 },
  amenityList: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  amenityItem: {
    borderRadius: '12px',
    background: '#F8F8F8',
    border: `1px solid ${C.borderLight}`,
    padding: '12px 14px',
    fontSize: '13px',
    color: C.text,
    fontWeight: 700,
  },
  policyList: { display: 'grid', gap: '10px' },
  policyRow: { display: 'flex', justifyContent: 'space-between', gap: '16px', paddingBottom: '10px', borderBottom: `1px solid ${C.borderLight}` },
  policyLabel: { fontSize: '13px', color: C.textSub, fontWeight: 700 },
  policyValue: { fontSize: '14px', color: C.text, fontWeight: 700, textAlign: 'right' },
  reviewSectionHeader: { display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '16px' },
  reviewSectionDesc: { margin: 0, fontSize: '14px', color: C.textSub, lineHeight: 1.6 },
  reviewScoreInline: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    paddingTop: '4px',
  },
  reviewScoreValue: { fontSize: '24px', fontWeight: 800, color: '#B45309' },
  reviewScoreMeta: { fontSize: '13px', fontWeight: 700, color: C.textSub },
  reviewSummaryInline: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    padding: '0 0 16px',
    marginBottom: '10px',
    borderBottom: `1px solid ${C.borderLight}`,
  },
  reviewSummaryStat: { display: 'inline-flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' },
  reviewSummaryLabel: { fontSize: '12px', color: C.textSub, fontWeight: 700 },
  reviewSummaryText: { fontSize: '18px', color: C.text, fontWeight: 800 },
  reviewSummaryDivider: { width: '1px', height: '14px', background: C.borderLight },
  reviewSortRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0 8px' },
  reviewSortBtn: {
    border: 'none',
    borderRadius: '999px',
    background: '#F5F5F5',
    color: C.textSub,
    fontSize: '13px',
    fontWeight: 700,
    padding: '8px 13px',
    cursor: 'pointer',
  },
  reviewSortBtnActive: {
    background: '#21242B',
    color: '#fff',
  },
  reviewSuccess: { margin: '12px 0 0', fontSize: '13px', color: '#15803D', fontWeight: 700 },
  reviewError: { margin: '12px 0 0', fontSize: '13px', color: '#B91C1C', fontWeight: 700 },
  reviewList: { display: 'grid', gap: 0, justifyItems: 'start' },
  reviewEmpty: {
    border: `1px dashed ${C.border}`,
    borderRadius: '18px',
    background: '#FAFAFA',
    padding: '28px 20px',
    textAlign: 'center',
  },
  reviewEmptyTitle: { margin: '0 0 8px', fontSize: '18px', color: C.text, fontWeight: 800 },
  reviewEmptyDesc: { margin: 0, fontSize: '14px', color: C.textSub, lineHeight: 1.6 },
  mapBox: { borderRadius: '24px', overflow: 'hidden', border: `1px solid ${C.borderLight}`, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
  mapCoord: { fontSize: '12px', color: C.textSub, margin: '12px 0 0' },
  locationNoteList: { display: 'grid', gap: '8px', marginTop: '14px' },
  locationNoteItem: { fontSize: '13px', color: C.text, background: '#FAFAFA', borderRadius: '12px', padding: '10px 12px', border: `1px solid ${C.borderLight}` },
  inquiryBtn: {
    padding: '14px 28px',
    background: 'transparent',
    border: `1px solid ${C.border}`,
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: '700',
    color: C.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sidebar: { width: '380px', flexShrink: 0 },
  inputCard: {
    border: `1px solid ${C.border}`,
    borderRadius: R.lg,
    overflow: 'hidden',
    marginBottom: '16px',
  },
  dateRow: { display: 'flex', borderBottom: `1px solid ${C.border}` },
  dateField: { flex: 1, padding: '12px 16px' },
  dateDivider: { width: '1px', background: C.border },
  fieldLabel: { display: 'block', fontSize: '10px', fontWeight: '700', color: C.text, marginBottom: '4px', letterSpacing: '0.05em' },
  dateInput: { border: 'none', outline: 'none', fontSize: '14px', color: C.text, width: '100%', background: 'transparent', padding: 0 },
  guestField: { padding: '12px 16px' },
  guestSelect: { border: 'none', outline: 'none', fontSize: '14px', color: C.text, background: 'transparent', width: '100%', padding: 0, cursor: 'pointer' },
  bookingError: { margin: '10px 2px 0', color: '#DC2626', fontSize: '13px', fontWeight: 600 },
  sideInfoCard: {
    marginTop: '14px',
    border: `1px solid ${C.borderLight}`,
    borderRadius: '18px',
    background: '#fff',
    padding: '16px 18px',
    boxShadow: '0 8px 22px rgba(15,23,42,0.04)',
  },
  sideInfoHeader: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '10px' },
  sideInfoTitle: { margin: 0, fontSize: '15px', color: C.text, fontWeight: 800 },
  sideInfoBadge: { fontSize: '11px', fontWeight: 800, color: '#B45309', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '999px', padding: '5px 8px', whiteSpace: 'nowrap' },
  sideInfoList: { margin: 0, paddingLeft: '18px', display: 'grid', gap: '8px', color: C.textSub, fontSize: '13px', lineHeight: 1.6 },
};
