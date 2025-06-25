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
import { computed, inject, watch } from 'vue';

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
        // Inject form info if available
        const form = inject('_wwForm:info', null);
        
        // Update sidepanel content with form info when in editor
        /* wwEditor:start */
        watch(
            () => form,
            () => {
                console.log('[ww-label] Form detected:', form);
                emit('update:sidepanel-content', {
                    path: 'form',
                    value: { uid: form?.uid, name: form?.name?.value },
                    forced: true,
                });
            },
            { immediate: true, deep: true }
        );
        /* wwEditor:end */
        // Compute the actual 'for' attribute value
        const computedFor = computed(() => {
            if (!props.content.htmlFor) {
                return null;
            }
            
            if (props.content.htmlFor === 'custom') {
                return props.content.customHtmlFor || null;
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