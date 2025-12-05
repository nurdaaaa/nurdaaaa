document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("driverUpload");
  const preview = document.getElementById("preview");
  const label = document.getElementById("upload-label");

  // Показ изображения
  function showImage(src) {
    let img = preview.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      preview.appendChild(img);
    }
    img.src = src;
    img.style.transform = "translate(0px,0px) scale(1)";
    label.style.display = "none";
  }

  function resetPreview() {
    preview.innerHTML = "";
    label.style.display = "inline-block";
  }

  // Загрузка изображения
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

  // Восстановление при перезагрузке
  const saved = localStorage.getItem("driverImage");
  if(saved) showImage(saved);

  // --- Touch pinch-zoom & drag ---
  let startDistance = 0, currentScale = 1, startX = 0, startY = 0, currentX = 0, currentY = 0, isPanning = false;
  preview.addEventListener("touchstart", function(e) {
    const img = preview.querySelector("img");
    if(!img) return;
    if(e.touches.length === 2){
      startDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      isPanning = false;
    } else if(e.touches.length === 1 && currentScale > 1){
      isPanning = true;
      startX = e.touches[0].clientX - currentX;
      startY = e.touches[0].clientY - currentY;
    }
  }, {passive: false});

  preview.addEventListener("touchmove", function(e){
    const img = preview.querySelector("img");
    if(!img) return;
    e.preventDefault();
    if(e.touches.length === 2){
      const newDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const scaleChange = newDistance / startDistance;
      let newScale = currentScale * scaleChange;
      if(newScale < 1) newScale = 1;
      img.style.transform = `translate(${currentX}px,${currentY}px) scale(${newScale})`;
    } else if(e.touches.length === 1 && isPanning){
      currentX = e.touches[0].clientX - startX;
      currentY = e.touches[0].clientY - startY;
      img.style.transform = `translate(${currentX}px,${currentY}px) scale(${currentScale})`;
    }
  }, {passive: false});

  preview.addEventListener("touchend", function(e){
    const img = preview.querySelector("img");
    if(!img) return;
    const style = window.getComputedStyle(img);
    const matrix = new WebKitCSSMatrix(style.transform);
    currentScale = Math.max(matrix.a,1);
  });
});
