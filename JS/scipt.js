// Wrap every letter in a span
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({ loop: true })
  .add({
    targets: '.ml3 .letter',
    opacity: [0, 1],
    easing: "easeInOutQuad",
    duration: 2250,
    delay: (el, i) => 150 * (i + 1)
  }).add({
    targets: '.ml3',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });


function spark(event) {
  let i = document.createElement('i');
  i.style.left = (event.pageX) + 'px';
  i.style.top = (event.pageY) + 'px';
  // to add random shape
  i.style.scale = `${Math.random() * 2 + 1}`;

  // randomly set some property. --x and --y is the name of variable
  // The i.style.setProperty function is used to set CSS custom properties (variables) directly on an element's style object.
  i.style.setProperty('--x', getRandomTransitionValue());
  i.style.setProperty('--y', getRandomTransitionValue());

  document.body.appendChild(i);

  setTimeout(() => {
    document.body.removeChild(i);
  }, 2000);
}

function getRandomTransitionValue() {
  return `${Math.random() * 400 - 200}px`;
}

document.addEventListener('mousemove', spark);