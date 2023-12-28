
interface HeadingProps {
	title:string,
	description?:string
	titleClassName?:string,
	descriptionClassName?:string
}
const Heading: React.FC<HeadingProps> = ({ title, description, titleClassName, descriptionClassName }) => {

  return (
	<div>
		<h2 className={`text-3xl font-bold tracking-tight ${titleClassName}`}>
			{title}
		</h2>
		<p className={`text-sm text-muted-foreground ${descriptionClassName}`}>
			{description}
		</p>
	</div>
  )
}
export default Heading