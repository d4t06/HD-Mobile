import { useNavigate } from "react-router-dom"

function Unauthorized () {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    } 


    return (<div>
        <h1>unauthorized page</h1>
        <button onClick={() => goBack()}>Go back</button>
        
        </div>)

}

export default Unauthorized