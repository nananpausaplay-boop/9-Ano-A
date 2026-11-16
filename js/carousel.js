const photos = [
  "854662730_1830566031608874_5544062110993959440_n.jpg",
  "857431114_3147896228874815_1700145465854592634_n.jpg",
  "861784694_1120630180511165_4663957082551336629_n.jpg",
  "861814043_1096311743277702_3777647277784752407_n.jpg",
  "862653983_1302650281952151_5587929863478166161_n.jpg",
  "865898331_2272034933659555_4919877203521353558_n.jpg",
  "867966357_1629361802169045_450309018325541063_n.jpg",
  "WhatsApp Image 2026-11-12 at 09.56.44.jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.06 (1).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.06 (2).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.06 (3).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.06.jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.07 (1).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.07 (2).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.07 (3).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.07 (4).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.07.jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.08 (1).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.08.jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.09 (1).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.09 (2).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.09.jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.10.jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.11 (1).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.11.jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.12 (1).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.12 (2).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.12 (3).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.12 (4).jpeg",
  "WhatsApp Image 2026-11-12 at 10.06.12.jpeg",
  "WhatsApp Image 2026-11-12 at 10.20.25.jpeg",
  "WhatsApp Image 2026-11-12 at 10.27.32.jpeg"
];

const image = document.querySelector("#carousel-image");
const photoFrame = document.querySelector(".photo-frame");
const progress = document.querySelector("#progress");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const carousel = document.querySelector(".carousel");
const planetArt = document.querySelector(".hero-art");
let activeIndex = 0;

function createOrbitAnimation(element, radiusX, radiusY, rotationDegrees, startAngle = 0) {
  const centerX = 49.5;
  const centerY = 52.5;
  const rotation = rotationDegrees * Math.PI / 180;
  const points = 120;
  const frames = Array.from({ length: points + 1 }, (_, index) => {
    const angle = startAngle + (index / points) * Math.PI * 2;
    const localX = radiusX * Math.cos(angle);
    const localY = radiusY * Math.sin(angle);
    const x = centerX + localX * Math.cos(rotation) - localY * Math.sin(rotation);
    const y = centerY + localX * Math.sin(rotation) + localY * Math.cos(rotation);
    return { left: `${x}%`, top: `${y}%` };
  });

  const animation = element.animate(frames, {
    duration: 26000,
    iterations: Infinity,
    easing: "linear"
  });
  animation.pause();
  return animation;
}

const orbitAnimations = [
  createOrbitAnimation(document.querySelector(".art-note"), 42.5, 21.5, -29),
  createOrbitAnimation(document.querySelector(".hero-stamp"), 36.5, 27.5, 48, Math.PI)
];
let pointerIsOverPlanet = false;
let orbitPinned = false;

function setOrbiting(isActive) {
  orbitAnimations.forEach((animation) => isActive ? animation.play() : animation.pause());
}

planetArt.addEventListener("pointerenter", (event) => {
  if (event.pointerType !== "mouse") return;
  pointerIsOverPlanet = true;
  setOrbiting(true);
});

planetArt.addEventListener("pointerleave", (event) => {
  if (event.pointerType !== "mouse") return;
  pointerIsOverPlanet = false;
  if (!orbitPinned) setOrbiting(false);
});

planetArt.addEventListener("click", (event) => {
  orbitPinned = !orbitPinned;
  planetArt.setAttribute("aria-pressed", String(orbitPinned));
  const isTouchOrKeyboard = event.pointerType === "touch" || event.detail === 0;
  setOrbiting(orbitPinned || (pointerIsOverPlanet && !isTouchOrKeyboard));
});

function showPhoto(index) {
  activeIndex = (index + photos.length) % photos.length;
  const name = photos[activeIndex];
  image.classList.add("is-changing");

  const nextImage = new Image();
  nextImage.onload = () => {
    image.src = nextImage.src;
    image.alt = `Foto ${activeIndex + 1} de ${photos.length} da turma do 9º A`;
    const ratio = nextImage.naturalWidth / nextImage.naturalHeight;
    photoFrame.classList.toggle("is-portrait", ratio < 0.85);
    photoFrame.classList.toggle("is-landscape", ratio > 1.15);
    photoFrame.classList.toggle("is-square", ratio >= 0.85 && ratio <= 1.15);
    photoFrame.classList.toggle("trim-photo-border", [0, 2, 5, 6, 15].includes(activeIndex));
    progress.style.width = `${((activeIndex + 1) / photos.length) * 100}%`;
    image.classList.remove("is-changing");
  };
  nextImage.onerror = () => {
    image.alt = "Não foi possível carregar esta foto.";
    image.classList.remove("is-changing");
  };
  nextImage.src = `Images/${encodeURIComponent(name).replaceAll("%2F", "/")}`;
}

previous.addEventListener("click", () => showPhoto(activeIndex - 1));
next.addEventListener("click", () => showPhoto(activeIndex + 1));

let touchStart = 0;
carousel.addEventListener("touchstart", (event) => {
  touchStart = event.changedTouches[0].screenX;
}, { passive: true });
carousel.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].screenX - touchStart;
  if (Math.abs(distance) > 45) showPhoto(activeIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
  if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
});

showPhoto(0);

