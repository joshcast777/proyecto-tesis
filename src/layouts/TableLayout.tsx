type TableLayoutProps = {
	children: React.ReactNode;
};

export default function TableLayout({ children }: TableLayoutProps): React.ReactNode {
	return <div className="container pb-10 pt-16">{children}</div>;
}
