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
import { computed } from 'vue';

export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content', 'update:sidepanel-content'],
    setup(props) {
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