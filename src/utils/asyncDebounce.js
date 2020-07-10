function canDo(cb,delay) {
    let canDoTimer = setInterval(() => {
        if (doing) {
            // 如果上一个还没做完，就再等一次
            console.log("上一个没做完");
            clearInterval(canDoTimer);
            canDo(cb);
        } else {
            //上一个做完了
            console.log("上一个做完了，开始下一个");
            cb && cb();
        }
    }, delay);
}

function asyncDebounce(callback,delay) {
    let doing = false;
    return () => {
        canDo(() => {
            doing = true;
            callback(() => {
                doing = false;
            });
        },delay);
    };
}