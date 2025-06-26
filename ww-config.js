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
        form: {
            editorOnly: true,
            hidden: true,
            defaultValue: false,
        },
        formInfobox: {
            type: "InfoBox",
            section: "settings",
            options: (_, sidePanelContent) => ({
                variant: sidePanelContent.form?.name ? "info" : "warning",
                icon: "tag",
                title: sidePanelContent.form?.name || "Not in a form",
                content:
                    !sidePanelContent.form?.name &&
                    "Place this label inside a form container to access form inputs.",
            }),
            hidden: (_, sidePanelContent) => !sidePanelContent.form?.uid,
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
                console.log('htmlFor hidden check - Label should be:', content?.uid || 'NO-UID');
                console.log('htmlFor hidden check - sidePanelContent keys:', Object.keys(sidePanelContent || {}));
                console.log('htmlFor hidden check - hasChildInput:', sidePanelContent?.hasChildInput);
                return !!sidePanelContent?.hasChildInput;
            },
            /* wwEditor:start */
            options: (content, sidePanelContent) => {
                // If not in a form, only show custom option
                if (!sidePanelContent?.form?.uid) {
                    return {
                        options: [
                            { label: "None", value: null },
                            { label: "Custom", value: "custom" },
                        ],
                    };
                }

                // If in a form but no inputs available yet
                if (
                    !sidePanelContent?.form?.inputs ||
                    sidePanelContent.form.inputs.length === 0
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
                    ...sidePanelContent.form.inputs.map((input) => ({
                        label: input.label || input.name,
                        value: input.name,
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
