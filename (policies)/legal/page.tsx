'use client'
import useLocaleStore from "@/app/hooks/languageStore";
import { MessagesProps, getDictionary } from "@/i18n";
import { useEffect, useState } from "react";
const LegalPage = () => {

	const {locale} = useLocaleStore();

	const [d, setDictionary] = useState<MessagesProps>();

	useEffect(() => {
        const fetchDictionary = async () => {
            const m = await getDictionary(locale);
            setDictionary(m);
        };

        fetchDictionary();
    }, [locale]);

	return (
	<div className="min-h-screen flex-col flex mx-5 mobile:mx-10 space-y-10 my-10 whitespace-pre-wrap text-lg leading-8">
<h1 className="text-3xl font-semibold text-center">
{d?.legal.legal_title}
</h1>
<p>

{d?.legal.legal_text_1}
</p>
<h2 className="text-2xl font-semibold uppercase text-center">
	{d?.legal.legal_data_1_heading}
</h2>
<p className="flex justify-start">
	{d?.legal.legal_data_1_text}
</p>
<h2  className="text-2xl font-semibold text-center text-slate-100  ">
	{d?.legal.legal_data_2_heading}
</h2>
<p className="text-slate-100  ">
	{d?.legal.legal_data_2_text}
</p>
<h2 className="text-2xl font-semibold text-center text-slate-100 mobile:text-slate">
	{d?.legal.legal_data_3_heading}
</h2>
<p className="text-slate-100">
{d?.legal.legal_data_3_text}
</p>
<h2 className="text-2xl font-semibold text-center text-slate-100">
	{d?.legal.legal_data_4_heading}
</h2>
<p className="text-slate-100">
{d?.legal.legal_data_4_text}
</p>
	</div>
  )
}
export default LegalPage