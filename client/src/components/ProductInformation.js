import React, { memo, useState, useCallback } from 'react'
import { productInforTabs } from '../ultils/contants'
import { Votebar, Button, VoteOption } from './'
import { renderStarFromNumber } from '../ultils/helpers'
import { apiRatings } from '../apis'
import { useDispatch } from 'react-redux'
import { showModel } from '../store/app/appSlice'

const ProductInformation = ({ totalRatings, totalCount, nameProduct }) => {
    const [activedTab, setActivedTab] = useState(1)
    const [isVote, setIsVote] = useState(false)
    const dispatch = useDispatch()
    // const toggleVote = useCallback(() => {
    //     setIsVote(!isVote)
    // }, [isVote])
    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]' >
                {productInforTabs.map(el => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}
                    </span>


                ))}
                <div
                    className={`py-2 px-4 cursor-pointer ${activedTab === 5 ? 'bg-white border border-b-0' : 'bg-gray-200'}`}

                    onClick={() => setActivedTab(5)}
                >CUSTOMER REVIEW
                </div>
            </div>
            <div className='w-full border p-4 mb-8'>
                {productInforTabs.some(el => el.id === activedTab) && productInforTabs.find(el => el.id === activedTab)?.content}
                {activedTab === 5 &&
                    <div className='flex p-4 flex-col'>
                        <div className='flex'>
                            <div className='flex-4 border flex flex-col gap-2 items-center justify-center'>
                                <span className='font-semibold text-[24px]'>{`${totalRatings}/5`}</span>
                                <span className='flex gap-2 items-center'>{renderStarFromNumber(totalRatings)?.map((el, index) => (
                                    <span key={index}>{el}</span>
                                ))}</span>
                                <span className='italic underline text-blue-600 font-semibold'>{`${totalCount} reviewers`}</span>
                            </div>
                            <div className='flex-6 border p-4 flex flex-col'>
                                {Array.from(Array(5).keys()).reverse().map(el => (
                                    <Votebar
                                        key={el}
                                        number={el + 1}
                                        ratingTotal={5}
                                        ratingCount={2}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className='p-4 flex flex-col items-center justify-center gap-2'>
                            <span>Do you want to review this Product?</span>
                            <Button handleOnClick={()=>dispatch(showModel({isShowModel: true, modelChildren: <VoteOption nameProduct={nameProduct}/>}))}>Vote now</Button>
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default memo(ProductInformation)








