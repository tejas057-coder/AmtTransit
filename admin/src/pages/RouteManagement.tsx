import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Bus, Edit, GripVertical, Map, MapPin, Plus, Trash2, X } from 'lucide-react';
import { adminBorders, adminSpacing } from '@/lib/adminDesignTokens';

type RouteStatus = 'Active' | 'Inactive' | 'Maintenance';
type ScheduleType = 'Weekday' | 'Weekend' | 'Both';

type Stop = {
	id: string;
	name: string;
	time: string;
};

type RouteItem = {
	id: string;
	routeNo: string;
	name: string;
	status: RouteStatus;
	distanceKm: number;
	busesAssigned: string[];
	scheduleType: ScheduleType;
	stops: Stop[];
};

type FormState = {
	routeName: string;
	routeNumber: string;
	startStop: string;
	endStop: string;
	via: Stop[];
	assignedBuses: string[];
	scheduleType: ScheduleType;
	status: boolean;
};

const STOP_OPTIONS = [
	'Rajapeth Junction',
	'Rani Garden',
	'Police Station',
	'Hospital Road',
	'Market Circle',
	'Cotton Market',
	'Railway Station',
	'City Center',
	'Sports Complex',
	'University Campus',
	'Airport Terminal',
	'Airport Road',
	'Highway Bypass',
];

const BUS_OPTIONS = ['AMT-001', 'AMT-002', 'AMT-003', 'AMT-004', 'AMT-005', 'AMT-006', 'AMT-007', 'AMT-008'];

const INITIAL_ROUTES: RouteItem[] = [
	{
		id: 'r-1',
		routeNo: '4',
		name: 'Rajapeth – Cotton Market',
		status: 'Active',
		distanceKm: 8.4,
		busesAssigned: ['AMT-001', 'AMT-002', 'AMT-003'],
		scheduleType: 'Both',
		stops: [
			{ id: 's1', name: 'Rajapeth Junction', time: '05:30' },
			{ id: 's2', name: 'Rani Garden', time: '05:36' },
			{ id: 's3', name: 'Police Station', time: '05:42' },
			{ id: 's4', name: 'Hospital Road', time: '05:48' },
			{ id: 's5', name: 'Market Circle', time: '05:54' },
			{ id: 's6', name: 'Cotton Market', time: '06:00' },
		],
	},
	{
		id: 'r-2',
		routeNo: '7',
		name: 'Railway Station – University',
		status: 'Active',
		distanceKm: 12.8,
		busesAssigned: ['AMT-004', 'AMT-005'],
		scheduleType: 'Weekday',
		stops: [
			{ id: 's7', name: 'Railway Station', time: '06:10' },
			{ id: 's8', name: 'City Center', time: '06:18' },
			{ id: 's9', name: 'Sports Complex', time: '06:26' },
			{ id: 's10', name: 'University Campus', time: '06:35' },
		],
	},
	{
		id: 'r-3',
		routeNo: '12',
		name: 'Airport – City Center',
		status: 'Maintenance',
		distanceKm: 22.5,
		busesAssigned: ['AMT-006'],
		scheduleType: 'Both',
		stops: [
			{ id: 's11', name: 'Airport Terminal', time: '07:15' },
			{ id: 's12', name: 'Airport Road', time: '07:25' },
			{ id: 's13', name: 'Highway Bypass', time: '07:40' },
			{ id: 's14', name: 'City Center', time: '07:55' },
		],
	},
];

const createForm = (): FormState => ({
	routeName: '',
	routeNumber: '',
	startStop: '',
	endStop: '',
	via: [],
	assignedBuses: [],
	scheduleType: 'Both',
	status: true,
});

const statusStyle = (status: RouteStatus): React.CSSProperties => {
	if (status === 'Active') {
		return { border: '1px solid rgba(255, 208, 0, 0.45)', backgroundColor: 'rgba(255, 208, 0, 0.12)', color: '#FFD000' };
	}
	if (status === 'Inactive') {
		return { border: '1px solid rgba(136, 136, 136, 0.35)', backgroundColor: 'rgba(136, 136, 136, 0.12)', color: '#888888' };
	}
	return { border: '1px solid rgba(255, 153, 0, 0.4)', backgroundColor: 'rgba(255, 153, 0, 0.14)', color: '#FF9900' };
};

