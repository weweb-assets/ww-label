import { inject, onUnmounted } from 'vue';

export function useLabelChild(inputInfo = {}) {
    const registerInput = inject('_wwLabel:registerInput', null);
    const unregisterInput = inject('_wwLabel:unregisterInput', null);
    
    if (registerInput) {
        registerInput(inputInfo);
    }
    
    onUnmounted(() => {
        if (unregisterInput) {
            unregisterInput(inputInfo);
        }
    });
    
    return {
        isInsideLabel: !!registerInput
    };
}