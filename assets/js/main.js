/* ============================================
   楊佳叡醫師個人網站 — 主要 JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- 漢堡選單開關 --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // 點擊任何連結都關閉選單
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- 手機版下拉選單：動態插入展開箭頭，讓主連結可正常導覽 --- */
  document.querySelectorAll('.mobile-nav-item').forEach(function (item) {
    var dropdown = item.querySelector('.mobile-dropdown');
    if (!dropdown) return;

    var link = item.querySelector('a');
    var toggle = document.createElement('span');
    toggle.className = 'mobile-dropdown-toggle';
    toggle.setAttribute('aria-label', '展開子選單');
    link.insertAdjacentElement('afterend', toggle);

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      item.classList.toggle('open');
    });
  });

  /* --- Hashtag 篩選功能（用於知識專欄 & 案例分享） --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-tags]');

  if (filterBtns.length > 0 && filterItems.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var tag = btn.getAttribute('data-filter');

        filterItems.forEach(function (item) {
          if (tag === 'all') {
            item.style.display = '';
          } else {
            var tags = item.getAttribute('data-tags').split(',');
            item.style.display = tags.indexOf(tag) !== -1 ? '' : 'none';
          }
        });
      });
    });
  }

  /* --- 證書圖片點擊放大（Lightbox） --- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.cert-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var imgSrc = item.getAttribute('data-full');
        if (imgSrc) {
          lightboxImg.src = imgSrc;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    lightbox.addEventListener('click', function () {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  /* --- 滾動淡入動畫 --- */
  var fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  /* --- 演講 Accordion --- */
  document.querySelectorAll('.accordion-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item = this.closest('.accordion-item');
      var isOpen = item.classList.contains('open');
      // 關閉所有
      document.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });
      // 若原本是關閉的，則打開
      if (!isOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- 聯絡表單非同步送出（頁尾迷你表單 + 門診掛號主表單） --- */
  function handleAsyncForm(form, successClass) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.innerHTML = '<p class="' + successClass + '">感謝您的訊息，我們將盡快與您聯繫。</p>';
        } else {
          alert('送出失敗，請稍後再試。');
        }
      } catch (err) {
        alert('送出失敗，請確認網路連線後再試。');
      }
    });
  }

  document.querySelectorAll('.footer-inquiry-form').forEach(function (form) {
    handleAsyncForm(form, 'footer-form-success');
  });
  document.querySelectorAll('.contact-inquiry-form').forEach(function (form) {
    handleAsyncForm(form, 'contact-form-success');
  });

});
