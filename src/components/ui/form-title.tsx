/**
 * Properties for `FormTitle` component.
 *
 * @typedef {FormTitleProps}
 */
type FormTitleProps = {
	children: string | React.ReactNode;
};

/**
 * `FormTitle` is a component that renders a title for a form.
 *
 * @export
 *
 * @param {FormTitleProps} props - The properties for the component.
 * @param {string 1 React.ReactNode} props.children - The content to be displayed as the title.
 *
 * @returns {React.ReactNode}
 */
export default function FormTitle({ children }: FormTitleProps): React.ReactNode {
	return <h2 className="text-center text-3xl font-bold uppercase xl:text-5xl">{children}</h2>;
}
