'use client';
import useLocaleStore from '@/app/hooks/languageStore';
import Heading from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Heading2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProjectIntro = () => {
    const router = useRouter();
    const { data: session } = useSession();
	const {locale} = useLocaleStore();

    return (
        <div className=" py-10 whitespace text-text-primary">
            <div className=" w-full h-full flex flex-col items-center ">
                <h1 className="text-3xl font-semibold ">
                    Internet parla l&apos;Amazic!
                </h1>
                <div className="flex flex-row justify-center items-center ">
                    <div className="flex flex-col w-1/2  mt-5 mx-10 text-gray-700">
                        <p>
                            Awal és una iniciativa impulsada per la comunitat
                            per fomentar la llengua Tamazight en el m&#243;n
                            digital. La nostra missi&#243; és senzilla: veure
                            com l&apos;Amazic es parla i s&apos;entén al
                            m&#243;n digital amb tecnologia de codi obert, i
                            necessitem la teva col·laboraci&#243; per
                            aconseguir-ho.
                        </p>
                        <p className="pt-2">
                            <Heading
                                title="Com Pots Contribuir:"
                                titleClassName="text-xl"
                            />

                            <ul className="list-disc">
                                <li className="ml-4">
                                    <strong>Tradueix amb Sentit:</strong>
                                    Mostra les teves habilitats
                                    ling&#252;&#237;stiques traduint frases a o
                                    des del Amazic amb les teves pr&#242;pies
                                    paraules.
                                </li>
                                <li className="ml-4">
                                    <strong>La Validaci&#243; Compta: </strong>
                                    Valida les traduccions realitzades pels
                                    altres voluntaris, assegurant
                                    l&apos;exactitud de la tecnologia resultant.
                                </li>
                                <li className="ml-4">
                                    <strong> Alça la teva Veu:</strong>{' '}
                                    Contribueix amb dades de parla a través de
                                    Common Voice, donant-li al Amazic una veu en
                                    el m&#243;n digital.
                                </li>
                            </ul>
                        </p>
                        <p className="pt-2">
                            Per cada traducci&#243; registrada a Awal,
                            guanyar&#224;s punts i podr&#224;s veure com
                            compares amb els altres membres de la comunitat.
                        </p>
                    </div>
                    <div className="w-1/2  flex flex-col  justify-end mt-5 text-gray-700 ">
                        <Heading
                            title="Tothom és Benvingut/a "
                            titleClassName="text-xl pt-5"
                        />

                        <p className="">
                            La contribuci&#243; est&#224; oberta a qualsevol
                            persona que pugui llegir i/o escriure en Amazic.
                            Celebrem la rica diversitat de les variants de
                            l&apos;Amazic i donem la benvinguda als parlants de
                            tots els or&#237;gens.
                        </p>
                        <Heading
                            title="Explora els Nostres Recursos "
                            titleClassName="text-xl pt-5"
                        />
                        <p>
                            Visita la nostra p&#224;gina de recursos per accedir
                            a conjunts de dades obertes resultat dels nostres
                            esforços col·lectius i descobreix altres projectes
                            que contribueixen activament a la preservaci&#243;
                            de l&apos;Amazic.
                        </p>
                        <Heading
                            title="Descobreix la Comunitat Awal "
                            titleClassName="text-xl pt-5"
                        />
                        <p>
                            Coneix més sobre la comunitat que impulsa Awal a la
                            nostra p&#224;gina &quot;Sobre nosaltres&quot;.
                            Uneix-te als nostres grups de Facebook, Telegram i
                            WhatsApp per connectar amb altres voluntaris,
                            compartir progressos, buscar orientaci&#243; i
                            formar part dl&apos;una xarxa de suport.
                        </p>
                    </div>
                </div>
                {session ? (
                    ''
                ) : (
                    <Button
                        variant="default"
                        size="lg"
                        className="mt-5 bg-text-primary "
                        // TODO: the redirect endpoint needs to be changed
                        onClick={() =>
                            router.push('/signIn', { scroll: false })
                        }
                    >
                        Uniu-vos a Awal!
                    </Button>
                )}
            </div>
        </div>
    );
};
export default ProjectIntro;
