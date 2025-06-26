lottie.loadAnimation({
  container: document.getElementById('loader'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'loading.json' // your Lottie file
});

// Hide loader and show content after 3 seconds
setTimeout(() => {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('main-content').style.display = 'flex';

  const likeContainer = document.getElementById('like-button');
    const likeAnim = lottie.loadAnimation({
      container: likeContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'like-button.json' // should include both empty and full in one file
    });

    let isLiked = false;

    likeContainer.addEventListener('click', () => {
      if (!isLiked) {
        likeAnim.playSegments([0, 30], true); // from empty to full
      } else {
        likeAnim.playSegments([30, 0], true); // from full to empty
      }
      isLiked = !isLiked;
    });

  const otherAnim = lottie.loadAnimation({
    container: document.getElementById('other-button'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'other-button.json'
  });

  document.getElementById('like-button').addEventListener('click', () => {
    likeAnim.goToAndPlay(0, true);
  });

  document.getElementById('other-button').addEventListener('click', () => {
    otherAnim.goToAndPlay(0, true);
  });

}, 4000);