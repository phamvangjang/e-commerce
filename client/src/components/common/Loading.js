import React, { memo } from 'react'
import { ClipLoader } from 'react-spinners'

const Loading = () => {
    return (
        <div>
            <ClipLoader color='#34e3f5'/>
        </div>
    )
}

export default memo(Loading)
