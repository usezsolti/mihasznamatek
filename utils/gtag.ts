// Google Ads conversion tracking
export const trackContactConversion = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
            'send_to': 'AW-17680696688/xgDwCKzh3sQbEPCK6O5B',
            'value': 1.0,
            'currency': 'HUF'
        });
    }
};

