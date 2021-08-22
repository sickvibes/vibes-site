import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  label?: string;
  accent?: boolean;
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    notFlash: {
      color: (props) => (props.accent ? theme.palette.accent.main : theme.palette.accent.quadriarylolwhat),
    },
    flash: {
      color: (props) => (props.accent ? 'white' : theme.palette.accent.tertiary),
    },
  };
});

export const FlashingLabel: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  const flash = useRef(0);
  const [isFlash, setIsFlash] = useState(false);
  const flashStart = 5;
  const flashEnd = 7;
  const clickTime = props.accent ? 50 : 100;

  useEffect(() => {
    const h = setInterval(() => {
      flash.current = (flash.current + 1) % flashEnd;
      setIsFlash(flash.current >= flashStart);
    }, clickTime);

    return () => clearInterval(h);
  }, []);

  if (props.children) {
    return <span className={isFlash ? classes.flash : classes.notFlash}>{props.children}</span>;
  }

  return <span className={isFlash ? classes.flash : classes.notFlash}>{(props.label ?? '☀ NEW!').toUpperCase()}</span>;
};
