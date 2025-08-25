const loadBMapPromise = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://api.map.baidu.com/getscript?v=2.0sak=8l5p21xEN5biP8xY1ieuxiwpLssL2auEsservices=&t=2021025162129'

        document.body.appendChild(script); script.onload = function () {
            resolve(true);
        }
    });
};
export default loadBMapPromise;