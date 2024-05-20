import React from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const withBaseCompoment = (Compoment) => (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    return <Compoment
        navigate={navigate}
        dispatch={dispatch}
        location={location}
        {...props}
    />
}

export default withBaseCompoment
