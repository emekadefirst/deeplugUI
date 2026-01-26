import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseProps {
    slot?: string;
    format?: string;
    fullWidthResponsive?: boolean;
    className?: string;
}

export default function AdSense({
    slot,
    format = 'auto',
    fullWidthResponsive = true,
    className = ''
}: AdSenseProps) {
    useEffect(() => {
        try {
            // Load the script if it's not already loaded
            if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
                const script = document.createElement('script');
                script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7573835643291988";
                script.async = true;
                script.crossOrigin = "anonymous";
                document.head.appendChild(script);
            }

            // Push the ad
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className={`my-8 ${className}`}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-7573835643291988"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
            />
        </div>
    );
}
