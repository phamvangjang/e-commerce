import React, { memo, useState } from 'react'
import { productInforTabs } from '../ultils/contants'

const activedStyles = ''
const notAativedStyles = ''
const ProductInformation = () => {
    const [activedTab, setActivedTab] = useState(1)
    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]' >
                {productInforTabs.map(el => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className='w-full border p-4 mb-8'>
                {productInforTabs.some(el => el.id === activedTab) && productInforTabs.find(el => el.id === activedTab)?.content}
            </div>
            
        </div>
    )
}

export default memo(ProductInformation)








