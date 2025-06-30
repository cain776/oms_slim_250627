document.addEventListener('DOMContentLoaded', () => {
    // 0. 로그인 상태 확인 (최우선 실행)
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'main.html';
        return;
    }

    // 1. UI 요소 가져오기
    const loginForm = document.getElementById('loginForm');
    const idInput = document.getElementById('id');
    const passwordInput = document.getElementById('password');
    const captchaDisplay = document.getElementById('captchaDisplay');
    const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
    const captchaInput = document.getElementById('captchaInput');
    const captchaContainer = document.getElementById('captcha-container');
    const captchaError = document.getElementById('captchaError');
    let currentCaptcha = '';

    // 2. 보안문자 관련 로직
    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        currentCaptcha = result;
        captchaDisplay.textContent = currentCaptcha;
        captchaError.classList.add('hidden');
        captchaContainer.classList.remove('shake');
    }

    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.addEventListener('click', generateCaptcha);
    }
    
    // 3. 폼 제출 로직
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 3.1. 보안문자 검증
            if (captchaInput.value.toUpperCase() !== currentCaptcha.toUpperCase()) {
                captchaError.classList.remove('hidden');
                captchaContainer.classList.add('shake');
                generateCaptcha(); // 새 보안문자 생성
                captchaInput.value = ''; // 입력 필드 초기화
                return; // 로그인 중단
            }
            captchaError.classList.add('hidden');

            // 3.2. 아이디/비밀번호 검증 (보안문자 통과 후)
            const id = idInput.value;
            const password = passwordInput.value;
            if (id && password) {
                // 로그인 성공 처리
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'main.html';
            } else {
                alert('아이디와 비밀번호를 모두 입력해주세요.');
            }
        });
    }

    // 4. 초기화
    generateCaptcha(); // 페이지 로드 시 첫 보안문자 생성
}); 