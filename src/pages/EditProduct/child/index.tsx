import { Ref, forwardRef, useImperativeHandle, useRef } from "react";
import {
  CategoryAttribute,
  ProductAttributeSchema,
  ProductColor,
  ProductCombine,
  ProductStorage,
  SliderSchema,
} from "@/types";
import { useProductContext } from "@/store/ProductDataContext";
import SliderGroup, { SliderRef } from "@/components/SliderGroup";
import InputGroup, { CombineRef } from "./CombineGroup";
import { getExistCombine, getExistSlider } from "./helper";
import AttributeGroup, { AttributeRef } from "./AttributeGroup";

type Props = {
  colors: (ProductColor & { id?: number })[];
  storages: (ProductStorage & { id?: number })[];
  attrList: CategoryAttribute[];
};

export type ConfigRef = {
  submitSliders: () => Promise<(SliderSchema & { id: number; color_ascii: string })[]>;
  trackingCombine: () => {
    newCombines: ProductCombine[];
    updateCombines: ProductCombine[];
  };
  submitAttributes: () => Promise<ProductAttributeSchema[]>;
  validate: () => void;
};

function ProductConfig({ colors, storages, attrList }: Props, ref: Ref<ConfigRef>) {
  const { combines_data, product_name_ascii, product_name, sliders_data, setIsChange } =
    useProductContext();

  const sliderRefs = useRef<(SliderRef | undefined)[]>([]);
  const combineRefs = useRef<(CombineRef | undefined)[]>([]);
  const attributeRefs = useRef<(AttributeRef | undefined)[]>([]);

  // const submitSliderList = sliderRefs.current.map((item) => item.submit);
  // const submitCombines = useMemo(() => combineRefs.current.map((item) => item.submit), [colors, storages]);

  const submitSliders = async () => {
    console.log(">>> submit slider");
    let newSliders = [];
    for (let sliderItem of sliderRefs!.current) {
      if (typeof sliderItem?.submit === "function") {
        const newSlider = await sliderItem.submit();
        if (newSlider) {
          newSliders.push(newSlider);
        }
      }
    }

    return newSliders;
  };

  const validate = () => {
    let isError = false;
    for (let sliderItem of sliderRefs!.current) {
      if (typeof sliderItem?.validate === "function") {
        if (sliderItem.validate()) isError = true;
      }
    }

    for (let combineItem of combineRefs!.current) {
      if (typeof combineItem?.validate === "function") {
        if (combineItem.validate()) isError = true;
      }
    }

    if (isError) {
      throw new Error("Input field missing");
    }
  };

  const trackingCombine: ConfigRef["trackingCombine"] = () => {
    console.log(">>> tracking combine");

    let newCombines: ProductCombine[] = [];
    let updateCombines: ProductCombine[] = [];
    for (let combineItem of combineRefs!.current) {
      if (typeof combineItem?.submit === "function") {
        const cb = combineItem.submit();
        if (cb) {
          const { data, type } = cb;
          switch (type) {
            case "new":
              newCombines.push(data);
              break;
            case "update":
              updateCombines.push(data);
              break;
          }
        }
      }
    }

    return { newCombines, updateCombines };
  };

  const submitAttributes = async () => {
    const newProductAttrs: ProductAttributeSchema[] = [];
    for await (const attributeItem of attributeRefs!.current) {
      if (typeof attributeItem?.submit === "function") {
        // attributeItem only update data
        const data = await attributeItem.submit();
        if (data) {
          newProductAttrs.push(data);
        }
      }
    }

    return newProductAttrs;
  };

  useImperativeHandle(
    ref,
    () =>
      ({
        submitAttributes,
        trackingCombine,
        submitSliders,
        validate,
      } as ConfigRef)
  );

  const classes = {
    label: "text-[20px] font-[500] mb-[8px] uppercase",
    container: "flex bg-[#fff] rounded-[12px] p-[20px]",
  };

  return (
    <>
      {/* slider */}
      <div className={classes.label}>Product Slider</div>
      {!!colors.length && (
        <div className={`${classes.container} mb-[30px] flex-col gap-[40px]`}>
          {colors.map((item, index) => {
            const { existSlider, isExits } = getExistSlider(
              sliders_data,
              item,
              product_name
            );
            return (
              <div key={index} className="row items-center">
                <div key={index} className="col w-2/12">
                  <div className={"text-[16px] text-center font-[500]"}>{item.color}</div>
                </div>
                <div className="col w-10/12">
                  <SliderGroup
                    setIsChange={setIsChange}
                    width="w-1/2"
                    paddingRatio="pt-[55%]"
                    color_ascii={item.color_ascii}
                    ref={(ref) => (sliderRefs.current[index] = ref!)}
                    initSlider={existSlider}
                    isExist={isExits}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* combine */}
      <div className="mb-[30px]">
        <div className={classes.label}>Quantity & Price</div>
        {!!storages.length && (
          <div className={`bg-[#fff] rounded-[8px] p-[20px]`}>
            {storages.map((storageItem, i) =>
              colors.map((colorItem, j) => {
                const { existCombine, isExits } = getExistCombine(
                  combines_data,
                  colorItem,
                  storageItem,
                  product_name_ascii
                );
                const key = storageItem.storage_ascii + colorItem.color_ascii;
                const index = !i ? j : i * (j + colors.length);
                // 0 1 2 3 4 5
                // 0 1 2

                return (
                  <div key={key} className="row items-center w-full">
                    <div className="col w-2/12">
                      <h5 className={`text-[16px] text-center font-[500]`}>
                        {storageItem.storage} / {colorItem.color}
                      </h5>
                    </div>
                    <InputGroup
                      ref={(ref) => (combineRefs.current[index] = ref!)}
                      initCombine={existCombine}
                      isExist={isExits}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* attribute */}
      <div className="mb-[30px]">
        <div className={classes.label}>Specification</div>
        {!!storages.length && (
          <div className={`${classes.container} flex-col`}>
            {attrList.map((attr, index) => {
              return (
                <AttributeGroup
                  ref={(ref) => (attributeRefs.current[index] = ref!)}
                  catAttr={attr}
                  key={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
export default forwardRef(ProductConfig);
