export function createCanvas (selector = 'canvas') {
      const dpr = window.devicePixelRatio;
      const height = window.innerHeight;
      const width = window.innerWidth;

      const canvas = document.querySelector(selector); 

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      return ctx;
}

export function circle (ctx, radius, point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
}

export function getRandomNum (min, max, round = true) {
    return (round)
        ? Math.floor(Math.random() * (max - min + 1) + min)
        : Math.random() * (max - min) + min;
}

export function html (tag, attributes = null, children = null) {
    const elem = document.createElement(tag);

    if (attributes) addAttributes(elem, attributes); 
    if (children) addChildren(elem, children);

    return elem;
}

export function getPng (canvas) {
    const data = canvas.toDataURL('image/png');
    const a = html('a', {download: 'img.png', href: data, style: 'display:none'});

    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
}

function addAttributes (elem, attributes) {
    Object.keys(attributes).forEach(key => {
        switch (key) {
            case 'classes':
                attributes[key].forEach(cls => elem.classList.add(cls));
                break;
            case 'textContent':
                elem.textContent = attributes[key];
                break;
            case 'selected':
                elem.selected = attributes[key];
            default:
                elem.setAttribute(key, attributes[key]);
        }
    });
}

function addChildren (elem, children) {
    children.forEach(child => elem.appendChild(child));
}
