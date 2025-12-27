// DOM 요소
const domainForm = document.getElementById('domainForm');
const domainNameInput = document.getElementById('domainName');
const targetIPInput = document.getElementById('targetIP');
const recordTypeSelect = document.getElementById('recordType');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');
const dnsInfoDiv = document.getElementById('dnsInfo');
const registeredDomainSpan = document.getElementById('registeredDomain');

// 메시지 표시 함수
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    }
}

// DNS 정보 표시 함수
function showDNSInfo(domain) {
    registeredDomainSpan.textContent = domain;
    dnsInfoDiv.classList.add('show');
}

// 도메인 유효성 검사
function validateDomain(domain) {
    const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return regex.test(domain);
}

// IP 주소 유효성 검사
function validateIP(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/;
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip) || domainRegex.test(ip);
}

// 폼 제출 핸들러
domainForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const domainName = domainNameInput.value.toLowerCase().trim();
    const targetIP = targetIPInput.value.trim();
    const recordType = recordTypeSelect.value;
    
    // 유효성 검사
    if (!validateDomain(domainName)) {
        showMessage('도메인 이름은 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.', 'error');
        return;
    }
    
    if (!validateIP(targetIP)) {
        showMessage('올바른 IP 주소 또는 도메인을 입력하세요.', 'error');
        return;
    }
    
    // CNAME 검증
    if (recordType === 'CNAME' && /^\d+\.\d+\.\d+\.\d+$/.test(targetIP)) {
        showMessage('CNAME 레코드는 도메인만 사용할 수 있습니다. A 레코드를 선택하세요.', 'error');
        return;
    }
    
    // 로딩 상태
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span>';
    messageDiv.classList.remove('show');
    dnsInfoDiv.classList.remove('show');
    
    const fullDomain = `${domainName}.${CONFIG.DOMAIN_EXTENSION}`;
    
    try {
        // API 호출
        const response = await fetch(`${CONFIG.API_ENDPOINT}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                domain: domainName,
                target: targetIP,
                type: recordType
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showMessage('도메인이 성공적으로 등록되었습니다!', 'success');
            showDNSInfo(fullDomain);
            domainForm.reset();
        } else {
            showMessage(data.message || '도메인 등록에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('서버 연결에 실패했습니다. 나중에 다시 시도해주세요.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '도메인 등록하기';
    }
});

// 실시간 도메인 이름 소문자 변환
domainNameInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toLowerCase();
});
