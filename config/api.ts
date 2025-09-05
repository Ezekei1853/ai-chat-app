// config/api.ts
// 简化版本 - 直接使用配置，不依赖 process.env

const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.port !== '';

export const API_BASE_URL: string = isDevelopment 
  ? 'http://localhost:8787'  // 本地开发
  : 'https://api.zcx.icu';   // 生产环境

// 也可以通过检查域名来判断
export const API_BASE_URL_BY_DOMAIN: string = 
  window.location.hostname.includes('zcx.icu') 
    ? 'https://api.zcx.icu'
    : 'http://localhost:8787';

// 如果你想保留环境变量支持，可以这样写
export const API_BASE_URL_WITH_FALLBACK: string = 
  // @ts-ignore - 忽略 process 可能不存在的错误
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 
  (isDevelopment ? 'http://localhost:8787' : 'https://api.zcx.icu');