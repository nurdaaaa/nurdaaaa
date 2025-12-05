document.addEventListener("DOMContentLoaded", () => {
  // --- Tabs ---
  const tabBtn1 = document.getElementById("tab-btn-1");
  const tabBtn2 = document.getElementById("tab-btn-2");
  const doc = document.getElementById("doc");
  const req = document.getElementById("req");

  function updateTabs() {
    if (tabBtn1.checked) {
      doc.classList.add("active");
      req.classList.remove("active");
      const saved = localStorage.getItem("driverImage");
      if (saved) showImage(saved);
      else resetPreview();
    } else {
      req.classList.add("active");
      doc.classList.remove("active");
      resetPreview();
    }
  }

  tabBtn1.addEventListener("change", updateTabs);
  tabBtn2.addEventListener("change", updateTabs);
  tabBtn1.checked = true;
  updateTabs();

  // --- Image Upload ---
  const input = document.getElementById("driverUpload");
  const preview = document.getElementById("preview");
  const label = document.getElementById("upload-label");

  function showImage(src) {
    const img = document.createElement("img");
    img.src = src;
    preview.innerHTML = "";
    preview.appendChild(img);
    label.style.display = "none";
  }

  function resetPreview() {
    preview.innerHTML = "";
    label.style.display = "inline-block";
  }

  input.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const src = e.target.result;
      localStorage.setItem("driverImage", src);
      showImage(src);
    };
    reader.readAsDataURL(file);
  });

  // --- Rekvizits ---
  const rekvizits = ["driverName","driverNumber","driverDOB","driverIssued","driverExpiry"];
  rekvizits.forEach(id => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem(id);
    if(saved) el.value = saved;
    el.addEventListener("input", () => {
      localStorage.setItem(id, el.value);
    });
  });

  // --- QR Modal ---
  const openBtn = document.getElementById('btnShowQR');
  const overlay = document.getElementById('qrOverlay');
  const closeBtn = document.getElementById('qrClose');
  const backdrop = document.getElementById('qrBackdrop');

  function openModal() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  // --- Share buttons ---
  document.getElementById("btnShare").addEventListener("click", async () => {
    if(navigator.share){
      try{ await navigator.share({ title:"Водительское удостоверение", url: window.location.href }); }
      catch(err){ console.log(err); }
    } else alert("Ваш браузер не поддерживает системное меню поделиться");
  });

  document.getElementById("btnShareRekv").addEventListener("click", async () => {
    if(navigator.share){
      const rekvData = rekvizits.map(id => document.getElementById(id).value).join("\n");
      try{ await navigator.share({ title:"Реквизиты ВУ", text: rekvData }); }
      catch(err){ console.log(err); }
    } else alert("Ваш браузер не поддерживает системное меню поделиться");
  });
});
