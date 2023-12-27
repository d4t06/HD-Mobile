// import usePrivateRequest from "../../hooks/usePrivateRequest"
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

function AccountPage() {
   const navigate = useNavigate();
   const logout = useLogout();

   const singOut = async () => {
      await logout();
      navigate('/');
   };

   return (
      <div>
         <h1>Account Page</h1>
         <button onClick={() => singOut()}>Logout</button>
      </div>
   );
}

export default AccountPage;
