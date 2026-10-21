export type UiMode = 'modern' | 'classic';

export const UI_MODE_STORAGE_KEY = 'verdict-ui';
export const UI_MODE_EVENT = 'verdict-ui-change';

// Runs in <head> before first paint so a saved classic mode never flashes the
// modern look. Mirrors applyUiMode in hooks/useUiMode.ts.
export const UI_MODE_BOOT_SCRIPT = `try{if(localStorage.getItem('${UI_MODE_STORAGE_KEY}')==='classic'){document.documentElement.dataset.ui='classic'}}catch(e){}`;
