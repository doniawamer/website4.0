/** Keep only one design-page reel playing at a time. */

const REEL_SELECTOR = "video[data-reel-phone]";

export function playReelExclusive(video: HTMLVideoElement): Promise<void> {
  document.querySelectorAll<HTMLVideoElement>(REEL_SELECTOR).forEach((other) => {
    if (other !== video && !other.paused) {
      other.pause();
    }
  });
  video.muted = false;
  return video.play().then(() => undefined);
}
