import { Type } from "@sinclair/typebox";
import { implementRuntimeComponent } from "@sunmao-ui/runtime";
import { useEffect, useState } from "react";
import { generateFromSchema } from "../../_internal/utils/generate-from-schema";
import _ from "lodash";
import _KubectlApplyForm from "../../_internal/organisms/KubectlApplyForm/KubectlApplyForm";

const UiConfigFieldSchema = Type.Object({
  path: Type.String(),
  label: Type.String(),
  helperText: Type.String(),
  sectionTitle: Type.String(),
  error: Type.String(),
  widget: Type.String(),
});

export const UiConfigSchema = Type.Object({
  layout: Type.Object({
    type: Type.KeyOf(
      Type.Object({
        simple: Type.Boolean(),
        tabs: Type.Boolean(),
        wizard: Type.Boolean(),
      })
    ),
    fields: Type.Array(UiConfigFieldSchema, {
      widget: "core/v1/array",
      widgetOptions: { displayedKeys: ["path", "label"] },
      conditions: [
        {
          key: "type",
          value: "simple",
        },
      ],
    }),
    tabs: Type.Array(
      Type.Object({
        title: Type.String(),
        fields: Type.Array(UiConfigFieldSchema, {
          widget: "core/v1/array",
          widgetOptions: { displayedKeys: ["path", "label"] },
        }),
      }),
      {
        widget: "core/v1/array",
        widgetOptions: { displayedKeys: ["title"] },
        conditions: [
          {
            key: "type",
            value: "tabs",
          },
        ],
      }
    ),
    steps: Type.Array(
      Type.Object({
        title: Type.String(),
        fields: Type.Array(UiConfigFieldSchema, {
          widget: "core/v1/array",
          widgetOptions: { displayedKeys: ["path", "label"] },
        }),
        disabled: Type.Boolean(),
        prevText: Type.String(),
        nextText: Type.String(),
      }),
      {
        widget: "core/v1/array",
        widgetOptions: { displayedKeys: ["title"] },
        conditions: [
          {
            key: "type",
            value: "wizard",
          },
        ],
      }
    ),
  }),
});

const KubectlApplyFormProps = Type.Object({
  k8sConfig: Type.Object({
    basePath: Type.String(),
  }),
  applyConfig: Type.Object({
    create: Type.Boolean(),
    patch: Type.Boolean(),
  }),
  formConfig: Type.Object(
    {
      yaml: Type.String(),
      schemas: Type.Array(Type.Any()),
      defaultValues: Type.Array(Type.Any()),
      uiConfig: UiConfigSchema,
    },
    {
      widget: "kui/v1/KubectlApplyFormDesignWidget",
    }
  ),
});

const KubectlApplyFormState = Type.Object({
  value: Type.Any(),
});

const exampleProperties = {
  applyConfig: {
    create: true,
    patch: true,
  },
  formConfig: {
    yaml: "",
    schemas: [],
    defaultValues: [],
    uiConfig: {
      layout: {
        type: "simple",
        fields: [],
      },
    },
  },
};

export const KubectlApplyForm = implementRuntimeComponent({
  version: "kui/v1",
  metadata: {
    name: "kubectl_apply_form",
    displayName: "Kubectl Apply Form",
    isDraggable: true,
    isResizable: true,
    exampleSize: [4, 4],
    exampleProperties,
    annotations: {
      category: "Input",
    },
  },
  spec: {
    properties: KubectlApplyFormProps,
    state: KubectlApplyFormState,
    methods: {
      setField: Type.Object({
        fieldPath: Type.String(),
        value: Type.Any(),
      }),
    },
    slots: {
      field: {
        slotProps: UiConfigFieldSchema,
      },
    },
    styleSlots: [],
    events: ["onChange"],
  },
})(
  ({
    k8sConfig,
    applyConfig,
    formConfig,
    mergeState,
    slotsElements,
    subscribeMethods,
    callbackMap,
  }) => {
    const [values, setValues] = useState<any[]>(() => {
      const initValues = (formConfig.schemas || []).map((s, idx) => {
        return _.merge(generateFromSchema(s), formConfig.defaultValues?.[idx]);
      });

      mergeState({ value: initValues });
      return initValues;
    });
    useEffect(() => {
      subscribeMethods({
        setField({ fieldPath, value }) {
          setValues((prevValues) => {
            _.set(prevValues, fieldPath, value);
            const newValues = [...prevValues];
            mergeState({
              value: newValues,
            });
            return newValues;
          });
        },
      });
    }, []);

    return (
      <_KubectlApplyForm
        k8sConfig={k8sConfig}
        applyConfig={applyConfig}
        schemas={formConfig.schemas}
        uiConfig={formConfig.uiConfig}
        values={values}
        onChange={(newValues) => {
          setValues(newValues);
          mergeState({
            value: newValues,
          });
          callbackMap?.onChange();
        }}
        getSlot={(f, fallback) => {
          return slotsElements.field?.(f, fallback);
        }}
      />
    );
  }
);