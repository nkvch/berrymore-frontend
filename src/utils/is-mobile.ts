function isMobile() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows phone'];
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
}

export default isMobile;
