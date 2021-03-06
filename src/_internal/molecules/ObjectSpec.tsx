import React, { useContext } from "react";
import { Unstructured } from "../k8s-api-client/kube-api";
import { KitContext } from "../atoms/kit-context";
import TreeView from "./TreeView";

const _ObjectSpec = React.forwardRef<
  HTMLDivElement,
  {
    item?: Unstructured & { spec?: any } & Record<string, any>;
    className?: string;
  }
>((props, ref) => {
  const { className, item } = props;
  const kit = useContext(KitContext);
  if (!item?.spec) {
    return null;
  }

  return (
    <div className={className} ref={ref}>
      {/* spec */}
      <TreeView value={item.spec} />
    </div>
  );
});

export default _ObjectSpec;
