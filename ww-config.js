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
            type: 'Repeat',
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
                console.log('[ww-label] htmlFor options called');
                console.log('[ww-label] sidePanelContent:', sidePanelContent);
                console.log('[ww-label] sidePanelContent.form:', sidePanelContent?.form);
                
                // If not in a form, only show custom option
                if (!sidePanelContent?.form?.uid) {
                    console.log('[ww-label] Not in a form - showing basic options');
                    return {
                        options: [
                            { label: "None", value: null },
                            { label: "Custom", value: "custom" },
                        ],
                    };
                }

                console.log('[ww-label] Form UID found:', sidePanelContent.form.uid);
                console.log('[ww-label] Form inputs:', sidePanelContent.form?.inputs);

                // If in a form but no inputs available yet
                if (
                    !sidePanelContent?.form?.inputs ||
                    sidePanelContent.form.inputs.length === 0
                ) {
                    console.log('[ww-label] In form but no inputs available');
                    return {
                        options: [
                            { label: "None (children input)", value: null },
                            { label: "Custom", value: "custom" },
                        ],
                    };
                }

                console.log('[ww-label] Found inputs:', sidePanelContent.form.inputs.length);
                console.log('[ww-label] Input details:', JSON.stringify(sidePanelContent.form.inputs, null, 2));

                // If in a form with inputs
                const options = [
                    { label: "None (children input)", value: null },
                    ...sidePanelContent.form.inputs.map((input) => ({
                        label: input.label || input.value,
                        value: input.value,
                    })),
                    { label: "Custom", value: "custom" },
                ];

                console.log('[ww-label] Final options:', JSON.stringify(options, null, 2));
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
