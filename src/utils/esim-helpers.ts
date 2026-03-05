/**
 * Pure helper functions for eSIM data transformation.
 * These are side-effect-free and can be safely called during render.
 */

import type { ESimOffering } from '../services/esim-service';
import { MVNO_COLOR_MAP, DEFAULT_MVNO_COLOR } from '../components/esim/constants';

/** Formats data value, treating -1 as "Unlimited" */
export function formatData(data: number, unit: string): string {
    if (data === -1) return 'Unlimited';
    return `${data} ${unit}`;
}

/** Returns human-readable plan type based on call/SMS availability */
export function getPlanTypeLabel(o: ESimOffering): string {
    return hasCommunication(o) ? 'Data/Calls/SMS' : 'Data';
}

/** Returns human-readable speed label from network_speed alias */
export function getSpeedLabel(o: ESimOffering): string {
    const alias = o.network_speed?.alias ?? '';
    if (alias.includes('5G') && alias.includes('4G')) return '4G / 5G';
    if (alias.includes('5G')) return '5G';
    if (alias.includes('4G')) return '4G';
    return 'LTE';
}

/** True when the plan has NO calls and NO SMS */
export function isDataOnly(o: ESimOffering): boolean {
    return !hasCommunication(o);
}

/** Checks whether the plan includes calls or SMS (shared logic) */
function hasCommunication(o: ESimOffering): boolean {
    const hasCalls = o.call_minutes !== null && o.call_minutes !== undefined && o.call_minutes !== 0;
    const hasSms = o.texts !== null && o.texts !== undefined && o.texts !== 0;
    return hasCalls || hasSms;
}

/** Strip HTML tags and entities from a description string */
export function stripHtml(html: string): string {
    return html
        .replace(/<\/?(p|li|ul|br)[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/** Resolves MVNO brand colour from the offering's icon_uri */
export function getMvnoColor(iconUri: string): string {
    const key = (iconUri ?? '').toLowerCase();
    for (const [k, v] of MVNO_COLOR_MAP) {
        if (key.includes(k)) return v;
    }
    return DEFAULT_MVNO_COLOR;
}
