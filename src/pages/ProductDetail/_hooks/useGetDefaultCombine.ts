import { Dispatch, SetStateAction, useEffect } from "react";

type Props = {
   product: ProductDetail | null;
   setVariant: Dispatch<SetStateAction<ProductVariant | undefined>>;
   setColor: Dispatch<SetStateAction<ProductColor | undefined>>;
};

export default function useGetDefaultCombine({ setColor, setVariant, product }: Props) {
   useEffect(() => {
      if (!product) return;

      const defaultVariant = product.variants.find(
         (s) => s.id === product!.default_variant.id
      );

      if (!defaultVariant) {
         setVariant(product.variants[0]);
         setColor(product.colors[0]);

         return;
      }

      const defaultCombineOfVariant = product.combines.find(
         (c) => c.id === defaultVariant.default_combine.combine_id
      );

      const defaultColor = product.colors.find(
         (c) => c.id === defaultCombineOfVariant!.color_id
      );

      setVariant(defaultVariant);

      if (!defaultColor) {
         setColor(product.colors[0]);
      } else {
         setColor(defaultColor);
      }
   }, [product]);
}
