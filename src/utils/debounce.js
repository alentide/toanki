function debounce(func, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(func.bind(...args), delay);
    };
}

module.exports = debounce;

function foo(callback) {
    let doing = false;
    let i = 0;

    let timer;

    function canDo(cb) {
        let canDoTimer = setInterval(() => {
            if (doing) {
                // 如果上一个还没做完，就再等一次
                console.log("上一个没做完");
                clearInterval(canDoTimer);
                canDo(cb);
            } else {
                //上一个做完了
                clearInterval(canDoTimer);
                console.log("上一个做完了，开始下一个");
                cb && cb();
            }
        }, 1000);
    }

    return (nextCallback) => {
        canDo(() => {
            doing = true;

            callback(() => {
                doing = false;
            });

            // let canDoCbTimer = setInterval(()=>{
            //     if(i===10){
            //         doing = false
            //         i=0
            //         clearInterval(canDoCbTimer)
            //     }else {
            //         i++
            //     }
            //     console.log(i)
            // },1000)
        });
    };
}

foo((cb) => {
    i=0
    let canDoCbTimer = setInterval(() => {
        if (i === 10) {
            cb()
            i = 0;
            clearInterval(canDoCbTimer);
        } else {
            i++;
        }
        console.log(i);
    }, 1000);
})();


/**
 * 当监听到文件变动时
 * 判断是不是md文件，是否需要进行后续操作
 * 如果需要读取，则放到事件队列中，
 * 如果3秒后，没有新的事件，且上一次任务执行完了，
 * 则读取文件，开始制卡
 * 在制卡的过程中，所有事件放到队列中等待，
 * 卡片制作完后，如果事件队列还有事件，
 * 则等待3秒，之后没有事件就开始执行新任务。
 */