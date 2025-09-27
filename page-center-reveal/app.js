// Config mirroring Svelte variables
const mobileScreenWidth = 768;
const navbarHeight = 64;
const controlsWidth = 225;

// State
let scrollY = 0;
let textOpacity = 1;
let imageOpacity = 0;
let textScale = 1;
let imageScale = 0;
let optionsWidth = 0;
let screenWidth = 0;
let isMobile = false;
let headerHeight = 0;
let progress = 0;
let controlsTopPosition = 0;
let distanceBetweenLayout = 0;
let galleryHeight = 0;
let productImageHeight = 0;
let sideHeight = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function $(id) {
  return document.getElementById(id);
}

// Mock data to render options
const mockData = {
  name: "Jungle",
  sizes: [{ title: "Sizes", list: ["A5", "A4", "A3"] }],
  colours: [{ title: "Colours", list: ["Green", "Yellow", "Purple"] }],
};

function renderOptions() {
  const sizes = $("sizes");
  const colours = $("colours");
  sizes.innerHTML = "";
  colours.innerHTML = "";
  mockData.sizes.forEach(group => {
    const container = document.createElement("div");
    const title = document.createElement("div");
    title.textContent = group.title;
    title.style.fontWeight = "700";
    title.style.marginBottom = ".5rem";
    container.appendChild(title);
    const list = document.createElement("div");
    group.list.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.style.marginRight = ".5rem";
      btn.textContent = item;
      btn.addEventListener("click", () => {
        Array.from(list.children).forEach(b => (b.style.outline = ""));
        btn.style.outline = "2px solid #111827";
      });
      list.appendChild(btn);
    });
    container.appendChild(list);
    sizes.appendChild(container);
  });

  mockData.colours.forEach(group => {
    const container = document.createElement("div");
    const title = document.createElement("div");
    title.textContent = group.title;
    title.style.fontWeight = "700";
    title.style.marginBottom = ".5rem";
    container.appendChild(title);
    const list = document.createElement("div");
    group.list.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.style.marginRight = ".5rem";
      btn.textContent = item;
      btn.addEventListener("click", () => {
        Array.from(list.children).forEach(b => (b.style.outline = ""));
        btn.style.outline = "2px solid #111827";
      });
      list.appendChild(btn);
    });
    container.appendChild(list);
    colours.appendChild(container);
  });
}

function updateLayoutHeights() {
  headerHeight = $("header")?.clientHeight || 0;
  galleryHeight = $("product-gallery-container")?.clientHeight || 0;
  productImageHeight = $("product-image-container")?.clientHeight || 0;
  distanceBetweenLayout = window.innerHeight - headerHeight - navbarHeight;

  if (
    galleryHeight > productImageHeight &&
    galleryHeight > distanceBetweenLayout
  ) {
    sideHeight =
      galleryHeight - (galleryHeight - distanceBetweenLayout) * progress;
  } else if (
    productImageHeight > galleryHeight &&
    productImageHeight > distanceBetweenLayout
  ) {
    sideHeight =
      productImageHeight -
      (productImageHeight - distanceBetweenLayout) * progress;
  } else {
    sideHeight = -1;
  }
}

function applyStyles() {
  const headerText = $("header-text");
  const headerCopy = $("header-copy");
  const headerAccent = $("header-accent");
  const main = $("main");
  const gallery = $("product-gallery-container");
  const options = $("options-container");
  const productImage = $("product-image-container");

  // header height animation
  headerText.style.height = `${(1.2 - progress) * 95}px`;

  // section offset beneath dynamic header height
  if (main) {
    main.style.top = `${headerHeight}px`;
  }

  // text opacity/scale
  headerCopy.style.opacity = String(textOpacity);
  headerCopy.style.transform = `scale(${textScale})`;

  // accent opacity/scale
  headerAccent.style.opacity = String(imageOpacity);
  headerAccent.style.transform = `scale(${imageScale})`;

  // gallery and product widths
  const widthCalc = `calc(50% - ${(controlsWidth / 2) * progress}px)`;
  gallery.style.width = widthCalc;
  productImage.style.width = widthCalc;

  // options visibility and right position fixed at center gap, opacity tracks progress
  options.style.opacity = String(imageOpacity);

  // mobile width handling
  if (isMobile) {
    optionsWidth = screenWidth;
  } else {
    const optionsMaxWidth = isMobile ? 100 : controlsWidth;
    optionsWidth = optionsMaxWidth * progress;
  }
}

function handleScroll() {
  updateLayoutHeights();
  scrollY = window.scrollY;
  const animationStart = 0;
  const animationEnd = 100;
  progress = clamp(
    (scrollY - animationStart) / (animationEnd - animationStart),
    0,
    1
  );
  controlsTopPosition = isMobile ? 0 : scrollY;
  textOpacity = 1 - progress;
  textScale = Math.max(0, 1 - progress);
  imageOpacity = progress;
  imageScale = progress;
  applyStyles();
}

function init() {
  screenWidth = window.innerWidth;
  isMobile = screenWidth <= mobileScreenWidth;
  renderOptions();
  updateLayoutHeights();
  applyStyles();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    screenWidth = window.innerWidth;
    isMobile = screenWidth <= mobileScreenWidth;
    updateLayoutHeights();
    applyStyles();
  });

  const addBtn = document.getElementById("add-to-cart");
  const addBtnMobile = document.getElementById("add-to-cart-mobile");
  function addToCart() {
    // Simple demo action replacing store interaction
    alert("Added to cart: Jungle (Test) - $10");
  }
  if (addBtn) addBtn.addEventListener("click", addToCart);
  if (addBtnMobile) addBtnMobile.addEventListener("click", addToCart);
}

document.addEventListener("DOMContentLoaded", init);
