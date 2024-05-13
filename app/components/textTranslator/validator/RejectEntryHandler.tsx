import { MessagesProps } from "@/i18n";
import axios from "axios";
import { Session } from "next-auth";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface HandleRejectProps{
	entry:any,
	session:Session|null,
	sessionUpdate:(data?:any)=>Promise<Session|null>,
	d?:MessagesProps,
	setTriggerFetch:Dispatch<SetStateAction<number>>
}
export const HandleReject = async ({entry, session, sessionUpdate, d, setTriggerFetch}: HandleRejectProps) => {
    const data = { ...entry, validatorId: session?.user?.id };
    try {
        const res = await axios.patch('/api/contribute/reject', data);
        const validationScore = 3;
        const updatedUser = res.data;
        const { score, ...userWithoutScore } = updatedUser;
        //console.log(userWithoutScore, updatedUser);
        sessionUpdate({ user: updatedUser });
        toast.success(
            `${
                d?.validator.success_validation.text_before_link
            }${' '}${validationScore}${' '}${
                d?.validator.success_validation.text_after_link
            }`,
        );
    } catch (error) {
        //console.log(error);
        toast(`${d?.validator.alert_no_more_entries}`, {
            icon: '❌',
        });
    }
    setTriggerFetch((prev) => prev + 1);
};
