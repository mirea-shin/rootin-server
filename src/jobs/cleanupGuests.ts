import { prisma } from '../data/lib/prisma';

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1시간마다 실행

export const startGuestCleanupJob = () => {
  setInterval(async () => {
    try {
      const result = await prisma.user.deleteMany({
        where: {
          is_guest: true,
          guest_expires_at: { lt: new Date() },
        },
      });
      if (result.count > 0) {
        console.log(`[Cleanup] 만료된 게스트 계정 ${result.count}개 삭제 완료`);
      }
    } catch (err) {
      console.error('[Cleanup] 게스트 계정 삭제 실패:', err);
    }
  }, CLEANUP_INTERVAL_MS);

  console.log('[Cleanup] 게스트 계정 정리 작업 시작 (1시간 주기)');
};
