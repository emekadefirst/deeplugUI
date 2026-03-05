import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
}

export const SEO = ({ title, description }: SEOProps) => {
    useEffect(() => {
        const baseTitle = 'deePlugg';
        const fullTitle = title.toLowerCase().includes(baseTitle.toLowerCase()) ? title : `${title} | ${baseTitle}`;
        document.title = fullTitle;

        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.head.appendChild(meta);
            }
        }
    }, [title, description]);

    return null;
};
