import { useFormContext } from 'react-hook-form';

const Consent = () => {
    const form = useFormContext();
    return (
        <div>
            <label>
                <input type="checkbox" {...form.register('isPrivacy')} />
                Accepto les condicions de privadesa i de contribuci&#243;
            </label>
            <label>
                <input type="checkbox" {...form.register('isSubscribed')} />
                Accepto rebre notificacions sobre el projecte Awal{' '}
            </label>
        </div>
    );
};

export default Consent;
