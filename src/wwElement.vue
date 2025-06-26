<template>
    <label 
        :for="computedFor"
        class="ww-form-label"
        v-bind="wwElementState.props.attributes"
        @mousedown="(event) => {
            // prevent text selection when double clicking label
            if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
        }"
    >
        <wwLayout path="children" />
    </label>
</template>

<script>
import { computed, inject, watch, provide, ref, nextTick } from 'vue';
import { useLabelChild } from './composables/useLabelChild';

export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content', 'update:sidepanel-content'],
    setup(props, { emit }) {
        const form = inject('_wwForm:info', null);
        const hasChildInput = ref(false);
        
        provide('_wwLabel:registerInput', () => {
            console.log('ww-label: Input registering, setting hasChildInput to true');
            hasChildInput.value = true;
        });
        
        provide('_wwLabel:unregisterInput', () => {
            hasChildInput.value = false;
        });
        
        provide('_wwLabel:useLabelChild', useLabelChild);
        
        /* wwEditor:start */
        watch(
            () => form,
            () => {
                emit('update:sidepanel-content', {
                    path: 'form',
                    value: { 
                        uid: form?.uid, 
                        name: form?.name?.value,
                        inputs: form?.inputs?.value || []
                    },
                    forced: true,
                });
                
                if (props.content.htmlFor && props.content.htmlFor !== 'custom') {
                    const availableInputs = form?.inputs?.value || [];
                    const inputExists = availableInputs.some(input => input.name === props.content.htmlFor);
                    
                    if (!inputExists) {
                        emit('update:content', {
                            htmlFor: null
                        });
                    }
                }
            },
            { immediate: true, deep: true }
        );
        
        watch(
            () => hasChildInput.value,
            (newValue) => {
                console.log('ww-label: Emitting hasChildInput update:', newValue);
                // Use nextTick to ensure this runs after all other updates
                nextTick(() => {
                    emit('update:sidepanel-content', {
                        path: 'hasChildInput',
                        value: newValue,
                        forced: true,
                    });
                });
            },
            { immediate: true }
        );
        /* wwEditor:end */
        const computedFor = computed(() => {
            if (hasChildInput.value) {
                return null;
            }
            
            if (!props.content.htmlFor) {
                return null;
            }
            
            if (props.content.htmlFor === 'custom') {
                return props.content.customHtmlFor || null;
            }
            
            if (form?.inputs?.value) {
                const input = form.inputs.value.find(input => input.name === props.content.htmlFor);
                if (input) {
                    return input.id;
                }
            }
            
            return props.content.htmlFor;
        });

        return {
            computedFor
        };
    }
};
</script>

<style lang="scss" scoped>
.ww-form-label {
    cursor: pointer;
}
</style>