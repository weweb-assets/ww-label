import { inject, onUnmounted } from 'vue';

export function useLabelChild() {
    const registerInput = inject('_wwLabel:registerInput', null);
    const unregisterInput = inject('_wwLabel:unregisterInput', null);
    
    console.log('useLabelChild: registerInput found:', !!registerInput);
    
    if (registerInput) {
        console.log('useLabelChild: Calling registerInput');
        registerInput();
    }
    
    onUnmounted(() => {
        if (unregisterInput) {
            console.log('useLabelChild: Calling unregisterInput');
            unregisterInput();
        }
    });
    
    return {
        isInsideLabel: !!registerInput
    };
}