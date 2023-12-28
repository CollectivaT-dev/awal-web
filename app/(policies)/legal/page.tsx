'use client'
import useLocaleStore from "@/app/hooks/languageStore";

const LegalPage = () => {
	const {locale} = useLocaleStore();

	return (
	<div className="h-[100vh] flex justify-center items-center text-xl">Aquesta p&#224;gina encara est&#224; en desenvolupament</div>
  )
}
export default LegalPage