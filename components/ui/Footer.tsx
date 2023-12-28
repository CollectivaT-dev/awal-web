import Link from 'next/link';
import { Separator } from './separator';
import {
    RiTwitterXFill,
    RiFacebookFill,
    RiInstagramFill,
    RiGithubFill,
} from 'react-icons/ri';

const Footer = () => {
    return (
        <>
            <Separator className="bg-text-primary " />
            <div className="flex flex-row justify-center space-x-10 items-center">
                <div>
                    <ul className="flex flex-col my-5 justify-center items-end ">
                        <li>
                            <Link href={'/translate'} scroll={false}>
                                
							Traductor
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'} scroll={false}>
Veu
                            </Link>
                        </li>
                        <li>
                            <Link href={'/about'} scroll={false}>
							Sobre Awal
                            </Link>
                        </li>
                        <li>
                            <Link href={'/resources'} scroll={false}>
							Recursos
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-row justify-center items-center space-x-3">
                    <Link target="_blank" href={'https://facebook.com'}>
                        <RiFacebookFill size={30} />
                    </Link>
                    <Link
                        target="_blank"
                        href={'https://twitter.com/Awaldigital'}
                    >
                        <RiTwitterXFill size={30} />
                    </Link>

                    <Link
                        target="_blank"
                        href={'https://www.instagram.com/awaldigital/'}
                    >
                        <RiInstagramFill size={30} />
                    </Link>
                    <Link
                        target="_blank"
                        href={'https://github.com/CollectivaT-dev/awal-web'}
                    >
                        <RiGithubFill size={30} />
                    </Link>
                </div>
                <div>
                    <ul className="flex flex-col items-start justify-between my-5">
                        <li>
                            <Link href={'/'} className="font-bold">
                                AWAL
                            </Link>
                        </li>
                        <li>
                            <Link href={'/legal'}> Av&#237;s legal</Link>
                        </li>
                        <li>
                            <Link href={'/privacy'}>
                                Pol&#237;tica de privacitat
                            </Link>
                        </li>
                        <li>
                            <Link href={'/cookies'}>
                                Pol&#237;tica de cookies
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};
export default Footer;
