import { useEffect } from "react";
import { implementRuntimeComponent } from "@sunmao-ui/runtime";
import { Type } from "@sinclair/typebox";
import { ConfigProvider } from "antd";
import { KitContext, CloudTowerKit } from "../../_internal/atoms/kit-context";

const RootState = Type.Object({
  theme: Type.String(),
});

export const Root = implementRuntimeComponent({
  version: "kui/v1",
  metadata: {
    name: "root",
    displayName: "Root",
    description: "please make sure your kui app has the root component",
    isDraggable: true,
    isResizable: true,
    exampleProperties: {},
    exampleSize: [12, 12],
    annotations: {
      category: "Advance",
    },
  },
  spec: {
    properties: Type.Object({}),
    state: RootState,
    methods: {},
    slots: {
      root: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: [],
    events: [],
  },
})(({ slotsElements, mergeState }) => {
  useEffect(() => {
    mergeState({
      theme: CloudTowerKit.name,
    });
  }, []);

  return (
    <ConfigProvider prefixCls="dovetail-ant">
      <KitContext.Provider value={CloudTowerKit}>
        <>{slotsElements.root ? slotsElements.root?.({}) : null}</>
      </KitContext.Provider>
    </ConfigProvider>
  );
});