const RouteManagement: React.FC = () => {
	const [routes, setRoutes] = useState<RouteItem[]>(INITIAL_ROUTES);
	const [expandedId, setExpandedId] = useState<string | null>(INITIAL_ROUTES[0].id);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
	const [form, setForm] = useState<FormState>(createForm());

	const editingRoute = useMemo(() => routes.find((route) => route.id === editingRouteId) ?? null, [editingRouteId, routes]);

	const openCreateDrawer = () => {
		setEditingRouteId(null);
		setForm(createForm());
		setDrawerOpen(true);
	};

	const openEditDrawer = (route: RouteItem) => {
		setEditingRouteId(route.id);
		setForm({
			routeName: route.name,
			routeNumber: route.routeNo,
			startStop: route.stops[0]?.name ?? '',
			endStop: route.stops[route.stops.length - 1]?.name ?? '',
			via: route.stops.map((stop) => ({ ...stop })),
			assignedBuses: route.busesAssigned,
			scheduleType: route.scheduleType,
			status: route.status === 'Active',
		});
		setDrawerOpen(true);
	};

	const closeDrawer = () => {
		setDrawerOpen(false);
		setEditingRouteId(null);
	};

	const deleteRoute = (id: string) => {
		setRoutes((prev) => prev.filter((route) => route.id !== id));
		if (expandedId === id) setExpandedId(null);
	};

	const addViaStop = () => {
		setForm((prev) => ({
			...prev,
			via: [...prev.via, { id: `stop-${Date.now()}`, name: '', time: '00:00' }],
		}));
	};

	const moveViaStop = (index: number, direction: 'up' | 'down') => {
		setForm((prev) => {
			const next = [...prev.via];
			const target = direction === 'up' ? index - 1 : index + 1;
			if (target < 0 || target >= next.length) return prev;
			[next[index], next[target]] = [next[target], next[index]];
			return { ...prev, via: next };
		});
	};

	const updateViaStop = (index: number, key: 'name' | 'time', value: string) => {
		setForm((prev) => {
			const next = [...prev.via];
			next[index] = { ...next[index], [key]: value };
			return { ...prev, via: next };
		});
	};

	const removeViaStop = (index: number) => {
		setForm((prev) => ({ ...prev, via: prev.via.filter((_, i) => i !== index) }));
	};

	const saveRoute = () => {
		const cleanedStops = form.via.filter((stop) => stop.name.trim()).map((stop) => ({
			...stop,
			name: stop.name.trim(),
			time: stop.time || '00:00',
		}));
		if (!form.routeName.trim() || !form.routeNumber.trim()) return;
		if (cleanedStops.length === 0) return;

		const payload: RouteItem = {
			id: editingRoute?.id ?? `r-${Date.now()}`,
			routeNo: form.routeNumber.trim(),
			name: form.routeName.trim(),
			status: form.status ? 'Active' : 'Inactive',
			distanceKm: Math.max(4.2, Number((cleanedStops.length * 1.3).toFixed(1))),
			busesAssigned: form.assignedBuses,
			scheduleType: form.scheduleType,
			stops: cleanedStops,
		};

		setRoutes((prev) => (editingRoute ? prev.map((item) => (item.id === editingRoute.id ? payload : item)) : [payload, ...prev]));
		setExpandedId(payload.id);
		closeDrawer();
	};

	return (
		<div style={{ minHeight: '100vh', backgroundColor: '#0D0D0D', padding: adminSpacing.xl }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: adminSpacing.xl }}>
				<h1 style={{ margin: 0, color: '#FFFFFF', fontSize: '24px', fontWeight: 700 }}>Route Management</h1>
				<button onClick={openCreateDrawer} style={primaryButtonStyle}>
					<Plus size={16} />
					Add Route
				</button>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: adminSpacing.lg }}>
				{routes.map((route) => {
					const expanded = expandedId === route.id;
					return (
						<article key={route.id} style={cardStyle}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: adminSpacing.md }}>
								<div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
										<span style={{ borderRadius: '999px', backgroundColor: '#FFD000', color: '#0D0D0D', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
											Route {route.routeNo}
										</span>
										<span style={{ ...statusStyle(route.status), borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
											{route.status}
										</span>
									</div>
									<h2 style={{ margin: 0, color: '#FFFFFF', fontSize: '16px', fontWeight: 700 }}>{route.name}</h2>
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginTop: adminSpacing.md, marginBottom: adminSpacing.md }}>
								<Metric icon={<MapPin size={15} />} title="Stops" value={`${route.stops.length} stops`} />
								<Metric icon={<Map size={15} />} title="Distance" value={`${route.distanceKm.toFixed(1)} km`} />
								<Metric icon={<Bus size={15} />} title="Buses" value={`${route.busesAssigned.length} buses`} />
							</div>

							<button
								onClick={() => setExpandedId((prev) => (prev === route.id ? null : route.id))}
								style={{
									width: '100%',
									border: '1px solid #2A2A2A',
									backgroundColor: '#111111',
									borderRadius: adminBorders.radius.md,
									color: '#E5E5E5',
									height: '36px',
									cursor: 'pointer',
									fontSize: '12px',
									fontWeight: 600,
								}}
							>
								{expanded ? 'Hide Stops Timeline' : 'Show Stops Timeline'}
							</button>

							{expanded && (
								<div style={{ marginTop: adminSpacing.md, paddingLeft: '24px', position: 'relative' }}>
									<div style={{ position: 'absolute', left: '9px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#2A2A2A' }} />
									{route.stops.map((stop, index) => {
										const edge = index === 0 || index === route.stops.length - 1;
										return (
											<div key={stop.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', position: 'relative' }}>
												<div
													style={{
														position: 'absolute',
														left: '-24px',
														width: edge ? '14px' : '10px',
														height: edge ? '14px' : '10px',
														borderRadius: '999px',
														backgroundColor: '#FFD000',
														border: edge ? '2px solid rgba(255, 208, 0, 0.45)' : 'none',
														boxShadow: edge ? '0 0 0 2px rgba(255, 208, 0, 0.12)' : 'none',
													}}
												/>
												<div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 500 }}>{stop.name}</div>
												<div style={{ color: '#888888', fontSize: '11px' }}>{stop.time}</div>
											</div>
										);
									})}
								</div>
							)}

							<div style={{ marginTop: adminSpacing.md, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '8px' }}>
								<button onClick={() => openEditDrawer(route)} style={actionBtnStyle}>
									<Edit size={14} />
									Edit Route
								</button>
								<button style={actionBtnStyle}>
									<Map size={14} />
									View on Map
								</button>
								<button onClick={() => deleteRoute(route.id)} style={{ ...actionBtnStyle, color: '#FF4444', borderColor: 'rgba(255,68,68,0.35)' }}>
									<Trash2 size={14} />
									Delete
								</button>
							</div>
						</article>
					);
				})}
			</div>

			{drawerOpen && (
				<>
					<div onClick={closeDrawer} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60 }} />
					<aside
						style={{
							position: 'fixed',
							right: 0,
							top: 0,
							width: '400px',
							height: '100vh',
							backgroundColor: '#111111',
							borderLeft: '1px solid #2A2A2A',
							zIndex: 70,
							display: 'flex',
							flexDirection: 'column',
							transform: 'translateX(0)',
							animation: 'routeDrawerIn 180ms ease-out',
						}}
					>
						<div style={{ height: '56px', borderBottom: '1px solid #2A2A2A', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '16px' }}>{editingRoute ? 'Edit Route' : 'Add Route'}</h3>
							<button onClick={closeDrawer} style={iconBtnStyle}><X size={16} /></button>
						</div>

						<div style={{ flex: 1, overflowY: 'auto', padding: adminSpacing.lg, display: 'grid', gap: adminSpacing.md }}>
							<Field label="Route Name">
								<input value={form.routeName} onChange={(e) => setForm((p) => ({ ...p, routeName: e.target.value }))} style={inputStyle} />
							</Field>
							<Field label="Route Number">
								<input value={form.routeNumber} onChange={(e) => setForm((p) => ({ ...p, routeNumber: e.target.value }))} style={inputStyle} />
							</Field>
							<Field label="Start Stop">
								<select value={form.startStop} onChange={(e) => setForm((p) => ({ ...p, startStop: e.target.value }))} style={inputStyle}>
									<option value="">Select start stop</option>
									{STOP_OPTIONS.map((stop) => <option key={stop}>{stop}</option>)}
								</select>
							</Field>
							<Field label="End Stop">
								<select value={form.endStop} onChange={(e) => setForm((p) => ({ ...p, endStop: e.target.value }))} style={inputStyle}>
									<option value="">Select end stop</option>
									{STOP_OPTIONS.map((stop) => <option key={stop}>{stop}</option>)}
								</select>
							</Field>

							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<label style={labelStyle}>Via Stops (Reorderable)</label>
									<button onClick={addViaStop} style={{ ...iconBtnStyle, width: '30px', height: '30px' }}><Plus size={14} /></button>
								</div>
								<div style={{ display: 'grid', gap: '8px' }}>
									{form.via.map((stop, index) => (
										<div key={stop.id} style={{ border: '1px solid #2A2A2A', borderRadius: adminBorders.radius.md, backgroundColor: '#1A1A1A', padding: '8px', display: 'grid', gap: '6px' }}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
												<GripVertical size={14} color="#777" />
												<input value={stop.name} placeholder="Stop name" onChange={(e) => updateViaStop(index, 'name', e.target.value)} style={inputStyle} />
											</div>
											<div style={{ display: 'flex', gap: '6px' }}>
												<input type="time" value={stop.time} onChange={(e) => updateViaStop(index, 'time', e.target.value)} style={inputStyle} />
												<button onClick={() => moveViaStop(index, 'up')} style={iconBtnStyle}><ArrowUp size={14} /></button>
												<button onClick={() => moveViaStop(index, 'down')} style={iconBtnStyle}><ArrowDown size={14} /></button>
												<button onClick={() => removeViaStop(index)} style={{ ...iconBtnStyle, color: '#FF4444' }}><Trash2 size={14} /></button>
											</div>
										</div>
									))}
								</div>
							</div>

							<Field label="Assign Buses">
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
									{BUS_OPTIONS.map((bus) => {
										const selected = form.assignedBuses.includes(bus);
										return (
											<button
												key={bus}
												onClick={() =>
													setForm((prev) => ({
														...prev,
														assignedBuses: selected ? prev.assignedBuses.filter((b) => b !== bus) : [...prev.assignedBuses, bus],
													}))
												}
												style={{
													height: '28px',
													borderRadius: adminBorders.radius.full,
													border: selected ? '1px solid #FFD000' : '1px solid #2A2A2A',
													backgroundColor: selected ? 'rgba(255,208,0,0.12)' : '#111111',
													color: selected ? '#FFD000' : '#888888',
													fontSize: '11px',
													padding: '0 10px',
													cursor: 'pointer',
												}}
											>
												{bus}
											</button>
										);
									})}
								</div>
							</Field>

							<Field label="Schedule Type">
								<div style={{ display: 'flex', gap: '8px' }}>
									{(['Weekday', 'Weekend', 'Both'] as ScheduleType[]).map((item) => (
										<button
											key={item}
											onClick={() => setForm((prev) => ({ ...prev, scheduleType: item }))}
											style={{
												flex: 1,
												height: '34px',
												borderRadius: adminBorders.radius.md,
												border: form.scheduleType === item ? '1px solid #FFD000' : '1px solid #2A2A2A',
												backgroundColor: form.scheduleType === item ? 'rgba(255,208,0,0.12)' : '#1A1A1A',
												color: form.scheduleType === item ? '#FFD000' : '#888888',
												cursor: 'pointer',
												fontSize: '12px',
												fontWeight: 600,
											}}
										>
											{item}
										</button>
									))}
								</div>
							</Field>

							<Field label="Status">
								<button
									onClick={() => setForm((prev) => ({ ...prev, status: !prev.status }))}
									style={{
										width: '52px',
										height: '28px',
										borderRadius: '999px',
										border: '1px solid #2A2A2A',
										backgroundColor: form.status ? '#FFD000' : '#1A1A1A',
										position: 'relative',
										cursor: 'pointer',
									}}
								>
									<span
										style={{
											position: 'absolute',
											top: '3px',
											left: form.status ? '27px' : '3px',
											width: '20px',
											height: '20px',
											borderRadius: '999px',
											backgroundColor: form.status ? '#0D0D0D' : '#888888',
											transition: 'left 170ms ease-in-out',
										}}
									/>
								</button>
							</Field>
						</div>

						<div style={{ borderTop: '1px solid #2A2A2A', padding: adminSpacing.lg, display: 'flex', gap: '8px', position: 'sticky', bottom: 0, backgroundColor: '#111111' }}>
							<button onClick={closeDrawer} style={ghostBtnStyle}>Cancel</button>
							<button onClick={saveRoute} style={primaryButtonStyle}>Save Route</button>
						</div>
					</aside>
				</>
			)}

			<style>{`
				@keyframes routeDrawerIn {
					from { transform: translateX(100%); }
					to { transform: translateX(0); }
				}
			`}</style>
		</div>
	);
};

