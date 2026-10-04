import test from 'node:test';
import assert from 'node:assert/strict';

const { togglePreview } = await import('../src/preview-controls.js').catch(() => ({}));
// The media platform is unavailable in Node. Keep its async contract and events,
// and assert the controller's resulting playback state, not mocked call counts.
class MediaFixture extends EventTarget {
  paused = true;
  constructor(failure = false) { super(); this.failure = failure; }
  async play() {
    if (this.failure) throw new Error('Playback denied');
    this.paused = false;
    this.dispatchEvent(new Event('play'));
  }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}

test('preview activates only after the media play request succeeds', async () => {
  assert.equal(typeof togglePreview, 'function', 'Preview controller is missing');
  const video = new MediaFixture();
  assert.equal(await togglePreview(video), true);
  assert.equal(video.paused, false);
});
test('preview returns to paused state on the second toggle', async () => {
  assert.equal(typeof togglePreview, 'function', 'Preview controller is missing');
  const video = new MediaFixture();
  await video.play();
  assert.equal(await togglePreview(video), false);
  assert.equal(video.paused, true);
});
test('denied preview playback stays inactive and reports an error', async () => {
  assert.equal(typeof togglePreview, 'function', 'Preview controller is missing');
  const video = new MediaFixture(true);
  let error;
  assert.equal(await togglePreview(video, reason => { error = reason; }), false);
  assert.equal(video.paused, true);
  assert.equal(error?.message, 'Playback denied');
});
test('a missing video cannot activate the play control', async () => {
  assert.equal(typeof togglePreview, 'function', 'Preview controller is missing');
  assert.equal(await togglePreview(null), false);
});
