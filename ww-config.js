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
        ["required", "requiredSymbol"],
    ],
    properties: {
        children: {
            label: { en: 'Label content' },
            defaultValue: [],
            options: {
                text: { en: 'Label text and elements' }
            }
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
                            { label: "None (children input)", value: null },
                            { label: "Custom", value: "custom" },
                        ],
                    };
                }

                const options = [
                    { label: "None (children input)", value: null },
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
        required: {
            label: {
                en: "Required indicator",
                fr: "Indicateur obligatoire",
            },
            type: "OnOff",
            section: "settings",
            defaultValue: false,
            bindable: true,
            responsive: true,
            states: true,
        },
        requiredSymbol: {
            label: {
                en: "Required symbol",
                fr: "Symbole obligatoire",
            },
            type: "Text",
            section: "settings",
            defaultValue: "*",
            bindable: true,
            responsive: true,
            states: true,
            hidden: (content) => !content.required,
        },
    },
};
