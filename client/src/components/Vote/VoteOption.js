import React, { memo, useRef, useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { voteOptions } from '../../ultils/contants'
import icons from '../../ultils/icons'
import { Button } from '../../components'

const { FaStar } = icons
const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
    const modelRef = useRef()

    useEffect(() => {
        modelRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    })

    const [chooseScore, setChooseScore] = useState(null)
    const [comment, setComment] = useState('')
    const [score, setScore] = useState(null)
    return (
        <div
            onClick={e => e.stopPropagation()}
            ref={modelRef}
            className='bg-white w-[700px]  p-4 flex flex-col items-center justify-center gap-4'>
            <img
                src={logo}
                alt='logo'
                className='w-[300px] object-contain'
            />
            <h2 className='text-center text-medium text-lg'>{`Please voting this Product: ${nameProduct}`}</h2>
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder='write sometings..'
                className='p-3 placeholder:italic placeholder:text-sm placeholder:text-gray-500 text-sm w-full min-h-32 outline-none border'></textarea>
            <div className='w-full flex flex-col gap-4'>
                <p>How do you like this Product?</p>
                <div className='flex items-center justify-center gap-4'>
                    {voteOptions.map(el => (
                        <div
                            onClick={() => setChooseScore(el.id)}
                            key={el.id}

                            className='bg-gray-200 hover:bg-gray-300 cursor-pointer w-[100px] h-[100px] flex items-center justify-center flex-col gap-2'>
                            {(Number(chooseScore) && chooseScore >= el.id) ? <FaStar color='orange' /> : <FaStar color='gray' />}
                            <span>{el.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                fw
                handleOnClick={() => handleSubmitVoteOption({ comment, score: chooseScore })}
            >Submit</Button>
        </div>
    )
}

export default memo(VoteOption)
