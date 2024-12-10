import useGetProductDetail from "@/hooks/useGetProductDetail";
import DetailTop from "./_components/DetailTop";
import Rating from "./_components/Rating";
import RatingContextProvider from "@/store/ratingContext";
import DetailBody from "./_components/DetailBody";
import NotFound from "@/shares/components/NotFound";

export default function DetailPage() {
   // hooks
   const { status, productDetail } = useGetProductDetail();

   if (status === "error" || (status === "successful" && !productDetail))
      return <NotFound />;

   return (
      <>
         <DetailTop loading={status === "loading"} product={productDetail} />
         <DetailBody loading={status === "loading"} product={productDetail} />

         <RatingContextProvider>
            <Rating loading={status === "loading"} product={productDetail} />
         </RatingContextProvider>
      </>
   );
}