const cardStyle: React.CSSProperties = {
	backgroundColor: '#1A1A1A',
	border: '1px solid #2A2A2A',
	borderRadius: '12px',
	padding: '16px',
};

const primaryButtonStyle: React.CSSProperties = {
	height: '40px',
	border: 'none',
	borderRadius: adminBorders.radius.md,
	backgroundColor: '#FFD000',
	color: '#0D0D0D',
	fontWeight: 700,
	fontSize: '13px',
	cursor: 'pointer',
	padding: '0 14px',
	display: 'inline-flex',
	alignItems: 'center',
	gap: '8px',
};

const ghostBtnStyle: React.CSSProperties = {
	flex: 1,
	height: '40px',
	borderRadius: adminBorders.radius.md,
	border: '1px solid #2A2A2A',
	backgroundColor: 'transparent',
	color: '#E5E5E5',
	fontWeight: 600,
	cursor: 'pointer',
};

const actionBtnStyle: React.CSSProperties = {
	height: '34px',
	borderRadius: adminBorders.radius.md,
	border: '1px solid #2A2A2A',
	backgroundColor: '#111111',
	color: '#E5E5E5',
	fontSize: '12px',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '6px',
	cursor: 'pointer',
};

const iconBtnStyle: React.CSSProperties = {
	width: '34px',
	height: '34px',
	borderRadius: adminBorders.radius.md,
	border: '1px solid #2A2A2A',
	backgroundColor: '#1A1A1A',
	color: '#888888',
	display: 'grid',
	placeItems: 'center',
	cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
	display: 'block',
	color: '#888888',
	fontSize: '12px',
	marginBottom: '6px',
	fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
	width: '100%',
	height: '34px',
	borderRadius: adminBorders.radius.md,
	border: '1px solid #2A2A2A',
	backgroundColor: '#1A1A1A',
	color: '#E5E5E5',
	padding: '0 10px',
	fontSize: '12px',
};

const Metric: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ icon, title, value }) => (
	<div style={{ border: '1px solid #2A2A2A', borderRadius: adminBorders.radius.md, padding: '8px', backgroundColor: '#111111' }}>
		<div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888888', fontSize: '11px', marginBottom: '4px' }}>
			{icon}
			<span>{title}</span>
		</div>
		<div style={{ color: '#E5E5E5', fontSize: '12px', fontWeight: 700 }}>{value}</div>
	</div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<div>
		<label style={labelStyle}>{label}</label>
		{children}
	</div>
);

export default RouteManagement;
