'use client';

import { Theme } from '@/app/constants';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import IconButton from '../IconButton';

const ThemeToggle: React.FC = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// effect runs only on the client
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleClick = useCallback(() => {
		setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
	}, [theme, setTheme]);

	const getIcon = useCallback(() => {
		return theme === Theme.DARK ? (
			<MoonIcon className="icon-size" />
		) : (
			<SunIcon className="icon-size" />
		);
	}, [theme]);

	// prevent rendering until mounted
	if (!mounted) return null;

	return <IconButton onClick={handleClick}>{getIcon()}</IconButton>;
};

export default ThemeToggle;
