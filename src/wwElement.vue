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
import { computed, inject, watch, provide, ref } from 'vue';
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
            console.log('ww-label: Input registered');
            hasChildInput.value = true;
        });
        
        provide('_wwLabel:unregisterInput', () => {
            console.log('ww-label: Input unregistered');
            hasChildInput.value = false;
        });
        
        provide('_wwLabel:useLabelChild', useLabelChild);
        
        /* wwEditor:start */
        watch(
            () => [form, hasChildInput.value],
            () => {
                console.log('ww-label: Updating sidepanel - form and hasChildInput:', hasChildInput.value);
                emit('update:sidepanel-content', {
                    path: '',
                    value: {
                        form: { 
                            uid: form?.uid, 
                            name: form?.name?.value,
                            inputs: form?.inputs?.value || []
                        },
                        hasChildInput: hasChildInput.value
                    },
                    forced: true,
                });
            },
            { immediate: true, deep: true }
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