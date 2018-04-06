// think.js 创建think变量以及基础API

// 加载所需要的文件
import * as path from 'path';
import * as colors from 'colors';
import * as consoleConf from './console.json';
import thinkInterFace from './thinkInterface';

let think: thinkInterFace;
(think as any) = {};

const tplDefineArr = [];


// 加载控制台颜色
colors.setTheme((consoleConf as any).color);


/**
 * 获得一个标准路径
 * 兼容 window, linux, mac 平台
 * 会将路径中的 ../ 解析掉, 如 c:/abc/../a.js 会解析成 c:/a.js
 */
think.frontPath = (url: string): string => {
    let urlArr: string[] = path.normalize(url).split(path.sep);
    return urlArr.slice(0, -1).join(path.sep);
}

// 设置常量
think.END = Symbol('end');
think.NODATA = Symbol('nodata');
think.DIR = think.frontPath(__dirname);

// 请求头默认
think.headerInfo = [];

// 设置请求头
think.header = (responeHeaders: string) => think.headerInfo.push(responeHeaders);

// 默认时区
think.timeInfo = 'GMT';

/**
 * 设置时区, 默认GNT
 */
think.timeZone = (info: string) => (think.timeInfo = info);

// 语言默认为中文
think.language = 'en';

// 设置语言
think.lang = (l) => {
    think.language = l;
}

/**
 * 设置option, 失败返回false, 成功返回true
 */
think.opt = (key: string, value: any): boolean => {
    let keyPath:string[] = key.toLowerCase().split('_');
    let optVal: Object = think.option;
    
    // 取到最终的路径, 且该对路径应该是一个对象
    for (let i = 0, j = keyPath.length - 1; i < j; i ++) {
        optVal = optVal[keyPath[i]];
        if (!optVal) return false;
    }

    // 获取上一级路径
    let popPath = keyPath.pop();

    // 设置, 如果成功为true, 失败为false
    if (typeof optVal === 'object')
        return optVal[popPath] = value, true;
    else
        return false;
}

/**
 * define 定义内容
 * 暂时没用,预留接口
 */
think.define = (key: string, value: any, url: string = '*') => {
    if (typeof key === 'string' && typeof url === 'string')
        return tplDefineArr.push({key, value, url}), true;
    else if (!key) 
        return tplDefineArr;
    else
        return false;
}

/**
 * load功能, 用来初始化代码时使用
 * think.onload 应该只会执行一次
 */
let loadList: Function[] = [];

// 执行所有的load代码
think.onload = () => loadList.forEach((callback) => callback());

// 将函数添加到load列表
think.load = (callback: Function) => loadList.push(callback);

// 一个空函数
think.voidCallback = _ => _;

(global as any).think = think;
export default think;