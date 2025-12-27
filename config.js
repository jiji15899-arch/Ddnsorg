// 도메인 설정
const CONFIG = {
    // Cloudflare Workers API 엔드포인트
    API_ENDPOINT: 'https://your-worker.your-subdomain.workers.dev',
    
    // 제공할 도메인 확장자 (여기를 수정하세요!)
    DOMAIN_EXTENSION: 'your-domain.com',
    
    // Cloudflare 계정 정보 (Workers에서 환경 변수로 설정)
    // 여기서는 프론트엔드이므로 실제 키를 넣지 마세요!
};

// 확장자를 화면에 표시
document.addEventListener('DOMContentLoaded', () => {
    const extensionDisplay = document.getElementById('extensionDisplay');
    if (extensionDisplay) {
        extensionDisplay.textContent = '.' + CONFIG.DOMAIN_EXTENSION;
    }
});
