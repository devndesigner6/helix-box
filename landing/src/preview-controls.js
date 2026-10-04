export async function togglePreview(video, onError = () => {}) {
  if (!video) return false;
  if (!video.paused) {
    video.pause();
    return false;
  }
  try {
    await video.play();
    return !video.paused;
  } catch (error) {
    onError(error);
    return false;
  }
}
