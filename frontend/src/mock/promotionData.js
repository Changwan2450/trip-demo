// TODO(back-end): 프로모션 목록/상세 API가 준비되면 이 mock 데이터를 서버 응답으로 교체한다.
export const PROMOTION_ITEMS = [
  {
    slug: 'spring-domestic-coupon-pack',
    applyPath: '/lodgings?benefit=coupon&scope=domestic',
    applyLabel: '국내 숙소 바로 보기',
    lead: '봄 맞이 국내여행 할인 만개!',
    title: '최대 10% 할인\n국내숙소 쿠폰팩',
    date: '2026.03.01 - 2026.03.31 23:59',
    subtitle: '봄맞이 국내숙소 쿠폰팩',
    imageUrl: 'https://picsum.photos/seed/tripzone-promo-flower/280/280',
    circle: '#DDF3FF',
    gradient: 'linear-gradient(135deg, #F7FAFF 0%, #EAF4FF 55%, #FDEEEE 100%)',
    description: '국내 인기 숙소 예약 시 바로 사용할 수 있는 시즌 쿠폰팩입니다. 지역별 할인과 특정 숙소 추가 할인을 함께 제공하는 구조로 확장할 수 있습니다.',
    highlights: [
      { title: '국내숙소 전용 쿠폰', desc: '숙소 카테고리별 할인율과 최소 주문 금액 조건을 함께 내려줄 수 있습니다.' },
      { title: '지역별 추가 혜택', desc: '제주, 부산, 강원 같은 특정 지역 프로모션을 분리해 노출할 수 있습니다.' },
      { title: '혜택 사용 흐름 연계', desc: '쿠폰 발급 후 예약 페이지에서 자동 적용 후보로 보여주는 흐름을 붙이기 좋습니다.' },
    ],
  },
  {
    slug: 'golden-week-overseas-coupon-pack',
    applyPath: '/overseas?benefit=coupon&scope=overseas',
    applyLabel: '해외 숙소 바로 보기',
    lead: '5월 황금연휴는 한 번 더 할인!',
    title: '최대 12%\n해외숙소 쿠폰팩',
    date: '2026.03.01 - 2026.03.31 23:59',
    subtitle: '해외숙소 봄맞이 쿠폰팩',
    imageUrl: 'https://picsum.photos/seed/tripzone-promo-tower/280/280',
    circle: '#F7E8FF',
    gradient: 'linear-gradient(135deg, #FDF7FF 0%, #F2E9FF 55%, #F3F0FF 100%)',
    description: '도시형 해외숙소와 휴양지 리조트 예약에 사용할 수 있는 해외숙소 전용 프로모션입니다. 환율, 국가별 세금, 취소 정책을 함께 확장하기 쉽게 설계할 수 있습니다.',
    highlights: [
      { title: '도시/휴양지 분리 노출', desc: '일본 도시호텔, 동남아 리조트처럼 여행 목적별 혜택 구성이 가능합니다.' },
      { title: '연휴 집중 프로모션', desc: '특정 출발일 범위에만 노출되는 프로모션 배너와 상세를 연결할 수 있습니다.' },
      { title: '등급 혜택 결합', desc: '회원 등급별 추가 할인이나 포인트 적립률 강조 영역을 붙일 수 있습니다.' },
    ],
  },
  {
    slug: 'domestic-open-run-special',
    applyPath: '/lodgings?promotion=openrun&scope=domestic',
    applyLabel: '오픈런 숙소 바로 보기',
    lead: '매주 월·목 오전 10시 오픈!',
    title: '놀라운 특가 등장!\n국내여행 오픈런',
    date: '2026.12.01 - 상시 진행',
    subtitle: '국내여행 오픈런',
    imageUrl: 'https://picsum.photos/seed/tripzone-promo-gift/280/280',
    circle: '#DBF3FF',
    gradient: 'linear-gradient(135deg, #F7FDFF 0%, #E4F5FF 55%, #EFF7FF 100%)',
    description: '매주 정해진 시간에 한정 수량 특가를 오픈하는 국내여행 프로모션입니다. 실시간 재고, 남은 수량, 구매 제한 정책을 붙이기 좋습니다.',
    highlights: [
      { title: '오픈 시간 고정', desc: '시간대 기준 노출 상태 변경과 카운트다운 UI를 연결할 수 있습니다.' },
      { title: '한정 수량 특가', desc: '남은 수량, 마감 상태, 선착순 조건을 쉽게 노출할 수 있습니다.' },
      { title: '숙소 큐레이션', desc: '오픈런 대상 숙소만 별도 묶음으로 관리하는 구조로 확장 가능합니다.' },
    ],
  },
  {
    slug: 'overseas-open-run-special',
    applyPath: '/overseas?promotion=openrun&scope=overseas',
    applyLabel: '해외 특가 바로 보기',
    lead: '매주 화·수·금 오전 10시 오픈!',
    title: '놀라운 특가 등장\n해외여행 오픈런',
    date: '2026.12.01 - 상시 진행',
    subtitle: '해외여행 오픈런',
    imageUrl: 'https://picsum.photos/seed/tripzone-promo-bag/280/280',
    circle: '#FFF3C8',
    gradient: 'linear-gradient(135deg, #FFFDF5 0%, #FFF2D8 55%, #FFECE2 100%)',
    description: '해외 항공, 숙소, 번들 상품 특가를 특정 시간대에 공개하는 프로모션입니다. 국가별 입국 규정이나 여행 준비 정보를 추가하기 쉬운 상세 화면으로 확장할 수 있습니다.',
    highlights: [
      { title: '해외 특가 타임세일', desc: '국가/도시별 특가 상품을 프로모션 카드로 묶어 보여줄 수 있습니다.' },
      { title: '항공+숙소 연동', desc: '개별 상품이 아니라 번들 특가로 연결하는 흐름을 붙이기 쉽습니다.' },
      { title: '프로모션 안내 강화', desc: '취소 규정, 포함 항목, 출발 가능 기간을 상세 영역에서 강조할 수 있습니다.' },
    ],
  },
];

export function findPromotionBySlug(slug) {
  return PROMOTION_ITEMS.find((item) => item.slug === slug);
}

export function getPromotionTarget(promotion) {
  return promotion?.applyPath || '/lodgings';
}
