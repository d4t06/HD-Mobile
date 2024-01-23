import { redirect } from "react-router-dom";

export default function Unauthorized() {
   const goBack = () => {
      redirect("/");
   };

   return (
      <div>
         <h1>unauthorized page</h1>
         <button onClick={() => goBack()}>Go back</button>
      </div>
   );
}
