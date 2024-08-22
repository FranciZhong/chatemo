'use client';

import { Theme } from '@/app/constants';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useState } from 'react';
import IconToggle from '../IconToggle';

const ThemeToggle: React.FC = () => {
	const { theme, setTheme } = useTheme();
	const [isDark, setDark] = useState(theme === Theme.DARK);

	const handleClick = useCallback(() => {
		setDark((v) => !v);
		setTheme(isDark ? Theme.LIGHT : Theme.DARK);
	}, [isDark]);

	const getIcon = useCallback(() => {
		return isDark ? (
			<MoonIcon className="h-5 w-5" />
		) : (
			<SunIcon className="h-5 w-5" />
		);
	}, [isDark]);

	return <IconToggle onClick={handleClick}>{getIcon()}</IconToggle>;
};

export default ThemeToggle;
