import React from "react";
import { NavLink } from 'react-router-dom'
import { createSlug } from '../../ultils/helpers'
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { categories } = useSelector(state => state.app)
    // const [categories, setCategories] = useState(null)
    // const fetchCategories = async () => {
    //     const response = await apiGetCategory()
    //     if (response.success) setCategories(response.productCategories)
    // }
    // useEffect(() => {
    //     fetchCategories()
    // }, [])
    return (
        <div className='flex flex-col border'>
            {categories?.map(el => (
                <NavLink
                    key={createSlug(el.title)}
                    to={createSlug(el.title)}
                    className={({ isActice }) => isActice
                        ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main'
                        : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
                >{el.title}
                </NavLink>
            ))}
        </div>
    )
}
export default Sidebar