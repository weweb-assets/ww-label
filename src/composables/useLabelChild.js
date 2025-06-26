import { onUnmounted, provide, ref, unref, watch } from "vue";

export function useChildLabelProvider() {
  const hasChildInput = ref(false);
  const childInputs = ref(new Map());

  function registerInput(uid, nameRef) {
    if (!uid) return;

    // Store the name ref (computed or regular value)
    childInputs.value.set(uid, nameRef);
    hasChildInput.value = childInputs.value.size > 0;
  }

  function unregisterInput(uid) {
    if (!uid) return;

    childInputs.value.delete(uid);
    hasChildInput.value = childInputs.value.size > 0;
  }

  function useLabelChild(uid, nameRef) {
    if (registerInput && uid) {
      registerInput(uid, unref(nameRef));
    }

    /* wwEditor:start */
    watch(
      () => unref(nameRef),
      (name) => {
        if (registerInput && uid) {
          registerInput(uid, name);
        }
      },
    );
    /* wwEditor:end */

    onUnmounted(() => {
      if (unregisterInput && uid) {
        unregisterInput(uid);
      }
    });

    return {
      isInsideLabel: !!registerInput,
    };
  }

  provide("_wwLabel:useLabelChild", useLabelChild);

  return {
    hasChildInput,
    childInputs,
  };
}
