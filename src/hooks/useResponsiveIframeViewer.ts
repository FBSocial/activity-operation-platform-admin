import { ResponsiveIframeViewerContext } from '@/contexts/ResponsiveIframeViewerContext';
import { useContext } from 'react';

/**
 * 使用响应式 iframe 查看器上下文
 */
export const useResponsiveIframeViewer = () => {
    const context = useContext(ResponsiveIframeViewerContext);
    if (!context) {
        throw new Error('useResponsiveIframeViewer must be used within a ResponsiveIframeViewerProvider');
    }
    return context;
};