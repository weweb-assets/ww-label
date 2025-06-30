<template>
  <label
    :for="computedFor"
    class="ww-form-label"
    v-bind="wwElementState.props.attributes"
    @click="handleClick"
    @mousedown="
      (event) => {
        // prevent text selection when double clicking label
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    "
  >
    <wwLayout path="children" />
  </label>
</template>

<script>
import { computed, inject, watch, unref } from "vue";
import { useChildLabelProvider } from "./composables/useLabelChild";

export default {
  props: {
    content: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ["update:content", "update:sidepanel-content"],
  setup(props, { emit }) {
    const form = inject("_wwForm:info", null);
    
    console.log('[ww-label] Debug - Form injected:', {
      form,
      hasForm: !!form,
      formUid: form?.uid,
      formName: form?.name?.value,
      formInputs: form?.inputs?.value,
    });

    const { hasChildInput, childInputs } = useChildLabelProvider();

    /* wwEditor:start */
    watch(
      () => [form, hasChildInput.value, childInputs.value],
      () => {
        console.log('[ww-label] Debug - Watch triggered:', {
          form,
          hasForm: !!form,
          formUid: form?.uid,
          formName: form?.name?.value,
          formInputs: form?.inputs?.value,
          hasChildInput: hasChildInput.value,
          childInputsSize: childInputs.value.size,
        });
        // Get all input names from the Map
        const childInputNames = [];
        for (const [uid, nameRef] of childInputs.value.entries()) {
          const name = unref(nameRef);
          if (name) {
            childInputNames.push(name);
          }
        }

        emit("update:sidepanel-content", {
          path: "labelState",
          value: {
            form: {
              uid: form?.uid,
              name: form?.name?.value,
              inputs: form?.inputs?.value || [],
            },
            hasChildInput: hasChildInput.value,
            childInputNames,
          },
          forced: true,
        });

        if (props.content.htmlFor && props.content.htmlFor !== "custom") {
          const availableInputs = form?.inputs?.value || [];
          const inputExists = availableInputs.some(
            (input) => input.componentUid === props.content.htmlFor,
          );

          if (!inputExists) {
            emit("update:content", {
              htmlFor: null,
            });
          }
        }
      },
      { immediate: true, deep: true },
    );
    /* wwEditor:end */

    const computedFor = computed(() => {
      if (hasChildInput.value) {
        return null;
      }

      if (!props.content.htmlFor) {
        return null;
      }

      if (props.content.htmlFor === "custom") {
        return props.content.customHtmlFor || null;
      }

      if (form?.inputs?.value) {
        const input = form.inputs.value.find(
          (input) => input.componentUid === props.content.htmlFor,
        );
        if (input) {
          return input.id;
        }
      }

      return props.content.htmlFor;
    });

    const handleClick = (event) => {
      // Label click handling if needed in the future
    };

    return {
      computedFor,
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.ww-form-label {
  cursor: pointer;
}
</style>
