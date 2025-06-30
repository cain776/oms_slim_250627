document.addEventListener('DOMContentLoaded', () => {
    // 1. 인증 상태 확인 (가장 먼저 실행)
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return; 
    }

    // --- 새로운 모달 제어 로직 (이벤트 위임) ---
    document.addEventListener('click', (e) => {
        const openTrigger = e.target.closest('[data-modal-open]');
        const closeTrigger = e.target.closest('[data-modal-close]');
        const modal = e.target.closest('.modal-overlay');

        if (openTrigger) {
            e.preventDefault();
            const modalId = openTrigger.dataset.modalOpen;
            const modalToOpen = document.getElementById(modalId);
            if (modalToOpen) {
                modalToOpen.classList.remove('hidden');
            }
        } else if (closeTrigger) {
            e.preventDefault();
            const modalToClose = closeTrigger.closest('.modal-overlay');
            if (modalToClose) {
                modalToClose.classList.add('hidden');
            }
        } else if (modal) {
            // 모달 바깥의 어두운 영역을 클릭했을 때
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        }
    });

    // --- 개별 모달의 특정 기능 처리 ---
    // 화물추적 가이드 URL 복사
    const copyTrackingUrlBtn = document.getElementById('copy-tracking-url-btn');
    if (copyTrackingUrlBtn) {
        copyTrackingUrlBtn.addEventListener('click', () => {
            const trackingUrlInput = document.getElementById('tracking-url-input');
            if (trackingUrlInput && trackingUrlInput.value) {
                navigator.clipboard.writeText(trackingUrlInput.value).then(() => {
                    alert('URL이 클립보드에 복사되었습니다.');
                }).catch(err => {
                    console.error('URL 복사 실패:', err);
                    alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
                });
            }
        });
    }

    // 복수화물조회 탭
    const multiTrackTabs = document.getElementById('multi-track-tabs');
    if (multiTrackTabs) {
        const tabButtons = multiTrackTabs.querySelectorAll('button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => {
                    btn.classList.remove('border-blue-600', 'text-blue-600');
                    btn.classList.add('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300');
                });
                button.classList.add('border-blue-600', 'text-blue-600');
                button.classList.remove('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300');
            });
        });
    }


    // 3. UI 컴포넌트 초기화
    const lnb = document.getElementById('lnb');
    const lnbToggle = document.getElementById('lnb-toggle');
    if(lnbToggle && lnb) {
        lnbToggle.addEventListener('click', () => lnb.classList.toggle('collapsed'));
    }

    // --- 중앙 집중식 뷰 전환 로직 ---
    function switchView(viewId) {
        document.querySelectorAll('.main-content-view').forEach(view => {
            view.style.display = 'none';
        });

        const inventoryDetailView = document.getElementById('detailPage');
        if (inventoryDetailView) {
            inventoryDetailView.style.display = 'none';
        }

        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.style.display = 'block';
        }
    }

    // --- 메뉴 클릭 핸들러 ---
    lnb.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        e.preventDefault();
        const parentLi = link.closest('.lnb-menu-item');
        if (!parentLi) return;
        
        const allMenuItems = lnb.querySelectorAll('.lnb-menu-item');
        const allSubmenuLinks = lnb.querySelectorAll('.submenu a');
        const hasSubmenu = parentLi.classList.contains('has-submenu');
        const isSubmenuLink = !!link.closest('.submenu');
        
        const targetViewId = (isSubmenuLink ? link.dataset.menu : parentLi.dataset.menu) + 'View';

        if (isSubmenuLink) {
            allMenuItems.forEach(li => li.classList.remove('active'));
            allSubmenuLinks.forEach(a => a.classList.remove('active'));
            parentLi.classList.add('active'); 
            link.classList.add('active');
        } else if (hasSubmenu) {
            parentLi.classList.toggle('submenu-open');
            return; 
        } else {
            lnb.querySelectorAll('.lnb-menu-item.has-submenu').forEach(item => item.classList.remove('submenu-open'));
            allMenuItems.forEach(li => li.classList.remove('active'));
            allSubmenuLinks.forEach(a => a.classList.remove('active'));
            parentLi.classList.add('active');
        }

        switchView(targetViewId);
    });

    // --- 검색 팝업 로직 ---
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchPopup = document.getElementById('search-popup');
    if(searchInput && searchPopup) {
        searchInput.addEventListener('focus', () => searchPopup.classList.add('active'));
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchPopup.classList.remove('active');
            }
        });
    }
    
    // --- 프로모션 배너 캐러셀 로직 ---
    const promoSlides = document.getElementById('promo-slides');
    const promoDotsContainer = document.getElementById('promo-dots');
    if (promoSlides && promoSlides.children.length > 0) {
        const slides = promoSlides.children;
        let currentSlideIndex = 0;
        let slideInterval;

        function createDots() {
            if(!promoDotsContainer) return;
            promoDotsContainer.innerHTML = '';
            if (slides.length <= 1) {
                promoDotsContainer.style.display = 'none';
                return;
            }
            promoDotsContainer.style.display = 'flex';
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('button');
                dot.classList.add('promo-dot');
                dot.addEventListener('click', () => {
                    showSlide(i);
                    if (slides.length > 1) resetInterval();
                });
                promoDotsContainer.appendChild(dot);
            }
        }

        function showSlide(index) {
            if (!promoSlides || !promoDotsContainer) return;
            promoSlides.style.transform = `translateX(-${index * 100}%)`;
            currentSlideIndex = index;
            const dots = promoDotsContainer.children;
            for (let i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('active', i === index);
            }
        }
        function nextSlide() { const newIndex = (currentSlideIndex + 1) % slides.length; showSlide(newIndex); }
        function startInterval() { slideInterval = setInterval(nextSlide, 5000); }
        function resetInterval() { clearInterval(slideInterval); startInterval(); }
        
        createDots();
        showSlide(0);
        
        if (slides.length > 1) {
            startInterval();
        }
    }

    // --- 샘플 데이터 및 렌더링 함수 ---
    const announcements = [
        { category: '중요', title: '서버 점검 안내 (04:00~05:00)', date: '2024-03-29', hasAttachment: false },
        { category: '일반', title: '3월 정산 및 세금계산서 발행 안내', date: '2024-03-28', hasAttachment: true },
        { category: '시스템', title: '자동 주문 관리 기능 업데이트', date: '2024-03-27', hasAttachment: false },
        { category: '뉴스', title: 'eXmate, 2024 물류산업 혁신상 수상', date: '2024-03-25', hasAttachment: true },
    ];
    const statusData = [
        { status: '집화', d3: 10, d5: 5, d7: 2, d10: 1, d15: 0 },
        { status: '간선상차', d3: 15, d5: 8, d7: 3, d10: 2, d15: 1 },
        { status: '간선하차', d3: 20, d5: 10, d7: 5, d10: 3, d15: 2 },
        { status: '배달출발', d3: 5, d5: 2, d7: 1, d10: 0, d15: 0 },
        { status: '미배송', d3: 8, d5: 4, d7: 2, d10: 1, d15: 2 },
    ];

    function renderHomeAnnouncements() {
        const listEl = document.getElementById('home-announcements-list');
        if(!listEl) return;
        listEl.innerHTML = '';
        announcements.slice(0, 4).forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center text-sm';
            li.innerHTML = `
                <a href="#" class="truncate hover:text-blue-600" title="${item.title}">${item.title}</a>
                <span class="text-gray-400 flex-shrink-0">${item.date.substring(5)}</span>
            `;
            listEl.appendChild(li);
        });
    }

    function renderAllAnnouncements() {
        const tableBody = document.getElementById('notice-table-body');
        if(!tableBody) return;
        tableBody.innerHTML = '';
        announcements.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-gray-200 hover:bg-gray-50';
            tr.innerHTML = `
                <td class="p-4 text-sm text-gray-500 hidden md:table-cell">${announcements.length - index}</td>
                <td class="p-4 text-sm text-gray-800 font-medium"><a href="#" class="hover:underline">${item.title}</a></td>
                <td class="p-4 text-sm text-gray-500 hidden sm:table-cell">${item.category}</td>
                <td class="p-4 text-sm text-gray-500 hidden sm:table-cell">관리자</td>
                <td class="p-4 text-sm text-gray-500">${item.date}</td>
                <td class="p-4 text-center">
                    ${item.hasAttachment ? '<i data-lucide="paperclip" class="w-5 h-5 mx-auto text-gray-400"></i>' : ''}
                </td>
            `;
            tableBody.appendChild(tr);
        });
        lucide.createIcons();
    }
    
    function renderStatusTable() {
        const tableBody = document.getElementById('status-table-body');
        if(!tableBody) return;
        tableBody.innerHTML = '';
        let totals = { d3: 0, d5: 0, d7: 0, d10: 0, d15: 0, total: 0 };
        statusData.forEach(item => {
            const total = item.d3 + item.d5 + item.d7 + item.d10 + item.d15;
            totals.d3 += item.d3;
            totals.d5 += item.d5;
            totals.d7 += item.d7;
            totals.d10 += item.d10;
            totals.d15 += item.d15;
            totals.total += total;
            const tr = document.createElement('tr');
            tr.className = 'bg-white hover:bg-gray-50';
            tr.innerHTML = `
                <td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">${item.status}</td>
                <td class="px-6 py-4 text-center">${item.d3}</td>
                <td class="px-6 py-4 text-center">${item.d5}</td>
                <td class="px-6 py-4 text-center">${item.d7}</td>
                <td class="px-6 py-4 text-center">${item.d10}</td>
                <td class="px-6 py-4 text-center text-red-600 font-medium">${item.d15}</td>
                <td class="px-6 py-4 text-center font-bold text-gray-900">${total}</td>
            `;
            tableBody.appendChild(tr);
        });
        const tfoot = document.createElement('tfoot');
        tfoot.innerHTML = `
            <tr class="bg-gray-100 font-bold text-gray-900">
                <td class="px-6 py-3 text-center">합계</td>
                <td class="px-6 py-3 text-center">${totals.d3}</td>
                <td class="px-6 py-3 text-center">${totals.d5}</td>
                <td class="px-6 py-3 text-center">${totals.d7}</td>
                <td class="px-6 py-3 text-center">${totals.d10}</td>
                <td class="px-6 py-3 text-center text-red-600">${totals.d15}</td>
                <td class="px-6 py-3 text-center">${totals.total}</td>
            </tr>
        `;
        tableBody.parentNode.appendChild(tfoot);
        lucide.createIcons();
    }

    function initializeInventoryAdjustment() {
        const tableBody = document.getElementById('inventory-adjustment-table-body');
        if (!tableBody) return;

        tableBody.addEventListener('input', (e) => {
            if (e.target.type === 'number') {
                const row = e.target.closest('tr');
                const currentStockEl = row.querySelector('td:nth-child(3)');
                const adjustmentInput = e.target;
                const finalStockEl = row.querySelector('td:nth-child(5)');

                const currentStock = parseInt(currentStockEl.textContent, 10);
                const adjustment = parseInt(adjustmentInput.value, 10) || 0;
                
                finalStockEl.textContent = currentStock + adjustment;
            }
        });
    }

    // 4. 초기 데이터 렌더링
    function init() {
        renderHomeAnnouncements();
        renderAllAnnouncements();
        renderStatusTable();
        initializeInventoryAdjustment();

        // 모든 아이콘을 마지막에 한 번만 다시 그립니다.
        lucide.createIcons();
    }

    // 초기 뷰 로드
    switchView('homeView');
    init();
});