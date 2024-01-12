import { useEffect } from "react"
import { useState } from "react"


const getLocalValue = <T>(key: string, initValue: T):  T => {
    //SSR Next.js
    // if (typeof window === 'undefined') return initValue;

    //if value is already stored
    const localValue = JSON.parse(localStorage.getItem(key)!);
    if (localValue) return localValue;

    // if (initValue instanceof Function) return initValue()

    return initValue
}

const useLocalStorage = <T>(key: string, initValue: T):  [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue);
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}

export default useLocalStorage