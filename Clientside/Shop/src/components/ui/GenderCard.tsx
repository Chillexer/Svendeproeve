import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props{
    gender: string
}

function GenderCard({gender}: Props){
    return(
        <div className="w-full">
            <Link href={`/${gender}`}>
            <a>
            <Image layout='responsive' src={`/images/${gender}.png`} height="560" width="560" alt={gender}/>
            <div className="bg-white flex justify-center align-center py-3 capitalize">
                <p className="md:text-2xl lg:text-3xl">{gender}</p>
            </div>
            </a>
            </Link>
        </div>
    )
}

export default GenderCard