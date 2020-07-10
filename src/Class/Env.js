module.exports =  Env

function Env() {}
//获得家目录
Env.getHome = function () {
    const USER_HOME = process.env.HOME || process.env.USERPROFILE;
    return USER_HOME;
};
