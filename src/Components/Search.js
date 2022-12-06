import React,{useState, useEffect} from 'react'
import { FaRulerVertical } from 'react-icons/fa'

export const Search = (props) => {
    const [value, setValue]= useState('')
    const [result, setResult]= useState([])
    useEffect(()=>{
        if(value.length>0){
            fetch('https://console.firebase.google.com/project/revelationapp-390bd/firestore/data/~2Finventorystock.json').then(
                response => response.json()
            ).then(responseData=>{
                let searchQuery = value.toLowerCase();
                for(const key in responseData){
                    let product = responseData[key].prodName.toLowerCase();
                    if(product.slice(0,searchQuery.length).indexOf(searchQuery)!== -1){
                        setResult(prevResult=>{
                            return[...prevResult, responseData[key].prodName]
                        })

                    }
                }


            }).catch(error=>{
                console.log(error)

            })
        }else{
            setResult([])
        }

    },[value])
  return (
    <div>Search</div>
  )
}
