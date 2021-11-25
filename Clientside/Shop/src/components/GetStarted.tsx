import Link from 'next/link'
import Image from 'next/image'


function GetStarted(){
    return (
    <div className="md:bg-red-500 md:py-2 md:px-1 lg:py-4">
        <div className="relative w-full h-full text-center mx-auto lg:w-[1000px]">
            <Image layout='responsive' src='/images/cover.png' height="500" width="1793" alt="cover"/>
            <div className="absolute top-0 flex flex-col justify-center space-y-3 sm:space-y-5 w-full h-full py-1 sm:py-5 md:py-10 lg:py-20">
                <h1 className="text-white font-bold text-lg sm:text-xl lg:text-5xl lg:font-semibold">Tøj for alle</h1>
                <p className="text-white text-sm sm:text-base lg:text-3xl">Moderne og praktisk tøj for alle</p>
                <div>
                    <Link href="/men/products"><a className="bg-black text-white py-1 px-2 lg:text-3xl">Start her</a></Link>
                </div>
            </div>
        </div>
    </div>
    )
}

export default GetStarted