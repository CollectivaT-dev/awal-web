'use client';

interface HeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
    return (
        <div className={center ? 'text-center' : 'text-start '}>
            <div className="text-2xl font-bold sm:text-xl capitalize">{title}</div>
            <div className="font-light text-neutral-500 mt-2 capitalize">{subtitle}</div>
        </div>
    );
};

export default Heading;
