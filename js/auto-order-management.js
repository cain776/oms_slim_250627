document.addEventListener('DOMContentLoaded', () => {
    // 이 스크립트는 auto-order-managementView가 활성화되었을 때만 실행되어야 합니다.
    // 하지만 LNB 메뉴 클릭 로직은 main.js에 있으므로,
    // 여기서는 auto-order-managementView 내부의 요소에 대한 이벤트 리스너만 등록합니다.

    const view = document.getElementById('auto-order-managementView');
    if (!view) return;

    const orderSearchModal = document.getElementById('orderSearchModal');
    const openSearchModalBtnNew = view.querySelector('#openSearchModalBtnNew'); // view 내부에서 검색
    const closeSearchModalBtnHeader = document.getElementById('closeSearchModalBtnHeader');
    const executeSearchBtn = document.getElementById('executeSearchBtn');
    
    // 이전에 생성된 modal-overlay가 DOM에 남아있을 수 있으므로, 새로 만들거나 찾아야 합니다.
    // main.html에 이미 modal 구조가 있다고 가정하고 진행합니다.
    // 만약 `주문관리.html`의 modal HTML도 main.html로 옮겨야 한다면, 해당 작업이 선행되어야 합니다.
    // 여기서는 `main.html`에 이미 `#orderSearchModal`이 있다고 가정합니다.

    const openModal = (modal) => {
        if(modal) modal.classList.add('active');
    }
    const closeModal = (modal) => {
        if(modal) modal.classList.remove('active');
    }

    if (openSearchModalBtnNew && orderSearchModal) {
        openSearchModalBtnNew.addEventListener('click', () => {
            openModal(orderSearchModal);
        });
    }

    if(closeSearchModalBtnHeader && orderSearchModal) {
        closeSearchModalBtnHeader.addEventListener('click', () => closeModal(orderSearchModal));
    }
    
    if (executeSearchBtn && orderSearchModal) {
        executeSearchBtn.addEventListener('click', () => {
            console.log('Search executed');
            closeModal(orderSearchModal);
        });
    }
    
    if(orderSearchModal) {
        orderSearchModal.addEventListener('click', (e) => {
            if (e.target === orderSearchModal) {
                closeModal(orderSearchModal);
            }
        });
    }

    // Date range button logic inside the modal
    const dateButtons = document.querySelectorAll('.date-range-buttons button');
    dateButtons.forEach(button => {
        button.addEventListener('click', () => {
            dateButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const days = parseInt(button.dataset.days);
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days + 1);

            // YYYY-MM-DD format
            const formatDate = (date) => {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }

            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            if(startDateInput && endDateInput) {
                startDateInput.value = formatDate(startDate);
                endDateInput.value = formatDate(endDate);
            }
        });
    });
}); 