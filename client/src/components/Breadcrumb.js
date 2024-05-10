import React from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { Link } from 'react-router-dom'
import icons from '../ultils/icons'

const { MdArrowForwardIos } = icons

const Breadcrumb = ({ title, category }) => {
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title },
    ];
    const breadcrumb = useBreadcrumbs(routes)
    // console.log({ title, category })
    return (
        <div className='flex gap-2'>
            {breadcrumb?.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
                <Link
                    className='flex items-center uppercase hover:text-main'
                    key={match.pathname}
                    to={match.pathname}>
                    <span className='capitalize'>{breadcrumb}</span>
                    {index !== self.length - 1 && <MdArrowForwardIos />}
                </Link>
            ))}
        </div>
    )
}

export default Breadcrumb
