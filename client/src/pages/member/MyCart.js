import withBaseCompoment from 'hocs/withBaseCompoment'
import React, { memo } from 'react'

const MyCart = (props) => {
    return (
        <div 
        className='cursor-pointer'
        onClick={() => props.navigate('/')}>
            MyCart
        </div>
    )
}

export default withBaseCompoment(MyCart)
