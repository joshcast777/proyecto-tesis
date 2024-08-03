type DashboardLayoutProps = {
	children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps): React.ReactNode {
	return <section className="dashboard-background pt-16 text-white">{children}</section>;
}
