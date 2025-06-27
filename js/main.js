document.addEventListener('DOMContentLoaded', () => {
    // 로그인 상태가 아니면 로그인 페이지로 리디렉션
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return; // 리디렉션 후 스크립트 실행 중단
    }

    // 로그아웃 버튼 이벤트 리스너
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn'); // 로그인 상태 제거
            window.location.href = 'login.html'; // 로그인 페이지로 리디렉션
        });
    }

    lucide.createIcons();

    // LNB toggle logic
    const lnb = document.getElementById('lnb');
    const lnbToggle = document.getElementById('lnb-toggle');
    if(lnbToggle && lnb) {
        lnbToggle.addEventListener('click', () => lnb.classList.toggle('collapsed'));
    }

    // --- Menu Logic with Accordion ---
    const contentViews = document.querySelectorAll('.main-content-view');
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

        const switchView = (targetId) => {
            contentViews.forEach(view => {
                const isActive = view.id === targetId;
                view.classList.toggle('active', isActive);
                if (isActive) {
                    view.classList.remove('hidden');
                }
            });
        };

        if (isSubmenuLink) {
            const targetViewId = link.dataset.menu + 'View';
            allMenuItems.forEach(li => li.classList.remove('active'));
            allSubmenuLinks.forEach(a => a.classList.remove('active'));
            parentLi.classList.add('active');
            link.classList.add('active');
            switchView(targetViewId);
        } else if (hasSubmenu) {
            lnb.querySelectorAll('.lnb-menu-item.has-submenu').forEach(item => {
                if (item !== parentLi) item.classList.remove('submenu-open');
            });
            parentLi.classList.toggle('submenu-open');
        } else {
            const targetViewId = parentLi.dataset.menu + 'View';
            lnb.querySelectorAll('.lnb-menu-item.has-submenu').forEach(item => item.classList.remove('submenu-open'));
            allMenuItems.forEach(li => li.classList.remove('active'));
            allSubmenuLinks.forEach(a => a.classList.remove('active'));
            parentLi.classList.add('active');
            switchView(targetViewId);
        }
    });

    // --- Search Popup Logic ---
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

    // --- Modals Logic ---
    function setupModal(modalId, openBtnId, closeBtnIds) {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);
        if (!modal) return;
        
        const openModal = () => modal.classList.add('active');
        const closeModal = () => modal.classList.remove('active');

        if(openBtn) openBtn.addEventListener('click', openModal);
        closeBtnIds.forEach(id => {
            const closeBtn = document.getElementById(id);
            if(closeBtn) closeBtn.addEventListener('click', closeModal);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // --- Multi-Track Modal Tabs ---
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

    // --- Copy URL Logic (Tracking Guide Modal) ---
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const trackingUrlInput = document.getElementById('trackingUrl');
    if (copyUrlBtn && trackingUrlInput) {
        copyUrlBtn.addEventListener('click', () => {
            trackingUrlInput.select();
            document.execCommand('copy');
            const originalIconHTML = copyUrlBtn.innerHTML;
            copyUrlBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-green-600"></i>';
            lucide.createIcons();
            setTimeout(() => {
                copyUrlBtn.innerHTML = originalIconHTML;
                lucide.createIcons();
            }, 2000);
        });
    }

    // --- Promotion Carousel Logic ---
    const promoCarouselCard = document.getElementById('promo-carousel-card');
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
                dot.addEventListener('click', () => { showSlide(i); if (slides.length > 1) resetInterval(); });
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
            promoCarouselCard.addEventListener('mouseenter', () => clearInterval(slideInterval));
            promoCarouselCard.addEventListener('mouseleave', () => startInterval());
        }
    }

    // --- Dummy data for table ---
    const statusData = [
        { status: '미통관', delays: [5, 2, 1, 0, 1] }, { status: '통관완료', delays: [2, 1, 0, 0, 0] }, { status: '배송사연계', delays: [1, 0, 0, 0, 0] },
        { status: '배송지연', delays: [3, 2, 1, 1, 1] }, { status: '미배송(사유발생)', delays: [5, 3, 2, 1, 3] },
    ];
    const tableBody = document.getElementById('status-table-body');
    if(tableBody) {
        tableBody.innerHTML = ''; // Clear previous data
        statusData.forEach(data => {
            const total = data.delays.reduce((a, b) => a + b, 0);
            const row = document.createElement('tr');
            row.className = 'bg-white border-b hover:bg-gray-50';
            let cellsHTML = `<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${data.status}</th>`;
            data.delays.forEach(count => {
                let textColor = 'text-gray-600';
                if (count > 0 && count <= 2) textColor = 'text-yellow-600';
                if (count > 2) textColor = 'text-red-600';
                cellsHTML += `<td class="px-6 py-4 text-center ${count > 0 ? 'font-bold' : ''} ${textColor}">${count}</td>`;
            });
            cellsHTML += `<td class="px-6 py-4 text-center font-extrabold text-blue-700">${total}</td>`;
            row.innerHTML = cellsHTML;
            tableBody.appendChild(row);
        });
    }

    // 재고 관리 스크립트 시작
    // --- 샘플 데이터 ---
    let database = {
        'UIQ-AMP-001': { no: 1, seller: 'UIQ', sku: 'UIQ-AMP-001', name: '바이옴 베리어 에센스 앰플', optionCode: 'AMP-30ML', option: '30ml', barcode: '8809123456789', productType: '화장품', storage: '상온보관', supplier: '코스맥스', totalStock: 350, scheduledRelease: 50, availableStock: 300, safetyStock: 100, locations: [ { id: 1, center: '인천1센터(청라)', zone: 'A-Zone', loc: 'RA-01-01-A', lot: 'L2405A01', expiry: '2026-05-31', mfgDate: '2024-05-31', current: 200, status: '정상', available: 180, lastModified: '2025-06-15 10:30', lastWorker: '김민준(minjun.kim)' }, { id: 2, center: '인천1센터(청라)', zone: 'B-Zone', loc: 'RB-02-03-D', lot: 'L2405A02', expiry: '2026-05-31', mfgDate: '2024-05-31', current: 150, status: '정상', available: 120, lastModified: '2025-06-15 10:32', lastWorker: '이서아(seoah.lee)' } ] },
        'UIQ-CRM-001': { no: 2, seller: 'UIQ', sku: 'UIQ-CRM-001', name: '미셀라 클렌징 워터', optionCode: 'CLW-200ML', option: '200ml', barcode: '8809123456790', productType: '화장품', storage: '상온보관', supplier: '한국콜마', totalStock: 500, scheduledRelease: 20, availableStock: 480, safetyStock: 200, locations: [ { id: 3, center: '인천2센터(원창)', zone: 'C-Zone', loc: 'RC-05-01-F', lot: 'L2406C01', expiry: '2026-06-15', mfgDate: '2024-06-15', current: 300, status: '정상', available: 300, lastModified: '2025-06-14 15:00', lastWorker: '박도윤(doyoon.park)' }, { id: 4, center: '인천2센터(원창)', zone: 'C-Zone', loc: 'RC-05-02-B', lot: 'L2406C02', expiry: '2026-06-15', mfgDate: '2024-06-15', current: 180, status: '정상', available: 180, lastModified: '2025-06-14 15:00', lastWorker: '박도윤(doyoon.park)' }, { id: 5, center: '인천2센터(원창)', zone: 'D-Zone', loc: 'RD-01-01-A', lot: 'L2312D01', expiry: '2025-12-20', mfgDate: '2023-12-20', current: 20, status: '유통기한임박', available: 0, lastModified: '2025-05-20 09:10', lastWorker: '최하은(haeun.choi)' } ] },
        'UIQ-SUN-001': { no: 3, seller: 'UIQ', sku: 'UIQ-SUN-001', name: '바이옴 베리어 선스크린', optionCode: 'SUN-50ML', option: '50ml', barcode: '8809123456791', productType: '화장품', storage: '상온보관', supplier: '코스맥스', totalStock: 120, scheduledRelease: 10, availableStock: 110, safetyStock: 50, locations: [ { id: 6, center: '인천1센터(청라)', zone: 'C-Zone', loc: 'RC-01-01-A', lot: 'L2407C01', expiry: '2026-07-20', mfgDate: '2024-07-20', current: 120, status: '정상', available: 110, lastModified: '2025-06-12 11:45', lastWorker: '정선우(sunwoo.jung)' } ] }
    };
    const allLocationsData = [ {id: 101, no: 1, center: '인천1센터(청라)', zone: 'A-Zone', loc: 'RA-10-A-1A'}, {id: 102, no: 2, center: '인천1센터(청라)', zone: 'B-Zone', loc: 'RB-10-A-1B'}, {id: 103, no: 3, center: '인천2센터(원창)', zone: 'C-Zone', loc: 'RC-01-C-5A'}, {id: 104, no: 4, center: '인천2센터(원창)', zone: 'D-Zone', loc: 'RD-11-B-2C'} ];

    // UI 요소
    const mainPage = document.getElementById('mainPage'), inventoryListEl = document.getElementById('inventoryList');
    const detailPage = document.getElementById('detailPage'), reasonModal = document.getElementById('reasonModal'), locationSearchModal = document.getElementById('locationSearchModal');
    let activeEdit = {}, selectedSearchLocation = null;
    const skuInfoPanel = document.getElementById('sku-info-panel'), totalStockPanel = document.getElementById('total-stock-panel'), locationListTable = document.getElementById('location-list-table');
    const adjustmentFormContainer = document.getElementById('adjustmentFormContainer'), selectedLocationInfo = document.getElementById('selectedLocationInfo');
    const detailPageConfirmBtn = document.getElementById('detailPageConfirmBtn'), detailPageCancelBtn = document.getElementById('detailPageCancelBtn');
    const mainAdjustmentType = document.getElementById('mainAdjustmentType');
    const stockAdjustForm = document.getElementById('stockAdjustForm'), stockMoveForm = document.getElementById('stockMoveForm'), stockSplitForm = document.getElementById('stockSplitForm');
    const adjustmentQuantity = document.getElementById('adjustmentQuantity'), quantityChangeDisplay = document.getElementById('quantityChangeDisplay'), stockStatus = document.getElementById('stockStatus'), lotNumber = document.getElementById('lotNumber'), expiryDate = document.getElementById('expiryDate'), mfgDate = document.getElementById('mfgDate'), adjustmentReasonSelect = document.getElementById('adjustmentReasonSelect'), adjustmentReasonDirectInput = document.getElementById('adjustmentReasonDirectInput');
    const moveQuantity = document.getElementById('moveQuantity'), moveQuantityHelpText = document.getElementById('moveQuantityHelpText'), destinationLocation = document.getElementById('destinationLocation'), moveReason = document.getElementById('moveReason'), openLocationSearchModalBtn = document.getElementById('openLocationSearchModalBtn');
    const splitQuantity = document.getElementById('splitQuantity'), splitQuantityHelpText = document.getElementById('splitQuantityHelpText'), splitDestinationLocation = document.getElementById('splitDestinationLocation'), openSplitLocationSearchModalBtn = document.getElementById('openSplitLocationSearchModalBtn'), splitStockStatus = document.getElementById('splitStockStatus'), splitLotNumber = document.getElementById('splitLotNumber'), splitExpiryDate = document.getElementById('splitExpiryDate'), splitMfgDate = document.getElementById('splitMfgDate'), splitReason = document.getElementById('splitReason');
    const closeLocationSearchModalBtn = document.getElementById('closeLocationSearchModalBtn'), locationSearchResultTable = document.getElementById('location-search-result-table'), locationSearchModalFooter = document.getElementById('locationSearchModalFooter');
    const inlineReasonSelect = document.getElementById('inlineReasonSelect'), inlineReasonTextContainer = document.getElementById('inlineReasonTextContainer'), inlineReasonText = document.getElementById('inlineReasonText');
    let workingProductCopy = null, selectedLocation = null;

    // 공통 함수
    function openModal(modalEl) { modalEl.classList.add('active'); }
    function closeModal(modalEl) { modalEl.classList.remove('active'); }

    // 메인 목록 페이지
    function renderInventoryList() {
        if (!inventoryListEl) return;
        inventoryListEl.innerHTML = '';
        Object.values(database).forEach(product => {
            product.locations.forEach((loc, index) => {
                const row = document.createElement('tr'); row.dataset.sku = product.sku; row.dataset.locationId = loc.id;
                const isLastRow = index === product.locations.length - 1;
                const bottomBorderClass = isLastRow ? 'border-b-2 border-gray-300' : 'border-b';
                let rowHtml = '';
                if (index === 0) { rowHtml += `<td class="px-4 py-3 align-top ${bottomBorderClass}" rowspan="${product.locations.length}">${product.seller}</td><td class="px-4 py-3 align-top ${bottomBorderClass}" rowspan="${product.locations.length}">${product.sku}</td><td class="px-4 py-3 align-top ${bottomBorderClass}" rowspan="${product.locations.length}"><a href="#" class="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline product-link" data-sku="${product.sku}">${product.name}</a></td><td class="px-4 py-3 align-top ${bottomBorderClass}" rowspan="${product.locations.length}">${product.optionCode}</td><td class="px-4 py-3 align-top ${bottomBorderClass}" rowspan="${product.locations.length}">${product.option}</td><td class="px-4 py-3 align-top ${bottomBorderClass}" rowspan="${product.locations.length}">${product.barcode}</td><td class="px-4 py-3 align-top text-right ${bottomBorderClass}" rowspan="${product.locations.length}">${product.totalStock.toLocaleString()}</td><td class="px-4 py-3 align-top text-right ${bottomBorderClass}" rowspan="${product.locations.length}">${product.scheduledRelease.toLocaleString()}</td><td class="px-4 py-3 align-top text-right ${bottomBorderClass} text-blue-600 font-bold" rowspan="${product.locations.length}">${product.availableStock.toLocaleString()}</td><td class="px-4 py-3 align-top text-right ${bottomBorderClass} text-red-600 font-bold" rowspan="${product.locations.length}">${product.safetyStock.toLocaleString()}</td>`; }
                rowHtml += `<td class="px-4 py-3 ${bottomBorderClass}">${loc.center}</td><td class="px-4 py-3 ${bottomBorderClass}">${loc.zone.replace('-Zone', '')}</td><td class="px-4 py-3 ${bottomBorderClass}"><div class="inline-input text-left hover:bg-slate-100 cursor-pointer inline-location-edit" data-sku="${product.sku}" data-location-id="${loc.id}">${loc.loc}</div></td><td class="px-4 py-3 ${bottomBorderClass}"><input type="text" value="${loc.lot}" class="inline-input" data-field="lot" data-sku="${product.sku}" data-location-id="${loc.id}"></td><td class="px-4 py-3 ${bottomBorderClass}"><div class="date-input-wrapper"><input type="text" value="${loc.expiry}" class="inline-input" data-field="expiry" data-sku="${product.sku}" data-location-id="${loc.id}" placeholder="YYYY-MM-DD"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div></td><td class="px-4 py-3 ${bottomBorderClass} text-right"><input type="number" value="${loc.current}" class="inline-input text-right" data-field="current" data-sku="${product.sku}" data-location-id="${loc.id}"></td><td class="px-4 py-3 align-middle text-right text-slate-600 ${bottomBorderClass}">${(loc.current - loc.available).toLocaleString()}</td><td class="px-4 py-3 align-middle text-right text-blue-600 font-bold ${bottomBorderClass}">${loc.available.toLocaleString()}</td><td class="px-4 py-3 ${bottomBorderClass}"><select class="inline-select" data-field="status" data-sku="${product.sku}" data-location-id="${loc.id}"><option value="정상" ${loc.status === '정상' ? 'selected' : ''}>정상</option><option value="불량" ${loc.status === '불량' ? 'selected' : ''}>불량</option><option value="유통기한임박" ${loc.status === '유통기한임박' ? 'selected' : ''}>유통기한임박</option></select></td><td class="px-4 py-3 text-xs text-slate-500 ${bottomBorderClass}">${loc.lastModified || '-'}</td><td class="px-4 py-3 text-slate-600 ${bottomBorderClass}">${loc.lastWorker || '-'}</td>`;
                row.innerHTML = rowHtml; inventoryListEl.appendChild(row);
            });
        });
    }

    function handleInlineFieldChange(e) {
        const input = e.target;
        if (!input.matches('.inline-input, .inline-select')) return;
        
        const sku = input.dataset.sku; const locationId = input.dataset.locationId; const field = input.dataset.field;
        const product = database[sku]; const location = product.locations.find(l => l.id == locationId);
        const originalValue = location[field]; const newValue = input.type === 'number' ? parseInt(input.value) : input.value;
        if (String(originalValue) !== String(newValue)) { activeEdit = { input, originalValue, newValue, productSku: sku, locationId, field }; openReasonModal(); }
    }

    function openReasonModal() {
        const { productSku, locationId, field, originalValue, newValue } = activeEdit;
        const product = database[productSku]; const location = product.locations.find(l => l.id == locationId);
        const fieldDisplayMap = { loc: '로케이션', lot: 'LOT 번호', expiry: '유통기한', current: '현재재고', status: '상태' };
        document.getElementById('reasonModalLocation').textContent = `${location.center} > ${location.zone.replace('-Zone', '')} > ${field === 'loc' ? originalValue : location.loc}`;
        document.getElementById('reasonModalField').textContent = fieldDisplayMap[field] || field;
        document.getElementById('reasonModalOldValue').textContent = originalValue; document.getElementById('reasonModalNewValue').textContent = newValue;
        inlineReasonSelect.value = ''; inlineReasonText.value = '';
        inlineReasonTextContainer.classList.add('hidden');
        openModal(reasonModal);
    }

    // 상세 페이지
    function showDetailPage(sku) {
        workingProductCopy = JSON.parse(JSON.stringify(database[sku]));
        mainPage.classList.add('hidden'); detailPage.classList.remove('hidden');
        loadProductDetail(workingProductCopy);
    }
    function showMainPage() {
        mainPage.classList.remove('hidden'); detailPage.classList.add('hidden');
        renderInventoryList();
    }
    function createInfoRow(label, value) { return `<div class="col-span-1"><p class="font-medium text-slate-500">${label}</p><p class="text-slate-800 font-semibold mt-1">${value || '-'}</p></div>`; }
    function createTotalStockRow(label, value, colorClass = 'text-slate-800') { return `<div class="col-span-1"><p class="font-medium text-slate-500">${label}</p><p class="${colorClass} font-extrabold text-xl mt-1">${(value || 0).toLocaleString()}</p></div>`; }
    function loadProductDetail(product) {
        skuInfoPanel.innerHTML = `${createInfoRow('셀러', product.seller)} ${createInfoRow('상품코드 (SKU)', product.sku)} ${createInfoRow('상품명', product.name)} ${createInfoRow('옵션', product.option)} ${createInfoRow('옵션코드', product.optionCode)} ${createInfoRow('바코드', product.barcode)} ${createInfoRow('상품유형', product.productType)} ${createInfoRow('보관', product.storage)} ${createInfoRow('공급사', product.supplier)}`;
        totalStockPanel.innerHTML = `${createTotalStockRow('현재재고', product.totalStock)} ${createTotalStockRow('가용재고', product.availableStock, 'text-indigo-600')}${createTotalStockRow('출고예정', product.scheduledRelease)} ${createTotalStockRow('안전재고', product.safetyStock, 'text-red-600')}`;
        locationListTable.innerHTML = '';
        product.locations.forEach(loc => {
            const row = document.createElement('tr');
            row.className = "hover:bg-slate-100 transition-colors duration-150 table-clickable-row"; row.dataset.locationId = loc.id;
            const statusClass = loc.status === '정상' ? 'bg-green-100 text-green-800' : (loc.status === '유통기한임박' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800');
            row.innerHTML = `<td class="px-4 py-3"><div class="font-bold">${loc.center}</div><div class="text-xs text-slate-500">${loc.zone}</div></td><td class="px-4 py-3 font-semibold text-slate-600">${loc.loc}</td> <td class="px-3 py-3 text-center text-indigo-600 font-mono font-bold">${loc.available.toLocaleString()}</td><td class="px-4 py-3"><span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full ${statusClass}">${loc.status}</span></td>`;
            locationListTable.appendChild(row);
        });
        resetDetailPageForm();
    }
    function resetDetailPageForm() {
        adjustmentFormContainer.classList.add('disabled-form'); selectedLocationInfo.textContent = '-'; detailPageConfirmBtn.disabled = true;
        mainAdjustmentType.value = 'adjust'; toggleForms();
        [adjustmentQuantity, quantityChangeDisplay, lotNumber, expiryDate, mfgDate, adjustmentReasonSelect, adjustmentReasonDirectInput, moveQuantity, moveReason, destinationLocation, splitQuantity, splitQuantityHelpText, splitDestinationLocation, splitLotNumber, splitExpiryDate, splitMfgDate, splitReason].forEach(el => el.value = '');
        stockStatus.value = '정상'; splitStockStatus.value = '정상';
        adjustmentReasonDirectInput.classList.add('hidden');
        document.querySelectorAll('#location-list-table tr').forEach(row => row.classList.remove('table-row-selected'));
        selectedLocation = null;
    }
    function handleLocationSelect(e) {
        const tr = e.target.closest('#location-list-table tr');
        if(!tr) return;

        const locationId = tr.dataset.locationId;
        selectedLocation = workingProductCopy.locations.find(loc => loc.id === parseInt(locationId));
        document.querySelectorAll('#location-list-table tr').forEach(row => { row.classList.toggle('table-row-selected', row.dataset.locationId == locationId); });
        adjustmentFormContainer.classList.remove('disabled-form'); detailPageConfirmBtn.disabled = false;
        selectedLocationInfo.innerHTML = `${selectedLocation.center} / ${selectedLocation.zone} / ${selectedLocation.loc} <span class="font-normal text-slate-500">(가용: ${selectedLocation.available.toLocaleString()})</span>`;
        adjustmentQuantity.value = selectedLocation.current; calculateQuantityChange();
        stockStatus.value = selectedLocation.status; expiryDate.value = selectedLocation.expiry;
        mfgDate.value = selectedLocation.mfgDate; lotNumber.value = selectedLocation.lot;
        moveQuantityHelpText.textContent = `이동 가능: ${selectedLocation.available.toLocaleString()}`; moveQuantity.max = selectedLocation.available;
        splitQuantityHelpText.textContent = `분할 가능: ${selectedLocation.available.toLocaleString()}`; splitQuantity.max = selectedLocation.available;
        splitStockStatus.value = selectedLocation.status; splitLotNumber.value = selectedLocation.lot;
        splitExpiryDate.value = selectedLocation.expiry; splitMfgDate.value = selectedLocation.mfgDate;
        adjustmentQuantity.focus();
    }
    function calculateQuantityChange() {
        if (!selectedLocation) return;
        const diff = parseInt(adjustmentQuantity.value) - selectedLocation.current;
        if (isNaN(diff)) { quantityChangeDisplay.textContent = ''; return; }
        quantityChangeDisplay.textContent = diff > 0 ? `+${diff}` : String(diff);
        quantityChangeDisplay.className = `mt-1 block w-full py-2.5 px-4 text-sm bg-slate-100 border rounded-lg h-[42px] flex items-center font-mono font-bold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-slate-500'}`;
    }
    function toggleForms() {
        stockAdjustForm.classList.toggle('hidden', mainAdjustmentType.value !== 'adjust');
        stockMoveForm.classList.toggle('hidden', mainAdjustmentType.value !== 'move');
        stockSplitForm.classList.toggle('hidden', mainAdjustmentType.value !== 'split');
    }
    function openLocationSearch(context, targetInputId) {
        locationSearchModalFooter.innerHTML = '';
        const button = document.createElement('button');
        button.className = "px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700";
        if (context === 'inlineEdit') { button.id = 'selectLocationBtn'; button.textContent = '선택'; }
        else { button.id = 'registerLocationBtn'; button.textContent = '등록'; button.dataset.targetInput = targetInputId; }
        locationSearchModalFooter.appendChild(button);
        renderLocationSearchResult(allLocationsData);
        locationSearchModal.classList.add('active');
        locationSearchModal.querySelector('.modal-content').style.transform = 'scale(1)';
    }
    function closeLocationSearch() {
        locationSearchModal.querySelector('.modal-content').style.transform = 'scale(0.95)';
        locationSearchModal.classList.remove('active');
        selectedSearchLocation = null;
    }
    function renderLocationSearchResult(locations) {
        locationSearchResultTable.innerHTML = '';
        locations.forEach(loc => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-100 transition-colors duration-150 table-clickable-row';
            row.dataset.locationData = JSON.stringify(loc);
            row.innerHTML = `<td class="px-4 py-3 text-slate-600">${loc.no}</td><td class="px-4 py-3 text-slate-800 font-bold">${loc.center}</td><td class="px-4 py-3 text-slate-600">${loc.zone}</td><td class="px-4 py-3 text-slate-600 font-semibold">${loc.loc}</td>`;
            locationSearchResultTable.appendChild(row);
        });
    }

    if (document.getElementById('inventory-adjustmentView')) {
        // 이벤트 리스너
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-link')) { e.preventDefault(); showDetailPage(e.target.closest('.product-link').dataset.sku); return; }
            if (e.target.closest('.inline-location-edit')) {
                const target = e.target.closest('.inline-location-edit');
                const product = database[target.dataset.sku], location = product.locations.find(l => l.id == target.dataset.locationId);
                activeEdit = { input: target, originalValue: location.loc, newValue: null, productSku: target.dataset.sku, locationId: target.dataset.locationId, field: 'loc' };
                openLocationSearch('inlineEdit'); return;
            }
            if (e.target.closest('#reasonModal .modal-close-btn')) { if(activeEdit.input && activeEdit.field !== 'loc') activeEdit.input.value = activeEdit.originalValue; closeModal(reasonModal); return; }
            if (e.target.closest('#locationSearchModal')) {
                if (e.target.closest('#closeLocationSearchModalBtn') || e.target === locationSearchModal) { closeLocationSearch(); return; }
                const searchResultRow = e.target.closest('#location-search-result-table tr');
                if (searchResultRow) {
                    document.querySelectorAll('#location-search-result-table tr').forEach(r => r.classList.remove('table-row-selected'));
                    searchResultRow.classList.add('table-row-selected');
                    selectedSearchLocation = JSON.parse(searchResultRow.dataset.locationData); return;
                }
                if (e.target.id === 'registerLocationBtn') {
                    if(!selectedSearchLocation) { alert('등록할 로케이션을 선택해주세요.'); return; }
                    document.getElementById(e.target.dataset.targetInput).value = selectedSearchLocation.loc;
                    closeLocationSearch(); return;
                }
                if (e.target.id === 'selectLocationBtn') {
                    if(!selectedSearchLocation) { alert('선택할 로케이션을 선택해주세요.'); return; }
                    activeEdit.newValue = selectedSearchLocation.loc;
                    closeLocationSearch();
                    if (activeEdit.originalValue !== activeEdit.newValue) openReasonModal();
                    return;
                }
            }
        });
        inventoryListEl.addEventListener('change', handleInlineFieldChange);
        locationListTable.addEventListener('click', handleLocationSelect);
        
        function handleDateInputFocus(e) {
            if (e.target.tagName === 'SELECT') return; 
            if (e.target.matches('input[data-field="expiry"]') || e.target.matches('input[data-date-input="true"]')) {
                e.target.type = 'date';
                try { e.target.showPicker(); } catch (error) { /* showPicker() 미지원 브라우저 무시 */ }
            }
        }
        function handleDateInputBlur(e) {
            if (e.target.tagName === 'SELECT') return;
            if (e.target.matches('input[data-field="expiry"]') || e.target.matches('input[data-date-input="true"]')) {
                e.target.type = 'text';
            }
        }

        document.body.addEventListener('focusin', handleDateInputFocus);
        document.body.addEventListener('focusout', handleDateInputBlur);

        document.getElementById('inlineSaveReasonBtn').addEventListener('click', () => {
            const reason = inlineReasonSelect.value;
            const reasonText = inlineReasonText.value.trim();
            if (!reason) { alert('조정 사유를 선택해주세요.'); return; }
            if (reason === '기타' && !reasonText) { alert('기타 사유를 직접 입력해주세요.'); inlineReasonText.focus(); return; }

            const { productSku, locationId, field, newValue } = activeEdit;
            const product = database[productSku]; const location = product.locations.find(l => l.id == locationId);
            if(field === 'current') { const diff = newValue - location.current; product.totalStock += diff; product.availableStock += diff; location.available += diff; }
            location[field] = newValue;
            const now = new Date(); location.lastModified = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            location.lastWorker = '홍길동(gildong)';
            renderInventoryList(); closeModal(reasonModal); activeEdit = {};
        });

        // 상세 페이지 이벤트
        detailPageCancelBtn.addEventListener('click', showMainPage);
        mainAdjustmentType.addEventListener('change', toggleForms);
        adjustmentQuantity.addEventListener('input', calculateQuantityChange);
        
        // 조정 사유 '기타' 선택 시 직접 입력 창 표시
        adjustmentReasonSelect.addEventListener('change', (e) => {
            adjustmentReasonDirectInput.classList.toggle('hidden', e.target.value !== '기타');
        });

        inlineReasonSelect.addEventListener('change', (e) => {
            inlineReasonTextContainer.classList.toggle('hidden', e.target.value !== '기타');
        });
        
        [openLocationSearchModalBtn, openSplitLocationSearchModalBtn].forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetInputId = e.currentTarget.id === 'openLocationSearchModalBtn' ? 'destinationLocation' : 'splitDestinationLocation';
                openLocationSearch('register', targetInputId);
            });
        });

        // 최종 저장 버튼
        detailPageConfirmBtn.addEventListener('click', () => {
            if (!selectedLocation) {
                alert('처리할 로케이션을 먼저 선택해주세요.');
                return;
            }

            const adjustmentType = mainAdjustmentType.value;
            // 실제 환경에서는 로그인 사용자 정보 사용
            const worker = '홍길동(gildong)'; 
            const now = new Date();
            const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            try {
                switch (adjustmentType) {
                    case 'adjust':
                        handleAdjustStock(timestamp, worker);
                        break;
                    case 'move':
                        handleMoveStock(timestamp, worker);
                        break;
                    case 'split':
                        handleSplitStock(timestamp, worker);
                        break;
                }
                
                // 데이터베이스 원본에 작업 사본 반영
                database[workingProductCopy.sku] = JSON.parse(JSON.stringify(workingProductCopy));
                
                alert('재고 조정 내용이 성공적으로 저장되었습니다.');
                showMainPage();

            } catch (error) {
                alert(`오류: ${error.message}`);
                // 오류가 발생해도 workingProductCopy는 변경되었을 수 있으므로 UI를 다시 로드하여 사용자 입력을 유지합니다.
                loadProductDetail(workingProductCopy);
                // 선택된 로케이션 재강조
                document.querySelector(`#location-list-table tr[data-location-id="${selectedLocation.id}"]`)?.classList.add('table-row-selected');
            }
        });

        // 초기 렌더링
        renderInventoryList();
    }
    setupModal('multiTrackModal', 'openMultiTrackModalBtn', ['closeMultiTrackModalBtn', 'cancelMultiTrackBtn']);
    setupModal('trackingModal', 'openTrackingModalBtn', ['closeTrackingModalBtn']);
}); 