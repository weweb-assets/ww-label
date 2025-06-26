import { inject, onUnmounted } from 'vue';

export function useLabelChild() {
    const registerInput = inject('_wwLabel:registerInput', null);
    const unregisterInput = inject('_wwLabel:unregisterInput', null);
    
    if (registerInput) {
        registerInput();
    }
    
    onUnmounted(() => {
        if (unregisterInput) {
            unregisterInput();
        }
    });
    
    return {
        isInsideLabel: !!registerInput
    };
}