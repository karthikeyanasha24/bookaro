import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb=({links=[],currentPage=''})=>{

    return <><nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        {links.map(itm=>{
            return <li class="breadcrumb-item"><Link to={itm.link}>{itm.name}</Link></li>
        })}
        <li class="breadcrumb-item active" aria-current="page">{currentPage}</li>
    </ol>
</nav></>
}

export default Breadcrumb