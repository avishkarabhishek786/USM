import React from 'react';

function USER_FUNC(props) {
    return (
        <div class="card">
            <div class="card-header">
                {props.title}
            </div>
            <div class="card-body">
                <div class="row gy-2 gx-3 align-items-center">
                    <div class="col-auto">
                        <label class="visually-hidden">{props.label}</label>
                        <input 
                            type="text" 
                            id={props.id}
                            class="form-control" 
                            placeholder="Example 100" 
                            value={props.value}
                            onChange={(e)=>props.onchangefunc(e.target.value)}    
                        />
                    </div>
                    <div class="col-auto">
                        <button 
                            type="submit" 
                            class="btn btn-primary"
                            onClick={()=>props.func(props.value)}    
                        >Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default USER_FUNC;