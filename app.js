const modelViewer = document.querySelector('#model-viewer');
const arButton = document.querySelector('#ar-button');
const fullscreenButton = document.querySelector('#fullscreen-button');
const resetViewButton = document.querySelector('#reset-view-button');
const progressFill = document.querySelector('#progress-fill');
const viewerError = document.querySelector('#viewer-error');
const toast = document.querySelector('#toast');

const initialOrbit = '35deg 67deg auto';
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}

modelViewer.addEventListener('progress', (event) => {
  const progress = Math.round(event.detail.totalProgress * 100);
  progressFill.style.width = `${progress}%`;
  if (progress >= 100) {
    window.setTimeout(() => {
      progressFill.parentElement.hidden = true;
    }, 280);
  }
});

modelViewer.addEventListener('load', () => {
  arButton.disabled = false;
  viewerError.hidden = true;
});

modelViewer.addEventListener('error', () => {
  arButton.disabled = true;
  viewerError.hidden = false;
});

modelViewer.addEventListener('ar-status', (event) => {
  arButton.disabled = false;
  if (event.detail.status === 'failed') {
    showToast('AR не запустился. Откройте страницу в Safari на iPhone или Chrome на совместимом Android.');
  }
});

arButton.addEventListener('click', async () => {
  arButton.disabled = true;
  try {
    await modelViewer.activateAR();
  } catch {
    showToast('На этом устройстве AR недоступен. 3D-модель по-прежнему доступна для просмотра.');
  } finally {
    window.setTimeout(() => {
      arButton.disabled = false;
    }, 500);
  }
});

resetViewButton.addEventListener('click', () => {
  modelViewer.cameraOrbit = initialOrbit;
  modelViewer.cameraTarget = 'auto auto auto';
  modelViewer.jumpCameraToGoal();
});

fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    showToast('Полноэкранный режим не поддерживается этим браузером.');
  }
});

document.addEventListener('fullscreenchange', () => {
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Выйти из полноэкранного режима' : 'Открыть на весь экран');
});
