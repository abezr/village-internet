export function worker() {
let sliderRatio = 80, counter = 0, isStopped = true

setInterval(() => {
    postMessage(counter);
}, 500);

let timedCount = () => {
    let t0 = performance.now(), t1
    if (!isStopped) {
        counter = -1;
        do {
            t1 = performance.now();
            counter++;
        } while (t1 - t0 < sliderRatio);

        setTimeout(timedCount, 100 - sliderRatio);
    }
}
timedCount();

self.onmessage = (event) => {
    switch (event.data) {
        case "start":
            isStopped = false;
            timedCount();
            break;
        case "stop":
            isStopped = true;
            counter = 0;
            break;
        default:
            sliderRatio = parseInt(event.data);
    }
};
}