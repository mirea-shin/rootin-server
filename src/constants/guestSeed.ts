/**
 * 게스트 계정 생성 시 복사되는 시드 데이터.
 * daysAgo: start_date = 오늘 - daysAgo
 * completedDaysAgo: 해당 일수 전에 태스크 완료 기록 생성
 */
export const GUEST_SEED_ROUTINES = [
  {
    title: '아침 루틴',
    description: '하루를 상쾌하게 시작하는 아침 습관',
    duration_days: 21,
    daysAgo: 6,
    tasks: [
      {
        name: '물 한 잔 마시기',
        sort_order: 0,
        completedDaysAgo: [6, 5, 4, 3, 2, 1],
      },
      {
        name: '5분 스트레칭',
        sort_order: 1,
        completedDaysAgo: [6, 5, 4, 3, 1],
      },
      {
        name: '오늘 하루 계획 세우기',
        sort_order: 2,
        completedDaysAgo: [6, 5, 3, 2, 1],
      },
    ],
  },
  {
    title: '운동 루틴',
    description: '꾸준한 체력 관리를 위한 운동 습관',
    duration_days: 30,
    daysAgo: 3,
    tasks: [
      {
        name: '팔굽혀펴기 20개',
        sort_order: 0,
        completedDaysAgo: [3, 2],
      },
      {
        name: '스쿼트 30개',
        sort_order: 1,
        completedDaysAgo: [3, 2],
      },
      {
        name: '플랭크 1분',
        sort_order: 2,
        completedDaysAgo: [3],
      },
    ],
  },
  {
    title: '독서 루틴',
    description: '매일 꾸준히 책 읽는 습관',
    duration_days: 14,
    daysAgo: 8,
    tasks: [
      {
        name: '30분 독서',
        sort_order: 0,
        completedDaysAgo: [8, 7, 6, 5, 3, 2],
      },
      {
        name: '핵심 내용 메모',
        sort_order: 1,
        completedDaysAgo: [8, 7, 5, 3],
      },
    ],
  },
  // 완성된 루틴: 7일 duration, 10일 전 시작 → 4일 전 종료, 모든 태스크 100% 완료
  {
    title: '명상 루틴',
    description: '매일 5분, 마음의 여유를 찾는 습관',
    duration_days: 7,
    daysAgo: 10,
    tasks: [
      {
        name: '5분 명상',
        sort_order: 0,
        completedDaysAgo: [10, 9, 8, 7, 6, 5, 4],
      },
      {
        name: '감사 일기 쓰기',
        sort_order: 1,
        completedDaysAgo: [10, 9, 8, 7, 6, 5, 4],
      },
    ],
  },
  // 만료 미완성 루틴: 5일 duration, 8일 전 시작 → 4일 전 종료, 일부만 완료
  {
    title: '저녁 루틴',
    description: '하루를 마무리하는 저녁 습관',
    duration_days: 5,
    daysAgo: 8,
    tasks: [
      {
        name: '10분 저녁 산책',
        sort_order: 0,
        completedDaysAgo: [8, 7],
      },
      {
        name: '핸드폰 멀리 두기',
        sort_order: 1,
        completedDaysAgo: [8],
      },
      {
        name: '오늘 하루 돌아보기',
        sort_order: 2,
        completedDaysAgo: [6],
      },
    ],
  },
];
