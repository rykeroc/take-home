import { PieLabel } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatting';
import * as React from 'react';

export const pieLabelCurrencyFormatter: PieLabel = ({ payload, ...props }) => (
	<text
		cx={props.cx}
		cy={props.cy}
		x={props.x}
		y={props.y}
		textAnchor={props.textAnchor}
		dominantBaseline={props.dominantBaseline}
		fill="hsla(var(--foreground))"
	>
		{formatCurrency(payload.value)}
	</text>
);
