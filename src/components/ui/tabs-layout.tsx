import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

type Tab = {
	value: string;
	tabTrigger: string | React.ReactNode;
	tabContent: string | React.ReactNode;
};

type TabsLayoutProps = {
	defaultValue?: string;
	tabs: Tab[];
};

export default function TabsLayout({ defaultValue, tabs }: TabsLayoutProps): React.ReactNode {
	if (defaultValue === undefined) {
		defaultValue = tabs[0].value;
	}

	return (
		<Tabs defaultValue={defaultValue} className="w-full">
			<TabsList>
				{tabs.map(
					({ value, tabTrigger }: Tab): JSX.Element => (
						<TabsTrigger value={value}>{tabTrigger}</TabsTrigger>
					)
				)}
			</TabsList>

			{tabs.map(
				({ value, tabContent }: Tab): JSX.Element => (
					<TabsContent value={value}>{tabContent}</TabsContent>
				)
			)}
		</Tabs>
	);
}
