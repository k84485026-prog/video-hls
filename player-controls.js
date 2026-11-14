const media = document.querySelector('#player');
const playButton = document.querySelector('#toggle');
const seek = document.querySelector('#seek');
const muteButton = document.querySelector('#mute');
const fullscreenButton = document.querySelector('#fullscreen');
const feedback = document.querySelector('#status');

function updateProgress() {
  const duration = Number.isFinite(media.duration) ? media.duration : 0;
  seek.disabled = duration === 0;
  seek.max = duration;
  seek.value = media.currentTime;
}

playButton.addEventListener('click', async () => {
  if (!media.paused) {
    media.pause();
    return;
  }
  try {
    await media.play();
  } catch (error) {
    if (error.name !== 'AbortError') feedback.textContent = '视频播放失败，请重试。';
  }
});

media.addEventListener('play', () => { playButton.textContent = '暂停'; });
media.addEventListener('pause', () => { playButton.textContent = '播放'; });
media.addEventListener('waiting', () => {
  if (!media.paused && !media.error && !feedback.textContent) feedback.textContent = '正在缓冲…';
});
media.addEventListener('playing', () => { feedback.textContent = ''; });
for (const event of ['durationchange', 'timeupdate', 'emptied']) {
  media.addEventListener(event, updateProgress);
}
seek.addEventListener('input', () => { media.currentTime = seek.valueAsNumber; });

muteButton.addEventListener('click', () => { media.muted = !media.muted; });
media.addEventListener('volumechange', () => {
  muteButton.textContent = media.muted ? '取消静音' : '静音';
});

fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.fullscreenEnabled) await document.querySelector('main').requestFullscreen();
    else if (media.webkitEnterFullscreen) media.webkitEnterFullscreen();
  } catch {
    feedback.textContent = '无法进入全屏。';
  }
});
document.addEventListener('fullscreenchange', () => {
  fullscreenButton.textContent = document.fullscreenElement ? '退出全屏' : '全屏';
});
