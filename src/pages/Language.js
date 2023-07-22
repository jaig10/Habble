import React, { useState } from "react";
import "./StartButton.css";
import {useNavigate} from "react-router-dom"
import usa from '../Utils/usa.png'
function Language() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(false);
    const toggleSelect = () =>{
      setSelected((selected) => !selected) ;
    }
    return (
      <>
        <div className='m-6'>
          <div>
            <img src="/habble_logo_green.JPG" alt="Habble" className='h-20'/>
          </div>
          <div className='text-center my-12'>
            <h3 className='text-3xl font-jua'>Choose your Habble buddy!</h3>
          </div>
          {/* avatar cards container*/}
          <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
              
                <div className={`bg-peach flex flex-col justify-center items-center gap-2 h-[242px] w-[242px] rounded-3xl md:h-[279px] md:w-[300px] hover:border-2 hover:border-bluish ${selected ? "border-2  border-bluish" : ""}`}
                onClick={()=>{toggleSelect()}} >
              <div>
                <img src={usa} alt="usa flag" className='mt-6 h-[110px] md:h-[140px]'/>
              </div>
              <p className='text-3xl font-helvetica font-bold mt-4'>ENGLISH</p>
            </div>
              
          </div>
          {/* start button */}
          <div className="flex md:justify-end justify-center mx-auto mt-10 md:mt-16 md:mx-40 w-34">
      <button className="css-button-sharp--blue" onClick={()=>{navigate("/avatar")}}>NEXT</button>
    </div>
        </div>
      </>
    )
}

export default Language;
