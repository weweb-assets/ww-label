---
name: ww-label
description: Label component that automatically manages the "for" attribute and detects child inputs. Works seamlessly with forms and input components.
keywords: [label, form, input, accessibility, for, htmlFor]
---

#### ww-label

***Purpose:***
A smart label component that automatically manages its `for` attribute based on context. It can detect child inputs, connect to form inputs by field name, or use custom values. Enhances accessibility and UX by making the entire label area clickable.

***Architecture:***
- Detects child inputs and automatically disables `for` attribute when wrapping inputs
- Integrates with form containers to resolve field names to input IDs
- Supports custom `for` values for advanced use cases

***For Attribute Logic:***
The `for` attribute is determined by these rules (in order):
1. **Child input detected**: `for` is `null` (not needed when input is inside label)
2. **No htmlFor set**: `for` is `null`
3. **Custom value**: When htmlFor is "custom", uses the customHtmlFor value
4. **Form field lookup**: Finds input ID by field name from the form registry
5. **Fallback**: Uses the htmlFor value directly

***Properties:***
- htmlFor: string - Field name to connect to, or "custom" for custom value
- customHtmlFor: string - Custom ID when htmlFor is set to "custom"

***Behavior:***
- **With child inputs**: Automatically detects inputs inside and shows their names in editor
- **With forms**: Looks up input IDs from form's input registry
- **Click handling**: Makes entire label clickable to focus/select the associated input
- **Multiple inputs warning**: Shows warning when multiple inputs are detected inside

***Common Patterns:***

1. **Wrapping an input** (no `for` needed):
```
ww-label
  └── ww-input-basic
```

2. **External input** (uses form registry):
```
ww-form-container
  ├── ww-label (htmlFor="email")
  └── ww-input-basic (fieldName="email")
```

3. **Radio/Checkbox with rich content**:
```
ww-label (styled as card)
  ├── ww-div
  │   ├── ww-icon
  │   └── ww-text
  └── ww-input-radio
```

***States:***
- No built-in states (styling through CSS classes)

***Features:***
- Prevents text selection on double-click
- Shows info box in editor about form connection status
- Warns about accessibility best practices (one input per label)
- Displays names of detected child inputs

***Form Integration:***
When inside a form container:
- Accesses form's input registry
- Resolves field names to actual input IDs
- Shows form name in editor info box
- Auto-clears invalid field selections

***Accessibility:***
- Proper label-input association via `for` attribute
- Supports click-to-focus behavior
- Works with screen readers
- Follows HTML semantic standards

***Notes:***
- Only one input should be inside a label for proper accessibility
- The `for` attribute uses input IDs, not field names
- Form integration provides the ID lookup service
- Custom IDs bypass the form lookup system

***Examples:***

1. **Label wrapping an input (recommended pattern):**
<elements>
{"uid":"label-1","tag":"ww-label","name":"Email Label","props":{"default":{"htmlFor":null}},"styles":{"default":{"display":"block","margin":"0 0 8px 0","color":"#374151","fontSize":"14px","fontWeight":"500"}},"slots":{"children":[{"uid":"label-text-1"},{"uid":"input-1"}]}}
{"uid":"label-text-1","tag":"ww-text","props":{"default":{"tag":"span","text":{"en":"Email Address"}}}}
{"uid":"input-1","tag":"ww-input-basic","props":{"default":{"type":"email","fieldName":"email","required":true,"placeholder":"Enter your email"}}}
</elements>

2. **Label with external input (using field name):**
<elements>
{"uid":"form-1","tag":"ww-form-container","name":"Contact Form","slots":{"formContent":[{"uid":"label-2"},{"uid":"input-2"}]}}
{"uid":"label-2","tag":"ww-label","name":"Name Label","props":{"default":{"htmlFor":"username"}},"styles":{"default":{"display":"block","margin":"0 0 4px 0"}},"slots":{"children":[{"uid":"label-text-2"}]}}
{"uid":"label-text-2","tag":"ww-text","props":{"default":{"tag":"span","text":{"en":"Username"}}}}
{"uid":"input-2","tag":"ww-input-basic","props":{"default":{"type":"text","fieldName":"username"}}}
</elements>

3. **Clickable card label with radio:**
<elements>
{"uid":"radio-label","tag":"ww-label","name":"Option Card","styles":{"default":{"display":"flex","padding":"16px","border":"2px solid #e5e7eb","borderRadius":"8px","cursor":"pointer","transition":"all 0.2s"},"_wwHover_default":{"borderColor":"#3b82f6","backgroundColor":"#eff6ff"}},"slots":{"children":[{"uid":"card-content"},{"uid":"radio-1"}]}}
{"uid":"card-content","tag":"ww-div","styles":{"default":{"flex":"1"}},"slots":{"children":[{"uid":"option-title"},{"uid":"option-desc"}]}}
{"uid":"option-title","tag":"ww-text","props":{"default":{"tag":"h3","text":{"en":"Premium Plan"}}},"styles":{"default":{"margin":"0 0 4px 0","fontSize":"16px","fontWeight":"600"}}}
{"uid":"option-desc","tag":"ww-text","props":{"default":{"tag":"p","text":{"en":"Best for growing teams"}}},"styles":{"default":{"margin":"0","color":"#6b7280","fontSize":"14px"}}}
{"uid":"radio-1","tag":"ww-input-radio","props":{"default":{"value":"premium","appearance":"simple"}}}
</elements>