export const drawBridgeBetweenIsland = (
    island1: HTMLElement,
    island2: HTMLElement,
    double = false,
) => {
    const bridge = document.createElement('div');

    bridge.classList.add('border-2', 'border-black', 'absolute');

    if (!double) {
        bridge.classList.add('border-dashed');
    }

    bridge.style.setProperty('z-index', '-1');

    bridge.style.setProperty('transform-origin', 'left');
    bridge.style.setProperty(
        'transform',
        `rotate(${getAngleBetweenIslands(island1, island2)}deg)`,
    );

    bridge.style.setProperty(
        'top',
        `${island1.offsetTop + island1.offsetHeight / 2}px`,
    );

    bridge.style.setProperty(
        'left',
        `${island1.offsetLeft + island1.offsetWidth / 2}px`,
    );

    bridge.style.setProperty(
        'width',
        `${getDistanceBetweenIslands(island1, island2)}px`,
    );

    bridge.onclick = () => {
        island1.removeChild(bridge);
    };

    island1.appendChild(bridge);
};

export const getDistanceBetweenIslands = (
    island1: HTMLElement,
    island2: HTMLElement,
) => {
    const island1Rect = island1.getBoundingClientRect();
    const island2Rect = island2.getBoundingClientRect();

    const x1 = island1Rect.left + island1Rect.width / 2;
    const y1 = island1Rect.top + island1Rect.height / 2;
    const x2 = island2Rect.left + island2Rect.width / 2;
    const y2 = island2Rect.top + island2Rect.height / 2;

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    return distance;
};

export const getAngleBetweenIslands = (
    island1: HTMLElement,
    island2: HTMLElement,
) => {
    const island1Rect = island1.getBoundingClientRect();
    const island2Rect = island2.getBoundingClientRect();

    const x1 = island1Rect.left + island1Rect.width / 2;
    const y1 = island1Rect.top + island1Rect.height / 2;
    const x2 = island2Rect.left + island2Rect.width / 2;
    const y2 = island2Rect.top + island2Rect.height / 2;

    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    return angle;
};
