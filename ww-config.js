export default {
    inherit: {
        type: "ww-layout"
    },
    editor: {
        label: {
            en: "Label",
            fr: "Label",
        },
        icon: "tag",
    },
    options: {
        linkable: false,
        autoByContent: true
    },
    customSettingsPropertiesOrder: [
        "formInfobox",
        ["htmlFor", "customHtmlFor"],
    ],
    properties: {
        children: {
            label: { en: 'Label content' },
            defaultValue: [],
            hidden: true,
        },
        labelState: {
            editorOnly: true,
            hidden: true,
            defaultValue: {
                form: null,
                hasChildInput: false,
                childInputNames: []
            },
        },
        formInfobox: {
            type: "InfoBox",
            section: "settings",
            options: (_, sidePanelContent) => {
                const hasForm = !!sidePanelContent.labelState?.form?.uid;
                const formName = sidePanelContent.labelState?.form?.name;
                const hasChildInput = sidePanelContent.labelState?.hasChildInput;
                const childInputNames = sidePanelContent.labelState?.childInputNames || [];
                
                let variant = "warning";
                let content = "";
                let title = "Not in a form";
                
                if (hasChildInput) {
                    // If we have a child input, we don't need to be in a form
                    if (childInputNames.length > 1) {
                        // Multiple inputs detected - show warning
                        variant = "warning";
                        content = "Multiple inputs detected. Labels should contain only one input for proper accessibility.";
                    } else {
                        // Single input - all good
                        variant = "success";
                        content = "Input auto-detected inside this label.";
                    }
                    title = hasForm && formName ? formName : "Label with input";
                } else if (!hasForm) {
                    // Not in form and no child input
                    content = "Place this label inside a form container to access form inputs.";
                } else {
                    // In form but no child input
                    variant = "success";
                    title = formName || "In form";
                }
                
                return {
                    variant,
                    icon: "tag",
                    title,
                    content: content,
                };
            },
            hidden: false,
        },
        htmlFor: {
            label: {
                en: "For",
                fr: "Pour",
            },
            type: "TextSelect",
            section: "settings",
            defaultValue: null,
            bindable: true,
            propertyHelp: {
                tooltip: "Associates this label with a specific form input. 'Auto' will automatically associate with any input inside this label."
            },
            hidden: (content, sidePanelContent) => {
                // Hide only when has child input (regardless of form)
                const hasChildInput = !!sidePanelContent?.labelState?.hasChildInput;
                return hasChildInput;
            },
            /* wwEditor:start */
            options: (content, sidePanelContent) => {
                // If not in a form, only show custom option
                if (!sidePanelContent?.labelState?.form?.uid) {
                    return {
                        options: [
                            { label: "None", value: null },
                            { label: "Custom", value: "custom" },
                        ],
                    };
                }

                // If in a form but no inputs available yet
                if (
                    !sidePanelContent?.labelState?.form?.inputs ||
                    sidePanelContent.labelState.form.inputs.length === 0
                ) {
                    return {
                        options: [
                            { label: "Auto", value: null },
                            { label: "Custom", value: "custom" },
                        ],
                    };
                }

                const options = [
                    { label: "Auto", value: null },
                    ...sidePanelContent.labelState.form.inputs.map((input) => ({
                        label: input.label || input.name,
                        value: input.componentUid,  // Use component UID instead of name
                    })),
                    { label: "Custom", value: "custom" },
                ];

                return { options };
            },
            /* wwEditor:end */
        },
        customHtmlFor: {
            label: {
                en: "Custom for",
                fr: "Pour personnalisé",
            },
            type: "Text",
            section: "settings",
            defaultValue: "",
            bindable: true,
            hidden: (content) => content.htmlFor !== "custom",
        },
    },
};
